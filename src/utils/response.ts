import { RESPONSE_STATUSES as rs, SERVER_MESSAGES as sm } from '../config';
import { ResponseObject } from './types';

export default (
  Request,
  Response,
  status = rs[200],
  message = sm.ok,
  data = null,
) => {
  const responseObject: ResponseObject = {
    datetime: Date.now(),
    message,
    request: `${Request.originalUrl || Request.url} [${Request.method}]`,
    status,
  };

  if (data) {
    responseObject.data = data;
  }

  return Response.send(responseObject);
};
