import express from 'express';
import authRouter from './auth';
import passwordRouter from './passwords';
import statusRouter from './status';
import linkRouter from './links';

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/passwords', passwordRouter);
apiRouter.use('/status', statusRouter);
apiRouter.use('/', linkRouter); // Handles link shortening routes!

export default apiRouter;
