import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { Pm2WatcherService } from "../services/pm2Watcher.service";
import { SLACK_WEBHOOK } from "../config";

export class Pm2WatcherController {
  public pm2WatcherService = new Pm2WatcherService();

  public listProcesses = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = await this.pm2WatcherService.listProcesses();
      if (!data) {
        throw new Error();
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(400);
      console.error(
        "Error in class Pm2WatcherController on function listProcesses",
        error
      );
    }
  };

  public processStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { process }: { process: number } = req.body;
      const status = await this.pm2WatcherService.processStatus(process);
      res.status(200).json({ status });
    } catch (error) {
      console.error("Error on processStatus in pm2WatcherController", error);
      res.status(400);
    }
  };

  public stopProcess = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { process }: { process: number } = req.body;
      // Check if process is running first
      const status = await this.pm2WatcherService.processStatus(process);
      if (status !== "stopped") {
        const data = await this.pm2WatcherService.stopProcess(process);
        if (data) {
          res.status(200).json({ status: "stopped" });
        }
      } else {
        console.error(
          "405 status. Could not stop process because it is already stopped"
        );
        res.sendStatus(405);
      }
    } catch (error) {
      res.status(400);
      console.error(
        "Error in class Pm2WatcherController on function stopProcess",
        error
      );
    }
  };

  public restartProcess = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { process }: { process: number } = req.body;
      const status = await this.pm2WatcherService.restartProcess(process);
      res.status(200).json({ status });
    } catch (error) {
      res.status(400);
      console.error(
        "Error occurred in pm2Watcher controller on function restartProcess",
        error
      );
    }
  };

  public reloadProcess = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { process }: { process: number } = req.body;
      const status = await this.pm2WatcherService.reloadProcess(process);
      res.status(200).json({ status });
    } catch (error) {
      res.status(400);
      console.error(
        "Error occurred in pm2Watcher controller on function reloadProcess",
        error
      );
    }
  };

  public deleteProcess = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      let process: number;
      if (req.query && req.query.process) {
        process = (req.query as any).process;
      }
      const status = await this.pm2WatcherService.deleteProcess(process);
      res.status(200).json({ status });
    } catch (error) {
      res.status(400);
      console.error(
        "Error occurred in pm2Watcher controller on function deleteProcess",
        error
      );
    }
  };

  public describe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      let process: number;
      if (req.query && req.query.process) {
        process = (req.query as any).process;
      }
      const data = await this.pm2WatcherService.describe(process);
      res.status(200).json({ data });
    } catch (error) {
      res.status(400);
      console.error(
        "Error occurred in pm2Watcher controller on function describe",
        error
      );
    }
  };

  public getLogs = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      let outputPath: string;
      if (req.query && req.query.outputPath) {
        process = (req.query as any).outputPath;
      }
      const logs = await this.pm2WatcherService.getLogs(outputPath);
      res.status(200).json({ logs });
    } catch (error) {
      res.status(500);
      console.error("Error occurred while getting logs");
    }
  };

  public slackMessageHandler = async () => {
    try {
      const processData = await this.pm2WatcherService.slackMessageHandler();
      const {
        data,
        at,
        process: { name, pm_id: pmId },
      }: {
        data: string;
        at: number;
        process: { name: string; pm_id: number };
      } = processData;
      this.slackMessageTest({ data, at, name, pmId });
    } catch (error) {
      console.error("Error on slackMessageHandler");
    }
  };

  public slackMessageTest = async ({ data, at, name, pmId }): Promise<void> => {
    try {
      const res = await axios.post(SLACK_WEBHOOK, {
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "New Event",
              emoji: true,
            },
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: "*Type:*\nError",
              },
              {
                type: "mrkdwn",
                text: `*PM ID:*\n${pmId}`,
              },
            ],
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*When:*\n${at}`,
              },
            ],
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Data:*\n${data}`,
              },
            ],
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `<http://localhost:5173/${pmId}>`,
            },
          },
        ],
      });

      console.log(res.data);
    } catch (error) {}
  };
}
