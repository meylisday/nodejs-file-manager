import os from "os";
import path from "path";
import { osInfo } from "./osInfo.js";
import { compress } from "./compress.js";
import { decompress } from "./decompress.js";
import { goUpInDirectory } from "./up.js";
import { copyOrMoveFile } from "./copyAndMove.js";
import { list } from "./list.js";
import { read } from "./read.js";
import { create } from "./create.js";
import { deleteFile } from "./delete.js";
import { rename } from "./rename.js";
import { hash } from "./hash.js";

const printCurrentWorkingDirectory = async () => {
  const cwd = process.cwd();
  console.log("You are currently in", cwd);
};

const exitFileManager = async (username) => {
  console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
  process.exit();
};

const changeDirectory = async (directory) => {
  const currentDir = process.cwd();
  const newDir = path.resolve(currentDir, directory);
  try {
    process.chdir(newDir);
  } catch (error) {
    console.error("Operation failed");
  }
};

const handleCommand = async (command, username) => {
  const [cmd, ...args] = command.split(" ");
  const [arg] = args.map((arg) => arg.replace(/^--/, ""));
  const [sourcePath, destinationPath] = args;
  switch (cmd) {
    case "exit":
      await exitFileManager(username);
      break;
    case "nwd":
      await printCurrentWorkingDirectory();
      break;
    case "up":
      await goUpInDirectory();
      break;
    case "cd":
      await changeDirectory(arg);
      break;
    case "ls":
      await list();
      break;
    case "cat":
      await read(arg);
      break;
    case "add":
      await create(arg);
      break;
    case "rm":
      await deleteFile(arg);
      break;
    case "rn":
      await rename(sourcePath, destinationPath);
      break;
    case "cp":
      await copyOrMoveFile(sourcePath, destinationPath, "copy");
      break;
    case "mv":
      await copyOrMoveFile(sourcePath, destinationPath, "move");
      break;
    case "os":
      await osInfo(arg);
      break;
    case "hash":
      await hash(arg);
      break;
    case "compress":
      await compress(sourcePath, destinationPath);
      break;
    case "decompress":
      await decompress(sourcePath, destinationPath);
      break;
    default:
      console.log("Invalid input");
  }
};

const startFileManager = async () => {
  try {
    const homeDirectory = os.homedir();
    process.chdir(homeDirectory);

    const args = process.argv;
    const usernameArg = args[2];

    if (usernameArg && usernameArg.startsWith("--username=")) {
      const username = usernameArg.split("=")[1];
      console.log("Welcome to the File Manager,", username);

      process.stdin.setEncoding("utf8");

      process.stdin.on("data", async (data) => {
        const input = data.trim();
        console.log("Command entered:", input);

        await handleCommand(input, username);

        await printCurrentWorkingDirectory();
      });

      process.on("SIGINT", async () => {
        await exitFileManager(username);
      });

      await printCurrentWorkingDirectory();
      console.log("Waiting for command...");
    } else {
      throw new Error("Argumend --username not defined");
    }
  } catch (error) {
    throw new Error(error);
  }
};

export { startFileManager };