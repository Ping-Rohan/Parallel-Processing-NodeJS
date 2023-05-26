const { faker } = require("@faker-js/faker");
const { createWriteStream } = require("fs");

const file1 = createWriteStream("./Database/file1.ndjson");
const file2 = createWriteStream("./Database/file2.ndjson");
const file3 = createWriteStream("./Database/file3.ndjson");
const file4 = createWriteStream("./Database/file4.ndjson");

function createRandomUser() {
  return {
    userId: faker.string.uuid(),
    userName: faker.internet.userName(),
    userEmail: faker.internet.email(),
    phone: faker.phone.number(),
  };
}

[file1, file2, file3, file4].forEach((file, index) => {
  for (let i = 0; i < 1e4; i++) {
    file.write(JSON.stringify(createRandomUser()).concat("\n"));
  }
  file.end();
});
