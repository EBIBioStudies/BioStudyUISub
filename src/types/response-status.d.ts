declare interface LogDetail {
  level: string; // 'INFO'|'WARN'|'ERROR'
  message: string;
  subnodes: Array<LogDetail>;
}

declare interface StatusResponse {
  status: string; // 'OK' or 'FAIL'
  log: LogDetail;
}
