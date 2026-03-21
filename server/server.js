import express from 'express';
const app = express();
import connectDB from './config/db.js';
import cors from 'cors';
import { APP_CONFIG } from './config/env.js';
import router from './routes/index.js';

app.use(cors({origin: APP_CONFIG.FRONTEND_URL, credentials: true}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
connectDB();
app.use("/api", router);
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${API_CONFIG.PORT} 🚀`);
});
