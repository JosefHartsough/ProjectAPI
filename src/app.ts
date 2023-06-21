import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import { Routes } from "./interfaces/routes.interface";
import { NODE_ENV, PORT, ORIGIN, CREDENTIALS } from "./config";
import errorMiddleware from "./middlewares/error.middleware";
import PM2Watcher from "./utils/pm2Watcher";
import SocketHandler from "./utils/socketHandler";

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public pm2Watcher = new PM2Watcher();
  public socketHanlder = new SocketHandler();

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || "development";
    this.port = PORT || 3000;

    this.initializePm2Bus();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
    this.initilizeSocketHandler();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`=================================`);
      console.log(`======= ENV: ${this.env} =======`);
      console.log(`App listening on the port ${this.port}`);
      console.log(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializePm2Bus() {
    this.pm2Watcher.launchBus();
  }

  public initializeMiddlewares() {
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  public initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initilizeSocketHandler() {
    this.socketHanlder.test();
  }
}

export default App;
