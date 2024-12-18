const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost/ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: true }));



// Routes
app.use(orderRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
