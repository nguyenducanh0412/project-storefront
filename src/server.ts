import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import userRoutes from "./controllers/UserController";
import swaggerDocs from "./swagger";
import productRoutes from "./controllers/ProductController";
import orderRoutes from "./controllers/OrderController";

const app = express();
let port: number = 3001;

if (process.env.ENV === "test") {
  port = 3001;
}

app.use(bodyParser.json());
app.get("/", function (_req: Request, res: Response) {
    res.redirect('/swagger');
});

userRoutes(app);
productRoutes(app);
orderRoutes(app);

app.listen(port, function () {
  const url: string = `\x1b[2mhttp://localhost:${port}\x1b[0m`;
  console.log(`starting app on: ${url}`);
  swaggerDocs(app, port);
});

export default app;
