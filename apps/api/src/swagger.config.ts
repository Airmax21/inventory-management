import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Management Inventory API',
            version: '1.0.0',
            description: 'Dokumentasi API untuk aplikasi manajemen inventaris.',
        },
        servers: [
            {
                url: 'http://localhost:3000/api/v1',
                description: 'API V1 Service',
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
        },
    },
    apis: ['./src/applications/v1/**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;