const tg = window.Telegram.WebApp;

document.addEventListener("DOMContentLoaded", function () {
    tg.expand();
    tg.ready();
});

window.onload = function () {
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

        const leftPosition = w === 75 && h === 100 ? -46 : -28;
    
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

    const color = getComputedStyle(document.documentElement)
        .getPropertyValue('--tg-theme-button-color')
        .trim()
        .substring(1);

    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    document.documentElement.style
        .setProperty('--tg-theme-button-color-alpha', 'rgba(' + r + ', ' + g + ', ' + b + ', 0.2)');
};

let items = new Map();

Telegram.WebApp.onEvent("mainButtonClicked", function () {
    let res = new Array();
    for (const [key, value] of items) {
        if (value === 0) {
            continue;
        }
        res.push(`${key} x ${value}`);
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
    
    if (btn.classList.contains("passive")) {
        btn.classList.remove("passive");
        btnMinus.classList.remove("passive");
        btnPlus.classList.remove("passive");
    }
    btn.classList.add("active");
    btn.setAttribute("disabled", "true");
    btn.innerHTML = item==="100VB" ? `${items.get(item) * 100}<img style= "border-radius: 50%;vertical-align: middle;" width="25px" height="25px" src="images/Fortnite/vbucks.webp" alt="VB">` : items.get(item);
    if(item === "100VB") {
        const price = document.getElementById(`price_${item}`);
        price.innerHTML = "12₴";
    }

    btnMinus.style.display = "block";
    btnMinus.classList.add("active");
    btnPlus.style.display = "block";
    btnPlus.classList.add("active");
    
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
        price.innerHTML = `${items.get(item) * 12}₴`;
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
        price.innerHTML = `${items.get(item)*12}₴`;
    }
    
    if (items.get(item) === 0) {
        btn.innerHTML = "Придбати";
        
        btnMinus.setAttribute("disabled", "true");
        btnPlus.setAttribute("disabled", "true");
        
        btnMinus.innerHTML = "";
        btnPlus.innerHTML = "";
        
        btn.classList.remove("active");
        btn.classList.add("passive");
        btnMinus.classList.remove("active");
        btnMinus.classList.add("passive");
        btnPlus.classList.remove("active");
        btnPlus.classList.add("passive");
        
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
