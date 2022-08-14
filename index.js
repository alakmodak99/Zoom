const express = require("express")
const app = express()
const server = require("http").Server(app)
const io =require("socket.io")(server)
const {v4: uuidV4} = require("uuid")
server.listen(8080)

app.set('view engine', 'ejs');
app.use(express.static("public"))
app.get("/", (req,res)=>{
   res.redirect(`/${uuidV4()}`)
})

app.get("/:room",(req,res)=>{
    res.render("room", {roomId: req.params.room})
})
// app.get('/socket.io/socket.io.js', (req, res) => {
//     res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
//   });
io.on("connection", (ws)=>{
    ws.on('join-room', (roomId, userId)=>{
        console.log("RoomID :",roomId,"UserID", userId)
        ws.join(roomId)
        ws.broadcast.emit('user-connected', userId)
        ws.on('disconnect', ()=>{
            ws.broadcast.emit('user-disconnected', userId)
        })
    })
})
