import {
    Request,
    Response
} from 'express';

import db from '../database/connection';

export default class UsersController {
    async create(request: Request, response: Response): Promise<Response> {
        const {
            email,
            username,
            name,
            password
        } = request.body;

        const trx = await db.transaction();

        try {
            await trx('users').insert({
                email,
                username,
                name,
                password
            });

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

        try {
            const users = await db('users')
                .where({ ...filters });

            return response.status(200).json(users);
        } catch (error) {
            return response.status(400).json({
                message: 'Unexpected error while list users',
                error
            });
        }
    }

    async show(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        try {
            const user = await db('users')
                .where({ id });

            return response.status(200).json(user);
        } catch (error) {
            return response.status(400).json({
                message: 'Unexpected error while show the user',
                error
            });
        }
    }

    async update(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const {
            email,
            username,
            name,
            password
        } = request.body;

        const trx = await db.transaction();

        try {
            await trx('users')
                .update({
                    email,
                    username,
                    name,
                    password
                })
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
        const { id } = request.params;

        try {
            await db('users')
                .delete()
                .where({ id });
        } catch (error) {
            return response.status(400).json({
                message: 'Unexpected error while delete the user',
                error
            });
        }

        return response.status(200).send();
    }
}
