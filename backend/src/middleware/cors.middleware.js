import cors from 'cors';

const allowedOrigins = [
  'http://localhost:4200', // Angular client dev
  'http://localhost:4300', // Angular admin dev
  'http://localhost:4000', // SSR dev server
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, Swagger)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export default cors(corsOptions);
