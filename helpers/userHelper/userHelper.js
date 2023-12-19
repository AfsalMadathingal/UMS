const { data } = require('jquery')
const db=require('../../db/conn')
const bcrypt= require('bcrypt')
const { resolve } = require('path')
const { log } = require('console')
const saltRounds=10


module.exports={

    login:(data)=>{
        return new Promise((resolve,reject)=>{
            console.log(data);
            db.get().collection('userdatas').findOne({user_name:data.user_name}).then((result) => {
                
                if(result!=null)
                {
                    bcrypt.compare(data.password,result.password).then((bcrypt)=>{
                        if(bcrypt)
                        {
                            resolve({success:true})
                        }else
                        {
                            resolve({password:true})
                        }
                    })
                }else
                {
                    resolve({username:true})
                }
                
            }).catch((err) => {
                
            });
        })
    },

   
    signup: (data)=>{

        return new Promise(async (resolve,reject)=>{
           
            let password= await bcrypt.hash(data.password,saltRounds)
            data.password=password
            db.get().collection('userdatas').findOne({$or:[{user_email:data.user_email},{user_name:data.user_name}]}).then((result)=>{
                if(result!=null)
                {

                    resolve({success:false})
                }
                else
                {
                    
                    db.get().collection('userdatas').insertOne(data)
                    resolve({success:true})

                }
            })

        })

    },

    findUser: (user_name)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('userdatas').findOne({user_name:user_name}).then((result)=>{
                
                resolve(result)
                
            })
        })
    },

}
