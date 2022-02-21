import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

import { Pagination, QueryParams } from '../utils/types';

@Injectable()
export class PaginationMiddleware implements NestMiddleware {
  use(req, res, next: NextFunction) {
    let { limit = '', page = '' }: QueryParams = req.query;

    if (!limit || Number.isNaN(Number(limit))) limit = 15;
    if (!page || Number.isNaN(Number(page))) page = 1;

    req.pagination = {
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      page: Number(page),
    } as unknown as Pagination;

    return next();
  }
}
