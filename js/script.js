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

document.addEventListener("DOMContentLoaded", function () {
	const prices = document.getElementsByClassName("price");
	for (const item of prices) {
		item.innerHTML = `${PRICES[item.id.slice(6)]}₴`;
	}
	
	// if(window.innerWidth>1400) document.querySelector(".tent").style.display = "none";
	
	const bgColor = getComputedStyle(document.documentElement)
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
	
	const buttonColor = getComputedStyle(document.documentElement)
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
	
	const disabledItems = document.getElementsByClassName("item disabled");
	for (const item of disabledItems) {
		const btn = document.getElementById("btn_" + item.id);
		btn.setAttribute("disabled", "true");
		btn.innerHTML = "Недоступно";
		
		const price = document.getElementById("price_" + item.id);
		price.style.display = "none";
	}
};
