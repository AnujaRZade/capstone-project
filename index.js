const express =require('express') //common js module

require('dotenv').config() //help read configuration in .env fie and make available in process.env

/* alternate way*/
// const dotenv= require('dotenv')
// dotenv.config()


console.log(process.env.port)
const PORT = process.env.PORT;

const app= express()

app.use(express.json()); // Middleware to parse JSON requests

app.use((req, res, next)=>{
    console.log(`${req.method} request to ${req.path}`)
    next() // transfer the control to next middleware
})

app.get('/api/user',(req,res)=>{
    res.json({
        status:'success',
        statusCode:200,
        data:{
            name:'anuja',
            age:40
        },
    });
});


app.post('/api/user', (req, res)=>{
    console.log(req.body);
    res.json({
        data:req.body
    });
});

// Catch-all route

app.use(function(req,res){
    res.status(200).send('hello world')
})
//get server up and listening
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


