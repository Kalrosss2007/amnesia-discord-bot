const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "..", "data", "vacation.json");

function ensureFile() {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, JSON.stringify({ users: {} }, null, 2));
}

function readData() {
  ensureFile();
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
}

function writeData(data) {
  ensureFile();
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

function setVacation(userId, payload) {
  const data = readData();
  data.users[userId] = {
    active: true,
    ...payload,
    updatedAt: Date.now()
  };
  writeData(data);
  return data.users[userId];
}

module.exports = { readData, writeData, setVacation };
