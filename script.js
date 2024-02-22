const tg = window.Telegram.WebApp;

document.addEventListener("DOMContentLoaded", function () {
    tg.expand();
    tg.ready();
});

window.onload = function() {
    const disabledItems = document.getElementsByClassName("item disabled");
    for(const item of disabledItems) {
        const btn = document.getElementById("btn_" + item.id);
        btn.classList.add("disabled");
        btn.innerHTML = "Недоступно";
        btn.setAttribute("disabled", "true");

        const imgWrapper = document.getElementById("img_wrapper_" + item.id);
        imgWrapper.classList.add("disabled");

        const price = document.getElementById("price_" + item.id);
        price.style.textDecoration = "line-through";
    }

    const color = getComputedStyle(document.documentElement)
                .getPropertyValue('--tg-theme-button-color');
    color = color.trim();
    color = color.substring(1);
  
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
    btn.innerHTML = 1;

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
    
    btn.innerHTML = items.get(item);
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
    
    btn.innerHTML = items.get(item);
    
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
        
        setTimeout(function(){
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
