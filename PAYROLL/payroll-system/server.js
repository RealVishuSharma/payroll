const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const mongoose = require("mongoose");


const app = express();

// Open the SQLite database connection
const db = new sqlite3.Database('payroll.db');
const uri = "mongodb://localhost:27017/PayRollSystem";

// Middleware to parse JSON request bodies
app.use(express.json());

// CORS middleware (required if the API and frontend are running on different origins)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const salarySchema = new mongoose.Schema({
  type: {
    type: String
  },
  amount: {
    type: String
  },
  date : {
    type: Date,
    default: Date.now(),
  }
})

const collection = mongoose.model("salary", salarySchema);

// API endpoint to fetch history data
app.get('/api/history', async(req, res) => {
  // db.all('SELECT * FROM history', (err, rows) => {
  //   if (err) {
  //     console.error(err.message);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   } else {
  //     res.json(rows);
  //   }
  // });

  try {
    const newSalary =  await collection.find(req.body);
    res.json(newSalary);
    console.log(newSalary);
  } catch (error) {
    console.error("Data not saved!" + error);
  }

});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  try {
    mongoose.connect(uri);
    console.log("Database connection established!");
  } catch (error) {
    console.error("Unable to connect to Database!");
  }
});
// API endpoint to save salary data
app.post('/api/save', async(req, res) => {
    const { type, amount } = req.body;
  
    // const query = 'INSERT INTO history (type, amount, date) VALUES (?, ?, CURRENT_TIMESTAMP)';
    // db.run(query, [type, amount], function(err) {
    //   if (err) {
    //     console.error(err.message);
    //     res.status(500).json({ error: 'Internal Server Error' });
    //   } else {
    //     res.json({ id: this.lastID });
    //   }
    // });

    try {
      const newSalary =  await collection(req.body);
      await newSalary.save();
    } catch (error) {
      console.error("Data not saved!" + error);
    }
  });