const db=require('../../db/conn')
const bcrypt= require('bcrypt')
const { ObjectId } = require('mongodb')
//number of salt rounds for bcrypt
const saltRounds=10

module.exports={

    login:(data)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('admins').findOne({admin_name:data.admin_name}).then((result) => {
                if(result!=null)
                {
                    bcrypt.compare(data.password,result.password).then((result)=>{
                        if (result) {
                            resolve({success:true})
                            
                        }else
                        {
                            resolve({success:false})
                        }
                    })
                }else
                {
                    resolve({success:false})
                }
                
            }).catch((err) => {
                
            });

        })
    },

    getUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            userDetails = await db.get().collection('userdatas').find().sort({user_name:1}).toArray()
            resolve(userDetails)

        })
    },

    findUser: (session)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('userdatas').findOne({user_name:session.user_name}).then((result)=>{
                resolve(result)
                
            })
        })
    },



     updateUser: (data)=>{
        return new Promise(async (resolve,reject)=>{

           
            let updatedpassword=false
            const checkuser= await  db.get().collection('userdatas').findOne({user_name:data.user_name})
            let password=data.password;


            if (checkuser.password!=data.password)
            {
                password= await bcrypt.hash(data.password,saltRounds)

                // data.password=password
                updatedpassword=true
            }
           

            if (checkuser.user_name==data.user_name_new || checkuser.user_email==data.user_email)
            {
                if(checkuser.user_name==data.user_name_new)
                {
                    db.get().collection('userdatas').findOne({user_email:data.user_email}).then((result)=>{

                        if (result)
                        {
                            resolve(false)
                        }else
                        {
                            db.get().collection('userdatas').updateOne({user_name:data.user_name},{$set:{

                                user_name:data.user_name_new,
                                user_email:data.user_email,
                                password:password
            
            
                            }})
                            resolve(true)
                        }
                                
                            })
                }else if(checkuser.user_email==data.user_email)
                {
                    db.get().collection('userdatas').findOne({user_name:data.user_name_new}).then((result)=>{
                        console.log(result);

                        if (result)
                        {
                            resolve(false)
                        }else
                        {
                            db.get().collection('userdatas').updateOne({user_name:data.user_name},{$set:{

                                user_name:data.user_name_new,
                                user_email:data.user_email,
                                password:password
            
            
                            }})
                            resolve(true)
                        }
                                
                            })
                }else if(updatedpassword)
                {
                    db.get().collection('userdatas').updateOne({user_name:data.user_name},{$set:{

                        password:password


                    }})
                    resolve(true)
                }

            }else
            {

                db.get().collection('userdatas').findOne({$or:[{user_email:data.user_email},{user_name:data.user_name_new}]}).then((result)=>{

                    if (result)
                    {
                        resolve(false)
                    }else
                    {
                        db.get().collection('userdatas').updateOne({user_name:data.user_name},{$set:{

                            user_name:data.user_name_new,
                            user_email:data.user_email,
                            password:password
        
        
                        }})
                        resolve(true)
                    }
                            
                        })

            }}

        )},

      
       



    deleteUser: (data)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('userdatas').deleteOne({user_name:data.user_name}).then((result)=>{
                resolve(result)
            })
        })
    }


}


