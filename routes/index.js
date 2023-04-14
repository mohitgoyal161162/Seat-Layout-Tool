const axios =require('axios')

const express=require('express')
const seatRouter=express.Router()
const cors = require('cors')

// seatRouter.get('/',cors(),(req,res)=>{
//   fetch("http://10.5.30.105:8001/api/operators", { method: "GET", headers: { 'Content-Type': 'application/json',}, mode: 'no-cors'})
//   .then(response => response.json())
//   .then(data => {
//     if(data){
//       const cacheArray = data.map(obj => ({
//         Travels: obj.Travels,
//         OperatorId: obj.OperatorId
//       }));
//       localStorage.setItem('cachedData', JSON.stringify(cacheArray));
//       res.send(data)
//     }
   
//     else console.log("No data");
//   })
//   .catch(error => console.error(error));
// })

// seatRouter.get('/operators' , cors(),(req,res)=>{
//   const cachedArray = localStorage.getItem('cachedArray');
//   if (cachedArray) {
//     const cacheObject = JSON.parse(cachedArray);
//     res.send(cacheObject);
//   }
  
// })

seatRouter.get('/operators' , cors(),(req,res)=>{
  fetch("http://10.5.30.105:8001/api/operators", { method: "GET", headers: { 'Content-Type': 'application/json',}, mode: 'no-cors'})
  .then(response => response.json())
  .then(data => {
    if(data){
      res.send(data)
    }
    else console.log("No data");
  })
  .catch(error => console.error(error));
})

module.exports=seatRouter
