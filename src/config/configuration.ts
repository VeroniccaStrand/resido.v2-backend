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
  logging: {
    mode: process.env.LOGGING_MODE || 'global',
    logRequest: process.env.LOG_REQUEST || 'true',
  },
});
