import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { matchingRouter } from './routes/matching';
import { knowledgeRouter } from './routes/knowledge';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/matching', matchingRouter);
app.use('/api/knowledge', knowledgeRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;