import {createLogger, format, transports} from "winston";

const logger = createLogger({
  format: format.combine(
    format.splat(),
    format.colorize(),
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.printf((log) => {
      return `[${log.timestamp}] [${log.level}] ${log.caller ?? ""} - ${log.message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({filename: "error.log", level: "error", options: {flags: "w"}}),
  ],
});

export default logger;
