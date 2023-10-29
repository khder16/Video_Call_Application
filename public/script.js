const socket = io('/')
const videoGrid = document.getElementById('video-grid')


//It will work on localhost only
const myPeer = new Peer()

const userVideoControls = document.getElementById('videoElement');
const selfVideoControls = document.getElementById('videoSelfElement');

const myVideo = document.getElementById('videoSelfElement');
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,

}).then(stream => {
  // add my video stream
  addVideoStream(myVideo, stream);

    
    myPeer.on('call', call => {
    // answer the incoming call
    call.answer(stream)
    const video = document.getElementById('videoElement')
    
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })
  // send user-connected to the server
  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
  
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

const connectToNewUser = (userId, stream) => {
  const call = myPeer.call(userId, stream)
  const video = document.getElementById('videoElement')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.srcObject = null;
  })

  peers[userId] = call
}

const addVideoStream = (video, stream) => {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
}





//styling

document.getElementById('hide-video').addEventListener('click', function () {
  if (document.getElementsByClassName("hide")[0] == undefined) {
    document.getElementById("videoSelfElement").classList.add("hide");
    //eye icon change on click
    document.getElementById("hide-video").classList.remove("fa-eye");
    document.getElementById("hide-video").classList.add("fa-eye-slash");
  } else {
    document.getElementById("videoSelfElement").classList.remove("hide");
    document.getElementById("hide-video").classList.add("fa-eye");
    document.getElementById("hide-video").classList.remove("fa-eye-slash");
  }
});

//cancel call
document.getElementById('cancel-call').addEventListener('click', function () {
  window.location.href = "/";
});

//turn off audio
var audioIcon = document.getElementById("off-volume");
document.getElementById('off-volume').addEventListener('click', function () {
  if (userVideoControls.volume != 1) {
    userVideoControls.volume = 1;
    try {
      audioIcon.classList.remove("fa-volume-off");
      audioIcon.classList.add("fa-volume-up");
    } catch (error) {
      console.log(error);
    }

  } else {
    userVideoControls.volume = 0;
    try {
      audioIcon.classList.add("fa-volume-off");
      audioIcon.classList.remove("fa-volume-up");
    } catch (error) {
      console.log(error);
    }
  }
});

//mute call
var micIcon = document.getElementById("off-mic");
document.getElementById('off-mic').addEventListener('click', function () {
  if (selfVideoControls.muted == true) {
    selfVideoControls.muted = false;
    try {
      micIcon.classList.remove("fa-microphone-slash");
      micIcon.classList.add("fa-microphone");
    } catch (error) {
      console.log(error);
    }

  } else {
    selfVideoControls.muted = true;
    try {
      micIcon.classList.add("fa-microphone-slash");
      micIcon.classList.remove("fa-microphone");
    } catch (error) {
      console.log(error);
    }
  }
});

//pause your own current stream
var cameraIcon = document.getElementById("off-camera");
document.getElementById('off-camera').addEventListener('click', function () {
  if (selfVideoControls.paused == true) {
    selfVideoControls.play();
    try {
      cameraIcon.classList.remove("icon-visiblity");
    } catch (error) {
      console.log(error);
    }

  } else {
    selfVideoControls.pause();
    try {
      cameraIcon.classList.add("icon-visiblity");
    } catch (error) {
      console.log(error);
    }
  }
});