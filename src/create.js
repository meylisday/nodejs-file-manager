import { promises as fsPromises } from "fs";

const create = async (filename) => {
    try {
      await fsPromises.writeFile(filename, "");
      console.log(`Empty file "${filename}" created successfully.`);
    } catch (error) {
      console.error("Operation failed");
    }
  };

  export { create };