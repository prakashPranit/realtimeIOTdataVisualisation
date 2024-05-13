const { Router } = require('express');
const { sensorsRouter } = require('./sensors');

const apiRouter = Router();

apiRouter.use('/sensors', sensorsRouter);

module.exports = {
  apiRouter,
};