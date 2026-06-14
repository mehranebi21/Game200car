const fs = require('fs');
const path = require('path');

const TOTAL_GAMES = 200;
const themes = ['Cyberpunk Neon', 'Desert Rally', 'Midnight City', 'Alpine Snow', 'Sunset Highway', 'Alien Planet'];
const carTypes = ['Supercar', 'Muscle Car', 'F1 Jet', 'Cyber Truck', 'Concept Sport'];

if (!fs.existsSync('dist')) fs.mkdirSync('dist');
let metadataCollection = [];

for (let i = 1; i <= TOTAL_GAMES; i++) {
    const gameId = `game_${String(i).padStart(3, '0')}`;
    const gameName = `Turbo Rush ${themes[i % themes.length]} ${carTypes[i % carTypes.length]}`;
    const packageName = `com.noblegames.turborush.v${i}`; // پکیج‌نام کاملاً اختصاصی
    
    metadataCollection.push({
        gameId,
        name: gameName,
        packageName: packageName,
        theme: themes[i % themes.length],
        carColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        skyColor: `#${Math.floor(Math.random()*16777215).toString(16)}`
    });
}

fs.writeFileSync('dist/games_metadata.json', JSON.stringify(metadataCollection, null, 2));
console.log(`Metadata for ${TOTAL_GAMES} Android build configurations created.`);
