var inv = [ 
    { 
        "customer": "MDT",
        "performance": [
            {
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
    }
];


function statement(invoice) {

    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Счет для ${invoice[0].customer}\n`;

    const format = new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 2
    }).format;

    console.log(invoice[0].performance);

    for (let perf of invoice[0].performance) {
                
        let thisAmount = 0;

        switch (perf.type) {

            case "tragedy":
                thisAmount = 40000;
                if (perf.audience > 30) {
                    thisAmount += 1000 * (perf.audience - 30);
                }
                break;

            case "comedy":
                thisAmount = 30000;

                if (perf.audience > 20) {
                    thisAmount += 10000 + 500 * (perf.audience - 20);
                }
                thisAmount += 300 * perf.audience;
                break;
                
            default:
                throw new Error(`неизвестный тип: ${perf.type}`);
        }
        
        // Добавление бонусов
        volumeCredits += Math.max(perf.audience - 30, 0);
        // Дополнительный бонус за каждые 10 комедий
        if ("comedy" === perf.type) volumeCredits += Math.floor(perf.audience / 5);
        // Вывод строки счета
        result += ` ${perf.playId}: ${format(thisAmount / 100)}`;
        result += ` (${perf.audience} мест)\n`;
        totalAmount += thisAmount;
              
    }

    result += `Итого с вас ${(format(totalAmount/100))}\n`;
    result += `Вы заработали ${volumeCredits} бонусов\n`; 

    return result;
}