const express = require('express');
const { readDataFile, writeDataFile, filePath } = require('./helper.js');

const app = express();
const PORT = 4000;

app.use(express.json());

// Get all products
app.get("/products", async (req, res) => {
  try {
    const data = await readDataFile();
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send("Error reading the data file");
  }
});

// POST route to add a new product
app.post('/products', async (req, res) => {
  const newProduct = req.body;

  try {
    const data = await readDataFile();
    newProduct.id = data.products.length ? Math.max(data.products.map(p => p.id)) + 1 : 1;
    data.products.push(newProduct); 

    await writeDataFile(JSON.stringify(data, null, 2)); 

    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error reading or writing the data file');
  }
});
// Delete a product by model name
app.delete('/products/:model', async (req, res) => {
  const modelName = req.params.model;

  try {
    const data = await readDataFile();
    const initialLength = data.products.length;

    // Filter out the product with the specified model name
    data.products = data.products.filter(
      (product) => product.model.toLowerCase() !== modelName.toLowerCase()
    );

    if (data.products.length === initialLength) {
      return res.status(404).send('Product not found');
    }

    await writeDataFile(JSON.stringify(data, null, 2));
    res.status(204).send('Product deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing the request');
  }
});
// Update a product by ID
app.put('/products/:id', async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const updatedData = req.body;

  try {
    const data = await readDataFile();
    const productIndex = data.products.findIndex((product) => product.id === productId);

    if (productIndex === -1) {
      return res.status(404).send('Product not found');
    }

    // Update the product with new data
    data.products[productIndex] = { ...data.products[productIndex], ...updatedData };

    await writeDataFile(JSON.stringify(data, null, 2)); 
    res.status(200).json(data.products[productIndex]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing the request');
  }
});
// Partially update a product by ID
app.patch('/products/:id', async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const updatedFields = req.body;

  try {
    const data = await readDataFile(); 
    const productIndex = data.products.findIndex((product) => product.id === productId);

    if (productIndex === -1) {
      return res.status(404).send('Product not found');
    }

    // Update the product with new fields
    data.products[productIndex] = { ...data.products[productIndex], ...updatedFields };

    await writeDataFile(JSON.stringify(data, null, 2)); 
    res.status(200).json(data.products[productIndex]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing the request');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});