import createHttpError from "http-errors";
import express, { Express, Request, Response, NextFunction } from 'express';
const router = express.Router();

import {createChannel, listChannels, writeMessage, listMessagesInChannel} from '../model';

router.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});
  
router.get('/messages', (req: Request, res: Response, next: NextFunction): void => {
    let channelId = req.query.channelId as string;
    let currentPage = req.query.currentPage as string;
    let pageSize = req.query.pageSize as string;

    let [isOk, result] = listMessagesInChannel(channelId, currentPage, pageSize);
    if (isOk) {
        res.send(result);
        return;
    }
    const error = createHttpError(400, result);
    next(error);
})

router.get('/channels', (req: Request, res: Response, next: NextFunction): void => {
    res.send(listChannels());
})

router.post('/channel', (req: Request, res: Response, next: NextFunction): void => {
    let [isOk, result] = createChannel(req.body.name);
    if (isOk) {
        res.send(result);
        return
    }
    const error = createHttpError(400, result);
    next(error)
})

router.post('/message', (req: Request, res: Response, next: NextFunction): any => {
    const { title, content, channel } = req.body;
    let [isOk, msg] = writeMessage(title, content, channel);
    if (isOk) {
        res.send(msg);
        return
    }
    const error = createHttpError(400, msg);
    next(error)
}) 

export { router }
