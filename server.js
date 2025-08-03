const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Correct static middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.static('views'));


// Serve HTML files
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "views", "index.html")));
app.get("/cart", (req, res) => res.sendFile(path.join(__dirname, "views", "cart.html")));
app.get("/checkout", (req, res) => res.sendFile(path.join(__dirname, "views", "checkout.html")));
app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "views", "admin.html")));


// Return all orders
app.get("/admin", (req, res) => {
    const password = req.query.password;

    if (password === "letmein") { // Change this to your secret
        res.sendFile(path.join(__dirname, "views", "admin.html"));
    } else {
        res.status(401).send("Unauthorized 🛑");
    }
});



// Handle form submission
app.post("/submit-order", (req, res) => {
    const order = req.body;
    const ordersFile = path.join(__dirname, "orders.json");

    fs.readFile(ordersFile, "utf8", (err, data) => {
        let orders = [];
        if (!err && data) {
            orders = JSON.parse(data);
        }

        orders.push({ ...order, timestamp: new Date() });

        fs.writeFile(ordersFile, JSON.stringify(orders, null, 2), (err) => {
            if (err) {
                return res.status(500).send("Error saving order.");
            }
            res.send("Order received! ✅");
        });
    });
});

// Admin access: fetch orders
app.get('/orders', (req, res) => {
  const ordersPath = path.join(__dirname, 'orders.json');
  fs.readFile(ordersPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Could not read orders');
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});


// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
