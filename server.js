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
app.use("/api/pendingorders", require("./routes/pendingOrderRoute"));
app.use("/api/report", require("./routes/reportRoute"));
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
