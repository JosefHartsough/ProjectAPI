export interface Message {
  data: string;
  at: number;
  process: {
    namespace: string;
    rev: string;
    name: string;
    pm_id: number;
    status: string;
  };
}

export interface EventData {
  at: number;
  process: {
    username: string;
    watch: boolean;
    namespace: string;
    name: string;
    node_args: string[];
    pm_exec_path: string;
    instances: number;
    pm_out_log_path: string;
    pm_err_log_path: string;
    pm_pid_path: string;
    node_version: string;
    exit_code: number;
  };
  event: string;
}

export interface Process {
  pid: number;
  name: string;
  process: {
    username: string;
    watch: boolean;
    namespace: string;
    name: string;
    node_args: string[];
    pm_exec_path: string;
    instances: number;
    pm_out_log_path: string;
    pm_err_log_path: string;
    pm_pid_path: string;
    node_version: string;
    exit_code: number;
  };
}

export interface ProcessInfo {
  name: string;
  status: string;
  execMode: string;
  execInterpreter: string;
  scriptPath: string;
  pmOutLogPath: string;
  pmErrorLogPath: string;
  pmId: number;
  pid: number;
  memory: number;
  cpu: number;
  restarts: number;
  unstableRestarts: number;
  env: any;
}
