import PM2Watcher from "../utils/pm2Watcher";
import { ProcessInfo } from "@interfaces/pm2.interface";

const pm2Watcher = new PM2Watcher();

export default class Pm2WatcherService {
  public async listProcesses(): Promise<any[]> {
    const processList: any[] = await pm2Watcher.listProcesses();
    return processList;
  }

  public async processStatus(process: string | number): Promise<string> {
    const status: string = await pm2Watcher.processStatus(process);
    if (status) {
      return status;
    } else {
      throw new Error("processStatus error on service");
    }
  }

  public async stopProcess(process: string | number): Promise<Boolean> {
    const stoppedProcess: boolean = await pm2Watcher.stopProcess(process);
    if (stoppedProcess) {
      return true;
    }
    return false;
  }

  public async restartProcess(
    process: string | number
  ): Promise<boolean | string> {
    const status: boolean | string = await pm2Watcher.restartProcess(process);
    return status;
  }

  public async reloadProcess(
    process: string | number
  ): Promise<boolean | string> {
    const status: boolean | string = await pm2Watcher.reloadProcess(process);
    return status;
  }

  public async deleteProcess(
    process: string | number
  ): Promise<boolean | string> {
    const status: boolean | string = await pm2Watcher.deleteProcess(process);
    return status;
  }

  public async describe(process: string | number): Promise<ProcessInfo> {
    const data = await pm2Watcher.describe(process);
    return data;
  }

  public async getLogs(outputPath: string): Promise<any> {
    const logs = await pm2Watcher.getLogs(outputPath);
    return logs;
  }

  public async getErrorLog(): Promise<any> {
    const logs = await pm2Watcher.getErrorLog();
    return logs;
  }

  public async slackMessageHandler() {
    const data = await pm2Watcher.launchBus();
    return data;
  }
}
