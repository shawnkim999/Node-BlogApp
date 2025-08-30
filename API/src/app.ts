import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import userRoutes from './routes/userRoutes';

const app = express();

app.use(cors());

app.use(express.json());
app.use("/users", userRoutes)

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})