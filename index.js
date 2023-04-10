/* eslint-disable no-unused-vars */
import chalk from "chalk";
import tmi from "tmi.js";
import prompt from "prompt";
import { execSync } from "child_process";

prompt.start();

prompt.get(
  {
    name: "Channel name",
    required: true,
  },
  (err, result) => {
    const channel = result["channel name"].toLowerCase();
    const client = new tmi.Client({
      channels: [channel],
    });
    try {
      console.log(chalk.yellowBright(`Connecting to ${channel}...`));
      sleep(2);
      client.connect();
      console.log(`Connected to ${chalk.greenBright(channel)}`);

      client.on("message", (channel, tags, message, self) => {
        const user = {
          name: tags["display-name"],
          color: tags.color,
          message,
        };
        if (self) return;
        printMessage(user, tags, message);
      });
      client.on(
        "subscription",
        (channel, username, method, message, userstate) => {
          console.log(chalk.bgMagenta(`${username} has subscribed`));
        }
      );
    } catch (error) {
      console.log(chalk.redBright(error));
    }
  }
);

function printMessage (user, tags, message) {
  if (user.color) {
    const color = chalk.hex(user.color);
    console.log(color.bold(`${user.name}: `) + chalk.white(message));
  } else {
    chalk.blue.bold(`${user.name}: `) + chalk.white(message);
  }
  if (message.includes("@")) {
    const [mention, ...args] = message.split(" ");
    console.log(chalk.magenta.bold(mention), args.join(" "));
  }
}
function sleep (seconds) {
  execSync(`sleep ${seconds}`);
}
