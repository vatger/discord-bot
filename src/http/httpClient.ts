import express from 'express';
import apiController from './apiController';
import bodyParser from 'body-parser';
import cors from 'cors';

export const httpClient = express();

httpClient.use(
    cors({
        origin: '*',
    })
);
httpClient.use(bodyParser.json());

httpClient.post('/member/update', apiController.updateMember);