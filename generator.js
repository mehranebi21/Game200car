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
    const packageName = `com.noblegames.turborush.v${i}`; // پکیج‌نام کاملاً اختصاصی برای باز شدن قفل پنل
    
    metadataCollection.push({
        gameId,
        name: gameName,
        packageName: packageName,
        description: `High performance 3D racing game featuring ${themes[i % themes.length]} environment and ${carTypes[i % carTypes.length]} physics. Smooth vector aesthetics.`
    });
}

fs.writeFileSync('dist/games_metadata.json', JSON.stringify(metadataCollection, null, 2));
console.log(`Generated metadata for ${TOTAL_GAMES} apps.`);
