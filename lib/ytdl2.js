const chalk = require('chalk');

// ✨ Beltah Console Theme Colors
const colors = {
  success: chalk.green,
  info: chalk.cyan,
  warning: chalk.yellow,
  error: chalk.red,
  dim: chalk.gray,
  bright: chalk.whiteBright,
  tag: chalk.magentaBright
};

// 🛠 Format label + value with spacing
const printLine = (label, value = '', gap = 20) => {
  const spaces = ' '.repeat(Math.max(1, gap - label.length));
  return `${chalk.greenBright(label)}:${spaces}${chalk.white(value)}`;
};

// 🔍 Beltah Logger Display
const logInfo = (title, data = {}) => {
  console.log(`\n${chalk.bold.green('[ BeltahBot Info ]')} ${chalk.cyanBright(title)}`);
  for (let [key, val] of Object.entries(data)) {
    console.log(printLine(key, val));
  }
};

// ⚠ BeltahBot Error Log
const logError = (title, err = '') => {
  console.log(`\n${chalk.bold.red('[ BeltahBot Error ]')} ${chalk.yellowBright(title)}`);
  if (err) console.error(typeof err === 'string' ? err : err.message || err.toString());
};

// 🧾 Header Output
const banner = (text = 'BeltahBot Activated!') => {
  console.log(chalk.bgMagenta.white.bold(`\n🔰 ${text} 🔰\n`));
};

// 🌍 BeltahBot status output
const status = {
  start: () => banner('🔥 BeltahBot is now live!'),
  stop: () => console.log(chalk.red('🛑 BeltahBot stopped')),
  restart: () => console.log(chalk.yellow('♻️ Restarting BeltahBot...'))
};

module.exports = {
  colors,
  printLine,
  logInfo,
  logError,
  banner,
  status
};