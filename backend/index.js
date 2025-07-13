import express from 'express';
import cors from 'cors';
import bookingRoutes from './routes/bookingRoutes.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/api', bookingRoutes);

app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});
