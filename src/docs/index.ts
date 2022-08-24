import category from './category';
import auth from './auth';
import file from './file';
import playground from './playground';

export default {
  openapi: '3.0.3',
  info: {
    title: 'Mjolnir API',
    description: 'This is Mjolnir file api swagger documentation',
    version: '0.0.1',
  },
  servers: [
    {
      url: `http://localhost:3000`,
      description: 'Local server',
    },
  ],
  tags: [
    {
      name: 'auth',
      description: 'Auth operations',
    },
    {
      name: 'file',
      description: 'File operations',
    },
    {
      name: 'category',
      description: 'Category operations',
    },
    {
      name: 'playground',
      description: 'Playground for api test',
    },
  ],
  paths: {
    ...category.paths,
    ...auth.paths,
    ...file.paths,
    ...playground.paths,
  },
};
