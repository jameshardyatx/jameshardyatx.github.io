const charScoreInput = document.querySelector('.charScore');
const profBonusInput = document.querySelector('.profBonus');
const isProfInput = document.querySelector('.isProf');
const rarityInput = document.querySelector('.rarity');
const rollButton = document.querySelector('.rollButton');
const diceText = document.querySelector('.rollResult');
const preTotalText = document.querySelector('.preTotal');
const totalGPText = document.querySelector('.totalGP');

const commonCost = [50, 100];
const uncommonCost = [101, 500];
const rareCost = [501, 5000];
const veryrareCost = [5001, 50000];

const commonDC = 16;
const uncommonDC = 18;
const rareDC = 22;
const veryrareDC = 26;

rollButton.addEventListener("click", getData);

function diceRoll() {
    let result = Math.floor(Math.random() * 20) + 1;
    return result;
}

function randomCost(lower, upper) {
    let randomInRange = Math.floor(Math.random() * (upper - lower)) + lower;
    
    return randomInRange;
}

function getData() {
    let profMod = profBonusInput.value;
    let charScore = charScoreInput.value;
    if(!isProfInput.checked) {
        profMod = 0;
    }
    let rarity = rarityInput.value;
    
    let lowerCost = 50;
    let upperCost = 100;
    let DC = 12;

    let charMod = Math.floor((charScore - 10) / 2);

    let dice = diceRoll();

    switch(rarity) {
        case '1':
            lowerCost = commonCost[0];
            upperCost = commonCost[1];
            DC = commonDC;
            break;
        case '2':
            lowerCost = uncommonCost[0];
            upperCost = uncommonCost[1];
            DC = uncommonDC;
            break;
        case '3':
            lowerCost = rareCost[0];
            upperCost = rareCost[1];
            DC = rareDC;
            break;
        case '4':
            lowerCost = veryrareCost[0];
            upperCost = veryrareCost[1];
            DC = veryrareDC;
            break;
        default: 
            console.log("How did we get here?");
            lowerCost = 0;
            upperCost = 0;
            DC = 99;
            break;
    }

    let itemPrice = randomCost(lowerCost, upperCost);

    let discountPrice = checkPass(dice, charMod, profMod, DC, itemPrice);

    displayRollResults(dice, profMod, charMod);

    displayCost(itemPrice, discountPrice);
}

function checkPass(dice, char, prof, DC, price) {
    let discountPrice = price;

    let check = parseInt(dice) + parseInt(char) + parseInt(prof);
    console.log(check);
    
    if(check > DC + 6) {
        discountPrice = Math.floor(discountPrice * .65);
    }
    else if(check > DC + 4) {
        discountPrice = Math.floor(discountPrice * .7);
    }
    else if(check > DC + 2 ) {
        discountPrice = Math.floor(discountPrice * .8);
    }
    else if(check >= DC) {
        discountPrice = Math.floor(discountPrice * .9);
    }

    return discountPrice;
}

function displayRollResults(dice, prof, char) {
    let finalRoll = parseInt(dice) + parseInt(prof) + parseInt(char);

    diceText.textContent = dice + " + " + prof + " + " + char + " = " + finalRoll;
}

function displayCost(preTotal, cost) {
    preTotalText.textContent = preTotal + " GP.";
    totalGPText.textContent = cost + " GP.";
}
