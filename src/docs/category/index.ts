import getAll from './getAll';

export default {
  paths: {
    '/categories': { ...getAll },
  },
};
