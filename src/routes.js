import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryStatusController from './app/controllers/DeliveryStatusController';
import DeliveryCheckInController from './app/controllers/DeliveryCheckInController';
import DeliveryCheckOutController from './app/controllers/DeliveryCheckOutController';
import DeliveryProblem from './app/controllers/DeliveryProblemController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// Login
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

// Destinations
routes.post('/recipients', RecipientController.store);
routes.put('/recipients', RecipientController.update);

// All files
routes.post('/files', upload.single('file'), FileController.store);
routes.get('/files', FileController.index);

// Deliverymans controller
routes.post('/deliverymans', DeliverymanController.store);
routes.get('/deliverymans', DeliverymanController.index);
// routes.get('/deliverymans/:id/deliveries', DeliverymanController.index); // REFATORAR PARA DELIVERY CHECK IN CONTROLLER
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

// Deliveries controller
routes.post('/delivery', DeliveryController.store);
routes.get('/delivery', DeliveryController.index);
routes.delete('/delivery/:id', DeliveryController.delete);
routes.put('/delivery/:id', DeliveryController.update);

routes.get('/deliverystatus/:id', DeliveryStatusController.index);
// routes.post('/deliverystatus/check/:id', DeliveryStatusController.store); // REFATORAR PARA DELIVERY CKECK IN/OUT CONTROLLERS

// CheckIn
routes.post('/delivery/checkin/:id', DeliveryCheckInController.store);
// routes.get('/deliverymans/:id/deliveries', DeliveryCheckInController.index);

// CheckOut
routes.post('/delivery/checkout/:id', DeliveryCheckOutController.store);

// Deliveries problems
routes.post('/delivery/problem/:id', DeliveryProblem.store);
routes.get('/delivery/problem/:id', DeliveryProblem.index);

export default routes;
