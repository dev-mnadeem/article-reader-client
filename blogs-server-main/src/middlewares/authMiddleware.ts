import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import RESPONSE_CODES from '../constants/responseCodes';
import sendResponse from '../helpers/responseHelper';
import { getJwtKey, TOKEN_ALGORITHM } from '../helpers/tokenConfig';
import { CustomRequest } from '../interfaces/request';

const reject = (res: Response) => sendResponse(res, {}, 'Unauthorized user', RESPONSE_CODES.authorizationError);

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const jwtKey = getJwtKey();
  const token = req.headers.authtoken;
  if (typeof token !== 'string' || !token) return reject(res);

  jwt.verify(token, jwtKey, { algorithms: [TOKEN_ALGORITHM] }, (err, data) => {
    if (err || !data || typeof data !== 'object' || typeof data.user !== 'string' || !data.user) return reject(res);
    (req as CustomRequest).userId = data.user;
    next();
  });
};

export default authenticateToken;
