import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import routes from './routes';

dotenv.config();

console.log(process.env);

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.listen(process.env.SERVER_PORT);
