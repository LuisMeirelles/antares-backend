import express from 'express';

import UsersController from './controllers/UsersController';
import SongsController from './controllers/SongsController';
import AuthController from './controllers/AuthController';

const routes = express.Router();

const usersController = new UsersController();
const songsController = new SongsController();
const authController = new AuthController();

routes.post('/users', usersController.store);
routes.get('/users', usersController.index);
routes.get('/users/:id', usersController.show);
routes.put('/users/:id', usersController.update);
routes.delete('/users/:id', usersController.delete);

routes.post('/songs', songsController.store);
routes.get('/songs', songsController.index);
routes.get('/songs/:id', songsController.show);
routes.put('/songs/:id', songsController.update);
routes.delete('/songs/:id', songsController.delete);

routes.post('/auth', authController.auth);

export default routes;
