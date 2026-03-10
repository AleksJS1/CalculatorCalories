require('dotenv').config();
const { createApp } = require('./app');
const { env, validateEnv } = require('./config/env');
const { connectDatabase, registerConnectionEvents } = require('./config/db');

async function bootstrap() {
  validateEnv();
  registerConnectionEvents(console);
  await connectDatabase();

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`Server started on http://localhost:${env.port}`);
  });

  const gracefulShutdown = () => {
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
}

bootstrap().catch((error) => {
  console.error('Startup failed', error);
  process.exit(1);
});
