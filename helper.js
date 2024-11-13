const path = require("path");
const fs = require("fs").promises;

// Define the path to the data file
const filePath = path.join(__dirname, 'data/products.json');

async function readDataFile() {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    if (!jsonData.products) {
      // If the products array is missing, initialize it
      jsonData.products = [];
    }
    return jsonData;
  } catch (error) {
    console.error(`Error reading ${filePath}: ${error}`);
    return { products: [] }; // Return an object with an empty products array if an error occurs
  }
}

// Async function to write data to a file
async function writeDataFile(data) {
  try {
    await fs.writeFile(filePath, data, 'utf8');
  } catch (err) {
    console.error(`Error writing to file ${filePath}:`, err);
    throw err;
  }
}

module.exports = {
  readDataFile,
  writeDataFile,
  filePath
};