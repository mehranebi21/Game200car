// سیستم صوتی پیشرفته و مدرن بدون فایل صوتی خارجی
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playEngineSound() {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(CONFIG.engineSoundFreq, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    setTimeout(() => oscillator.stop(), 200);
}

// رندرینگ سه‌بعدی و شیک با استفاده از CSS 3D Transforms (سبک، روان و بدون پیکسل)
document.body.style.backgroundColor = CONFIG.skyColor;
const app = document.getElementById('game-app');
app.innerHTML = `
    <div class="scene">
        <div class="road" style="background: linear-gradient(#333, #111);"></div>
        <div class="car" id="playerCar" style="background-color: ${CONFIG.carColor};">
            <span class="car-glow"></span>
        </div>
    </div>
    <div class="ui">
        <h2>${CONFIG.gameName}</h2>
        <p>Theme: ${CONFIG.theme} | Speed: ${CONFIG.speed} km/h</p>
    </div>
`;

// کنترل حرکت ماشین
let carX = 50;
document.addEventListener('keydown', (e) => {
    const car = document.getElementById('playerCar');
    if (e.key === 'ArrowLeft' && carX > 20) carX -= 5;
    if (e.key === 'ArrowRight' && carX < 80) carX += 5;
    car.style.left = `${carX}%`;
    playEngineSound();
});
