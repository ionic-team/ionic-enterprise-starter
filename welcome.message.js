const chalk = require("chalk");

const msg = `
Welcome to the ${chalk.blue.bold("Ionic")} Enterprise Starter!

For more details, please see the project's README: ${chalk.bold(
  "https://github.com/ionic-team/ionic-enterprise-starter/blob/main/README.md"
)}
`.trim();

console.log(msg);
console.log(JSON.stringify(msg));
