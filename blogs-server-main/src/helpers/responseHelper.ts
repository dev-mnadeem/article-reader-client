import { Response } from 'express';
import RESPONSE_CODES from '../constants/responseCodes';

// Function to send response
const sendResponse = (res: Response, data?: any, error?: string | null, responseCode?: number | null) => {
  if (error) {
    // If error exists, send error response
    res.status(responseCode || RESPONSE_CODES.serverError).json({
      payload: {},
      message: error,
    });
  } else {
    // If no error, send data payload
    res.send({ payload: data || {} });
  }
};

export default sendResponse;
