var express=require("express")
var router=express.Router()
const db=require('../db/conn');
const bcrypt= require('bcrypt')
const { login, getUsers, findUser, updateUser, deleteUser } = require('../helpers/adminHelper/adminHelper');
const userhelper= require("../helpers/userHelper/userHelper");

//number of salt rounds for bcrypt
const saltRounds=10

//variables for sending allerts
let CreateuserExists=false;
let creationSuccess=false;
let DeleteSuccMsg=false;
let EditMsg=false;
let Editerr=false;



//Admin Dashboard

router.get('/dash',(req,res)=>{

    if(req.session.adminStatus)
    { 
    getUsers().then((userdetails)=>{

        
        let UserDataWithIndex = userdetails.map((obj, index) => ({  index: index+1, ...obj, }));

        res.render('admin/adminDashboard',
    {   tittle:"Admin Dashboard",
        userdetails:UserDataWithIndex,
        creationSuccess:creationSuccess,
        CreateuserExists:CreateuserExists ,
        DeleteSuccMsg:DeleteSuccMsg,
        EditMsg:EditMsg,
        Editerr:Editerr
    })

        CreateuserExists=false;
        creationSuccess=false;
        DeleteSuccMsg=false;
        EditMsg=false;
        Editerr=false;
        
        
    })
    }else
    {
        res.redirect('/admin')
    }

})



//admin login Page

router.get('/',  (req,res)=>{

    if (req.session.adminStatus)
    {
        res.redirect('admin/dash')
    }else
    {
       res.render('partials/admin',{tittle:"Admin Login",alert:"Welcome",color:"color: blue;"})
    }

   

})



//admin validation
router.post('/login',  (req,res)=>{
   
    login(req.body).then((result)=>{

       
        if(result.success)
        {   

            req.session.adminStatus = true
            res.redirect('dash')
        }
        else
        {
            res.render('partials/admin',{tittle:"Admin Login",alert:"Enter Valid Details",color:"color: red;"})
        }
    })
    
} )



router.get('/login',(req,res)=>{

    if(req.session.adminStatus)
    {
        res.render('admin/adminDashboard',{tittle:"Admin Dashboard" ,  })
    }else
    {
        res.redirect('/admin')
    }

    

})

//admin editing route

router.post('/edit', (req,res)=>{


 //adding every datas to data variable
 const data=req.body


    updateUser(data).then((result)=>{
        if (result)
        {
            EditMsg=true
            res.redirect('/admin/dash');
        }else
        {  
            Editerr=true
            res.redirect('/admin/dash');
        }
    })
 
})


//admin deleting route

router.post('/delete', (req,res)=>{

    //adding every datas to data variable
    const data= req.body

    deleteUser(data).then((result)=>{
        if(result.deletedCount)
        {
            DeleteSuccMsg=true
            res.redirect('/admin/dash')
        }else
        {   DeleteSuccMsg=false
            res.redirect('/admin/dash')
        }

    })
    
})


//admin Create New user

router.post('/create',(req,res)=>{

    
    let data=
        {
            user_name: req.body.user_name,
            user_email: req.body.user_email,
            password: req.body.password
        }

        userhelper.signup(data).then((result)=>{
            console.log("create fuction");

        if (result.success)
        {
            creationSuccess=true
            res.redirect('/admin/dash')
        }else
        {
            CreateuserExists=true
            res.redirect('/admin/dash')
        }

    })

})

//admin logout 


router.post('/logout', (req,res)=>{

    
    if(req.session.adminStatus)
    {
        req.session.adminStatus=false
        res.redirect('/admin')
    }else
    {
        res.redirect('/admin')
    }
    
    
    
})

























module.exports=router;