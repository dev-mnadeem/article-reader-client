import 'dotenv/config';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import logger from 'morgan';
import RESPONSE_CODES from './constants/responseCodes';
import sendResponse from './helpers/responseHelper';
import { getJwtKey } from './helpers/tokenConfig';
import routes from './routes/index';

export const app = express();

app.use(cors({ origin: process.env.REACT_APP_URL || 'http://localhost:3000' }));
if (process.env.NODE_ENV !== 'test') app.use(logger('dev'));
app.use(express.json({ limit: '100kb' }));

app.use('/api', routes);

app.use((_req: Request, res: Response) => sendResponse(res, null, 'Not found', RESPONSE_CODES.notFound));

// express.json() reports malformed or oversized bodies through the error chain;
// answer in the API's JSON envelope instead of Express's default HTML page.
app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
  if (err.status && err.status >= 400 && err.status < 500) {
    return sendResponse(res, null, 'Invalid request', err.status);
  }
  console.error(err);
  return sendResponse(res, null, 'Internal server error', RESPONSE_CODES.serverError);
});

if (require.main === module) {
  getJwtKey();
  const port = Number(process.env.PORT) || 8080;
  const host = process.env.HOST || '127.0.0.1';
  app.listen(port, host, () => console.log(`Server started at http://${host}:${port}`));
}
