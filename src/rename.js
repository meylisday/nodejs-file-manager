import { promises as fsPromises } from "fs";

const rename = async (sourcePath, destinationPath) => {
    try {
      await fsPromises.rename(sourcePath, destinationPath);
      console.log("File renamed successfully!");
    } catch (error) {
      console.error("Operation failed");
    }
  };

export { rename };