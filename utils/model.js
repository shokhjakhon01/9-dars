const { readFileSync, writeFileSync } = require("fs");
const { resolve } = require("path");
const crypto = require("crypto");

function read(filename) {
  const data = readFileSync(resolve("database", filename + ".json"), "utf-8");
  return JSON.parse(data);
}

function write(filename, data) {
  writeFileSync(
    resolve("database", filename + ".json"),
    JSON.stringify(data, null, 4)
  );
  return true;
}

function hashPassword(password) {
  const hash = crypto.createHash("sha256").update(password).digest("hex");
  return hash;
}

module.exports = {
  write,
  read,
  hashPassword,
};
