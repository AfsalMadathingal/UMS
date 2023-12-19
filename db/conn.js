// const mongoose=require('mongoose')

const {MongoClient}= require('mongodb')

var database;
module.exports={

    connect: ()=>{
        const url="mongodb://localhost:27017"
        const client = new MongoClient(url)
        database=client.db("LoginData")
        console.log("Connected to database");
    },
    get:()=>{
        return database
    }
}

