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

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 204
};
// app.use(cors(corsOptions));
// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || corsOptions.origin.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   optionsSuccessStatus: 204
// }));

app.use(cookieParser());
app.use(cors({
  origin: (origin, callback) => {
    callback(null, true); // Allow all origins
  },
  credentials: true,
  optionsSuccessStatus: 204
}));
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
app.get('*', (req, res) => { 
  const token = req.cookies.token ;
  console.log("here is done information about token --->" ,token);
  if (!token) {
    return res.redirect('/'); // Redirect to login page
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    res.sendFile(path.join(reactApp)); // Serve the React app
  } catch (err) {
    return res.redirect('/'); // Redirect to login page
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
