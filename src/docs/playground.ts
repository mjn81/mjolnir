export default {
  tags: ['playground'],
  paths: {
    '/playground': {
      get: {
        tags: ['playground'],
        summary: 'Get all playground',
        description: 'get all playground',
        operationId: 'get-playground',

        responses: {
          200: {
            description: 'Success',
            content: {
              'application/json': {
                example: {
                  messsage: 'Hello World',
                },
              },
            },
          },
        },
      },
    },
  },
};
