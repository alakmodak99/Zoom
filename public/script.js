const socket =io("/")

const mypeer = new Peer(undefined, {
    host: "/",
    port: '8081'
})
const allPeers ={};
const myVideo = document.createElement("video")
myVideo.muted=true;

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then( (stream) =>{ 
    addVideoStream(myVideo, stream) 
    mypeer.on('call', call =>{
        call.answer(stream) 
        const video = document.createElement("video")
        call.on('stream', userVideoStream =>{
            addVideoStream(video, userVideoStream)
        })
    })
    socket.on('user-connected', userId =>{
        connectToNewUser(userId, stream)
    })
    socket.on('user-disconnected', (userId)=>{
        console.log(allPeers)
        
       
        if(allPeers[userId]) allPeers[userId].close()
    
        console.log("User disconnected", userId)
    })

})

mypeer.on('open', (id)=>{
     socket.emit("join-room", ROOM_ID, id)
})

socket.on('user-connected', (userId)=>{
    console.log(`User connected : ${userId}`)
})

function addVideoStream(video, stream){
    const videoGrid = document.querySelector("#video-grid")
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", ()=>{
        video.play()
    })
    videoGrid.append(video)
} 

function connectToNewUser(userId, stream){
    const call = mypeer.call(userId, stream);
    
    const Video = document.createElement('video');
     Video.setAttribute("id", `${userId}`)
    call.on('stream', userVideoStream => {
        addVideoStream(Video, userVideoStream)
    })
    call.on('close', ()=>{
        Video.remove()
    }) 
    allPeers[userId] = call;
}