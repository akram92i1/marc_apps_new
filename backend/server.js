const express = require('express');
const path = require('path');
const cors = require('cors');
const userRoutes = require('./routes/user');
const messsageRoutes = require('./routes/message.routes');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();

console.log('JWT_SECRET:', process.env.JWT_SECRET); // Debug log
// CORS Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true  // If you are using cookies or Authorization header
}));
app.options('*', cors()); 
// Middleware
app.use(express.json());

// Serve static files from the React app's build folder
app.use(express.static(path.join(__dirname, '../build')));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/messages', messsageRoutes);

// MongoDB Connection
mongoose.connect(`mongodb+srv://admin:Tbm930antonov2@marcdatabase.rcgfo.mongodb.net/marc-database?retryWrites=true&w=majority`, {
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Wildcard route to serve the React app for any unmatched routes
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'), function(err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
