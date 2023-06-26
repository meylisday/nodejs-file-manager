import fs from "fs";

const read = async (filePath) => {
  try {
    const readableStream = fs.createReadStream(filePath, "utf8");
    readableStream.on("data", function (chunk) {
      process.stdout.write(`${chunk}\n`);
    });
  } catch (error) {
    console.error(error);
  }
};

export { read };
