import express from 'express';

import UsersController from './controllers/UsersController';
import SongsController from './controllers/SongsController';

const routes = express.Router();

const usersController = new UsersController();
const songsController = new SongsController();

routes.post('/users', usersController.create);
routes.get('/users', usersController.index);
routes.get('/users/:id', usersController.show);
routes.put('/users/:id', usersController.update);
routes.delete('/users/:id', usersController.delete);

routes.post('/songs', songsController.create);
routes.get('/songs', songsController.index);
routes.get('/songs/:id', songsController.show);
routes.put('/songs/:id', songsController.update);
routes.delete('/songs/:id', songsController.delete);

export default routes;
