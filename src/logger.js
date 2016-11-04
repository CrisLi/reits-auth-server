const winston = require('winston');
const moment = require('moment');
const { Console } = winston.transports;

module.exports = new (winston.Logger)({
  transports: [
    new Console({
      timestamp() {
        return moment().format('YYYY-MM-DD HH:mm:ss.SSSS');
      },
      formatter(options) {
        const { timestamp, level, message, meta } = options;
        const metaInfo = meta && Object.keys(meta).length ? JSON.stringify(options.meta, 2) : '';
        const levelInfo = winston.config.colorize(level, level.toUpperCase());
        return `${timestamp()} | ${levelInfo} | ${message} | ${metaInfo}`;
      },
      colorize: true,
      level: 'debug'
    })
  ]
});