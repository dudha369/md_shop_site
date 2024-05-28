const tg = window.Telegram.WebApp;
let items = new Map();

function changeMainButton() {
	let countOfItems = Array.from(items.values())
		.reduce(function (sum, count) {
			return sum + count;
		}, 0) - ((items.get("100VB") === undefined || items.get("100VB") === 0) ? 0 : items.get("100VB") - 1); // 100VBs - one item (gift)
	
	if (countOfItems > 0) {
		let price = Array.from(items.keys())
			.reduce(function (sum, item) {
				return sum + PRICES[item] * items.get(item);
			}, 0);
		if (countOfItems === 1) tg.MainButton.setText(`${text["buy"][lang]} ${text["offer_sum"][lang]} ${price}₴`);
		else tg.MainButton.setText(`${text["buy"][lang]} ${countOfItems} ${text["offers_sum"][lang]} ${price}₴`);
		
		if (!tg.MainButton.isVisible) tg.MainButton.show();
	} else {
		if (tg.MainButton.isVisible) tg.MainButton.hide();
	}
}


Telegram.WebApp.onEvent("mainButtonClicked", function () {
	let res = new Array();
	let re = /_/g;
	for (let [key, value] of items) {
		if (value === 0) {
			continue;
		}
		res.push(`${key.replace(re, " ")} x ${value}`);
	}

	localStorage.setItem('cart', null);

	tg.sendData(res.sort()
		.join(";"));
	tg.close();
});

function buy(item, cart=false) {
	items.set(item, 1);
	localStorage.setItem('cart', JSON.stringify(Array.from(items.entries())));
	
	if (navigator.vibrate && !cart) {
		navigator.vibrate(200);
	}
	
	changeMainButton();
	
	let btn = document.getElementById("btn_" + item);
	let btnMinus = document.getElementById("btn_" + item + "-minus");
	let btnPlus = document.getElementById("btn_" + item + "-plus");
	let img = document.getElementById("img_" + item);
	let price = document.getElementById(`price_${item}`);
	
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

function plus(item, cart=false) {
	items.set(item, items.get(item) + 1);
	localStorage.setItem('cart', JSON.stringify(Array.from(items.entries())));
	
	if (navigator.vibrate && !cart) {
		navigator.vibrate(200);
	}

	changeMainButton();
	
	let btn = document.getElementById("btn_" + item);
	let price = document.getElementById(`price_${item}`);
	
	btn.innerHTML = item === "100VB" ? `${items.get(item) * 100}<img style= "border-radius: 50%;vertical-align: middle;" width="25px" height="25px" src="images/Fortnite/vbucks.webp" alt="VB">` : items.get(item);
	price.innerHTML = `${items.get(item) * PRICES[item]}₴`;
}

function minus(item) {
	if (items.get(item) <= 0) {
		items.set(item, 0);
	} else {
		items.set(item, items.get(item) - 1);
	}
	localStorage.setItem('cart', JSON.stringify(Array.from(items.entries())));
	
	if (navigator.vibrate) {
		navigator.vibrate(200);
	}

	changeMainButton();
	
	let btn = document.getElementById("btn_" + item);
	let btnMinus = document.getElementById("btn_" + item + "-minus");
	let btnPlus = document.getElementById("btn_" + item + "-plus");
	let price = document.getElementById(`price_${item}`);
	
	btn.innerHTML = item === "100VB" ? `${items.get(item) * 100}<img style= "border-radius: 50%;vertical-align: middle;" width="25px" height="25px" src="images/Fortnite/vbucks.webp" alt="VB">` : items.get(item);
	price.innerHTML = `${items.get(item) * PRICES[item]}₴`;
	
	if (items.get(item) === 0) {
		btn.innerHTML = text["buy"][lang];
		
		btnMinus.setAttribute("disabled", "true");
		btnPlus.setAttribute("disabled", "true");
		
		btnMinus.innerHTML = "";
		btnPlus.innerHTML = "";
		
		let img = document.getElementById("img_" + item);
		
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
