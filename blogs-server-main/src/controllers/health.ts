import { Request, Response } from 'express';
import RESPONSE_CODES from '../constants/responseCodes';
import prisma from '../db';
import sendResponse from '../helpers/responseHelper';

export const getHealth = async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return sendResponse(res, { status: 'ok' });
  } catch {
    return sendResponse(res, null, 'Database unavailable', RESPONSE_CODES.serviceUnavailable);
  }
};
