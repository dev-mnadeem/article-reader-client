import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'yup';
import RESPONSE_CODES from '../constants/responseCodes';
import sendResponse from './responseHelper';

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

const exceptionHandler = (executable: Handler) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    return await executable(req, res, next);
  } catch (error) {
    if (error instanceof ValidationError) {
      return sendResponse(res, null, error.errors[0] ?? 'Invalid request', RESPONSE_CODES.badRequest);
    }
    console.error(error);
    return sendResponse(res, null, 'Internal server error', RESPONSE_CODES.serverError);
  }
};

export default exceptionHandler;
