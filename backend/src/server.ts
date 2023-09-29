import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import routes from './routes';
import { connectDatabase } from './config/database';
import { validateEnvVars } from './config/env';

validateEnvVars();
connectDatabase();

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3333, () => {
  console.log(`Server running on port 3333`);
});
