const path = require("path");
const fs = require("fs").promises;

const dataFilePath = path.join(__dirname, "..", "data", "urls.json");

async function ensureDataFile() {
  try {
    await fs.access(dataFilePath);
  } catch (err) {
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, "[]", "utf-8");
  }
}

async function readUrls() {
  await ensureDataFile();
  try {
    const fileData = await fs.readFile(dataFilePath, "utf-8");
    const parseData = JSON.parse(fileData);
    return Array.isArray(parseData) ? parseData : [];
  } catch (err) {
    console.error("Error reading URLs:", err);
    return [];
  }
}

async function writeUrls(urls) {
  await ensureDataFile();
  const safeUrls = Array.isArray(urls) ? urls : [];
  const content = JSON.stringify(safeUrls, null, 2);
  await fs.writeFile(dataFilePath, content, "utf-8");
}

module.exports = {
  readUrls,
  writeUrls,
};
