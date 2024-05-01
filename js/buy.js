const tg = window.Telegram.WebApp;
const PRICES = {
	// FORTNITE 
	"100VB": 8
	, "Crew": 130
	, "1000VB": 170
	, "2800VB": 425
	, "5000VB": 715
	, "13500VB": 1700
	, "PVE": 340
	, "Starter_Pack": 85,
	// DISCORD 
	"Nitro_Basic_month": 70
	, "Nitro_Basic_year": 700
	, "Nitro_month": 165
	, "Nitro_year": 1550,
	// TELEGRAM 
	"Telegram_Premium_month": 95
	, "Telegram_Premium_year": 660,
	// SPOTIFY 
	"Spotify_Premium_month": 100
	, "Spotify_Premium_3month": 265
	, "Spotify_Premium_6month": 520
	, "Spotify_Premium_year": 900,
	// TWITCH SUB
};
let items = new Map();

function changeMainButton() {
	const countOfItems = Array.from(items.values())
		.reduce(function (sum, count) {
			return sum + count;
		}, 0) - ((items.get("100VB") === undefined || items.get("100VB") === 0) ? 0 : items.get("100VB") - 1); // 100VBs - one item
	
	if (countOfItems > 0) {
		const price = Array.from(items.keys())
			.reduce(function (sum, item) {
				return sum + PRICES[item] * items.get(item);
			}, 0);
		if (countOfItems === 1) tg.MainButton.setText(`Придбати товар на суму ${price}₴`);
		else tg.MainButton.setText(`Придбати ${countOfItems} товарів на суму ${price}₴`);
		
		if (!tg.MainButton.isVisible) tg.MainButton.show();
	} else {
		if (tg.MainButton.isVisible) tg.MainButton.hide();
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
