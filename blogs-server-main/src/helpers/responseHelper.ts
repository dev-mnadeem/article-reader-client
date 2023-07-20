import { Response } from 'express';
import RESPONSE_CODES from '../constants/responseCodes';

const sendResponse = (res: Response, data?: unknown, error?: string | null, responseCode?: number | null) => {
  if (error) {
    return res.status(responseCode || RESPONSE_CODES.serverError).json({ payload: {}, message: error });
  }
  return res.status(responseCode || RESPONSE_CODES.ok).json({ payload: data || {} });
};

export default sendResponse;
