import { Request } from 'express';

export interface CustomRequest extends Request {
  userId?: string;
}

export interface ResponseCodes {
  ok: number;
  badRequest: number;
  authorizationError: number;
  notFound: number;
  conflictError: number;
  serverError: number;
  serviceUnavailable: number;
}
