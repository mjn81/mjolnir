import morgan from 'morgan';
import { createStream } from 'rotating-file-stream';
import path from 'path';

const logStream = createStream('reports.log', {
  size: '30M',
  interval: '1d',
  path: path.resolve(__dirname, '..', 'logs'),
  compress: 'gzip',
});
export const logMiddleware = () =>
  morgan('dev', {
    stream: logStream,
  });
