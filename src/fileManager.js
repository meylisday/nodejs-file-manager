import os from "os";
import path from "path";
import fs, { promises as fsPromises } from "fs";
import { osInfo } from "./osInfo.js";
import { compress } from "./compress.js";
import { decompress } from "./decompress.js";
import crypto from "crypto";

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
    console.error("Operation failed");
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
    console.error("Operation failed");
  }
};

const readFile = async (filePath) => {
  try {
    const readableStream = fs.createReadStream(filePath, "utf8");

    readableStream.on("data", function (chunk) {
      process.stdout.write(`${chunk}\n`);
    });

  } catch (error) {
    console.error(error);
  }
};

const createFile = async (filename) => {
  try {
    await fsPromises.writeFile(filename, "");
    console.log(`Empty file "${filename}" created successfully.`);
  } catch (error) {
    console.error("Operation failed");
  }
};

const deleteFile = async (filePath) => {
  try {
    const fullFilePath = path.join(process.cwd(), filePath);
    await fsPromises.rm(fullFilePath);
    console.log(`File deleted successfully.`);
  } catch (error) {
    console.error(error);
  }
};

const copyOrMoveFile = async (sourcePath, destinationPath, options) => {
  try {
    const fullSourcePath = path.join(process.cwd(), sourcePath);
    const fullDestinationPath = path.join(
      process.cwd(),
      destinationPath,
      path.basename(sourcePath)
    );

    const source = fs.createReadStream(fullSourcePath);
    const destination = fs.createWriteStream(fullDestinationPath);

    source.pipe(destination);

    source.on("error", (error) => {
      console.error("Error reading the source file:", error);
    });

    destination.on("error", (error) => {
      console.error("Error writing to the destination file:", error);
    });

    destination.on("finish", async () => {
      console.log("File copied successfully.");
      if (options === "move") {
        try {
          await fsPromises.unlink(fullSourcePath);
          console.log("Source file deleted successfully.");
        } catch (error) {
          console.error("Error deleting the source file:", error);
        }
      }
    });
  } catch (error) {
    console.error("Operation failed");
  }
};

const renameFile = async (sourcePath, destinationPath) => {
  try {
    await fsPromises.rename(sourcePath, destinationPath);
    console.log("File renamed successfully!");
  } catch (error) {
    console.error("Operation failed");
  }
};

const getFileHash = async (filePath) => {
  try {
    const fullSourcePath = path.join(process.cwd(), filePath);
    const fileBuffer = await fsPromises.readFile(fullSourcePath);
    const hashSum = crypto.createHash("sha256");
    hashSum.update(fileBuffer);
    const hex = hashSum.digest("hex");
    console.log(hex);
  } catch (error) {
    console.error(error);
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
      await readFile(arg);
      break;
    case "add":
      await createFile(arg);
      break;
    case "rm":
      await deleteFile(arg);
      break;
    case "rn":
      await renameFile(sourcePath, destinationPath);
      break;
    case "cp":
      await copyOrMoveFile(sourcePath, destinationPath, 'copy');
      break;
    case "mv":
      await copyOrMoveFile(sourcePath, destinationPath, 'move');
      break;
    case "os":
      await osInfo(arg);
      break;
    case "hash":
      await getFileHash(arg);
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
