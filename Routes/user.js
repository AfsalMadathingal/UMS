var express=require("express")
var router=express.Router()
const db=require('../db/conn');
const bcrypt= require('bcrypt')
const { login, signup, findUser } = require('../helpers/userHelper/userHelper');
//number of salt rounds for bcrypt
const saltRounds=10


router.get('/',(req,res)=>{

    if (req.session.user)
    {
        res.redirect('/homepage')
    }else
    {
        res.render('Main/loginpage')
    }
    

})



//user sign up
router.post('/signup', async (req,res)=>{


    let data={
        user_name: req.body.user_name,
        user_email: req.body.user_email,
        password: req.body.password
        }

        signup(data).then((result)=>{

            if(result.success)
            {
                res.render('Main/loginpage',{tittle:"signup",alert:"Registration successful",color:"color: #7cff05;"})
            }else
            {
                res.render('Main/loginpage',{tittle:"signup",alert:"Username or Email Already exists",color:"color: red;"})
            }

        })

})


//signin route
router.post('/signin', (req,res)=>{



    login(req.body).then((result)=>{

        if(result.success)
        {
           
            req.session.user=true
            req.session.username=req.body.user_name
            req.session.user_name=req.session.username
            res.redirect('/homepage')
        }
       else if(result.password)
        {

            req.session.passwordinvalid=true
            res.redirect('/signin')
            // res.render('Main/loginpage',{tittle:"signup",alert:"Wrong Password",color:"color: red;"})

        }else if(result.username)
        {
            req.session.usernameinvalid=true
            res.redirect('/signin')
            // res.render('Main/loginpage',{tittle:"signup",alert:"Invalid Username",color:"color: red;"})
        }
    })

    
})

router.get('/signin',(req,res)=>{
if (req.session.user)
{
    res.redirect('/')
}else 
{
    if(req.session.passwordinvalid)
    {
        req.session.passwordinvalid=false
        res.render('Main/loginpage',{tittle:"signup",alert:"Wrong Password",color:"color: red;"})
    }else if( req.session.usernameinvalid)
    {
        req.session.usernameinvalid=false
        res.render('Main/loginpage',{tittle:"signup",alert:"Invalid Username",color:"color: red;"})
    }
   
}

})


//user Home pagae

router.get('/homepage',(req,res)=>

{

    findUser(req.session.user_name).then((result)=>{

        
        if (!result)
        {
            req.session.user=false
            res.redirect('/')
    
            
        }else if (req.session.user)
        {
            
            res.render('user/homepage',{tittle:"Home",name:req.session.username})
        }else

        { 
            res.redirect('/')
        }

    })
   
})

    



//user logout

router.post('/user/logout', (req,res)=>{

if (req.session.user)
{
    req.session.user=false
    res.render('Main/loginpage',{tittle:"signup",alert:"Logout Success",color:"color: #7cff05;"})

}else
{
    res.redirect('/')
}

    
})


module.exports=router;

