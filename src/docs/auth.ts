export default {
  tags: ['auth'],
  paths: {
    '/auth/login': {
      post: {
        tags: ['auth'],
        summary: 'Login',
        description: 'login',
        operationId: 'login',
        responses: {
          200: {
            description: 'Success',
            content: {
              'application/json': {
                message: 'Login successful!!',
                token:
                  'Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1qbmFkbWluIiwiaWQiOiJjbDZwMzA2NGQwMDExYTJveGRxbm5icjAxIiwiaWF0IjoxNjYwMzI5NDIzLCJleHAiOjE2NjA0MTU4MjN9.wUW33VuQBrqHiuSz5SmjdtMe7gSWd0mFFc9W-zUhoJc',
                user: {
                  id: 'cl6p3064d0011a2oxdqnnbr01',
                  userName: 'mjnadmin',
                  email: 'mjn@a.com',
                },
              },
            },
          },
        },
      },
    },
    '/auth/register': {
      post: {
        tags: ['auth'],
        summary: 'Register',
        description: 'register',
        operationId: 'register',
        responses: {
          200: {
            description: 'Success',
            content: {
              'application/json': {
                message: 'Registered successfully!!',
                token:
                  'Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxIiwiaWQiOiJjbDZxdGF4bm0wMDAybmdveG9jMWFlbHY0IiwiaWF0IjoxNjYwMzI5NDc5LCJleHAiOjE2NjA0MTU4Nzl9.qXezdF2_Fyvl-uB1sLIZ5Atpbo2zSLDo6BhvkmdRAI8',
                user: {
                  id: 'cl6qtaxnm0002ngoxoc1aelv4',
                  userName: 'user1',
                  email: 'mjn@gmail.com',
                },
              },
            },
          },
        },
      },
    },
    '/auth/distToken': {
      get: {
        tags: ['auth'],
        summary: 'Dist Token',
        description:
          'gives user an access token without expiring for distrobution purposes',
        operationId: 'distToken',
        responses: {
          200: {
            description: 'Success',
            content: {
              'application/json': {
                message: 'Dist Token successful!!',
                token:
                  'Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1qbmFkbWluIiwiaWQiOiJjbDZwMzA2NGQwMDExYTJveGRxbm5icjAxIiwiaWF0IjoxNjYwMzI5NDIzLCJleHAiOjE2NjA0MTU4MjN9.wUW33VuQBrqHiuSz5SmjdtMe7gSWd0mFFc9W-zUhoJc',
                user: {
                  id: 'cl6qtaxnm0002ngoxoc1aelv4',
                  userName: 'user1',
                  email: '',
                },
              },
            },
          },
        },
      },
    },
  },
};
