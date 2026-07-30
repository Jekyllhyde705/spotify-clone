// ==========================================
// 1. SONG DATA SOURCE (Using Web URLs)
// ==========================================
const songs = [
  {
    title: "Summer Walk",
    artist: "Oursam",
    // Direct public web MP3 stream link:
    src: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=summer-walk-112763.mp3",
    // Direct public cover image URL:
    cover: "https://picsum.photos/id/1062/300/300"
  },
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    src: "assets/blinding_lights.mp3",
    cover: "assets/blinding_lights.png"
  }
];

// App States
let songIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let currentFilter = "all"; // "all" or "library"
let searchQuery = "";

// Load Liked Songs from Local Storage
let likedSongs = JSON.parse(localStorage.getItem('likedSongs')) || [];

let audio = new Audio(songs[songIndex].src);

// ==========================================
// 2. SELECTING HTML ELEMENTS
// ==========================================
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');
const likeBtn = document.getElementById('like-btn');

const progressBar = document.getElementById('progress');
const songTitle = document.getElementById('title');
const songArtist = document.getElementById('artist');
const songCover = document.getElementById('cover');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const volumeSlider = document.getElementById('volume');

const cardsContainer = document.getElementById('cards-container');
const searchInput = document.getElementById('search-input');
const sectionTitle = document.getElementById('section-title');
const likedCountEl = document.getElementById('liked-count');

const navHome = document.getElementById('nav-home');
const navLibrary = document.getElementById('nav-library');
const uploadTrigger = document.getElementById('upload-trigger');
const audioFileInput = document.getElementById('audio-file-input');

// ==========================================
// 3. CORE DISPLAY & RENDERING FUNCTIONS
// ==========================================

function updateLikedCount() {
  likedCountEl.textContent = likedSongs.length;
}

// Generate music cards grid
function generateMusicCards() {
  cardsContainer.innerHTML = "";

  songs.forEach((song, index) => {
    // 1. Apply Search Filter
    const matchesSearch = song.title.toLowerCase().includes(searchQuery) || 
                          song.artist.toLowerCase().includes(searchQuery);

    // 2. Apply Library Filter
    const matchesLibrary = currentFilter === "all" || likedSongs.includes(song.title);

    if (matchesSearch && matchesLibrary) {
      const isSongLiked = likedSongs.includes(song.title);
      const heartIconClass = isSongLiked ? "fa-solid fa-heart" : "fa-regular fa-heart";
      const heartColorStyle = isSongLiked ? "color: #1db954; opacity: 1;" : "";

      const cardHTML = `
        <div class="card">
          <div onclick="playSelectedSong(${index})">
            <img src="${song.cover}" alt="${song.title}">
            <div class="play-hover-btn"><i class="fa-solid fa-play"></i></div>
          </div>
          <button class="card-heart-btn" style="${heartColorStyle}" onclick="toggleLike('${song.title}', event)">
            <i class="${heartIconClass}"></i>
          </button>
          <h3>${song.title}</h3>
          <p>${song.artist}</p>
        </div>
      `;
      cardsContainer.innerHTML += cardHTML;
    }
  });

  if (cardsContainer.innerHTML === "") {
    cardsContainer.innerHTML = `<p style="color: #b3b3b3; margin-top: 24px;">No songs found matching your search.</p>`;
  }
}

// ==========================================
// 4. CORE MUSIC CONTROL FUNCTIONS
// ==========================================

function loadSong(song) {
  audio.src = song.src;
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  songCover.src = song.cover;
  updatePlayerLikeButton(song.title);
}

function playSong() {
  isPlaying = true;
  audio.play();
  playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
}

function pauseSong() {
  isPlaying = false;
  audio.pause();
  playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
}

function prevSong() {
  if (isShuffle) {
    songIndex = Math.floor(Math.random() * songs.length);
  } else {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
  }
  loadSong(songs[songIndex]);
  playSong();
}

function nextSong() {
  if (isRepeat) {
    audio.currentTime = 0;
    playSong();
  } else if (isShuffle) {
    songIndex = Math.floor(Math.random() * songs.length);
    loadSong(songs[songIndex]);
    playSong();
  } else {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songs[songIndex]);
    playSong();
  }
}

function playSelectedSong(index) {
  songIndex = index;
  loadSong(songs[songIndex]);
  playSong();
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// ==========================================
// 5. LIKE & LOCAL STORAGE SYSTEM
// ==========================================

function toggleLike(songTitleText, event) {
  if (event) event.stopPropagation();

  const songIndexInLikes = likedSongs.indexOf(songTitleText);
  if (songIndexInLikes === -1) {
    likedSongs.push(songTitleText);
  } else {
    likedSongs.splice(songIndexInLikes, 1);
  }

  localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
  
  updateLikedCount();
  updatePlayerLikeButton(songs[songIndex].title);
  generateMusicCards();
}

function updatePlayerLikeButton(currentSongTitle) {
  if (likedSongs.includes(currentSongTitle)) {
    likeBtn.innerHTML = '<i class="fa-solid fa-heart" style="color: #1db954;"></i>';
  } else {
    likeBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
  }
}

// ==========================================
// 6. EVENT LISTENERS
// ==========================================

playBtn.addEventListener('click', () => {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

shuffleBtn.addEventListener('click', () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle('active', isShuffle);
});

repeatBtn.addEventListener('click', () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle('active', isRepeat);
});

likeBtn.addEventListener('click', () => {
  toggleLike(songs[songIndex].title);
});

audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progressPercent;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    totalTimeEl.textContent = formatTime(audio.duration);
  }
});

// Fix seeking for web streams
progressBar.addEventListener('change', () => {
  if (audio.duration && !isNaN(audio.duration)) {
    const targetTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = targetTime;
  }
});

progressBar.addEventListener('input', () => {
  if (audio.duration && !isNaN(audio.duration)) {
    const targetTime = (progressBar.value / 100) * audio.duration;
    currentTimeEl.textContent = formatTime(targetTime);
  }
});

volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value / 100;
});

// ==========================================
// AUDIO OUTPUT SWITCHER (Bluetooth / Speaker)
// ==========================================
const speakerSelectBtn = document.getElementById('speaker-select-btn');

speakerSelectBtn.addEventListener('click', async () => {
  // Check if the browser supports selecting audio output devices
  if (navigator.mediaDevices && navigator.mediaDevices.selectAudioOutput) {
    try {
      // Prompt the user to choose an audio output device (e.g., Bluetooth headphones)
      const selectedDevice = await navigator.mediaDevices.selectAudioOutput();
      
      // Route the player's audio element to the chosen device ID
      if ('setSinkId' in HTMLMediaElement.prototype) {
        await audio.setSinkId(selectedDevice.deviceId);
        console.log(`Audio output switched to: ${selectedDevice.label}`);
        speakerSelectBtn.style.color = "#1db954"; // Green highlight when custom device selected
      }
    } catch (err) {
      // Handle user cancellation or permission errors gracefully
      if (err.name !== 'NotAllowedError') {
        console.error("Could not switch audio output device:", err);
      }
    }
  } else {
    // Fallback alert if running on browsers without setSinkId support (like iOS Safari)
    alert("Audio device switching isn't supported directly by your browser. Please connect your Bluetooth device BEFORE opening the page, or check your system audio settings.");
  }
});

audio.addEventListener('ended', nextSong);


// ==========================================
// LIVE WEB MUSIC SEARCH (Jamendo + Audius)
// ==========================================
let searchTimeout;

searchInput.addEventListener('input', (e) => {
  const query = e.target.value.trim().toLowerCase();
  
  clearTimeout(searchTimeout);

  if (query === "") {
    searchQuery = "";
    generateMusicCards();
    return;
  }

  // Debounce input to avoid spamming network requests
  searchTimeout = setTimeout(async () => {
    cardsContainer.innerHTML = `<p style="color: #1db954; margin-top: 24px;">Searching full-length tracks for "${query}"...</p>`;

    try {
      // 1. Try Jamendo API First (Option 1)
      const jamendoUrl = `https://api.jamendo.com/v3.0/tracks/?client_id=56b40278&format=json&limit=10&search=${encodeURIComponent(query)}`;
      const jamendoRes = await fetch(jamendoUrl);
      const jamendoData = await jamendoRes.json();

      let fetchedSongs = [];

      if (jamendoData.results && jamendoData.results.length > 0) {
        jamendoData.results.forEach(item => {
          fetchedSongs.push({
            title: item.name,
            artist: item.artist_name,
            src: item.audio, // Full-length MP3 stream URL
            cover: item.image || "https://picsum.photos/300/300"
          });
        });
      } else {
        // 2. Fallback to Audius API (Option 3)
        const audiusUrl = `https://discoveryprovider.audius.co/v1/tracks/search?query=${encodeURIComponent(query)}&app_name=SPOTIFY_CLONE`;
        const audiusRes = await fetch(audiusUrl);
        const audiusData = await audiusRes.json();

        if (audiusData.data && audiusData.data.length > 0) {
          audiusData.data.forEach(item => {
            fetchedSongs.push({
              title: item.title,
              artist: item.user ? item.user.name : "Unknown Artist",
              src: `https://discoveryprovider.audius.co/v1/tracks/${item.id}/stream?app_name=SPOTIFY_CLONE`, // Full stream URL
              cover: item.artwork ? item.artwork['480x480'] : "https://picsum.photos/300/300"
            });
          });
        }
      }

      if (fetchedSongs.length === 0) {
        cardsContainer.innerHTML = `<p style="color: #b3b3b3; margin-top: 24px;">No full-length tracks found for "${query}".</p>`;
        return;
      }

      // Replace active song list with fetched tracks
      songs.length = 0;
      songs.push(...fetchedSongs);
      generateMusicCards();

    } catch (error) {
      console.error("Search Error:", error);
      cardsContainer.innerHTML = `<p style="color: #ff5555; margin-top: 24px;">Error fetching tracks. Check your connection.</p>`;
    }
  }, 400);
});

// ==========================================
// 7. MAGIC NAVIGATION & TAB FILTERING
// ==========================================
const navItems = document.querySelectorAll('.navigation ul li');

navItems.forEach((item) => {
  item.addEventListener('click', function (e) {
    e.preventDefault();
    
    // Update Active Class for Magic Bubble Animation
    navItems.forEach((li) => li.classList.remove('active'));
    this.classList.add('active');

    // Run Navigation Logic based on clicked item ID
    if (this.id === 'nav-home') {
      currentFilter = "all";
      sectionTitle.textContent = "Good Morning";
      generateMusicCards();
    } else if (this.id === 'nav-library') {
      currentFilter = "library";
      sectionTitle.textContent = "Liked Songs";
      generateMusicCards();
    } else if (this.id === 'upload-trigger') {
      audioFileInput.click();
    }
  });
});

// ==========================================
// 8. FILE IMPORT SYSTEM
// ==========================================
audioFileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const cleanTitle = file.name.replace(/\.[^/.]+$/, "");
  const tempAudioUrl = URL.createObjectURL(file);

  const newSong = {
    title: cleanTitle,
    artist: "Local File",
    src: tempAudioUrl,
    cover: "https://picsum.photos/id/101/300/300"
  };

  songs.push(newSong);
  generateMusicCards();
  playSelectedSong(songs.length - 1);
});

// Initialize App
generateMusicCards();
updateLikedCount();
loadSong(songs[songIndex]);