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
                error: 'Unexpected error while creating new user'
            });
        }
    }
}
