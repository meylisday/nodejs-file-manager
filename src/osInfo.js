import os from "os";

const osInfo = async (arg) => {
  switch (arg) {
    case "EOL":
      await getEOLInfo();
      break;
    case "cpus":
      await getCpusInfo();
      break;
    case "homedir":
      await getHomedirInfo();
      break;
    case "username":
      await getUsernameInfo();
      break;
    case "architecture":
      await getArchitectureInfo();
      break;
    default:
      console.log("Invalid input");
  }
};

const getEOLInfo = () => {
  console.log(JSON.stringify(os.EOL));
};

const getCpusInfo = () => {
  const cpus = os.cpus();
  const cpuData = cpus.map((cpu, index) => {
    return {
      CPU: index + 1,
      Model: cpu.model,
      Speed: (cpu.speed / 1000).toFixed(2) + " GHz",
    };
  });
  console.table(cpuData);
};

const getHomedirInfo = () => {
  console.log(os.homedir());
};
const getUsernameInfo = () => {
  console.log(os.userInfo().username);
};

const getArchitectureInfo = () => {
  console.log(os.arch());
};

export { osInfo };
