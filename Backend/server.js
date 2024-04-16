const express = require("express");
const connectDB=require("./config/db")
const cors = require("cors"); // Import the CORS middleware
const userRoutes = require('./routes/userRoute');
const houseRoutes = require('./routes/houseRoute');
const reportRoutes=require('./routes/reportRoute')
const feedbackRouters=require('./routes/feedbackRoute')

const orderRoutes=require('./routes/pendingOrderRoute')

const app = express(); 

require('dotenv').config();
connectDB()

const port = process.env.PORT || 4000;
app.use(express.json())

// Use CORS middleware with the proper options
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true // Allow sending cookies from the frontend
  }));

//routes here
app.use('/api/houses',houseRoutes)
app.use('/api/users', userRoutes);
app.use('/api/reports',reportRoutes)
app.use('/api/feedbacks',feedbackRouters)
app.use('./api/orders',orderRoutes)
// app.use('/api/users', adminRoutes);
// app.use('/api/users', superAdminRoutes);


// app.use('/api/house', houseRoutes);

//starting server
app.listen(port, (err) => {
    if (err) {
        console.log(`Error to start server`);
    } else {
        console.log(`Server is listening on port ${port}`);
    }
});
