import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import { Pm2WatcherController } from "../controllers/pm2Watcher.controller";

export class Pm2WatcherRoutes implements Routes {
  public path = "/api/pm2";
  public router = Router();
  public pm2WatcherController = new Pm2WatcherController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/processes`,
      this.pm2WatcherController.listProcesses
    );
    this.router.get(
      `${this.path}/status`,
      this.pm2WatcherController.processStatus
    );
    this.router.get(
      `${this.path}/describe`,
      this.pm2WatcherController.describe
    );
    this.router.get(`${this.path}/logs`, this.pm2WatcherController.getLogs);
    this.router.post(
      `${this.path}/stop`,
      this.pm2WatcherController.stopProcess
    );
    this.router.post(
      `${this.path}/restart`,
      this.pm2WatcherController.restartProcess
    );
    this.router.post(
      `${this.path}/reload`,
      this.pm2WatcherController.reloadProcess
    );
    this.router.post(
      `${this.path}/slackmessagetest`,
      this.pm2WatcherController.slackMessageTest
    );
    this.router.delete(
      `${this.path}/delete`,
      this.pm2WatcherController.deleteProcess
    );
  }
}
