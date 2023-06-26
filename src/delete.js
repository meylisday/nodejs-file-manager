import path from "path";
import { promises as fsPromises } from "fs";

const deleteFile = async (filePath) => {
  try {
    const fullFilePath = path.join(process.cwd(), filePath);
    await fsPromises.rm(fullFilePath);
    console.log(`File deleted successfully.`);
  } catch (error) {
    console.error(error);
  }
};

export { deleteFile };