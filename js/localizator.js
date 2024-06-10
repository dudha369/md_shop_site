const PRICES = {
    // FORTNITE //
    "100VB": 8,
    "1000VB": 170,
    "2800VB": 425,
    "5000VB": 715,
    "13500VB": 1700,
    "PVE": 340,
    "Crew": 130,
    // DISCORD //
    "Nitro_Basic_1month": 70,
    "Nitro_Basic_year": 700,
    "Nitro_1month": 165,
    "Nitro_year": 1550,
    // TELEGRAM //
    "Telegram_Premium_1month": 95,
    "Telegram_Premium_year": 660,
    // SPOTIFY //
    "Spotify_Premium_1month": 100,
    "Spotify_Premium_3month": 265,
    "Spotify_Premium_6month": 520,
    "Spotify_Premium_year": 900
}

const text = {
    "buy": {
        "ru": "Купить",
        "uk": "Придбати",
        "en": "Buy"
    },
    "offer_sum": {
        "ru": "товар на сумму",
        "uk": "товар на суму",
        "en": "goods in the amount of"
    },
    "offers_sum": {
        "ru": "товаров на сумму",
        "uk": "товарів на суму",
        "en": "goods for the amount of"
    },
    "gift_info": {
        "ru": "Чтобы получить подарок, необходимо добавить нашего продавца «MD Shop gifts3» в друзья и подождать минимум двое суток. Это требование Epic Games, без соблюдения которого мы, к сожалению, не сможем отправить Вам подарок",
        "uk": "Щоб отримати подарунок, необхідно додати нашого продавця «MD Shop gifts3» у друзі та почекати мінімум дві доби. Це вимога Epic Games, без дотримання якої ми, на жаль, не зможемо надіслати Вам подарунок",
        "en": "To receive your gift, you need to add our seller «MD Shop gifts3» as a friend and wait at least two days. This is a requirement of Epic Games, without which, unfortunately, we will not be able to send you a gift"
    },
    "1month": {
        "ru": "1 месяц",
        "uk": "1 місяць",
        "en": "1 month",
    },
    "3month": {
        "ru": "3 месяца",
        "uk": "3 місяця",
        "en": "3 month",
    },
    "6month": {
        "ru": "6 месяцов",
        "uk": "6 місяців",
        "en": "6 month",
    },
    "year": {
        "ru": "1 год",
        "uk": "1 рік",
        "en": "1 year",
    },
    "Crew": {
        "ru": "Отряд",
        "uk": "Екіпаж",
        "en": "Crew",
    },
    "100VB": {
        "ru": "Подарок",
        "uk": "Подарунок",
        "en": "Gift",
    }
}

let get_gift_info = () => {tg.showAlert(text["gift_info"][lang])};
