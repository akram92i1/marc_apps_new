const express = require('express');
const path = require('path');
const cors = require('cors');
const userRoutes = require('./routes/user');
const messsageRoutes = require('./routes/message.routes');
const authRoutes = require('./routes/auth');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();

// const corsOptions = {
//   origin: '*',
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true, // Allow credentials (cookies, authorization headers, etc.)
//   optionsSuccessStatus: 204
// };


const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:3000',
  'https://semer-le-present-f32d8fb5ce8e.herokuapp.com',
  'http://www.semerlepresent.net',
  'https://www.semerlepresent.net', // Include both HTTP and HTTPS if applicable
];

const corsOptions = {
  origin: (origin, callback) => {
    // If the origin is in the allowedOrigins array or if it's undefined (like in server-to-server requests), allow it
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      console.log(`Blocked by CORS: ${origin}`); // For debugging
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests
app.use(cookieParser());
// app.use(cors({
//   origin: (origin, callback) => {
//     callback(null, true); // Allow all origins
//   },
//   credentials: true,
//   optionsSuccessStatus: 204
// }));

// Middleware
app.use(express.json());

// Serve static files from the React app's build folder
app.use(express.static(path.join(__dirname, '../build')));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/messages', messsageRoutes);
app.use('/api/auth', authRoutes);

// MongoDB Connection
mongoose.connect(`mongodb+srv://admin:Tbm930antonov2@marcdatabase.rcgfo.mongodb.net/marc-database?retryWrites=true&w=majority`, {
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));
// Wildcard route to serve the React app for any unmatched routes
const reactApp = path.join(__dirname, '../projectManager/build'); 
app.use(express.static(reactApp));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// Serve static files from the React app's build folder
const reactAppPath = path.join(__dirname, '../projectManager/build');
app.use(express.static(reactAppPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(reactAppPath, 'index.html'));
});
