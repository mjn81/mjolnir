export default {
  get: {
    tags: ['category'],
    description: 'Get all categories',
    operationId: 'categoryId',
    responses: {
      200: {
        description:
          'categories found successfully',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Items',
            },
          },
        },
      },
      500: {
        description: 'Server error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
    },
  },
};
