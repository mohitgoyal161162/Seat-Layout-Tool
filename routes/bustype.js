
const express=require('express')
const busType=express.Router()
const cors = require('cors')

busType.get('/' , cors(),(req,res)=>{
  fetch("http://omega.mdsdomestic.redbus.in:8001/api/bustypes", { method: "GET", headers: { 'Content-Type': 'application/json',}, mode: 'no-cors'})
  .then(response => response.json())
  .then(data => {
    if(data)
    res.send(data)
    else console.log("No data");
  })
  .catch(error => console.error(error));
  
})

module.exports=busType