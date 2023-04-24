import jwt, { Secret } from "jsonwebtoken";
import { User } from "../interfaces/IUser";
import { NextFunction, Request, Response } from "express";
import {
  CREATE,
  UPDATE,
  DELETE,
  REQUIRED,
  MESSAGE_ACCESS_DENIED,
} from "../constants";

const TOKEN_SECRET = process.env.TOKEN_SECRET as Secret;

export function getToken(user: User) {
  return jwt.sign({ user }, TOKEN_SECRET);
}

export function authHeader(
  req: Request,
  res: Response,
  next: NextFunction
): void | boolean {
  if (!req.headers.authorization) {
    res.status(401);
    res.json(MESSAGE_ACCESS_DENIED);

    return false;
  }

  try {
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, TOKEN_SECRET);

    next();
  } catch (err) {
    console.error(err);

    res.status(401);
    res.json(MESSAGE_ACCESS_DENIED);

    return false;
  }
}

export function generateMessage(type: string, stringField: string): string {
  switch (type) {
    case CREATE:
      return `Create ${stringField} successfully`;
    case UPDATE:
      return `Update ${stringField} successfully`;
    case DELETE:
      return `Delete ${stringField} successfully`;
    case REQUIRED:
      return `Field ${stringField} is required`;
    default:
      return "";
  }
}
