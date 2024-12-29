const express = require('express');
const http = require('http');
const path = require('path');
const socket = require('socket.io');
const status = require('express-status-monitor');
const imageRouter = require('./router/images');
const adminRouter = require('./router/adminRoute');
const aboutRouter = require('./router/About_UsRoute');
const adoptRouter = require('./router/adoptRoute');
const animalsRouter = require('./router/animalRoute');
const {connectToMongoDb} = require('./connection');
const animaldb = require('./models/animals');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Site available on localhost - http://localhost:${PORT}`);
});

app.use(status());
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
app.use('/About_Us',aboutRouter);
app.use('/adopt',adoptRouter);
app.use('/animals',animalsRouter);
app.get('/our_gallery',(req,res)=>{ res.render('our_gallery')});
app.get('/donation',(req,res)=>{ res.render('donation')});
app.get('/membership',(req,res)=>{ res.render('membership')});
app.get('/video',(req,res)=>{res.render('')});

app.get('/animal_info/:id', async (req, res) => {
  const info = req.params.id;
  
  try {
    const dd = await animaldb.find({img: info});
    
    if (dd.length === 0) {
      return res.json({'msg':"wrong"});
    }
    res.render('animal_info', {dd});
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving data from the database.");
  }
});

app.get('/connect',(req,res)=>{
  res.render('video');
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