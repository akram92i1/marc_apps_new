const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');
const messsageRoutes = require("./routes/message.routes")
const cookieParser = require('cookie-parser');
require('dotenv').config();

console.log('JWT_SECRET:', process.env.JWT_SECRET); // Debug log

const app = express();
const PORT = process.env.PORT || 5000;

// app.get('/*', (req, res) => { 
//   res.sendFile(path.join(__dirname, '../build/index.html'),
//   function(err){
//   if(err){
//     res.status(500).send(err)
//   } 
//   });
// });


// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
const url = process.env.MONGO_URI; 
mongoose.connect( url , { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error ----> :', err));

  
// Routes
app.use('/api/users', userRoutes);
app.use('/api/messages' , messsageRoutes) ; 

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});