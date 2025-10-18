const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ballut Games API',
      version: '1.0.0',
      description: 'Authentication and Todo management service with JWT for Ballut Games',
      contact: {
        name: 'API Support',
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'Authentication endpoints',
      },
      {
        name: 'Todos',
        description: 'Todo list management endpoints',
      },
    ],
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 6,
              description: 'User password (minimum 6 characters)',
              example: 'password123',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
            },
            data: {
              type: 'object',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Login successful',
            },
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              description: 'Short-lived access token (15 minutes)',
            },
            refreshToken: {
              type: 'string',
              example: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6...',
              description: 'Long-lived refresh token (7 days)',
            },
            data: {
              type: 'object',
              properties: {
                userId: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                },
              },
            },
          },
        },
        TodoInput: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              maxLength: 200,
              description: 'Todo title',
              example: 'Complete project documentation',
            },
            description: {
              type: 'string',
              maxLength: 1000,
              description: 'Todo description',
              example: 'Write comprehensive documentation for the API',
            },
            completed: {
              type: 'boolean',
              description: 'Todo completion status',
              example: false,
              default: false,
            },
          },
        },
        TodoUpdate: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              maxLength: 200,
              description: 'Todo title',
              example: 'Complete project documentation',
            },
            description: {
              type: 'string',
              maxLength: 1000,
              description: 'Todo description',
              example: 'Write comprehensive documentation for the API',
            },
            completed: {
              type: 'boolean',
              description: 'Todo completion status',
              example: false,
            },
          },
        },
        Todo: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Todo ID',
              example: '507f1f77bcf86cd799439011',
            },
            title: {
              type: 'string',
              description: 'Todo title',
              example: 'Complete project documentation',
            },
            description: {
              type: 'string',
              description: 'Todo description',
              example: 'Write comprehensive documentation for the API',
            },
            completed: {
              type: 'boolean',
              description: 'Todo completion status',
              example: false,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Todo creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Todo last update timestamp',
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            currentPage: {
              type: 'integer',
              example: 1,
            },
            totalPages: {
              type: 'integer',
              example: 5,
            },
            totalItems: {
              type: 'integer',
              example: 47,
            },
            itemsPerPage: {
              type: 'integer',
              example: 10,
            },
            hasNextPage: {
              type: 'boolean',
              example: true,
            },
            hasPreviousPage: {
              type: 'boolean',
              example: false,
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
