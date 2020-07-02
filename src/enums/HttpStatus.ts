/**
 * Http responses status with their respective codes
 */
export enum HttpStatus {
  /**
   * Continue
   */
  CONTINUE = 100,

  /**
   * Switching Protocols
   */
  SWITCHING_PROTOCOLS = 101,

  /**
   * Ok
   */
  OK = 200,

  /**
   * Created
   */
  CREATED = 201,

  /**
   * Accepted
   */
  ACCEPTED = 202,

  /**
   * Now Authoritative Information
   */
  NON_AUTHORITATIVE_INFORMATION = 203,

  /**
   * No Content
   */
  NO_CONTENT = 204,

  /**
   * Reset Content
   */
  RESET_CONTENT = 205,

  /**
   * Partial Content
   */
  PARTIAL_CONTENT = 206,

  /**
   * Multiple Choices
   */
  MULTIPLE_CHOICES = 300,

  /**
   * Moved Permanently
   */
  MOVED_PERMANENTLY = 301,

  /**
   * Found
   */
  FOUND = 302,

  /**
   * See Other
   */
  SEE_OTHER = 303,

  /**
   * Not Modified
   */
  NOT_MODIFIED = 304,

  /**
   * Use Proxy
   */
  USE_PROXY = 305,

  /**
   * Temporary Redirect
   */
  TEMPORARY_REDIRECT = 307,

  /**
   * Bad Request
   */
  BAD_REQUEST = 400,

  /**
   * Unauthorized
   */
  UNAUTHORIZED = 401,

  /**
   * Payment Required
   */
  PAYMENT_REQUIRED = 402,

  /**
   * Forbidden
   */
  FORBIDDEN = 403,

  /**
   * Not Found
   */
  NOT_FOUND = 404,

  /**
   * Method Not Allowed
   */
  METHOD_NOT_ALLOWED = 405,

  /**
   * Not Acceptable
   */
  NOT_ACCEPTABLE = 406,

  /**
   * Proxy Authentication Required
   */
  PROXY_AUTHENTICATION_REQUIRED = 407,

  /**
   * Request Timeout
   */
  REQUEST_TIMEOUT = 408,

  /**
   * Conflict
   */
  CONFLICT = 409,

  /**
   * Gone
   */
  GONE = 410,

  /**
   * Length Required
   */
  LENGTH_REQUIRED = 411,

  /**
   * Precondition Failed
   */
  PRECONDITION_FAILED = 412,

  /**
   * Request Entity Too Large
   */
  REQUEST_ENTITY_TOO_LARGE = 413,

  /**
   * Request Uri Too Long
   */
  REQUEST_URI_TOO_LONG = 414,

  /**
   * Unsupported Media Type
   */
  UNSUPPORTED_MEDIA_TYPE = 415,

  /**
   * Requested Range Not Satisfiable
   */
  REQUESTED_RANGE_NOT_SATISFIABLE = 416,

  /**
   * Expectation Failed
   */
  EXPECTATION_FAILED = 417,

  /**
   * Unprocessable Entity
   */
  UNPROCESSABLE_ENTITY = 422,

  /**
   * Too Many Requests
   */
  TOO_MANY_REQUESTS = 429,

  /**
   * Internal Server Error
   */
  INTERNAL_SERVER_ERROR = 500,

  /**
   * Not Implemented
   */
  NOT_IMPLEMENTED = 501,

  /**
   * Bad Gateway
   */
  BAD_GATEWAY = 502,

  /**
   * Service Unavailable
   */
  SERVICE_UNAVAILABLE = 503,

  /**
   * Gatewaty Timeout
   */
  GATEWAY_TIMEOUT = 504,

  /**
   * Http Version Not Supported
   */
  HTTP_VERSION_NOT_SUPPORTED = 505,
}
