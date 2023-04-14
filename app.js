const express=require('express')
const app=express()
const bodyParser = require('body-parser')
const path = require('path')

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));

const RouterIndex = require("./routes/index")
const seatLayout = require('./routes/seatLayout')
const busType = require('./routes/bustype')
app.use('/api/bustype',busType)
app.use('/api' , RouterIndex)
//app.use('/',RouterIndex)
app.use(seatLayout);
app.use('/api/vendor',seatLayout);

const PORT = process.env.PORT || 3001

// start the server
app.listen(PORT, function() {
  console.log('Server listening on port 3001');
});
