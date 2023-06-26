import fs from "fs";
import zlib from "zlib";
import path from "path";

// example how to use (need to specify the name of the file with the extension for the source file and destination file)
// decompress name_of_file.br destination_name_of_file or /folder/name_of_file.br destination_name_of_file and so on
const compress = async (sourcePath, destinationPath) => {
  const fullSourcePath = path.join(process.cwd(), sourcePath);
  const fullDestinationPath = path.join(process.cwd(), destinationPath);

  const readStream = fs.createReadStream(fullSourcePath);
  const writeStream = fs.createWriteStream(fullDestinationPath);

  const brotli = zlib.createBrotliCompress();

  const stream = readStream.pipe(brotli).pipe(writeStream);

  stream.on("finish", () => {
    console.log("Done compressing");
  });
};

export { compress };