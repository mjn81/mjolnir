import cors from 'cors';
import { WHITE_LIST } from '../constants';

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (WHITE_LIST.indexOf(origin ?? '') !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  credentials: true,
});
