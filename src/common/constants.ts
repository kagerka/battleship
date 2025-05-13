export const DEFAULT_PORT = 8181;

export const STATUS_CODES = {
  OK: { code: 200, message: 'OK' },
  CREATED: { code: 201, message: 'Created.' },
  DELETED: { code: 204, message: 'Deleted.' },
  BAD_REQUEST: { code: 400, message: 'Bad request.' },
  NOT_FOUND: { code: 404, message: 'Not found.' },
  METHOD_NOT_ALLOWED: { code: 405, message: 'Method not allowed.' },
  INTERNAL_SERVER_ERROR: { code: 500, message: 'Internal server error.' },
};
