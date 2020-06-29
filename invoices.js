var inv = [{
    "customer": "MDT",
    "performance": [{
            "playId": "Гамлет",
            "audience": 55,
            "type": "tragedy"
        },
        {
            "playId": "Ромео и Джульетта",
            "audience": 35,
            "type": "tragedy"
        },
        {
            "playId": "Отелло",
            "audience": 40,
            "type": "comedy"
        }
    ]
}];


function statement(invoice) {

    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Счет для ${invoice[0].customer}\n`;

    const format = new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 2
    }).format;

    for (let perf of invoice[0].performance) {
        
        // Вывод строки счета
        thisAmount = calcAmount(perf);

        result += ` ${perf.playId}: ${format(thisAmount / 100)}`;
        result += ` (${perf.audience} мест)\n`;
    }

    // Добавление бонусов
    volumeCredits = calcCredits(invoice);
    totalAmount = calcTotal(invoice);

    result += `Итого с вас ${(format(totalAmount/100))}\n`;
    result += `Вы заработали ${volumeCredits} бонусов\n`;

    return result;
}

function calcCredits(invoice) {
    var volumeCredits = invoice[0].performance.reduce(function(creditsAcc, play) {
        return creditsAcc + Math.max(play.audience - 30, 0);
    }, 0);

    var comedyPlays = invoice[0].performance.filter(function(play) {
        return play.type === "comedy";
    });

    var comedyCredits = 0;
    console.log(comedyPlays.length);

    if (comedyPlays.length >= 10) {
        for (i = 9; i < comedyPlays.length; i = i + 10) {
            comedyCredits += Math.floor(comedyPlays[i].audience / 5);
            console.log(comedyCredits); // fix this
        }
    }

    return volumeCredits + comedyCredits;
}

function calcTotal(invoice) {
    var tragedyAmount = invoice[0].performance
        .filter(play => play.type === "tragedy")
        .reduce((amountAcc, play) => {

            if (play.audience <= 30)
                return amountAcc + 40000;
            else
                return amountAcc + 40000 + (1000 * (play.audience - 30));
        }, 0);

    var comedyAmount = invoice[0].performance
        .filter(play => play.type === "comedy")
        .reduce((amountAcc, play) => {

            amountAcc += 30000 + (300 * play.audience);

            if (play.audience > 20)
                amountAcc += (10000 + 500 * (play.audience - 20));

            return amountAcc;
        }, 0);

    return tragedyAmount + comedyAmount;
}

function calcAmount(play)
{
    let amount = 0;

    switch (play.type) {

        case "tragedy":

            amount = 40000;

            if (play.audience > 30) {
                amount += 1000 * (play.audience - 30); 
            }

            break;

        case "comedy":

            amount = 30000 + 300 * play.audience;

            if (play.audience > 20) { 
                amount += 10000 + 500 * (play.audience - 20); 
            }

            break;

        default:
            throw new Error('неизвестный тип: ${play.type}');
    }

    return amount;
}