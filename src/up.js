import os from "os";
import path from "path";

const goUpInDirectory = async () => {
  const cwd = process.cwd();
  const parentDir = os.platform() === "win32" ? "\\" : "/";
  const newDir = path.dirname(cwd);

  if (newDir !== parentDir) {
    process.chdir(newDir);
  }
};

export { goUpInDirectory };