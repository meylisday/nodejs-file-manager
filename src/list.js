import path from "path";
import { promises as fsPromises } from "fs";

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

export { list };