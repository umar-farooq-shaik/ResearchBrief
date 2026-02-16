import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { researchRouter } from './routes/pipeline.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/research', researchRouter);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
