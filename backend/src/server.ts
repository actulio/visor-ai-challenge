import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
// import { Server } from 'socket.io';

import routes from './routes';
import { connectDatabase } from './config/database';
import { validateEnvVars } from './config/env';

validateEnvVars();
connectDatabase();

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

const server = http.createServer(app);
// const io = new Server(server);

// io.on('connection', (client) => {
//   client.on('event', (data) => {
//     /* … */
//   });
//   client.on('disconnect', () => {
//     /* … */
//   });
// });

server.listen(3333, () => {
  console.log(`Server running on port 3333`);
});
