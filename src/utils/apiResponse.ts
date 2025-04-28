import {
  StatusCodeKey,
  StatusCodeNumber,
  statusCodes,
  statusMessages,
} from "@/constants/error";

type ValidationError = {
  field: string;
  message: string;
};

export const ResponseBody = (
  statusCode: StatusCodeNumber,
  data: unknown = null,
  message?: string | unknown,
  errors?: ValidationError[]
) => {
  const statusEntry = Object.entries(statusCodes).find(
    ([, code]) => code === statusCode
  );

  if (!statusEntry) {
    throw new Error(`Unknown status code: ${statusCode}`);
  }

  const [statusCodeKey] = statusEntry as [StatusCodeKey, StatusCodeNumber];

  const success = statusCode >= 200 && statusCode < 300;
  return {
    success,
    statusCode,
    message: message ? message : statusMessages[statusCodeKey],
    data,
    ...(errors && { errors }),
  };
};
