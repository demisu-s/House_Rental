const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const port = process.env.PORT;
connectDB();
// Express setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/api/houses", require("./routes/houseRoute"));
app.use("/api/users", require("./routes/userRoute"));
// app.use("/api/brokers", require("./routes/brokerRoute"));
// app.use("/api/admins", require("./routes/adminRoute"));

// server started
app.listen(port, (error) => {
  if (error) {
    console.log("Did not connect");
  } else {
    console.log(`Server started on port ${port}`);
  }
});

// const express = require("express");
// const connectDB = require("./config/db");
// const app = express();
// require("dotenv").config();
// connectDB();

// const port = process.env.PORT || 4000;
// app.use(express.json());

//routes here

//starting server
// app.listen(port, (err) => {
//   if (err) {
//     console.log(`Error to start server`);
//   } else {
//     console.log(`Server is listening on port ${port}`);
//   }
// });
