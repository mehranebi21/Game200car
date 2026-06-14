const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TOTAL_GAMES = 200;
const themes = ['Cyberpunk Neon', 'Desert Rally', 'Midnight City', 'Alpine Snow', 'Sunset Highway', 'Alien Planet'];
const carTypes = ['Supercar', 'Muscle Car', 'F1 Jet', 'Cyber Truck', 'Concept Sport'];
const audioFrequencies = [220, 330, 440, 580, 110];

if (!fs.existsSync('dist')) fs.mkdirSync('dist');
let metadataCollection = [];

for (let i = 1; i <= TOTAL_GAMES; i++) {
    const gameId = `game_${String(i).padStart(3, '0')}`;
    const gameName = `Turbo Rush ${themes[i % themes.length]} ${carTypes[i % carTypes.length]}`;
    const packageName = `com.noblegames.turborush.v${i}`;
    
    const gameDir = path.join('dist', gameId);
    if (!fs.existsSync(gameDir)) fs.mkdirSync(gameDir);

    const config = {
        gameId, gameName, packageName,
        theme: themes[i % themes.length],
        carType: carTypes[i % carTypes.length],
        carColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        skyColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        speed: 15 + (i % 10),
        engineSoundFreq: audioFrequencies[i % audioFrequencies.length]
    };

    let gameJsContent = fs.readFileSync('template/game.js', 'utf8');
    gameJsContent = `const CONFIG = ${JSON.stringify(config, null, 2)};\n` + gameJsContent;
    fs.writeFileSync(path.join(gameDir, 'game.js'), gameJsContent);

    let htmlContent = fs.readFileSync('template/index.html', 'utf8');
    htmlContent = htmlContent.replace('{{GAME_NAME}}', gameName);
    fs.writeFileSync(path.join(gameDir, 'index.html'), htmlContent);
    fs.copyFileSync('template/style.css', path.join(gameDir, 'style.css'));

    // ساخت آیکون با فرمت متنی مناسب
    const iconSvg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${config.skyColor}"/><text x="50%" y="55%" font-family="Arial" font-size="50" fill="#fff" text-anchor="middle">${config.carType}</text></svg>`;
    fs.writeFileSync(path.join(gameDir, 'icon.svg'), iconSvg);

    // فشرده‌سازی پوشه بازی به فرمت zip برای ارسال فایل فیزیکی به کاتاپولت
    try {
        execSync(`cd dist && zip -r ${gameId}.zip ${gameId}/*`);
    } catch (e) {
        // اگر سیستم مجهز به zip نبود
    }

    metadataCollection.push({
        gameId,
        name: gameName,
        packageName,
        zipPath: `dist/${gameId}.zip`
    });
}

fs.writeFileSync('dist/games_metadata.json', JSON.stringify(metadataCollection, null, 2));
console.log(`Generated ${TOTAL_GAMES} build packets.`);
