import { Application, Request, Response } from "express";
import { DELETE, REQUIRED } from "../constants";
import { Order, OrderProduct } from "../interfaces/IOrder";
import { OrderService } from "../services/OrderService";
import { authHeader, generateMessage } from "../utils/index";

const orderService = new OrderService();

export default function orderRoutes(app: Application) {
  /**
   * @swagger
   * '/orders':
   *  get:
   *     tags:
   *     - Order Service
   *     summary: Get all orders
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *            schema:
   *       400:
   *         description: Bad request
   */
  app.get("/orders", authHeader, async (_req: Request, res: Response) => {
    try {
      const orders: Order[] = await orderService.getAll();

      res.json(orders);
    } catch (e) {
      res.status(400);
      res.json(e);
    }
  });

  /**
   * @swagger
   * '/orders/create':
   *  post:
   *     tags:
   *     - Order Service
   *     summary: Create new a user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *            type: object
   *            required:
   *              - product_list
   *              - quantity_list
   *              - user_id
   *              - status
   *            properties:
   *              products:
   *                type: array
   *                default: [{product_id: 1, quantity: 1}]
   *              user_id:
   *                type: number
   *                default: 1
   *              status:
   *                type: boolean
   *                default: true
   *     responses:
   *      200:
   *        description: Success
   *      400:
   *        description: Bad Request
   */
  app.post(
    "/orders/create",
    authHeader,
    async (req: Request, res: Response) => {
      try {
        const { products, status, user_id } = req.body as any;

        if (!products || !status || !user_id) {
          res.status(400);
          res.send(generateMessage(REQUIRED, `products, status, user_id`));
          return false;
        }

        const result: Order = await orderService.create({
          products,
          status,
          user_id,
        });

        res.json(result);
      } catch (ex) {
        res.status(400);
        res.json(ex);
      }
    }
  );
  /**
   * @swagger
   * '/orders/{id}':
   *  get:
   *     tags:
   *     - Order Service
   *     summary: detail order by id
   *     parameters:
   *      - name: id
   *        in: path
   *        description: The unique id of the order
   *        required: true
   *     responses:
   *      200:
   *        description: Success
   *      400:
   *        description: Bad request
   */
  app.get("/orders/:id", authHeader, async (req: Request, res: Response) => {
    try {
      const { id } = req.params as any;

      if (!id) {
        res.status(400);
        res.send(generateMessage(REQUIRED, "id"));
        return false;
      }

      const result: Order = await orderService.getDetail(id);

      res.json(result);
    } catch (e) {
      res.status(400);
      res.json(e);
    }
  });

  /**
   * @swagger
   * '/orders':
   *  put:
   *     tags:
   *     - Order Service
   *     summary: Modify a user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *            type: object
   *            required:
   *              - product_list
   *              - quantity_list
   *              - user_id
   *              - status
   *            properties:
   *              products:
   *                type: array
   *                default: [{product_id: 1, quantity: 1}]
   *              user_id:
   *                type: number
   *                default: 1
   *              order_id:
   *                type: number
   *                default: 1
   *              status:
   *                type: boolean
   *                default: true
   *     responses:
   *      200:
   *        description: Success
   *      400:
   *        description: Bad Request
   */
  app.put("/orders", authHeader, async (req: Request, res: Response) => {
    try {
      const products = req.body.products as any as OrderProduct[];
      const { status, user_id, order_id } = req.body as any;

      if (!products || !status || !user_id || !order_id) {
        res.status(400);
        res.send(
          generateMessage(REQUIRED, `products, status, user_id, order_id`)
        );
        return;
      }

      const result: Order = await orderService.update(order_id, {
        products,
        status,
        user_id,
      });

      res.json(result);
    } catch (ex) {
      res.status(400);
      res.json(ex);
    }
  });

  /**
   * @swagger
   * '/orders/{id}':
   *  delete:
   *     tags:
   *     - Order Service
   *     summary: Remove orders by id
   *     parameters:
   *      - name: id
   *        in: path
   *        description: The unique id of the orders to remove
   *        required: true
   *     responses:
   *      200:
   *        description: Success
   *      400:
   *        description: Bad request
   */
  app.delete("/orders/:id", authHeader, async (req: Request, res: Response) => {
    try {
      const { id } = req.params as any;

      if (!id) {
        res.status(400);
        res.send(generateMessage(REQUIRED, "id"));
        return;
      }

      await orderService.delete(id);

      res.send(generateMessage(DELETE, `id : ${id}`));
    } catch (ex) {
      res.status(400);
      res.json(ex);
    }
  });
}
