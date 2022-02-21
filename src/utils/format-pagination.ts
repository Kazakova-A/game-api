import { Pagination } from './types';

export default (limit = 10, page = 1, total = 0): Pagination => ({
  currentPage: page,
  limit,
  totalPages: Math.ceil(total / limit),
});
