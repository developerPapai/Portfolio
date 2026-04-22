import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: "Papai's Portfolio API",
      version: '1.0.0',
      description: 'REST API for portfolio website — projects, skills, profile, messages',
      contact: { name: 'Papai', email: 'admin@portfolio.dev' },
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Development' },
      { url: 'https://your-backend.onrender.com', description: 'Production' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

export default swaggerJsdoc(options);
