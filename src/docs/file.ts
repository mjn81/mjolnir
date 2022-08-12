export default {
  tags: ['file'],
  paths: {
    '/file': {
      get: {
        tags: ['file'],
        summary: 'Get all files',

        description: 'get all files',
        operationId: 'get-files',
        responses: {
          200: {
            description: 'Success',
            content: {
              'application/json': {
                example: {
                  files: [
                    {
                      id: 'cl6psmb530079snoxfln2sh9x',
                      name: 'testfile',
                      category: {
                        id: 'cl6p33pfv0048a2oxzfw7jwmt',
                        name: 'category test',
                      },
                    },
                    {
                      id: 'cl6pvbbpw0003q0ox55wx11a9',
                      name: 'hello world',
                      category: {
                        id: 'cl6p33pfv0048a2oxzfw7jwmt',
                        name: 'category test',
                      },
                    },
                    {
                      id: 'cl6qtgbt70018daoxz4ia151m',
                      name: 'logo',
                      category: {
                        id: 'cl6qt3ooa0003orox4wupqrwe',
                        name: 'cat test q',
                      },
                    },
                  ],
                  count: 3,
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['file'],
        summary: 'Upload file',
        description: 'upload file',
        operationId: 'upload',
        responses: {
          200: {
            description: 'Success',
            content: {
              'application/json': {
                example: {
                  message: 'File uploaded!',
                  data: {
                    id: 'cl6qtgbt70018daoxz4ia151m',
                    name: 'logo',
                    category: {
                      id: 'cl6qt3ooa0003orox4wupqrwe',
                      name: 'cat test q',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/file/{id}': {
      get: {
        tags: ['file'],
        summary: 'Serve file',
        description: 'serve file',
        operationId: 'serve-file',
        responses: {
          200: {
            description: 'Success',
            content: {
              file: '*',
            },
          },
        },
      },
      put: {
        tags: ['file'],
        summary: 'Update file',
        description: 'update file',
        operationId: 'update-file',
        responses: {
          200: {
            description: 'Success',
            content: {
              'application/json': {
                example: {
                  message: 'File Updated!!',
                  data: {
                    id: 'cl6pvbbpw0003q0ox55wx11a9',
                    name: 'hello world',
                    category: {
                      id: 'cl6p33pfv0048a2oxzfw7jwmt',
                      name: 'category test',
                    },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['file'],
        summary: 'Delete file',
        description: 'delete file',
        operationId: 'delete-file',
        responses: {
          200: {
            description: 'Success',
            content: {
              'application/json': {
                example: {
                  message: 'File deleted!!',
                  data: {
                    id: 'cl6pvbbpw0003q0ox55wx11a9',

                    name: 'hello world',
                    category: {
                      id: 'cl6p33pfv0048a2oxzfw7jwmt',
                      name: 'category test',
                    },
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
