const express = require('express');
const nodecache = require('node-cache');
require('isomorphic-fetch');

var apikey = "5041b2685724c541fd01a72c5004e46d";
const appCache = new nodecache({ stdTTL : 3599});
const router = express.Router();
const todosURL = `https://api.openweathermap.org/data/2.5/weather?q=karachi&appid=${apikey}&units=metric`;

router.get('/', async (req,res) => {
    if(appCache.has('todos')){
        console.log('Get data from Node Cache');
        return res.send(appCache.get('todos'))
    }
    else{
        const data = await fetch(todosURL)
            .then((response) => response.json());
        appCache.set("todos",data);
        console.log('Fetch data from API');
        res.send(data);
    }
})

router.get('/stats',(req,res)=>{
    res.send(appCache.getStats());
})

module.exports = router