/**
 * Входные данные о представлениях.
 */
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

/**
 * Объект с функциями для расчета цены на представления разных типов.
 */
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

/**
 * Массив с функциями для расчета бонусов разных типов.
 */
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

/**
 * Расчитывает цены представлений, бонусы и стоимость и создает строку счёта.
 *
 * @param  {Object} invoice - данные о представлениях.
 * @return {string} Строка со счётом.
 */
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

/**
 * Расчитывает бонусы по счёту.
 *
 * @param  {Object} invoice - данные о представлениях.
 * @return {number} Сумма всех типов бонусов.
 */
function calcCredits(invoice) {

    return creditsStrategies
        .reduce((creditAcc, strategy) => creditAcc + strategy(invoice), 0);
}

/**
 * Расчитывает стоимость представлений.
 *
 * @param  {Object} invoice - данные о представлениях.
 * @return {number} Стоимость представлений.
 */
function calcTotal(invoice) {

    let total = invoice.performance
        .reduce((amountAcc, play) => amountAcc + calcAmount(play), 0);

    return total;
}

/**
 * Расчитывает цену представления.
 *
 * @param  {Object} play - данные о представлении.
 * @return {number} Цена представления.
 */
function calcAmount(play) {

    if (!amountStrategies.hasOwnProperty(play.type))
        throw new Error(`неизвестный тип: ${play.type}`);

    return amountStrategies[play.type](play);
}

/**
 * Создает строку счёта.
 *
 * @param  {string} customer - клиент.
 * @param  {Object} plays - данные о представлениях, включающие цену.
 * @param  {number} total - стоимость представлений.
 * @param  {number} credits - начисленные бонусы.
 * @return {number} Строка со счётом.
 */
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

/**
 * Форматирует цену.
 *
 * @param  {number} число.
 * @return {string} отформатированная строка.
 */
const formatPrice = new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 2
}).format;

// Вывод счёта
inv.forEach(invoice => console.log(statement(invoice)));