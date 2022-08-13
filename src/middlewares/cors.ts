import cors from 'cors';

export const corsMiddleware = cors({
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  credentials: true,
});
