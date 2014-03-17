if (process.env.COLORS_TO_LESS_OPERATIONS_COVERAGE) {
  eval('module.exports = require("./.coverage/lib");');
} else {
  module.exports = require('./lib');
}
