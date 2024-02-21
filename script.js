const tg = window.Telegram.WebApp;

document.addEventListener("DOMContentLoaded", function () {
    tg.expand();
    tg.ready();
});

window.onload = function() {
    let color = getComputedStyle(document.documentElement)
                .getPropertyValue('--tg-theme-button-color');
    color = color.trim();
    color = color.substring(1);
  
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);
  
    document.documentElement.style
      .setProperty('--tg-theme-button-color-alpha', 'rgba(' + r + ',' + g + ',' + b + ',0.2)');

      let disabledElements = document.querySelectorAll(".disabled");
      for(let e of disabledElements) {
          e.setAttribute("disabled", "true");
          e.innerHTML = "Недоступно";
      }      
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
    
    try {
        window.navigator.vibrate(25);
    } catch {}
    
    const countOfItems = Array.from(items.values())
        .reduce(function (sum, elem) {
            return sum + elem;
        }, 0);
    tg.MainButton.setText(`Придбати товари(${countOfItems})`);
    if (!tg.MainButton.isVisible) {
        tg.MainButton.show();
    }
    
    const btn = document.getElementById(item);
    const btnMinus = document.getElementById(item + "-minus");
    const btnPlus = document.getElementById(item + "-plus");
    
    if (btn.classList.contains("passive")) {
        btn.classList.remove("passive");
        btnMinus.classList.remove("passive");
        btnPlus.classList.remove("passive");
    }
    btn.classList.add("active");
    btn.setAttribute("disabled", "true");
    btn.style.cursor = "default";
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
    
    try {
        window.navigator.vibrate(25);
    } catch {}
    
    const countOfItems = Array.from(items.values())
        .reduce(function (sum, elem) {
            return sum + elem;
        }, 0);
    tg.MainButton.setText(`Придбати товари(${countOfItems})`);
    
    const btn = document.getElementById(item);
    
    btn.innerHTML = items.get(item);
}

function minus(item) {
    if (items.get(item) <= 0) {
        items.set(item, 0);
    } else {
        items.set(item, items.get(item) - 1);
    }
    
    try {
        window.navigator.vibrate(25);
    } catch {}
    
    const countOfItems = Array.from(items.values())
        .reduce(function (sum, elem) {
            return sum + elem;
        }, 0);
    tg.MainButton.setText(`Придбати товари(${countOfItems})`);
    
    const btn = document.getElementById(item);
    const btnMinus = document.getElementById(item + "-minus");
    const btnPlus = document.getElementById(item + "-plus");
    
    btn.innerHTML = items.get(item);
    
    if (items.get(item) === 0) {
        btn.style.cursor = "pointer";
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
