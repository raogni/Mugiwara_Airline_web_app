const express = require('express');
const app = express();

const cors = require('cors');
const pool = require('./db');

app.use(cors());
app.use(express.json());

app.get('/flights', async(req, res)=>{
    try{
      const allTodos = await pool.query(`SELECT * FROM flights;`);
      res.json(allTodos.rows);
    } catch(err){
      console.log(err.message);
    }
  });

//get flight by id

app.get(`/flights/:id`, async (req, res)=>{
    try{
        const {id} = req.params;
        console.log(req.params)
        let temp = id.split('&')
        const dep = temp[0];
        const arr =temp[1];
        console.log("depart: " + dep);
        console.log("arrive: " + arr);
        const todo = await pool.query(`SELECT * FROM flights WHERE departure_airport= $1 AND arrival_airport=$2;`, [dep, arr]);
        res.json(todo.rows);
    }
    catch(e){
        console.log(e);
    }
});

var fl_allez;
var fl_retour;
var sub_allez;
var sub_retour;

var amount = 0;

app.post(`/flights/allez/:fid`, (req, res) => {
  fl_allez = req.params.fid;
  sub_allez = req.body.price
  amount += sub_allez;
  console.log("allez flight: " + fl_allez);
  console.log("sub_allez " + sub_allez);
})


app.post(`/flights/retour/:fid`, (req, res) => {
  fl_retour = req.params.fid;
  sub_retour = req.body.price;
  amount += sub_retour;
  console.log("Retour flight: " + fl_retour);
  console.log("sub_retour " + sub_retour);
})

var pname;
var email;
var pdob;




app.post(`/flights/personnalInfo`, async (req, res)=>{
  const reqJson = req.body;

  console.log(reqJson);
  const fname = reqJson.firstname;
  const lname = reqJson.lastname;

  console.log("first name: " + fname);
  console.log("last name: " + lname);


  pname = fname.concat(" ", lname);
  email = reqJson.email;
  pdob = reqJson.dateofBirth;
  
  const phone_num = reqJson.phone;

  await updatedb(pname, email, pdob, amount, phone_num);

  res.json("Success!")
});

app.get(`/summary`, async (req, res) =>{
  const sum = await pool.query(`SELECT * FROM flights WHERE flight_id = $1 OR flight_id=$2;`, [fl_allez, fl_retour]);
  res.json(sum.rows);
});

app.get(`/total`, (req, res)=>{
  console.log(amount);
  res.json({"total" : amount});
})


app.listen(5000,  ()=>{
    console.log("App is listening on port 5000");
});

// async function check_if_used_bookref(x){

//   try{
//     const r = await pool.query(`SELECT COUNT(*)>0 FROM bookings WHERE book_ref = $1` , [x]);
//     const rs = r.rows[0];
//     return rs;
//   }
//   catch(e){
//     console.log("SOMETHING WENT WRONG");
//   }
// }

// async function check_if_used_tickno(x){

//   try{
//     const r = await pool.query(`SELECT COUNT(*)>0 FROM ticket WHERE ticket_no = $1` , [x]);
//     const rs = r.rows[0];
//     return rs;
//   }
//   catch(e){
//     console.log("SOMETHING WENT WRONG");
//   }
// }



function generate_bookref(s){
  const x = Date.now()%10000;
  const i = s[0].concat(s[1])
  const r = i.concat(x);

  return r;
}

function generate_ticketno(s){
  const x = Date.now()%10000;
  const i = s[0].concat(s[1])
  const r = i.concat(x);

  return r;
}


const f_cond = 'Economy';

async function updatedb(name, email, pdob, amount, phone){

 console.log(email);
 const names = name.split(" ");

 const fname = names[0];
 const lname = names[1];
 
 const b_ref = generate_bookref(lname);
 const t_no = generate_ticketno(fname);

 const p_id = lname.concat(pdob);
 const b_date = new Date().toISOString();
 await pool.query("BEGIN;")
 
 await pool.query(`INSERT INTO bookings VALUES($1, $2, $3)`, [b_ref, b_date, amount]);

 await  pool.query(`INSERT INTO ticket VALUES($1, $2, $3, $4, $5, $6)`, [t_no, b_ref, p_id, name, email, phone]);

 await pool.query(`UPDATE flights SET seats_available = seats_available-1, seats_booked = seats_booked + 1 WHERE flight_id = $1`, [fl_allez]);

 await pool.query(`UPDATE flights SET seats_available = seats_available-1, seats_booked = seats_booked + 1 WHERE flight_id = $1`, [fl_retour]);

 await pool.query(`INSERT INTO ticket_flights VALUES($1, $2, $3, $4)` , [t_no, fl_allez, f_cond, amount]);

 await pool.query(`INSERT INTO ticket_flights VALUES($1, $2, $3, $4)` , [t_no, fl_retour, f_cond, amount]);

 await pool.query("COMMIT;")


}

