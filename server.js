import { connectDB } from './config/db.js';
import { config } from './config/index.js';
import app from './app.js';

const start = async () => {
  await connectDB();

  const server = app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
  });

  process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION:', err);
    server.close(() => process.exit(1));
  });
};

start();
