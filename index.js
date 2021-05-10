const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

require ('dotenv').config();
const authRoutes = require('./Route/authRouter')

const corsOption = {
    origin: "http://localhost:3000",
    credential: true,
    optionSuccessStatus: 200 
}
app.use(cors(corsOption));

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true,  useUnifiedTopology: true  }).then( () => {
    app.listen(PORT);
    console.log("connected");
}).catch( err=>console.log(err));

app.use(express.json());
app.use(cookieParser());
app.use(authRoutes);

app.get('/set-cookies', (req, res) => {
    res.cookie('username', 'Tony');
    res.cookie('isAuthenticated', true, {maxAge: 24*60*60*1000});
    res.send("Cookies are set")
})

app.get('/get-cookies', (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);
    res.json(cookies);
})

app.get('/', (req, res) =>{
    res.send("Hello, world!");
})

app.use((req, res) => {
    res.sendFile("./Error/404.html", {root:__dirname});
})



