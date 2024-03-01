const tg = window.Telegram.WebApp;

document.addEventListener("DOMContentLoaded", function () {
    tg.expand();
    tg.ready();
});

const PRICES = {
    // FORTNITE
    "100VB": 16,
    "1000VB": 90,
    "2800VB": 200,
    "5000VB": 300,
    "13500VB": 550,
    "PVE": 190,
    "Starter_Pack": 70,
    "Crew": 170,
    "Battle_Pass": 85,
    // DISCORD
    "Nitro_Basic_month": 50,
    "Nitro_Basic_year": 150,
    "Nitro_month": 100,
    "Nitro_year": 600,
    // TELEGRAM
    "Telegram_Premium_month": 85,
    "Telegram_Premium_year": 630,
    // SPOTIFY
    "Spotify_Premium_month": 85,
    "Spotify_Premium_3month": 260,
    "Spotify_Premium_6month": 500,
    "Spotify_Premium_year": 800,
    // TWITCH SUB
};


window.onload = function () {
    const prices = document.getElementsByClassName("price");
    for(const item of prices) {
        item.innerHTML = `${PRICES[item.id.slice(6)]}₴`;
    }


    const disabledItems = document.getElementsByClassName("item disabled");
    for (const item of disabledItems) {
        const btn = document.getElementById("btn_" + item.id);
        btn.setAttribute("disabled", "true");
        btn.innerHTML = "Недоступно";
        btn.classList.add("disabled");
        
        const price = document.getElementById("price_" + item.id);
        price.style.textDecoration = "line-through";
        
        const imgWrapper = document.getElementById("img_wrapper_" + item.id);

        const w = imgWrapper.offsetWidth / 2;
        const h = (imgWrapper.offsetHeight - 4) / 2;
        const d = Math.round(Math.sqrt(h * w * 2) * 2) - 4;

        const angle = Math.round(Math.atan(h / w) * (180 / Math.PI));

        const leftPosition = h === 100 ? -45 : h === 75 ? -28 : -8;
    
        const cross = document.createElement("style");
        cross.innerHTML = `
#img_wrapper_${item.id}::before, #img_wrapper_${item.id}::after {
    content: "";
    position: absolute;
    top: 48.5%;
    left: ${leftPosition}px;
    width: ${d}px;
    height: 3px;
    background: red;
}

#img_wrapper_${item.id}::before {
    transform: rotate(${angle}deg);
}

#img_wrapper_${item.id}::after {
    transform: rotate(-${angle}deg);
}
`;

        imgWrapper.appendChild(cross);

    }


    const buttonColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--tg-theme-button-color')
        .trim()
        .substring(1);

    let r = parseInt(buttonColor.substring(0, 2), 16);
    let g = parseInt(buttonColor.substring(2, 4), 16);
    let b = parseInt(buttonColor.substring(4, 6), 16);

    document.documentElement.style
        .setProperty('--tg-theme-button-color-alpha', 'rgba(' + r + ', ' + g + ', ' + b + ', 0.2)');

    const bgColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--tg-theme-bg-color')
        .trim()
        .substring(1);

    r = parseInt(bgColor.substring(0, 2), 16);
    g = parseInt(bgColor.substring(2, 4), 16);
    b = parseInt(bgColor.substring(4, 6), 16);

    if (1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5){
    document.documentElement.style
    .setProperty('--invert-to-black', '100%');
    }
    else{
    document.documentElement.style
    .setProperty('--tg-theme-bg-color-alpha', '0');
    }
};

let items = new Map();

Telegram.WebApp.onEvent("mainButtonClicked", function () {
    let res = new Array();
    const re = /_/g;
    for (const [key, value] of items) {
        if (value === 0) {
            continue;
        }
        res.push(`${key.replace(re, " ")} x ${value}`);
    }
    tg.sendData(res.sort()
        .join(";"));
    tg.close();
});

function buy(item) {
    items.set(item, 1);

    if (navigator.vibrate) {
        navigator.vibrate(200);
    } else {}
    
    const countOfItems = Array.from(items.values())
        .reduce(function (sum, elem) {
            return sum + elem;
        }, 0);
    tg.MainButton.setText(`Придбати товари(${countOfItems})`);
    if (!tg.MainButton.isVisible) {
        tg.MainButton.show();
    }

    const btn = document.getElementById("btn_" + item);
    const btnMinus = document.getElementById("btn_" + item + "-minus");
    const btnPlus = document.getElementById("btn_" + item + "-plus");
    const img = document.getElementById("img_wrapper_" + item);
    
    if (btn.classList.contains("passive")) {
        btn.classList.remove("passive");
        btnMinus.classList.remove("passive");
        btnPlus.classList.remove("passive");
        img.classList.remove("passive");
    }
    btn.classList.add("active");
    btn.setAttribute("disabled", "true");
    btn.innerHTML = item==="100VB" ? `${items.get(item) * 100}<img style= "border-radius: 50%;vertical-align: middle;" width="25px" height="25px" src="images/Fortnite/vbucks.webp" alt="VB">` : items.get(item);
    if(item === "100VB") {
        const price = document.getElementById(`price_${item}`);
        price.innerHTML = "16₴";
    }

    btnMinus.style.display = "block";
    btnMinus.classList.add("active");
    btnPlus.style.display = "block";
    btnPlus.classList.add("active");
    img.classList.add("active");
    
    btnMinus.innerHTML = "-";
    btnPlus.innerHTML = "+";
}

function plus(item) {
    items.set(item, items.get(item) + 1);
    
    if (navigator.vibrate) {
        navigator.vibrate(200);
    } else {}
    
    const countOfItems = Array.from(items.values())
        .reduce(function (sum, elem) {
            return sum + elem;
        }, 0);
    tg.MainButton.setText(`Придбати товари(${countOfItems})`);
    
    const btn = document.getElementById("btn_" + item);
    
    btn.innerHTML = item==="100VB" ? `${items.get(item) * 100}<img style= "border-radius: 50%;vertical-align: middle;" width="25px" height="25px" src="images/Fortnite/vbucks.webp" alt="VB">` : items.get(item);
    if(item === "100VB") {
        const price = document.getElementById(`price_${item}`);
        price.innerHTML = `${items.get(item) * 16}₴`;
    }
}

function minus(item) {
    if (items.get(item) <= 0) {
        items.set(item, 0);
    } else {
        items.set(item, items.get(item) - 1);
    }
    
    if (navigator.vibrate) {
        navigator.vibrate(200);
    } else {}
    
    const countOfItems = Array.from(items.values())
        .reduce(function (sum, elem) {
            return sum + elem;
        }, 0);
    tg.MainButton.setText(`Придбати товари(${countOfItems})`);
    
    const btn = document.getElementById("btn_" + item);
    const btnMinus = document.getElementById("btn_" + item + "-minus");
    const btnPlus = document.getElementById("btn_" + item + "-plus");
    
    btn.innerHTML = item==="100VB" ? `${items.get(item) * 100}<img style= "border-radius: 50%;vertical-align: middle;" width="25px" height="25px" src="images/Fortnite/vbucks.webp" alt="VB">` : items.get(item);
    if(item === "100VB") {
        const price = document.getElementById(`price_${item}`);
        price.innerHTML = `${items.get(item) * 16}₴`;
    }
    
    if (items.get(item) === 0) {
        btn.innerHTML = "Придбати";
        
        btnMinus.setAttribute("disabled", "true");
        btnPlus.setAttribute("disabled", "true");
        
        btnMinus.innerHTML = "";
        btnPlus.innerHTML = "";

        const img = document.getElementById("img_wrapper_" + item);
        
        btn.classList.remove("active");
        btn.classList.add("passive");
        btnMinus.classList.remove("active");
        btnMinus.classList.add("passive");
        btnPlus.classList.remove("active");
        btnPlus.classList.add("passive");
        img.classList.remove("active");
        img.classList.add("passive")
        
        setTimeout(function () {
            btn.removeAttribute("disabled");
            btnMinus.removeAttribute("disabled");
            btnPlus.removeAttribute("disabled");
            btnPlus.style.display = "none";
            btnMinus.style.display = "none";
        }, 750);
        
        if (Array.from(items.values())
            .every(value => value === 0)) {
            tg.MainButton.hide();
        }
    }
}
