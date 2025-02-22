export default () => ({
  app: {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV,
  },
  database: {
    dbName: process.env.DB_NAME || 'resido',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'supersecretkey',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  security: {
    saltRounds: parseInt(process.env.SALT_ROUNDS || '10', 10),
    allowedOrigins: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3000'],
  },
});
