import { readdir } from "fs/promises";
import { createWriteStream } from "fs";
import { fork } from "child_process";
import { Readable, PassThrough } from "stream";

const streamsArray = [];

function createReadStream(cp) {
  let stream = new Readable({
    read() {},
  });
  cp.on("message", (msg) => stream.push(msg.concat("\n")));

  return stream;
}

function mergeStreams() {
  const passThrough = new PassThrough();
  let waiting = streamsArray.length;
  for (let stream of streamsArray) {
    stream.pipe(passThrough, { end: false });
    stream.once("end", () => --waiting && pass.emit("end"));
  }
  return passThrough;
}

// our final output will be stored here
const outputFile = createWriteStream("./Database/output.ndjson");

// filtering only required files
const inputFiles = (await readdir("./Database")).filter(
  (file) => file !== "output.ndjson"
);
// creating number of sub process according to inputFiles length
for (let i = 0; i < inputFiles.length; i++) {
  // creates one child process
  // silent -> false will ensure to console everything in child process
  const cp = fork("./BackgroundTask.mjs", []);
  cp.send(`./Database/${inputFiles[i]}`);
  let stream = createReadStream(cp);
  streamsArray.push(stream);
}

// piping to writable stream
mergeStreams().pipe(outputFile);
