const fs = require('fs');
const path = require('path');

const TOTAL_GAMES = 200;

// دیتاست برای تنوع‌بخشی به ۲۰۰ بازی (بدون شباهت به آتاری)
const themes = ['Cyberpunk Neon', 'Desert Rally', 'Midnight City', 'Alpine Snow', 'Sunset Highway', 'Alien Planet'];
const carTypes = ['Supercar', 'Muscle Car', 'F1 Jet', 'Cyber Truck', 'Concept Sport'];
const audioFrequencies = [220, 330, 440, 580, 110]; // فرکانس‌های مختلف برای صدای موتور سینتی‌سایزر

if (!fs.existsSync('dist')) fs.mkdirSync('dist');

let metadataCollection = [];

for (let i = 1; i <= TOTAL_GAMES; i++) {
    const gameId = `game_${String(i).padStart(3, '0')}`;
    const gameName = `Turbo Rush ${themes[i % themes.length]} ${carTypes[i % carTypes.length]}`;
    const packageName = `com.noblegames.turborush.v${i}`; // پکیج‌نام اختصاصی برای حل مشکل آپتوید
    
    const gameDir = path.join('dist', gameId);
    if (!fs.existsSync(gameDir)) fs.mkdirSync(gameDir);

    // ویژگی‌های اختصاصی هر بازی
    const config = {
        gameId,
        gameName,
        packageName,
        theme: themes[i % themes.length],
        carType: carTypes[i % carTypes.length],
        carColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        skyColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        speed: 15 + (i % 10),
        engineSoundFreq: audioFrequencies[i % audioFrequencies.length]
    };

    // ۱. کپی و شخصی‌سازی فایل منطق بازی (game.js)
    let gameJsContent = fs.readFileSync('template/game.js', 'utf8');
    gameJsContent = `const CONFIG = ${JSON.stringify(config, null, 2)};\n` + gameJsContent;
    fs.writeFileSync(path.join(gameDir, 'game.js'), gameJsContent);

    // ۲. کپی قالب HTML و CSS
    let htmlContent = fs.readFileSync('template/index.html', 'utf8');
    htmlContent = htmlContent.replace('{{GAME_NAME}}', gameName);
    fs.writeFileSync(path.join(gameDir, 'index.html'), htmlContent);
    fs.copyFileSync('template/style.css', path.join(gameDir, 'style.css'));

    // ۳. ایجاد آیکون اختصاصی و شیک با SVG (بدون نیاز به لایبرری سنگین لینوکس)
    const iconSvg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${config.skyColor}"/>
        <circle cx="256" cy="256" r="200" fill="${config.carColor}" opacity="0.8"/>
        <text x="50%" y="55%" font-family="Arial" font-size="42" font-weight="bold" fill="#fff" text-anchor="middle">${config.carType}</text>
    </svg>`;
    fs.writeFileSync(path.join(gameDir, 'icon.svg'), iconSvg);

    // ۴. ساخت اسکرین‌شات‌های شبیه‌سازی شده برای پنل مارکت
    const screenshots = [];
    for(let s=1; s<=3; s++) {
        const screenshotSvg = `<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#111"/>
            <text x="50%" y="50%" font-family="Sans" font-size="48" fill="#fff" text-anchor="middle">${gameName} - Gameplay ${s}</text>
        </svg>`;
        const screenPath = `screenshot_${s}.svg`;
        fs.writeFileSync(path.join(gameDir, screenPath), screenshotSvg);
        screenshots.push(screenPath);
    }

    metadataCollection.push({
        gameId,
        name: gameName,
        packageName,
        icon: 'icon.svg',
        screenshots
    });
}

// ذخیره فایل نهایی متاداتا برای مدیریت یا استفاده در کاتاپولت/آپتوید
fs.writeFileSync('dist/games_metadata.json', JSON.stringify(metadataCollection, null, 2));
console.log(`Successfully generated ${TOTAL_GAMES} unique games in /dist!`);
