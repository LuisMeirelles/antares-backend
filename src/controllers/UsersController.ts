import {
    Request,
    Response
} from 'express';
import db from '../database/connection';
import bcrypt from 'bcryptjs';

export interface UsersInterface {
    id: number;
    email: string;
    username: string;
    name: string;
    password: string;
    created_at: Date;
}

export default class UsersController {
    async store(request: Request, response: Response): Promise<Response> {
        const data = {
            ...request.body,
            password: await bcrypt.hash(request.body.password, 10)
        };

        const trx = await db.transaction();

        const emailExists = await trx<UsersInterface>('users')
            .where({
                email: data.email
            }).first();

        const usernameExists = await trx<UsersInterface>('users')
            .where({
                username: data.username
            }).first();

        if (emailExists) {
            return response.status(400).json({
                message: 'email already registered'
            });
        } else if (usernameExists) {
            return response.status(400).json({
                message: 'username already registered'
            });
        } else {
            try {
                await trx<UsersInterface>('users')
                    .insert(data);

                await trx.commit();

                return response.status(201).send();
            } catch (error) {
                await trx.rollback();

                return response.status(400).json({
                    message: 'unexpected error while creating new user',
                    error
                });
            }
        }
    }

    async index(request: Request, response: Response): Promise<Response> {
        const filters = request.query;

        filters.password ? filters.password = undefined : null;

        try {
            const users = await db<UsersInterface>('users')
                .where({ ...filters });

            return response.status(200).json(
                users.map(
                    user => ({
                        ...user,
                        password: undefined
                    })
                )
            );
        } catch (error) {
            return response.status(400).json({
                message: 'unexpected error while listing users',
                error
            });
        }
    }

    async show(request: Request, response: Response): Promise<Response> {
        const id = parseInt(request.params.id);

        try {
            const user = await db<UsersInterface>('users')
                .where({ id })
                .first();

            return response.status(200).json({
                ...user,
                password: undefined
            });
        } catch (error) {
            return response.status(400).json({
                message: 'unexpected error while showing the user',
                error
            });
        }
    }

    async update(request: Request, response: Response): Promise<Response> {
        const id = parseInt(request.params.id);

        const trx = await db.transaction();

        try {
            await trx<UsersInterface>('users')
                .update({
                    ...request.body,
                    password: await bcrypt.hash(request.body.password, 10)
                })
                .where({ id });

            await trx.commit();

            return response.status(200).send();
        } catch (error) {
            await trx.rollback();

            return response.status(400).json({
                message: 'unexpected error while updating new user',
                error
            });
        }
    }

    async delete(request: Request, response: Response): Promise<Response> {
        const id = parseInt(request.params.id);

        const trx = await db.transaction();

        try {
            await trx<UsersInterface>('users')
                .delete()
                .where({ id });

            await trx.commit();

            return response.status(200).send();
        } catch (error) {
            trx.rollback();

            return response.status(400).json({
                message: 'unexpected error while deleting the user',
                error
            });
        }
    }
}
