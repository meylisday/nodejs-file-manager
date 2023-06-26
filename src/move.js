import fs from "fs";
import path from "path";

const move = async (sourcePath, destinationPath) => {
    const fullSourcePath = path.resolve(sourcePath);
    const fileName = path.basename(fullSourcePath);
    const fullDestinationPath = path.resolve(destinationPath, fileName);
  
    const sourceStream = fs.createReadStream(fullSourcePath);
    const destinationStream = fs.createWriteStream(fullDestinationPath);
  
    sourceStream.on("error", (error) => {
      console.error("Failed to read the source file:", error);
    });
  
    destinationStream.on("error", (error) => {
      console.error("Failed to write to the destination file:", error);
    });
  
    sourceStream.pipe(destinationStream);
  
    sourceStream.on("end", async () => {
      try {
        await fs.promises.unlink(sourcePath);
        console.log("File moved successfully");
      } catch (error) {
        console.error("Failed to move file:", error);
      }
    });
  };
export { move };