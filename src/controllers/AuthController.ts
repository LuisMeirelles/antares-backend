import {
    Request,
    Response
} from 'express';
import db from '../database/connection';
import bcrypt from 'bcryptjs';

import { UsersInterface } from './UsersController';

export default class AuthController {
    async auth(request: Request, response: Response): Promise<Response> {
        const {
            user,
            password
        } = request.body;

        try {
            const result = await db<UsersInterface>('users')
                .where({
                    email: user
                })
                .orWhere({
                    username: user
                })
                .first();

            if (!result) {
                return response.status(400).send({
                    message: 'user not found'
                });
            }

            if (!await bcrypt.compare(password, result.password)) {
                return response.status(400).send({
                    message: 'incorrect password'
                });
            }

            return response.status(200).send();
        } catch (error) {
            return response.status(400).json({
                message: 'unexpected error while authenticating the user',
                error
            });
        }
    }
}
