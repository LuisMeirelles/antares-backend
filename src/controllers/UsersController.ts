import {
    Request,
    Response
} from 'express';

import db from '../database/connection';

export interface UsersInterface {
    id: number;
    email: string;
    username: string;
    name: string;
    password?: string;
    created_at: Date;
}

export default class UsersController {
    async create(request: Request, response: Response): Promise<Response> {
        const trx = await db.transaction();

        try {
            await trx<UsersInterface>('users')
                .insert(request.body);

            await trx.commit();

            return response.status(201).send();
        } catch (error) {
            await trx.rollback();

            return response.status(400).json({
                message: 'Unexpected error while creating new user',
                error
            });
        }
    }

    async index(request: Request, response: Response): Promise<Response> {
        const filters = request.query;
        filters.password ? filters.password = undefined : null;

        try {
            const users = await db<UsersInterface>('users')
                .where({ ...filters });

            users.map(user => user.password = undefined);
            return response.status(200).json(users);
        } catch (error) {
            return response.status(400).json({
                message: 'Unexpected error while list users',
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

            user ? user.password = undefined : null;

            return response.status(200).json(user);
        } catch (error) {
            return response.status(400).json({
                message: 'Unexpected error while show the user',
                error
            });
        }
    }

    async update(request: Request, response: Response): Promise<Response> {
        const id = parseInt(request.params.id);

        const trx = await db.transaction();

        try {
            await trx<UsersInterface>('users')
                .update(request.body)
                .where({ id });

            trx.commit();

            return response.status(200).send();
        } catch (error) {
            await trx.rollback();

            return response.status(400).json({
                message: 'Unexpected error while update new user',
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

            return response.status(200).send();
        } catch (error) {
            trx.rollback();

            return response.status(400).json({
                message: 'Unexpected error while delete the user',
                error
            });
        }
    }
}
