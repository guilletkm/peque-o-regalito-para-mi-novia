// ==========================================
// 1. FECHA DE INICIO
// ==========================================
// Recuerda: Enero es 0, Febrero es 1, ..., Junio es 5.
const fechaInicio = new Date(2025, 5, 7, 15, 30, 0); 

// ==========================================
// 2. LÓGICA DEL CONTADOR
// ==========================================
function actualizarContador() {
    const ahora = new Date();
    
    let anios = ahora.getFullYear() - fechaInicio.getFullYear();
    let meses = ahora.getMonth() - fechaInicio.getMonth();
    let dias = ahora.getDate() - fechaInicio.getDate();
    let horas = ahora.getHours() - fechaInicio.getHours();
    let minutos = ahora.getMinutes() - fechaInicio.getMinutes();
    let segundos = ahora.getSeconds() - fechaInicio.getSeconds();

    if (segundos < 0) { segundos += 60; minutos--; }
    if (minutos < 0) { minutos += 60; horas--; }
    if (horas < 0) { horas += 24; dias--; }
    
    if (dias < 0) {
        const mesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0).getDate();
        dias += mesAnterior;
        meses--;
    }
    
    if (meses < 0) {
        meses += 12;
        anios--;
    }

    const timerHTML = `
        <div class="timer-main">
            <span class="number">${anios}</span><span class="unit">años</span>
            <span class="number">${meses}</span><span class="unit">meses</span>
            <span class="number">${dias}</span><span class="unit">días</span>
        </div>
        <div class="timer-sub">
            ${horas}h ${minutos}m ${segundos}s
        </div>
    `;

    document.getElementById('timer').innerHTML = timerHTML;
}

setInterval(actualizarContador, 1000);
actualizarContador();

// ==========================================
// 3. CURSOR DE CORAZONES
// ==========================================
document.addEventListener('mousemove', (e) => {
    const heart = document.createElement('span');
    heart.innerHTML = '❤';
    heart.classList.add('heart');
    
    heart.style.left = e.clientX + 'px';
    heart.style.top = e.clientY + 'px';
    
    const size = Math.random() * 15 + 10;
    heart.style.fontSize = size + 'px';

    document.body.appendChild(heart);

    setTimeout(() => { heart.remove(); }, 1500);
});

// ==========================================
// 4. REPRODUCTOR DE MÚSICA AVANZADO (Fijo para iPhone)
// ==========================================
const canciones = [
    "tu-cancion.mp3",
    "cancion2.mp3",
    "cancion3.mp3"
]; 

let indiceActual = 0;
const audio = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const icon = document.getElementById('music-icon');

const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const volumeSlider = document.getElementById('volume-slider');

// Detectar si es un iPhone/iPad (iOS)
const esIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// Si es iOS, ocultamos el deslizador de volumen porque Apple no permite usarlo
if (esIOS && volumeSlider) {
    volumeSlider.style.display = 'none';
}

function formatearTiempo(segundos) {
    if (isNaN(segundos)) return "0:00";
    const min = Math.floor(segundos / 60);
    const seg = Math.floor(segundos % 60);
    return `${min}:${seg < 10 ? '0' : ''}${seg}`;
}

if(audio) {
    audio.src = canciones[indiceActual];
    // Solo aplicar volumen si NO es iOS
    if (!esIOS) audio.volume = volumeSlider.value;

    // --- Controles Básicos ---
    musicBtn.addEventListener('click', () => {
        if (audio.paused) { 
            audio.play(); 
            icon.innerHTML = '⏸'; 
        } else { 
            audio.pause(); 
            icon.innerHTML = '♫'; 
        }
    });

    nextBtn.addEventListener('click', () => {
        indiceActual = (indiceActual + 1) % canciones.length; 
        audio.src = canciones[indiceActual];
        audio.play();
        icon.innerHTML = '⏸';
    });

    prevBtn.addEventListener('click', () => {
        indiceActual = (indiceActual - 1 + canciones.length) % canciones.length;
        audio.src = canciones[indiceActual];
        audio.play();
        icon.innerHTML = '⏸';
    });

    volumeSlider.addEventListener('input', (e) => {
        if (!esIOS) audio.volume = e.target.value;
    });

    audio.addEventListener('ended', () => {
        nextBtn.click();
    });

    // --- Lógica de la Barra de Progreso (COMPATIBLE CON IPHONE) ---
    
    let isDragging = false; // Variable para saber si estás tocando la barra

    audio.addEventListener('loadedmetadata', () => {
        progressBar.max = audio.duration;
        totalTimeEl.innerText = formatearTiempo(audio.duration);
    });

    // Mientras reproduce, solo se mueve sola si NO tienes el dedo puesto
    audio.addEventListener('timeupdate', () => {
        if (!isDragging) {
            progressBar.value = audio.currentTime;
            currentTimeEl.innerText = formatearTiempo(audio.currentTime);
        }
    });

    // Cuando pones el dedo y arrastras (Actualiza solo los números, no la música aún)
    progressBar.addEventListener('input', () => {
        isDragging = true;
        currentTimeEl.innerText = formatearTiempo(progressBar.value);
    });

    // Cuando LEVANTAS el dedo (Aquí recién cambiamos el minuto de la canción)
    progressBar.addEventListener('change', () => {
        audio.currentTime = progressBar.value;
        isDragging = false;
    });
}

// ==========================================
// 5. ANIMACIONES AL HACER SCROLL
// ==========================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) { 
            entry.target.classList.add('active'); 
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(section => { 
    observer.observe(section); 
});
