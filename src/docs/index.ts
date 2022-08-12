import category from './category';

export default {
  openapi: '3.0.3',
  servers: [
    { url: process.env.BASE_HREF ?? '/' },
  ],
  info: {
    title: 'Mjolnir API',
  },
  paths: {
    ...category.paths,
  },
};
