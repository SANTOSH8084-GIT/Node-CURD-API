const express = require("express");
const { body, validationResult } = require('express-validator');
const con = require("./config");
const app = express();

app.use(express.json());

//get API
app.get("/getData",(req,resp) => {
    con.query("select name,mobile,email,pincode from users", (error,result) =>{
        if(error){
            resp.json({ Status: 400, Data: error, Message: "Failed" })
        }
        else{
            resp.json({ Status: 200, Data: result, Message: "Success" })
        }
    })
});
 
//post API
app.post("/postData",
    //validation start
    body('name').isLength({ min: 5 }),
    (req,resp) => {
        // Handle the request only if there are no validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        resp.json({ Status: 400, Data: errors.array(), Message: "Failed" })
        }
        //validation end
        const data = req.body;
        con.query('insert into users SET ?', data , (error,result,fields) => {
            if(error) 
            {
                resp.json({ Status: 400, Data: error, Message: "Failed" })
            }
            else{
                resp.json({ Status: 201, Data: result, Message: "Success" })
            }       
        });
    });

//put API
app.put("/updateData/:id",(req,resp) =>{
    const data = [req.body.name,req.body.mobile,req.body.email,req.body.pincode,req.params.id];
    con.query("update users SET name = ?, mobile = ?, email = ?, pincode = ? where id = ?", data, (error,result,fields) =>{
        if(error) {
            resp.json({ Status: 400, Data: error, Message: "Failed" })
        }
        else{
            resp.json({ Status: 204, Data: result, Message: "Success" })
        }
    })
})

//delete API
app.delete("/deleteData/:id",(req,resp) =>{
    const data = [req.params.id];
    con.query("delete from users where id = ?", data, (error,result,fields) =>{
        if(error)
        {
            resp.json({ Status: 400, Data: error, Message: "Failed" })
        } 
        else{
            resp.json({ Status: 204, Data: result, Message: "Success" })
        }
    })
})

app.listen(5000);
