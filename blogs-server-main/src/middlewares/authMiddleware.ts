import { getJwtKey } from '../helpers/tokenConfig';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { IncomingHttpHeaders } from 'http';
import sendResponse from '../helpers/responseHelper';
import { CustomRequest } from '../interfaces/request';
import RESPONSE_CODES from '../constants/responseCodes';

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const headers: IncomingHttpHeaders = req.headers;
  const token = headers.authtoken;
  const jwtKey = getJwtKey();
  if (token == null) return sendResponse(res, {}, 'Unauthorized user', RESPONSE_CODES.authorizationError);

  jwt.verify(token as string, jwtKey as string, { algorithms: ['HS256'] }, (err, data: any) => {
    if (err) return sendResponse(res, {}, 'Unauthorized user', RESPONSE_CODES.authorizationError);
    const customReq = req as CustomRequest;
    if (!data || typeof data !== 'object' || typeof data.user !== 'string' || !data.user) return sendResponse(res, {}, 'Unauthorized user', 401);
    customReq.userId = data.user;
    next();
  });
};

export default authenticateToken;
