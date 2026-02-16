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

// Only start server if not in Vercel environment (Vercel exports the app)
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

export default app;
