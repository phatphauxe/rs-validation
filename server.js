const express = require('express');
const request = require('request');
const bodyParser = require('body-parser')
let server = express();

const jsonParser = bodyParser.json();
const HEADERS = {
    "sourceSystemTimeStamp": "2017-11-29T23:00:00.000-00:00",
    "exceptionNotificationEmailAddress": "A@B.com",
    "Api-Key": "kfsajjwnxx6dba34mb55t4zg",
    "sourceSystemTransactionID": "1",
    "sourceApplicationName": "callidus",
    "Connection": "Keep-Alive",
    "User-Agent": "Apache-HttpClient/4.5.2 (Java/1.8.0_144)",
    "Host": "stg.api.republicservices.com",
    "Accept-Encoding": "gzip,deflate",
    "Content-Length": 0
}

server.use(bodyParser.json({ type: 'application/json' }))
server.use(bodyParser.raw({ type: 'application/json' }))
server.listen("8000", ()=>{
    console.log('server ready')
})


server.post('/getData', (req, res) => {
    console.log(req.body);
    try{
        request(req.body.url, {method:'GET', headers: HEADERS}, (error, response, body)=>{
           
                res.send(JSON.stringify({response: response}));
            
        })
    }
    catch(e){
        res.send(JSON.stringify({error: 'System error occured calling request'}))
    }
})
// request("https://qa.api.republicservices.com/container/v1/products/R-L-OT-AG-0100/prices?segment=Environmental&accountType=T&infoProDivision=551&industryCode=622000&marketRate=75&isCustomerOwned=false&routeFormat=I&zipCode=60153&disposalCost=75&isOnCall=true&customerType=New&lawsonDivision=4551&suggestedRate=true&sellType=leased&timeForService=40&competitorCode=NEW&wasteCode=RCY&leasedComponents=DEL&routeType=RO&serviceType=New", {method:'GET', headers: HEADERS}, (error, response, body)=>{
//     console.log(response);
// })
