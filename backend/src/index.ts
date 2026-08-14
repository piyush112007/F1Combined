// F1 Insight Backend Server
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initRoutes } from './routes';
import { startCronJobs } from './services/syncService';

dotenv.config({ override: true });

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Setup API Routes
initRoutes(app);

// Initialize Proxy Cache
startCronJobs();

app.listen(port, () => {
  console.log(`F1 Insight Backend running on port ${port}`);
});
