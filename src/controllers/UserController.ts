import { DELETE } from "./../constants/index";
import { Application, Request, Response } from "express";
import { REQUIRED } from "../constants";
import { User } from "../interfaces/IUser";
import { UserService } from "../services/UserService";
import { authHeader, generateMessage, getToken } from "../utils/index";

const userService = new UserService();

export default function userRoutes(app: Application) {
  // skip authentication swagger
  //    *     security:
  //    *        - Bearer: []

  /**
   * @swagger
   * '/users/auth':
   *  post:
   *     tags:
   *     - UserService
   *     security:
   *        - Bearer: []
   *     summary: Login user with username and password (get token)
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *            type: object
   *            required:
   *              - username
   *              - password
   *            properties:
   *              username:
   *                type: string
   *                default: ducanhnguyen
   *              password:
   *                type: string
   *                default: 12345678
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *            schema:
   *       400:
   *         description: Bad request
   */
  app.post("/users/auth", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body as any;

      if (!username || !password) {
        res.status(400);
        res.send(generateMessage(REQUIRED, "username, password"));
        return false;
      }

      const result: User | null = await userService.authenticate(
        username,
        password
      );

      if (!result) {
        res.status(401);
        res.send(`username or password is incorrect, plz check again`);
        return;
      }

      res.json(getToken(result));
    } catch (e) {
      res.status(400);
      res.json(e);
    }
  });
  /**
   * @swagger
   * '/users/create':
   *  post:
   *     tags:
   *     - UserService
   *     summary: Create a users account
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *            type: object
   *            required:
   *              - firstname
   *              - lastname
   *              - username
   *              - password
   *            properties:
   *              firstname:
   *                type: string
   *                default: Duc Anh
   *              lastname:
   *                type: string
   *                default: Nguyen
   *              username:
   *                type: string
   *                default: ducanhnguyen
   *              password:
   *                type: string
   *                default: 12345678
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *            schema:
   *       400:
   *         description: Bad request
   */
  app.post("/users/create", async (req: Request, res: Response) => {
    try {
      const { firstname, lastname, username, password } = req.body as any;

      if (!firstname || !lastname || !username || !password) {
        res.status(400);
        res.send(
          generateMessage(REQUIRED, `firstname, lastname, username, password`)
        );
        return;
      }

      const user: User = await userService.create({
        firstname,
        lastname,
        username,
        password,
      });

      res.json(getToken(user));
    } catch (e) {
      res.status(400);
      res.json(e);
    }
  });
  /**
   * @swagger
   * '/users':
   *  get:
   *     tags:
   *     - UserService
   *     summary: Get all user
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *            schema:
   *       400:
   *         description: Bad request
   */
  app.get("/users", authHeader, async (_req: Request, res: Response) => {
    try {
      const users: User[] = await userService.getAll();

      res.json(users);
    } catch (e) {
      res.status(400);
      res.json(e);
    }
  });

  /**
   * @swagger
   * '/users/{id}':
   *  get:
   *     tags:
   *     - UserService
   *     summary: detail user by id
   *     parameters:
   *      - name: id
   *        in: path
   *        description: The unique id of the user
   *        required: true
   *     responses:
   *      200:
   *        description: Success
   *      400:
   *        description: Bad request
   */
  app.get("/users/:id", authHeader, async (req: Request, res: Response) => {
    try {
      const { id } = req.params as any;

      if (!id) {
        res.status(400);
        res.send(generateMessage(REQUIRED, "id"));
        return false;
      }

      const user: User = await userService.getDetail(id);

      res.json(user);
    } catch (e) {
      res.status(400);
      res.json(e);
    }
  });

  /**
   * @swagger
   * '/users':
   *  put:
   *     tags:
   *     - UserService
   *     summary: Modify a user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *            type: object
   *            required:
   *              - id
   *              - firstname
   *              - lastname
   *            properties:
   *              id:
   *                type: number
   *                default: 1
   *              firstname:
   *                type: string
   *                default: Duc Anh
   *              lastname:
   *                type: string
   *                default: Nguyen
   *     responses:
   *      200:
   *        description: Success
   *      400:
   *        description: Bad Request
   */
  app.put("/users", authHeader, async (req: Request, res: Response) => {
    try {
      const { id, firstname, lastname } = req.body as any;

      if (!firstname || !lastname || !id) {
        res.status(400);
        res.send(generateMessage(REQUIRED, "firstname, lastname, id"));
        return;
      }

      const result: User = await userService.update(id, {
        firstname,
        lastname,
      });

      res.json(result);
    } catch (ex) {
      res.status(400);
      res.json(ex);
    }
  });

  /**
   * @swagger
   * '/users/{id}':
   *  delete:
   *     tags:
   *     - UserService
   *     summary: Remove user by id
   *     parameters:
   *      - name: id
   *        in: path
   *        description: The unique id of the user to remove
   *        required: true
   *     responses:
   *      200:
   *        description: Success
   *      400:
   *        description: Bad request
   */
  app.delete("/users/:id", authHeader, async (req: Request, res: Response) => {
    try {
      const { id } = req.params as any;

      if (!id) {
        res.status(400);
        res.send(generateMessage(REQUIRED, "id"));
        return false;
      }

      await userService.delete(id);

      res.send(generateMessage(DELETE, `id`));
    } catch (e) {
      res.status(400);
      res.json(e);
    }
  });
}
