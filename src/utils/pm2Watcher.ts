import pm2, { connect } from "pm2";
import {
  Message,
  EventData,
  Process,
  ProcessInfo,
} from "@interfaces/pm2.interface";

import fs from "fs";

// TODO: Create a proper type for all any types

type ProcessData = {
  pid: number;
  name: string;
  pmId: number;
  status: string;
  uptime: number;
  restarts: number;
  cpu: number;
  memory: number;
};

export class PM2Watcher {
  /**
   * Connect to an existing pm2 or start a new pm2 instance
   * @param err
   */
  public connect(err: any) {
    if (err) {
      console.error(err);
      process.exit(2);
    }
  }

  /**
   * @returns A list of current processes
   */

  public async listProcesses(): Promise<any> {
    const processList = await new Promise((resolve, reject) => {
      pm2.list((err, lst) => {
        if (err) {
          reject(err);
        }
        const newList = lst.map((process) => {
          const {
            pid,
            name,
            pm_id: pmId,
            pm2_env: { status, pm_uptime: uptime, unstable_restarts: restarts },
            monit: { cpu, memory },
          } = process;
          // TODO: Better naming
          const cleanedProcess: ProcessData = {
            pid,
            name,
            pmId,
            status,
            uptime,
            restarts,
            cpu,
            memory,
          };
          return cleanedProcess;
        });
        resolve(newList);
      });
    });
    return processList;
  }

  /**
   *
   * @param process String | Number
   * @returns Current status for the given process
   *  statuses: "stopped", "running"
   */
  public async processStatus(process: string | number): Promise<string> {
    const processStatus: string = await new Promise((resolve, reject) => {
      pm2.describe(process, (err: any, msg: any) => {
        if (err) {
          console.error("Error: processStatus", err);
          reject(err);
        }
        const { status } = msg[0].pm2_env;
        resolve(status);
      });
    });
    return processStatus;
  }

  public async stopProcess(process: string | number): Promise<boolean> {
    const stopProcessStatus: boolean = await new Promise((resolve, reject) => {
      pm2.stop(process, (err: any, msg: any) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        resolve(true);
      });
    });

    return stopProcessStatus;
  }

  public async restartProcess(
    process: string | number
  ): Promise<boolean | string> {
    const restartProcessStatus: boolean | string = await new Promise(
      (resolve, reject) => {
        pm2.restart(process, (err: any, msg: any) => {
          if (err) {
            reject(err);
          }
          const [processInfo] = msg;
          const { status, pm_id: processId } = processInfo;
          if (status === "online") {
            resolve(true);
          } else {
            resolve(status);
          }
        });
      }
    );
    return restartProcessStatus;
  }

  public async reloadProcess(processName: string | number): Promise<any> {
    const reloadProcessStatus = await new Promise((resolve, reject) => {
      pm2.reload(processName, (err: any, msg: any) => {
        if (err) {
          reject(err);
        }
        console.log("Msg payload: reloadProcess", msg);

        resolve(true);
      });
    });
    return reloadProcessStatus;
  }

  // TODO: Since delete only removes process from list, decide if we want to also stop the process before deleting
  public async deleteProcess(
    processName: string | number
  ): Promise<boolean | string> {
    const deleteProcessStatus: boolean | string = await new Promise<
      boolean | string
    >((resolve, reject) => {
      pm2.delete(processName, (err: any, msg: any) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
    return deleteProcessStatus;
  }

  public async describe(process: string | number): Promise<ProcessInfo> {
    const processData = await new Promise<ProcessInfo>((resolve, reject) => {
      pm2.describe(process, (err: any, msg: any) => {
        if (err) {
          reject(err);
        }
        const {
          pid,
          name,
          pm2_env: {
            env,
            status,
            pm_id: pmId,
            exec_mode: execMode,
            exec_interpreter: execInterpreter,
            restart_time: restarts,
            unstable_restarts: unstableRestarts,
            pm_exec_path: scriptPath,
            pm_out_log_path: pmOutLogPath,
            pm_err_log_path: pmErrorLogPath,
          },
          monit: { memory, cpu },
        } = msg[0];

        resolve({
          pid,
          name,
          pmId,
          status,
          memory,
          cpu,
          execMode,
          execInterpreter,
          restarts,
          unstableRestarts,
          scriptPath,
          pmOutLogPath,
          pmErrorLogPath,
          env,
        });
      });
    });
    return processData;
  }

  public async getLogs(outputPath: string) {
    const outputLog = fs.readFileSync(
      "/Users/josefhartsough/.pm2/logs/test-file-js-2-out.log",
      "utf8"
    );
    return outputLog;
    // const logs = await new Promise((resolve, reject)) => {
    //  return fs.readFileSync(outputPath, "utf8")

    // }
  }

  // Creates a new bus object that listens for an event
  public async launchBus(): Promise<any> {
    const status = await new Promise((resolve, reject) => {
      pm2.launchBus((err: any, bus: any) => {
        // bus.on("process:exception", (msg: Message) => {
        //   console.log("process:exception", msg);
        // });

        bus.on("log:err", async (msg: Message) => {
          const { pm_id: pmId }: { pm_id: number } = msg.process;
          const processStopped = await this.stopProcess(pmId);
          resolve(msg);
        });

        bus.on("pm2:kill", (msg: Message) => {
          console.log("pm2:kill", msg);
        });

        bus.on("log:out", (msg: Message) => {
          console.log("log:out", msg);
        });

        bus.on("process:event", (data: EventData) => {
          if (data.process.name === "pm2_watcher.ts") return;
          switch (data.event) {
            case "start":
              console.log(`${data.process.name} has started`);
              break;
            case "stop":
              console.log(`${data.process.name} has stopped`);
              break;
            case "restart":
              console.log(`${data.process.name} has restarted`);
              break;
            case "restart overlimit":
              console.log(`${data.process.name} has reached its restart limit`);
              break;
          }
        });
      });
    });
    return status;
  }
}
