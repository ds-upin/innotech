const express = require('express');
const http = require('http');
const socket = require('socket.io');
const imageRouter = require('./router/images');
const adminRouter = require('./router/adminRoute');
const path = require('path');
const {connectToMongoDb} = require('./connection');
const animaldb = require('./models/animals');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(express.urlencoded({extended: true}));
app.use(express.json());

connectToMongoDb('mongodb://127.0.0.1:27017/Animals')
.then(()=> console.log('Database Connected'))
.catch((err) => console.log('Error Occured at database connection ',err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public','HTML'));
app.use(express.static('public'));
app.get('/',(req,res)=>{
  res.render('index');
});
app.use('/admin',adminRouter);
app.use('/image',imageRouter);
app.get('/our_gallery',(req,res)=>{ res.render('our_gallery')});
app.get('/donation',(req,res)=>{ res.render('donation')});
app.get('/membership',(req,res)=>{ res.render('membership')});
//app.get('/adoptions',(req,res)=> res.render('adoptions'));
app.get('/About_Us',(req,res)=> res.render('About_Us'));
app.get('/video',(req,res)=>{res.render('')});
app.get('/animal_info/:id', async (req, res) => {
  const info = req.params.id;
  
  try {
    const dd = await animaldb.find({img: info});
    
    if (dd.length === 0) {
      return res.json({'msg':"wrong"});
    }
    //console.log(dd);
    res.render('animal_info', {dd});
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving data from the database.");
  }
});

app.get('/connect',(req,res)=>{
  res.render('video');
});

app.get('/adopt/:id',async (req,res)=>{
  const id = req.params.id;
  const data = await animaldb.find({
    img:id,
  });
  res.status(200).json({"data":data});
});

app.get('/animals', async (req, res) => {
  const { gender = 'All', ageRange = 'all' } = req.query; 

  let filter = {};


  if (gender && gender !== 'All') {
      filter.gender = gender;
  }

  if (ageRange) {
      if (ageRange === 'under_9_months') {
          filter.age = { $lt: 9 };  
      } else if (ageRange === '9_months_to_6_years') {
          filter.age = { $gte: 9, $lte: 72 };
      } else if (ageRange === '6_years_plus') {
          filter.age = { $gt: 72 }; 
      }
  }
  try {
      const animals = await animaldb.find(filter);  
      res.render('animals', { 
          animals,
          gender,   
          ageRange 
      });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
  }
});


let io = socket(server);
io.on("connection", function (socket) {
  socket.on("join", function (roomName) {
    let rooms = io.sockets.adapter.rooms;
    let room = rooms.get(roomName);
    if (room == undefined) {
      socket.join(roomName);
      socket.emit("created");
    } else if (room.size == 1) {
      socket.join(roomName);
      socket.emit("joined");
    } else {
      socket.emit("full");
    }
  });

  socket.on("ready", function (roomName) {
    socket.broadcast.to(roomName).emit("ready"); 
  });

  socket.on("candidate", function (candidate, roomName) {
    socket.broadcast.to(roomName).emit("candidate", candidate); 
  });

  socket.on("offer", function (offer, roomName) {
    socket.broadcast.to(roomName).emit("offer", offer); 
  });

  socket.on("answer", function (answer, roomName) {
    socket.broadcast.to(roomName).emit("answer", answer);
  });
});