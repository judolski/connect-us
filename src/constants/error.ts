export const statusCodes = {
  OK: 200, // OK
  CREATED: 201, // Created

  BAD_REQUEST: 400, // Bad Request
  UNAUTHORIZED: 401, // Unauthorized
  FORBIDDEN: 403, // Forbidden
  NOT_FOUND: 404, // Not Found
  METHOD_NOT_ALLOWED: 405, // Method Not Allowed
  CONFLICT: 409, // Conflict

  INTERNAL_SERVER_ERROR: 500, // Internal Server Error
} as const;

export type StatusCodeKey = keyof typeof statusCodes;
export type StatusCodeNumber = (typeof statusCodes)[keyof typeof statusCodes];

export const statusMessages = {
  // Successful (2xx)
  OK: "The request has succeeded.",
  CREATED:
    "The request has been fulfilled and resulted in a new resource being created.",

  // Client Error (4xx)
  BAD_REQUEST:
    "The server could not understand the request due to invalid syntax.",
  UNAUTHORIZED:
    "The client must authenticate itself to get the requested response.",
  FORBIDDEN: "The client does not have access rights to the content.",
  NOT_FOUND: "The server cannot find the requested resource.",
  METHOD_NOT_ALLOWED:
    "The request method is known by the server but is not supported by the target resource.",
  CONFLICT:
    "The request could not be completed due to a conflict with the current state of the resource.",
  // Server Error (5xx)
  INTERNAL_SERVER_ERROR:
    "The server has encountered a situation it doesn't know how to handle.",
} satisfies Record<StatusCodeKey, string>;
