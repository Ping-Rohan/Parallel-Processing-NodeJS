import { createReadStream } from "fs";
import { Transform, pipeline } from "stream";
console.log(`Child process created : ${process.pid}`);

function parseAndVerify(line) {
  const parsed = JSON.parse(line);
  if (parsed.userEmail.includes("gmail.com")) return true;
  return false;
}

process.once("message", async (msg) => {
  let last = "";

  createReadStream(msg)
    .pipe(
      new Transform({
        transform(chunk, enc, cb) {
          last += chunk.toString();
          let splitted = last.split("\n");
          last = splitted.pop();
          for (let line of splitted) {
            if (parseAndVerify(line)) {
              process.send(line);
            }
          }
          cb();
        },
        flush(cb) {
          if (last && parseAndVerify(last)) {
            // send msg here
          }
        },
      })
    )
    .pipe(process.stdout);
});
