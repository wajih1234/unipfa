const express= require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();
connectDB();
const app=express();

// middlware
app.use(express.json());
app.use(cors());


const routes = require('./routes/index');
app.use('/logic', routes);

const PORT = 5200;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
