const CONFIG = {
  anniversaryDate: "26-09-26",
  letter: `Happy anniversary, sayang. Terima kasih ya sudah mau berjalan sejauh ini sama aku.<br><br>Aku mau berjanji baik-baik dan sama-sama menjaga cerita yang sudah kita mulai. Semoga setiap langkah berikutnya tetap punya alasan untuk tersenyum.<br><br>Happy anniversary.`
};

const pages = [...document.querySelectorAll(".page")];
let current = "envelope";
let musicAvailable = true;
constmusic = document.getElementById("music");

const letterText = document.getElementById("letterText");
if (letterText) letterText.innerHTML = CONFIG.letter;

function showPage(name, from = current){
  if(name === current) return;
  const oldPage = document.querySelector(`.page[data-page="${from}"]`);
  const newPage = document.querySelector(`.page[data-page="${name}"]`);
  if(!newPage) return;
  oldPage?.classList.add("leaving");
  setTimeout(()=>{
    oldPage?.classList.remove("active","leaving");
    newPage.classList.add("active");
    current = name;
  }, 380);
}

const envelopeBtn = document.getElementById("envelopeBtn");
if (envelopeBtn) {
  envelopeBtn.addEventListener("click", ()=>{
    if(envelopeBtn.classList.contains("open")) return;
    envelopeBtn.classList.add("open");
    setTimeout(()=>showPage("anniversary"),1100);
  });
}

document.querySelectorAll("[data-go]").forEach(btn=>{
  btn.addEventListener("click",()=>showPage(btn.dataset.go));
});

document.querySelectorAll(".surprise-item").forEach(item=>{
  item.addEventListener("click",()=>{
    const target = item.dataset.surprise;
    item.classList.add("selected");
    setTimeout(()=>showPage(target),360);

    for(let i=0;i<8;i++){
      const s=document.createElement("i");
      s.textContent="✦";
      s.style.cssText=`position:absolute;left:${45+Math.random()*10}%;top:${45+Math.random()*10}%;z-index:20;color:#ffe7a2;font-size:${10+Math.random()*15}px;pointer-events:none;animation:sparkle .7s ease-out forwards;`;
      item.appendChild(s);
      setTimeout(()=>s.remove(),800);
    }
  });
});

document.querySelectorAll("[data-back]").forEach(btn=>{
  btn.addEventListener("click",()=>showPage(btn.dataset.back));
});

// Gallery lightbox
const lightbox=document.getElementById("lightbox");
const lightboxImg=document.getElementById("lightboxImg");
const lightboxClose=document.getElementById("lightboxClose");
function closeLightbox(){
  if(!lightbox)return;
  lightbox.classList.remove("show");
  setTimeout(()=>{if(!lightbox.classList.contains("show")&&lightboxImg)lightboxImg.removeAttribute("src")},320);
}
if(lightbox&&lightboxImg){
  document.querySelectorAll(".polaroid img").forEach(img=>img.addEventListener("click",e=>{
    e.preventDefault();e.stopPropagation();
    lightboxImg.src=img.currentSrc||img.src;
    lightbox.classList.add("show");
  }));
  lightboxClose?.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();closeLightbox()});
  lightbox.addEventListener("click",e=>{if(e.target===lightbox)closeLightbox()});
}
// ================================
// MUSIC + 5 SONG PLAYLIST
// ================================

const playlistVinyl = document.getElementById("playlistVinyl");
const playlistMusicBtn = document.getElementById("playlistMusicBtn");

const songItems = document.querySelectorAll(".song-item");


// Update tampilan musik
function setMusicUI(playing){

  document.querySelectorAll(".music-btn").forEach(btn=>{
    btn.textContent = playing ? "Ⅱ" : "▶";
  });

  // Piringan Playlist
  if(playlistVinyl){
    playlistVinyl.classList.toggle("vinyl-playing", playing);
  }

  // Piringan di Gift
  document.querySelectorAll(".vinyl-record").forEach(v=>{
    v.classList.toggle("vinyl-playing", playing);
  });
}


// Pilih salah satu dari 5 lagu
songItems.forEach(item => {

  item.addEventListener("click", async () => {

    const song = item.dataset.song;

    // Ganti lagu
    music.pause();

    music.src = song;

    music.load();

    try {

      await music.play();

      setMusicUI(true);

    } catch(error) {

      console.log("Musik tidak bisa diputar:", error);

      setMusicUI(false);

    }


    // Tandai lagu aktif
    songItems.forEach(btn=>{
      btn.classList.remove("active");
    });

    item.classList.add("active");


    // Ganti tulisan NOW PLAYING
    const nowPlaying = document.getElementById("nowPlaying");
    const musicFile = document.getElementById("musicFile");

    if(nowPlaying){
      nowPlaying.textContent = item.innerText.trim();
    }

    if(musicFile){
      musicFile.textContent = song.split("/").pop();
    }

  });

});


// Tombol PLAY / PAUSE
playlistMusicBtn?.addEventListener("click", async () => {

  if(music.paused){

    try{

      await music.play();

      setMusicUI(true);

    }catch(error){

      console.log(error);

    }

  }else{

    music.pause();

    setMusicUI(false);

  }

});


// Saat lagu selesai
music?.addEventListener("ended", () => {

  setMusicUI(false);

});

// Video fallback
const video = document.getElementById("journeyVideo");
const fallback = document.getElementById("videoFallback");
video?.addEventListener("loadeddata",()=>{ if(fallback) fallback.style.display="none"; });
video?.addEventListener("error",()=>{ if(fallback) fallback.style.display="grid"; });

// Keyboard shortcuts
document.addEventListener("keydown",e=>{
  if(e.key==="Escape") closeLightbox();
  if(e.code==="Space" && current==="playlist"){ e.preventDefault(); toggleMusic(); }
});

document.querySelectorAll("img").forEach(img=>{
  img.addEventListener("error",()=>{ img.style.opacity=".15"; });
});
