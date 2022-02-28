import * as dotenv from 'dotenv';

dotenv.config();

const { env = {} } = process;

// Port
export const PORT = env.PORT;

// Database connection options
export const DATABASE = {
  database: env.POSTGRES_DB,
  host: env.POSTGRES_HOST,
  password: env.POSTGRESS_PASSWORD,
  port: env.POSTGRESS_PORT,
  username: env.POSTGRES_USER,
};

// Server response statuses
export const RESPONSE_STATUSES = {
  200: 200,
  201: 201,
  204: 204,
  400: 400,
  500: 500,
};

// Server response messages
export const SERVER_MESSAGES = {
  ok: 'OK',
  notFound: 'NOT_FOUND',
  internalServerError: 'INTERNAL_SERVER_ERROR',
  missingData: 'MISSING_DATA',
  alreadyExists: 'ALREADY_EXISTS',
  publisherDoesNotExists: 'PUBLISHER_DOES_NOT_EXISTS',
};
