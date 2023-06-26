import path from "path";
import fs, { promises as fsPromises } from "fs";

const copyOrMoveFile = async (sourcePath, destinationPath, options) => {
  try {
    const fullSourcePath = path.join(process.cwd(), sourcePath);
    const fullDestinationPath = path.join(process.cwd(), destinationPath);

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

export { copyOrMoveFile };