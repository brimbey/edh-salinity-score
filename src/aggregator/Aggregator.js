export class Aggregator {
    cardList = [];

    constructor() {
    }

    parseDeckList = async (nodes) => {
        this.cardList = [];

        const cardnameList = [];

        Object.keys(nodes).forEach((cardname) => {
            cardnameList.push(cardname);
        })

        let saltTotal = 0;

        for (let i = 0; i < cardnameList.length; i++) {
            const cardname = cardnameList[i];

            console.log(`CARD NAME :: ${cardname}`);

            let data = await (await fetch(`/api/card?card=${cardname}`)).json();
            console.log(`======> salt :: ${data.salt}`);
            if (data?.salt) {
                this.cardList.push({
                    name: cardname,
                    salt: data.salt,
                });

                saltTotal = saltTotal + parseFloat(data.salt);
            }
        }

        console.log(`SALT TOTAL ${saltTotal}`);

        return saltTotal;
    }
}