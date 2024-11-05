const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 4000;

app.use(express.json());

// Define the path to the JSON data file
const dataFilePath = path.join(__dirname, 'data/products.json');

// Get all products
app.get('/products', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading the data file');
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(data);
  });
});

// Add a new product
app.post('/products', (req, res) => {
  const newProduct = req.body;

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading the data file');
      return;
    }

    const jsonData = JSON.parse(data);
    newProduct.id = jsonData.products.length + 1;
    jsonData.products.push(newProduct);

    fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        res.status(500).send('Error writing the data file');
        return;
      }
      res.status(201).json(newProduct);
    });
  });
});

// Delete a product by model name
app.delete('/products/:model', (req, res) => {
  const modelName = req.params.model;

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading the data file');
      return;
    }

    const jsonData = JSON.parse(data);
    const initialLength = jsonData.products.length;
    jsonData.products = jsonData.products.filter(
      (product) => product.model.toLowerCase() !== modelName.toLowerCase()
    );

    if (jsonData.products.length === initialLength) {
      res.status(404).send('Product not found');
      return;
    }

    fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        res.status(500).send('Error writing the data file');
        return;
      }
      res.status(204).send('Product deleted successfully');
    });
  });
});

// Update a product by ID
app.put('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const updatedData = req.body;

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading the data file');
      return;
    }

    const jsonData = JSON.parse(data);
    const productIndex = jsonData.products.findIndex((product) => product.id === productId);

    if (productIndex === -1) {
      res.status(404).send('Product not found');
      return;
    }

    jsonData.products[productIndex] = { ...jsonData.products[productIndex], ...updatedData };

    fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        res.status(500).send('Error writing the data file');
        return;
      }
      res.status(200).json(jsonData.products[productIndex]);
    });
  });
});

// Partially update a product by ID
app.patch('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const updatedFields = req.body;

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading the data file');
      return;
    }

    const jsonData = JSON.parse(data);
    const productIndex = jsonData.products.findIndex((product) => product.id === productId);

    if (productIndex === -1) {
      res.status(404).send('Product not found');
      return;
    }

    jsonData.products[productIndex] = { ...jsonData.products[productIndex], ...updatedFields };

    fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        res.status(500).send('Error writing the data file');
        return;
      }
      res.status(200).json(jsonData.products[productIndex]);
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
