const tg = window.Telegram.WebApp;
const PRICES = {
    // FORTNITE 
    "100VB": 8,
    "Crew": 130,
    "1000VB": 170,
    "2800VB": 425,
    "5000VB": 715,
    "13500VB": 1700,
    "PVE": 340,
    "Starter_Pack": 85,
    // DISCORD 
    "Nitro_Basic_month": 70,
    "Nitro_Basic_year": 700,
    "Nitro_month": 165,
    "Nitro_year": 1550,
    // TELEGRAM 
    "Telegram_Premium_month": 95,
    "Telegram_Premium_year": 660,
    // SPOTIFY 
    "Spotify_Premium_month": 100,
    "Spotify_Premium_3month": 265,
    "Spotify_Premium_6month": 520,
    "Spotify_Premium_year": 900,
    // TWITCH SUB
};
let items = new Map();

document.addEventListener("DOMContentLoaded", function () {
    const prices = document.getElementsByClassName("price");
    for (const item of prices) {
        item.innerHTML = `${PRICES[item.id.slice(6)]}₴`;
    }

    // if(window.innerWidth>1400) document.querySelector(".tent").style.display = "none";

    const bgColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--tg-theme-bg-color')
        .trim()
        .substring(1);

    if (bgColor === '') {
        document.documentElement.style
            .setProperty('--tg-theme-bg-color', 'black');
        document.documentElement.style
            .setProperty('--tg-theme-button-color', 'blue');
        document.documentElement.style
            .setProperty('--tg-theme-button-text-color', 'white');
        document.documentElement.style
            .setProperty('--tg-theme-link-color', 'lightblue');
        document.documentElement.style
            .setProperty('--tg-theme-text-color', 'white');
    }

    if (1 - (0.299 * parseInt(bgColor.substring(0, 2), 16) + 0.587 * parseInt(bgColor.substring(2, 4), 16) + 0.114 * parseInt(bgColor.substring(4, 6), 16)) / 255 < 0.5) {
        document.documentElement.style
            .setProperty('--invert-to-black', '100%');
    } else {
        document.documentElement.style
            .setProperty('--tg-theme-bg-color-alpha', '0');
    }

    const buttonColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--tg-theme-button-color')
        .trim()
        .substring(1);

    document.documentElement.style.setProperty('--tg-theme-button-color-alpha', `rgba(${buttonColor.substring(0, 2)}, ${buttonColor.substring(2, 4)}, ${buttonColor.substring(4, 6)}, 0.2)`);

});

window.onload = function () {
    tg.ready();
    tg.expand();
    
    const disabledItems = document.getElementsByClassName("item disabled");
    for (const item of disabledItems) {
        const btn = document.getElementById("btn_" + item.id);
        btn.setAttribute("disabled", "true");
        btn.innerHTML = "Недоступно";
    
        const price = document.getElementById("price_" + item.id);
        price.style.display = "none";
        
        const imgWrapper = document.getElementById("img_wrapper_" + item.id);
        const img = document.getElementById("img_" + item.id);
    
        const w = (img.offsetWidth - 4.8) / 2; // border 4.8
        const h = (img.offsetHeight - 4.8) / 2; // border 4.8
        const d = Math.round(Math.sqrt(h * w * 2) * 2);
    
        const angle = Math.round(Math.atan(h / w) * (180 / Math.PI));
    
        const closestHeight = (g) => Array(105, 100, 80, 75)
            .reduce((p, c) => Math.abs(c - g) < Math.abs(p - g) ? c : p);
    
        let leftPosition = new Map();
        leftPosition.set(105, -48);
        leftPosition.set(100, -44);
        leftPosition.set(80, 0);
        leftPosition.set(75, -28);
    
        const cross = document.createElement("style");
        cross.innerHTML = `
#img_wrapper_${item.id}, #btn_${item.id} {
    cursor: not-allowed;
}
    
#img_${item.id} {
    border: solid red;
}
    
#btn_${item.id} {
    background-color: red;
}
    
#price_${item.id} {
    text-decoration: line-throught;
}
    
#img_wrapper_${item.id}::before, #img_wrapper_${item.id}::after {
    content: "";
    position: absolute;
    top: 47.9%;
    left: ${leftPosition.get(closestHeight(h))}px;
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
};

function gift_info() {
    try {
        tg.showAlert('Щоб отримати подарунок, необхідно додати нашого продавця „MD Shop 100VBs3“ у друзі та почекати мінімум дві доби. Це вимога Epic Games, без дотримання якої ми, на жаль, не зможемо надіслати Вам подарунок');
    }
    catch {
        alert('Щоб отримати подарунок, необхідно додати нашого продавця „MD Shop 100VBs3“ у друзі та почекати мінімум дві доби. Це вимога Epic Games, без дотримання якої ми, на жаль, не зможемо надіслати Вам подарунок');
    }
}

function changeMainButton() {
    const countOfItems = Array.from(items.values())
        .reduce(function (sum, count) {
            return sum + count;
        }, 0) - (items.get("100VB") === undefined ? 0 : items.get("100VB") - 1);

    if(countOfItems > 0){
        const price = Array.from(items.keys())
        .reduce(function (sum, item) {
            return sum + PRICES[item] * items.get(item);
        }, 0);
        if(countOfItems === 1) tg.MainButton.setText(`Придбати товар на суму ${price}₴`);
        else tg.MainButton.setText(`Придбати ${countOfItems} товарів на суму ${price}₴`);

        if(!tg.MainButton.isVisible) tg.MainButton.show();
    } 
    else {
        if(tg.MainButton.isVisible) tg.MainButton.hide();
    }
}


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

    changeMainButton();

    const btn = document.getElementById("btn_" + item);
    const btnMinus = document.getElementById("btn_" + item + "-minus");
    const btnPlus = document.getElementById("btn_" + item + "-plus");
    const img = document.getElementById("img_" + item);
    const price = document.getElementById(`price_${item}`);

    if (btn.classList.contains("passive")) {
        btn.classList.remove("passive");
        btnMinus.classList.remove("passive");
        btnPlus.classList.remove("passive");
        img.classList.remove("passive");
    }
    btn.classList.add("active");
    btn.setAttribute("disabled", "true");
    btn.innerHTML = item === "100VB" ? `${items.get(item) * 100}<img class="VB" src="images/Fortnite/vbucks.webp" alt="VB" title="VB">` : items.get(item);
    price.innerHTML = `${PRICES[item]}₴`;

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
    
    changeMainButton();
    
    const btn = document.getElementById("btn_" + item);
    const price = document.getElementById(`price_${item}`);

    btn.innerHTML = item === "100VB" ? `${items.get(item) * 100}<img style= "border-radius: 50%;vertical-align: middle;" width="25px" height="25px" src="images/Fortnite/vbucks.webp" alt="VB">` : items.get(item);
    price.innerHTML = `${items.get(item) * PRICES[item]}₴`;
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

    changeMainButton();

    const btn = document.getElementById("btn_" + item);
    const btnMinus = document.getElementById("btn_" + item + "-minus");
    const btnPlus = document.getElementById("btn_" + item + "-plus");
    const price = document.getElementById(`price_${item}`);

    btn.innerHTML = item === "100VB" ? `${items.get(item) * 100}<img style= "border-radius: 50%;vertical-align: middle;" width="25px" height="25px" src="images/Fortnite/vbucks.webp" alt="VB">` : items.get(item);
    price.innerHTML = `${items.get(item) * PRICES[item]}₴`;

    if (items.get(item) === 0) {
        btn.innerHTML = "Придбати";

        btnMinus.setAttribute("disabled", "true");
        btnPlus.setAttribute("disabled", "true");

        btnMinus.innerHTML = "";
        btnPlus.innerHTML = "";

        const img = document.getElementById("img_" + item);

        btn.classList.remove("active");
        btn.classList.add("passive");
        btnMinus.classList.remove("active");
        btnMinus.classList.add("passive");
        btnPlus.classList.remove("active");
        btnPlus.classList.add("passive");
        img.classList.remove("active");
        img.classList.add("passive");
        price.innerHTML = `${PRICES[item]}₴`;

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
