// ==========================================
// 1. SONG DATA SOURCE
// ==========================================
const songs = [
  {
    title: "Starboy",
    artist: "The Weeknd",
    src: "assets/starboy.mp3",
    cover: "assets/starboy.jpg"
  },
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    src: "assets/blinding_lights.mp3",
    cover: "assets/blinding_lights.jpg"
  }
];

// Keep track of which song is playing
let songIndex = 0;

// Create the audio element with the first song
let audio = new Audio(songs[songIndex].src);

// ==========================================
// 2. SELECTING HTML ELEMENTS
// ==========================================
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progressBar = document.getElementById('progress');
const songTitle = document.getElementById('title');
const songArtist = document.getElementById('artist');
const songCover = document.getElementById('cover');

// ==========================================
// 3. CORE MUSIC CONTROL FUNCTIONS
// ==========================================

// Update the UI to show the current song details
function loadSong(song) {
  audio.src = song.src;
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  songCover.src = song.cover;
}

// Play the loaded song and update button state
function playSong() {
  audio.play();
  playBtn.textContent = 'Pause';
}

// Pause the loaded song and update button state
function pauseSong() {
  audio.pause();
  playBtn.textContent = 'Play';
}

// Switch to the previous song
function prevSong() {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

// Switch to the next song
function nextSong() {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

// ==========================================
// 4. EVENT LISTENERS
// ==========================================

// Handle Play/Pause button clicks
playBtn.addEventListener('click', () => {
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

// Handle Next and Previous button clicks
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Automatically update the progress bar as the song plays
audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progressPercent;
  }
});

// Allow the user to drag the progress bar to seek a spot in the song
progressBar.addEventListener('input', () => {
  if (audio.duration) {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
  }
});

// Automatically play the next song when the current one ends
audio.addEventListener('ended', nextSong);