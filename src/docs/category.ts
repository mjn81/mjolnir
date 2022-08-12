export default {
  tags: ['category'],
  paths: {
    '/category': {
      get: {
        tags: ['category'],
        summary: 'Get all categories',
        description: 'get all categories',
        operationId: 'get-categories',
        responses: {
          200: {
            description: 'Success',
            content: {
              'application/json': {
                example: {
                  categories: [
                    {
                      id: 'cl6p33pfv0048a2oxzfw7jwmt',
                      name: 'cat 1',
                      createdAt:
                        '2022-08-11T13:36:46.219Z',
                      updatedAt:
                        '2022-08-11T13:36:46.219Z',
                      usersId:
                        'cl6p3064d0011a2oxdqnnbr01',
                      _count: {
                        Files: 2,
                      },
                    },
                  ],
                  count: 1,
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['category'],
        summary: 'Create a new category',
        description: 'create new category',
        operationId: 'create-category',
        responses: {
          200: {
            description: 'Success',
            content: {
              'application/json': {
                example: {
                  message: 'Category created!!',
                  category: {
                    id: 'cl6qt3ooa0003orox4wupqrwe',
                    name: 'cat test q',
                    createdAt:
                      '2022-08-12T18:32:21.418Z',
                    updatedAt:
                      '2022-08-12T18:32:21.419Z',
                    usersId:
                      'cl6p3064d0011a2oxdqnnbr01',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/category/{id}': {
      put: {
        tags: ['category'],
        summary: 'Update a category',
        description: 'update category',
        operationId: 'update-category',
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                example: {
                  message: 'Category updated!!',
                  category: {
                    id: 'cl6p33pfv0048a2oxzfw7jwmt',
                    name: 'category test',
                    createdAt:
                      '2022-08-11T13:36:46.219Z',
                    updatedAt:
                      '2022-08-12T18:30:24.253Z',
                    usersId:
                      'cl6p3064d0011a2oxdqnnbr01',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
