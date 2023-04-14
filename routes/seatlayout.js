const express = require('express');
const router = express.Router();
const cors = require('cors')


let selectedOperatorId;
router.post('/submit-operator', (req, res) => {
   selectedOperatorId = req.body.operatorId;
  res.json({ message: 'Operator submitted successfully' });
});


router.get('/seatLayout',cors(),(req,res)=>{
  let operatorId = req.query.operatorId
    const url="http://10.5.30.105:8001/api/vendor/seatlayout/"+operatorId;
    console.log(url);

    fetch(url, { method: "GET", headers: { 'Content-Type': 'application/json',}, mode: 'no-cors'})
    .then(response => {
        if (!response.ok) {
          return [{}];
        }
        return response.json();
      })
    .then(data => {
        if(data)
      res.send(data)
      else console.log("No Data");
    })
    .catch(error => console.log(error));
})

module.exports = router;
