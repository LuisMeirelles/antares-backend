import {
    Request,
    Response
} from 'express';

import db from '../database/connection';

import { UsersInterface } from './UsersController';

export default class AuthController {
    async auth(request: Request, response: Response): Promise<Response> {
        const {
            user,
            password
        } = request.body;

        try {
            const result = await db<UsersInterface>('users')
                .where({ email: user })
                .orWhere({ username: user})
                .first();

            if (result) {
                if (result.password == password) {
                    return response.status(200).send();
                } else {
                    return response.status(400).send({ message: 'Passwords don\'t match' });
                }
            } else {
                return response.status(400).send({ message: 'User not found' });
            }
        } catch (error) {
            return response.status(400).json({
                message: 'Unexpected error while authenticate the user',
                error
            });
        }
    }
}
