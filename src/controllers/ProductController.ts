import { Application, Request, Response } from "express";
import { DELETE, REQUIRED } from "../constants";
import { Product } from "../interfaces/IProduct";
import { ProductService } from "../services/ProductService";
import { authHeader, generateMessage } from "../utils/index";

const productService = new ProductService();

export default function productRoutes(app: Application) {
  /**
   * @swagger
   * '/products':
   *  get:
   *     tags:
   *     - Product Service
   *     summary: Get all products
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *            schema:
   *       400:
   *         description: Bad request
   */
  app.get("/products", async (_req: Request, res: Response) => {
    try {
      const results: Product[] = await productService.getAll();

      res.json(results);
    } catch (ex) {
      res.status(400);
      res.json(ex);
    }
  });

  /**
   * @swagger
   * '/products/create':
   *  post:
   *     tags:
   *     - Product Service
   *     summary: Create a product
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *            type: object
   *            required:
   *              - name
   *              - price
   *            properties:
   *              name:
   *                type: string
   *                default: Milk
   *              price:
   *                type: number
   *                default: 3030
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *            schema:
   *       400:
   *         description: Bad request
   */

  app.post(
    "/products/create",
    authHeader,
    async (req: Request, res: Response) => {
      try {
        const { name, price } = req.body as any;
        if (!name || !price) {
          res.status(400);
          res.send(generateMessage(REQUIRED, "name, price"));
          return;
        }

        const result: Product = await productService.create({
          name,
          price,
        });

        res.json(result);
      } catch (e) {
        res.status(400);
        res.json(e);
      }
    }
  );

  /**
   * @swagger
   * '/products/{id}':
   *  get:
   *     tags:
   *     - Product Service
   *     summary: detail product by id
   *     parameters:
   *      - name: id
   *        in: path
   *        description: The unique id of the product
   *        required: true
   *     responses:
   *      200:
   *        description: Success
   *      400:
   *        description: Bad request
   */
  app.get("/products/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params as any;

      if (!id) {
        res.status(400);
        res.send(generateMessage(REQUIRED, "id"));
        return;
      }

      const result: Product = await productService.getDetail(id);

      res.json(result);
    } catch (ex) {
      res.status(400);
      res.json(ex);
    }
  });

  /**
   * @swagger
   * '/products':
   *  put:
   *     tags:
   *     - Product Service
   *     summary: Modify a user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *            type: object
   *            required:
   *              - price
   *            properties:
   *              id:
   *                type: number
   *                default: 1
   *              name:
   *                type: string
   *                default: Milk
   *              price:
   *                type: number
   *                default: 1234
   *     responses:
   *      200:
   *        description: Success
   *      400:
   *        description: Bad Request
   */
  app.put("/products", authHeader, async (req: Request, res: Response) => {
    try {
      const { id, name, price } = req.body as any;

      if (!name || !price || !id) {
        res.status(400);
        res.send(generateMessage(REQUIRED, "name, price, id"));
        return false;
      }

      const result: Product = await productService.update(id, {
        name,
        price,
      });

      res.json(result);
    } catch (ex) {
      res.status(400);
      res.json(ex);
    }
  });

  /**
   * @swagger
   * '/products/{id}':
   *  delete:
   *     tags:
   *     - Product Service
   *     summary: Remove product by id
   *     parameters:
   *      - name: id
   *        in: path
   *        description: The unique id of the product to remove
   *        required: true
   *     responses:
   *      200:
   *        description: Success
   *      400:
   *        description: Bad request
   */
  app.delete(
    "/products/:id",
    authHeader,
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params as any;

        if (!id) {
          res.status(400);
          res.send(generateMessage(REQUIRED, "id"));
          return;
        }
        await productService.delete(id);
        res.send(generateMessage(DELETE, `id ${id}`));
      } catch (ex) {
        res.status(400);
        res.json(ex);
      }
    }
  );
}
