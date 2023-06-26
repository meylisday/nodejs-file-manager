import path from "path";
import { promises as fsPromises } from "fs";
import crypto from "crypto";

const hash = async (filePath) => {
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

export { hash };