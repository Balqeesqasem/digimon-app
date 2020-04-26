'use strict'
require('dotenv').config();
let express = require('express');
let methodOverride = require('method-override');
let superagent =  require('superagent');
let pg = require('pg');
let app = express();
let PORT = process.env.PORT || 3030;
const client = new pg.Client(process.env.DATABASE_URL);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public')); 
app.set('view engine', 'ejs');

app.get('/', getAllData);
app.post('/addTofaveret', addDataToDb);
app.get('/myfaver', tackDataFromDb);
app.get('/search', searchOfData);
app.get('/detail/:id', showDetail );
app.put('/update/:id', updateData);
app.delete('/delete/:id', deleteData);

function getAllData(req,res){
    getFromApi()
    .then( data => {
        res.render('index',{myData:data})
          
      })
}
function getFromApi(){
    let url =`https://digimon-api.herokuapp.com/api/digimon`;
    return superagent(url)
    .then(data =>{
       return data.body.map(val =>{
        return new Pokemon(val);
    })
})}


function addDataToDb(req,res){
    let {name,img,level}=req.body;
    let SQL= 'INSERT INTO exam (name,img,level) VALUES ($1,$2,$3);';
    let safeValue = [name,img,level];
    return client.query(SQL,safeValue)
    .then(() =>{
        res.redirect('/myfaver')
    })
}

function tackDataFromDb(req,res){
 
    let SQL = 'SELECT * FROM exam;'
    return client.query(SQL)
    .then(data =>{
        //console.log('hiiiiiiiiiiii',data.rows);
        res.render('myfav', {myData:data.rows})
    })
}

function showDetail(req,res){
    let {name,img,level}= req.body;
    let SQL = 'SELECT * FROM exam WHERE id=$1;';
    let safeValue = [name,img,level,Number(req.params.id)];
    return client.query(SQL,safeValue)
    .then(data =>{
        Console.log(data.rows[0]);
        res.render(`detail/${req.params.id}`,{myData:data.rows[0]})
    })
}

function updateData(req,res){
    let {name,img,level}=req.body;
    let SQL= 'UPDATE exam SET name =$1,img=$2,level=$3  WHERE id=$4;'
    let safeValue = [name,img,level,Number(req.params.id)];
    return client.query(SQL,safeValue)
    .then(() =>{
        res.redirect('/myfaver');
    })
}

function deleteData(req,res){
    let valOf = [req.param.id];
    let SQL ='DELETE FROM exam WHERE id=$1;';
    return client.query(SQL,valOf)
    .then (()=>{
        res.redirect('/myfaver');
    })
}

function searchOfData(req,res){
    let searchthing = req.query.search;
    getFromApiSearch(searchthing)
    .then( data => {
        res.render('index',{myData:data})
          
      })
}

function getFromApiSearch(searchthing){
   
    let url =`https://digimon-api.herokuapp.com/api/digimon/name/${searchthing}`;
    return superagent(url)
    .then(data =>{
       return data.body.map(val =>{
        return new Pokemon(val);
    })
})}


function Pokemon(data){
    this.name=data.name;
    this.img =data.img;
    this.level=data.level;
}

client.connect()
.then(() =>{
    app.listen(PORT,() =>{
        console.log(`you are listen to PORT # ${PORT}`)
    })
})