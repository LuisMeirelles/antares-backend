import {
    Request,
    Response,
    NextFunction
} from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default (req: Request, res: Response, next: NextFunction): Response<any> | void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ error: 'no token provided' });
    }

    const parts = authHeader.split(' ');
    const [scheme, token] = parts;

    if (parts.length !== 2 || !/^Bearer$/i.test(scheme)) {
        console.log(parts);
        return res.status(401).send({ error: 'malformed token' });
    }

    const SECRET = process.env.SECRET || '';

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: 'invalid token' });
        }

        req.userId = decoded?.id;

        return next();
    });
};
