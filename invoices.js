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

var amountStrategies = {
    tragedy: play => {

        let amount = 40000;

        if (play.audience > 30) {
            amount += 1000 * (play.audience - 30);
        }
        return amount;
    },
    comedy: play => {

        let amount = 30000 + 300 * play.audience;

        if (play.audience > 20) {
            amount += 10000 + 500 * (play.audience - 20);
        }
        return amount;
    }
};

var creditsStrategies = [
    invoice => {

        var comedyPlays = invoice.performance
        .filter(play => play.type === "comedy");

        let comedyCredits = 0;

        if (comedyPlays.length >= 10) {
            for (i = 9; i < comedyPlays.length; i = i + 10) {
                comedyCredits += Math.floor(comedyPlays[i].audience / 5);
            }
        }

        return comedyCredits;
    },
    invoice => invoice.performance
        .reduce((creditsAcc, play) => creditsAcc + Math.max(play.audience - 30, 0), 0)   
];

function statement(invoice) {

    let credits = calcCredits(invoice);
    let total = calcTotal(invoice);

    let plays = invoice.performance.map(play => ({
        playId: play.playId,
        audience: play.audience,
        amount: calcAmount(play)
    }));

    return makeInvoice(invoice.customer, plays, total, credits);
}

function calcCredits(invoice) {

    return creditsStrategies
        .reduce((creditAcc, strategy) => creditAcc + strategy(invoice), 0);
}

function calcTotal(invoice) {

    let total = invoice.performance
        .reduce((amountAcc, play) => amountAcc + amountStrategies[play.type](play), 0);

    return total;
}

function calcAmount(play) {

    if (!amountStrategies.hasOwnProperty(play.type))
        throw new Error('неизвестный тип: ${play.type}');

    return amountStrategies[play.type](play);
}

function makeInvoice(customer, plays, total, credits)
{
    let result = `Счет для ${customer}\n`;

    plays.reduce((acc, play) => {
        result += ` ${play.playId}: ${formatPrice(play.amount / 100)}`;
        result += ` (${play.audience} мест)\n`;
    }, result);

    result += `Итого с вас ${(formatPrice(total / 100))}\n`;
    result += `Вы заработали ${credits} бонусов\n`;

    return result;
}

const formatPrice = new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 2
}).format;

inv.forEach(invoice => console.log(statement(invoice)));