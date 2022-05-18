import { ApiError } from "./apiError";
import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, _, res, __) => {
  if (err instanceof ApiError) {
    return res.status(err.code).json({
      statusCode: err.code,
      message: err.msg,
    });
  } else {
    return res.status(500).json({ statusCode: 500, message: err.message });
  }
};
 