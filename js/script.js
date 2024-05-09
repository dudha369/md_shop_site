document.addEventListener("DOMContentLoaded", function () {
	let prices = document.getElementsByClassName("price");
	for (let item of prices) {
		item.innerHTML = `${PRICES[item.id.slice(6)]}₴`;
	}
	
	// if(window.innerWidth>1400) document.querySelector(".tent").style.display = "none";
	
	let bgColor = getComputedStyle(document.documentElement)
		.getPropertyValue('--tg-theme-bg-color')
		.trim();
	
	if (bgColor === '') {
		document.documentElement.style
			.setProperty('--tg-theme-bg-color', '#000000');
		document.documentElement.style
			.setProperty('--tg-theme-button-color', '#3388ff');
		document.documentElement.style
			.setProperty('--tg-theme-button-text-color', '#ffffff');
		document.documentElement.style
			.setProperty('--tg-theme-link-color', 'lightblue');
		document.documentElement.style
			.setProperty('--tg-theme-text-color', '#f5f5f5');
	}
	
	if (1 - (0.299 * parseInt(bgColor.substring(0, 2), 16) + 0.587 * parseInt(bgColor.substring(2, 4), 16) + 0.114 * parseInt(bgColor.substring(4, 6), 16)) / 255 < 0.5) {
		document.documentElement.style
			.setProperty('--invert-to-black', '100%');
	} else {
		document.documentElement.style
			.setProperty('--tg-theme-bg-color-alpha', '0');
	}
	
	let buttonColor = getComputedStyle(document.documentElement)
		.getPropertyValue('--tg-theme-button-color')
		.trim()
		.substring(1);
	
	document.documentElement.style.setProperty('--tg-theme-button-color-alpha', `rgba(${buttonColor.substring(0, 2)}, ${buttonColor.substring(2, 4)}, ${buttonColor.substring(4, 6)}, 0.2)`);
	
});

function gift_info() {
	try {
		tg.showAlert('Щоб отримати подарунок, необхідно додати нашого продавця „MD Shop gifts3“ у друзі та почекати мінімум дві доби. Це вимога Epic Games, без дотримання якої ми, на жаль, не зможемо надіслати Вам подарунок');
	} catch {
		alert('Щоб отримати подарунок, необхідно додати нашого продавця „MD Shop gifts3“ у друзі та почекати мінімум дві доби. Це вимога Epic Games, без дотримання якої ми, на жаль, не зможемо надіслати Вам подарунок');
	}
}

window.onload = function () {
	tg.ready();
	tg.expand();
	
	let disabledItems = document.getElementsByClassName("item disabled");
	for (let item of disabledItems) {
		let btn = document.getElementById("btn_" + item.id);
		btn.setAttribute("disabled", "true");
		btn.innerHTML = "Недоступно";
		
		let price = document.getElementById("price_" + item.id);
		price.style.display = "none";
	}
};