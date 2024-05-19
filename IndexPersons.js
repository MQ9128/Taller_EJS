
const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('index');
const dotenv = require('dotenv');
const personsRouter= require('./src/routers/personsRouter');

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 3000;  

//middleware
app.use(morgan('dev'));  
app.use(express.static(__dirname + '/public'));  
app.set('view engine', 'ejs');  


app.use('/persons', personsRouter);



//levantando el servidor para escuchar por el puerto 3000
app.listen(PORT, () => {
    console.log('Listening on port:' + PORT);
});  