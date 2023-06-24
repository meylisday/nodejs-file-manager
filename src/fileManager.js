import os from "os";
import path from "path";
import { promises as fsPromises } from "fs";

const printCurrentWorkingDirectory = async () => {
  const cwd = process.cwd();
  console.log("You are currently in", cwd);
};

const exitFileManager = async (username) => {
  console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
  process.exit();
};

const goUpInDirectory = async () => {
  const cwd = process.cwd();
  const parentDir = os.platform() === "win32" ? "\\" : "/";
  const newDir = path.dirname(cwd);

  if (newDir !== parentDir) {
    process.chdir(newDir);
  }
};

const changeDirectory = async (directory) => {
  const currentDir = process.cwd();
  const newDir = path.resolve(currentDir, directory);
  try {
    process.chdir(newDir);
  } catch (error) {
    throw new Error("Operation failed");
  }
};

const list = async () => {
  try {
    const currentDir = process.cwd();
    const files = await fsPromises.readdir(currentDir);
    const fileData = await Promise.all(
      files.sort().map(async (file) => {
        const filePath = path.join(currentDir, file);
        const fileStats = await fsPromises.stat(filePath);
        const fileType = fileStats.isDirectory() ? "directory" : "file";
        return {
          File: file,
          Type: fileType,
        };
      })
    );

    fileData.sort((a, b) => {
      if (a.Type === "directory" && b.Type !== "directory") {
        return -1;
      }
      if (a.Type !== "directory" && b.Type === "directory") {
        return 1;
      }
      return a.File.localeCompare(b.File);
    });

    console.table(fileData);
  } catch (error) {
    throw new Error(error);
  }
};

const readFile = async (filePath) => {
  try {
    const content = await fsPromises.readFile(filePath, "utf8");
    console.log(content);
  } catch (error) {
    throw new Error("Operation failed");
  }
};

const handleCommand = async (command, username) => {
  const [cmd, arg] = command.split(" ");
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
      await readFile(arg);
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
