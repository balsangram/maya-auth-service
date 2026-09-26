const getTimestamp = () => {
  return new Date().toISOString();
};

const isDevelopment = process.env.NODE_ENV === "development";

const logger = {
  info: (message, data = null) => {
    if (isDevelopment) {
      console.log(
        `[INFO] ${getTimestamp()} - ${message}`,
        data ?? ""
      );
    }
  },

  warn: (message, data = null) => {
    if (isDevelopment) {
      console.warn(
        `[WARN] ${getTimestamp()} - ${message}`,
        data ?? ""
      );
    }
  },

  error: (message, error = null) => {
    if (isDevelopment) {
      console.error(
        `[ERROR] ${getTimestamp()} - ${message}`,
        error ?? ""
      );
    }
  },

  debug: (message, data = null) => {
    if (isDevelopment) {
      console.debug(
        `[DEBUG] ${getTimestamp()} - ${message}`,
        data ?? ""
      );
    }
  },
};

export default logger;