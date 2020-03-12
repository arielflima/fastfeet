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
routes.get('/recipients', RecipientController.index);
routes.put('/recipients', RecipientController.update);

// All files
routes.post('/files', upload.single('file'), FileController.store);
routes.get('/files', FileController.index);

// Deliverymen controller
routes.post('/deliveryman', DeliverymanController.store);
routes.get('/deliveryman', DeliverymanController.index);
routes.put('/deliveryman/:id', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.delete);

// Deliveries controller
routes.post('/delivery', DeliveryController.store);
routes.get('/delivery', DeliveryController.index);
routes.delete('/delivery/:id', DeliveryController.delete);
routes.put('/delivery/:id', DeliveryController.update);

routes.get('/deliverystatus/:id', DeliveryStatusController.index);
// routes.post('/deliverystatus/check/:id', DeliveryStatusController.store); // REFATORAR PARA DELIVERY CKECK IN/OUT CONTROLLERS

// CheckIn
routes.post('/delivery/:id/checkin', DeliveryCheckInController.store);
routes.get('/deliveryman/:id/deliveriesdone', DeliveryCheckInController.index);

// CheckOut
routes.post('/delivery/:id/checkout', DeliveryCheckOutController.store);

// Delivery problems
routes.post('/delivery/:id/problem', DeliveryProblem.store);
routes.get('/delivery/:id/problem', DeliveryProblem.index);
routes.delete('/problem/:id/cancel-delivery', DeliveryProblem.delete);

export default routes;
