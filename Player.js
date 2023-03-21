//music start
//mucic load start
const input = document.querySelector('input');
const preview = document.querySelector('.preview');

input.style.opacity = 0;

input.addEventListener('change', updateMusicDisplay);

function updateMusicDisplay() {

    const curFiles = input.files;
    const list = document.createElement('ol');
    list.className = 'del';
    preview.append(list);

    for(const file of curFiles) {

        const listItem = document.createElement('li');
        let name = file.name.slice(0, -4);
    
        if(validFileType(file) && musicList.includes(name) == false) {
            musicList.splice(-1, 0, `${name}`);
            listItem.insertAdjacentHTML(`afterbegin`, `<div class = "pieceAudio" onclick="loadSong(musicList[${musicList.indexOf(`${name}`)}])">
            <div class = "leftBarLoad">
            <div class = "songImage"> <img src="images/50x50.jfif" alt=""> </div>
            <div class = "songName">${name} </div>
            </div>
            <div class = "songSurname"> Surname </div>
            <div class = "durationTimeLoad">${0}</div>
            </div>`);
            
            list.prepend(listItem);
            indexMusic = musicList[musicList.indexOf(`${name}`)]
        } else {
            break;
        }; 

    };
};
// test start



// test end

const fileTypes = [
  `audio/mpeg`,
  `audio/mp4`,
  `audio/ogg`,
  `audio/mp3`
];

function validFileType(file) {
    return fileTypes.includes(file.type);
}

let musicList = [0];

let indexMusic = 0;

function loadSong(music) {
    audio.src = `music/${music}.mp3`;
    player.classList.remove('play');
    nameMusic.innerHTML = `${music}`
    indexMusic = musicList.indexOf(music);
    playSong();
};

//music load end
const audio = document.querySelector('.audio'),
      player = document.querySelector('.player'),
      playBtn = document.querySelector('.Play'),
      nextBtn = document.querySelector('.next'),
      prevBtn = document.querySelector('.prev'),
      progress = document.querySelector('.progress'),
      progressContainer = document.querySelector('.progressContainer'),
      VolumeContainer = document.querySelector('.VolumeContainer'),
      Volume = document.querySelector('.Volume'),
      currentVolume = document.querySelector('.currentVolume'),
      currentTime = document.querySelector('.currentTime'),
      durationTime = document.querySelector('.durationTime'),
      nameMusic = document.querySelector('.nameMusic'),
      volumeImg = document.querySelector('.volume'),
      durationTimeLoad = document.querySelector('.durationTimeLoad');
// play & pause start
function playSong() {
    player.classList.add('play');
    audio.play();
    playBtn.classList.remove('pauseImg');
}

function pauseSong() {
    player.classList.remove('play');
    audio.pause();
    playBtn.classList.add('pauseImg');
}

playBtn.addEventListener('click', () => {
    const isPlaying = player.classList.contains('play');
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}); 
// play & pause end
// Next song start
function nextSong() {
    if (indexMusic < musicList.length -2) {
        indexMusic++;
        } else {
            indexMusic = 0;
    }

    loadSong(musicList[indexMusic])
};

nextBtn.addEventListener('click', nextSong);
// Next song end
// Prev song start
function prevSong() {
    if (indexMusic > 0) {
        indexMusic--;
    } else {
        indexMusic = musicList.length - 2;
    }

    loadSong(musicList[indexMusic]);
};

prevBtn.addEventListener('click', prevSong);
// Prev song end
// Progress bar start

function Progress(e) {
    let {duration, currentTime} = e.srcElement;
    let progressPercent = (currentTime / duration) * 100;
    audioTimeUpdate()

    progress.style.width = `${progressPercent}%`;
};
audio.addEventListener('timeupdate', Progress);

function setProgress(e) {
    let width = this.clientWidth;
    let setClickX = e.offsetX;
    let duration = audio.duration;
    
    audio.currentTime = (setClickX / width) * duration;
};
progressContainer.addEventListener('click', setProgress);
// Progress bar end
// Next song start

audio.addEventListener('ended', nextSong);
// Next song end
// setVolume start

function setVolume(e) {
        let volume = audio.volume;
        let width = this.clientWidth;
        let setClickX = e.offsetX;
        let value = Math.floor((setClickX / width)*1000);
        Volume.style.width = `${value/10}%`;
        audio.volume = value/1000;
        currentVolume.innerHTML = `${Math.round(audio.volume * 100)}`;
    

        if (currentVolume.innerHTML > 50) {
            volumeImg.src = `styles/volumeMax.svg`;
        } else if (currentVolume.innerHTML < 1) {
            volumeImg.src = `styles/volumeMute.svg`;
        } else if (currentVolume.innerHTML < 50) {
            volumeImg.src = `styles/volumeHalf.svg`;   
        }   
};

   VolumeContainer.addEventListener('mousemove', setVolume); 

// setVolume end
// timer start

function audioTimeUpdate() {
    if(audio.duration) {
        let durationMinutes = Math.floor(audio.duration / 60);
        let durationSeconds = Math.floor(audio.duration - durationMinutes * 60);

        let currentMinutes = Math.floor(audio.currentTime / 60);
        let currentSeconds = Math.floor(audio.currentTime - currentMinutes * 60);

        if (durationSeconds < 10) {
            durationSeconds = "0" + durationSeconds;
        }

        if (durationMinutes < 10) {
            durationMinutes = "0" + durationMinutes;
        }

        if (currentMinutes < 10) {
            currentMinutes = "0" + currentMinutes;
        }

        if (currentSeconds < 10) {
            currentSeconds = "0" + currentSeconds;
        }

        durationTime.innerHTML = durationMinutes + ":" + durationSeconds;
        currentTime.innerHTML = currentMinutes + ":" + currentSeconds;

        } else {
            durationTime.innerHTML = "00" + ":" + "00";
            currentTime.innerHTML = "00" + ":" + "00";
    }
    
}
// timer end


// music end


// dgfdfg

const container = document.getElementById('container'),
      canvas = document.getElementById('canvas1');
canvas.width = window.innerWidth;
canvas.height = 300;
const ctx = canvas.getContext('2d');
let audioSource;
let analyser;

audio.addEventListener('playing', function(){
    const audioContext = new window.AudioContext();
    audioSource = audioContext.createMediaElementSource(audio);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination)
    analyser.fftSize = 1024;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = (canvas.width/2)/bufferLength;
    let barHeight;
    let x;
    
    function animate(){
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
        requestAnimationFrame(animate);
    }
    animate();
});

function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 1.15;
        const red = i * barHeight/20;
        const green = i/2;
        const blue= barHeight/1.5;
        ctx.fillStyle = 'white';
        ctx.fillRect(canvas.width/2 - x, canvas.height - barHeight - 5, barWidth, 15);
        ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
        ctx.fillRect(canvas.width/2 - x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth;
    }
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 1.15;
        const red = i * barHeight/20;
        const green = i/2;
        const blue= barHeight/1.5;
        ctx.fillStyle = 'white';
        ctx.fillRect(x, canvas.height - barHeight - 5, barWidth, 15);
        ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth;
    }
}


//dfgdfg
