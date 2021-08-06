const loanValueElement = document.getElementById("loanValue");
const loanButtonElement = document.getElementById("loanButton");
const currencyElement = document.getElementById("currency");
const bankButtonElement = document.getElementById("bankButton");
const workButtonElement = document.getElementById("workButton");
const payElement = document.getElementById("payAmount");
const laptopsElement = document.getElementById("laptops");
const repayButtonElement = document.getElementById("repayButton");
const laptopPriceElement = document.getElementById("price");
const laptopDescriptionElement = document.getElementById("description");
const laptopTitleElement = document.getElementById("title");
const laptopSpecsElement = document.getElementById("specs");
const buyButtonElement = document.getElementById("buyButton");
const buyLaptopElement = document.getElementById("buyLaptop");

/**
 * Images from API
 */
const myImage = document.getElementById('image');
const url = "https://noroff-komputer-store-api.herokuapp.com/"

/**
 * Variables for the basic logic. I.e, how much you have worked which is the total pay, your currency and the loan amount.
 */
let currency = 200;
let totalPay = 0;
let totalLoans = 0;
let loanAmount = 0;
let laptops = [];
let laptopPrice = 0;
let laptopTitle;

/**
 * Adding a new loan function. If statement to validate that total loans is 0, which is a requirement for taking loan, 
 * and the amount is not over currenct times two.
 * If the loan is valid, a repay button will appear on the webpage. 
 */
const addNewLoan = () => {
    loanAmount = parseInt(prompt("Please enter how much you would like to loan:"));
    if (loanAmount <= parseInt(currency * 2) && totalLoans === 0) {
        totalLoans = 1;
        currency = currency + loanAmount;

        updateCurrencyText();
        updateLoanText();
        alert("It went through! You have taken a loan with following ammount: " + loanAmount)
        document.getElementById("repayButton").hidden = false;
    }
    else {
        alert("Loan not accepted. Either pay back your existing loan or type in a valid loan value.")
    }
}

/**
 * Function which holds logic for banking the pay. If you have an existing loan there are two requirements which must be met.
 * 10% from the pay must go the existing loan which is represented on the local variable deductedPayAmount.
 * The remainding amount will go to the currency.  
 */
const bankPayAmount = () => {
    if(totalPay === 0) {
        return alert ("You cant bank anything while your pay is 0")
    };

    if(totalLoans === 1) {
        let deductedPayAmount = totalPay * 0.10;
        currency = currency + totalPay * 0.9;
        loanAmount = (loanAmount - deductedPayAmount < 0) ? 0 : loanAmount - deductedPayAmount;
        if (loanAmount <= 0) {
            totalLoans = 0;
            document.getElementById("repayButton").hidden = true;
        }
        totalPay = 0;
        updateAllTextValues();
    } else {
        currency = currency + totalPay;
        totalPay = 0;
        updateCurrencyText();
        updatePayText(); 
    }
}

/**
 * Update currency text element
 */
const updateCurrencyText = () => {
    currencyElement.innerText = currency;
}

/**
 * Update total loan text element
 */
const updateLoanText = () => {
    loanValueElement.innerText = loanAmount;
}

/**
 * Updating pay text element
 */
 const updatePayText = () => {
    payElement.innerText = totalPay;
}

/**
 * Update pay, which is related to work button event listener.
 */
const updatePay = () => {
    totalPay += 100;
    updatePayText();
}

/**
 * Function to update all text elements
 */
const updateAllTextValues = () => {
    updatePayText();
    updateCurrencyText();
    updateLoanText();
}

/**
 * Initialize text fields to 0
 */
updateAllTextValues();

/**
 * Repay loan function. The user has to work up the pay to be able to pay back the loan. 
 * Requirement for this function; when the user repays a loan, the full value of current pay amount should go to the loan and not currency.
 * Hence, the pay can be greater than the loan, then the pay value will remain as pay value, which the else if statement on line 141 handles.
 */
const repayLoan = () => {    
    if (totalPay <= loanAmount) {
        loanAmount = loanAmount - totalPay;
        totalPay = 0;
        if (loanAmount <= 0) {
            totalLoans = 0;
            document.getElementById("repayButton").hidden = true;
        }
        updateAllTextValues();
    }
    //If pay is greater then loan, the remainder will still be on the payElement.
    else if (totalPay >= loanAmount) {
        let repayValue = totalPay - loanAmount;
        if (loanAmount - totalPay >= 0) {
            loanAmount = loanAmount - totalPay;
            updateLoanText();
        } else {
            loanAmount = 0;
            updateLoanText();
        }
        if (loanAmount <= 0) {
            totalLoans = 0;
            document.getElementById("repayButton").hidden = true;
        }
        totalPay = repayValue;
        payElement.innerText = repayValue;
        updateCurrencyText();
    }
}

/**
 * Function to buy a new laptop. Price and title fetched from HTML inner text elements.
 * Function will return an alert if the user dont have enough currency to buy the desired laptop.
 */
const buyNewLaptop = () => {
    laptopPrice = laptopPriceElement.innerText;
    laptopTitle = laptopTitleElement.innerText;
    if (currency >= laptopPrice) {
        currency = currency - laptopPrice;
        updateCurrencyText();
        alert("Success! You have bought this computer: " + laptopTitle);
    } else {
        alert("You dont have enough money to buy this laptop");
    }
}

/**
 * Fetching the komputer-store-api, which will be the laptops that an user can buy.
 * The empty array laptops contains data from the response, which later displays in on the webpage through addLaptopsToMenu function. 
 */
fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
    .then(response => response.json())
    .then(data => laptops = data)
    .then(laptops => addLaptopsToMenu(laptops));

/**
 * Function which adds laptops to menu. Iterating through the laptop array and then add. 
 * From the api, price, despcription, specs, title and image is fetched for a specific laptop. 
 * @param {*} laptops : laptop 
 */
const addLaptopsToMenu = (laptops) => {
    laptops.forEach(x => addLaptopToMenu(x));
    laptopPriceElement.innerText = laptops[0].price;
    laptopDescriptionElement.innerText = laptops[0].description;
    laptopSpecsElement.innerText = laptops[0].specs;
    laptopTitleElement.innerText = laptops[0].title;
    myImage.setAttribute('src', "https://noroff-komputer-store-api.herokuapp.com/assets/images/1.png")
}

/**
 * Function which add a laptop to the menu. Option for the HTML-tag on the webpage.
 * Id from the API which is unique to the laptop element, which later creates a textnode on the laptop title.
 * Lastly adds to the HTML selection menu. 
 * @param {*} laptop : laptop
 */
const addLaptopToMenu = (laptop) => {
    const laptopElement = document.createElement("option")
    laptopElement.value = laptop.id;
    laptopElement.appendChild(document.createTextNode(laptop.title));
    laptopsElement.appendChild(laptopElement);
}

/**
 * Function which handles change from the user in the laptop menu. 
 */
const handleLaptopMenuChange = e => {
    const selectedLaptop = laptops[e.target.selectedIndex];
    laptopPriceElement.innerText = selectedLaptop.price;
    laptopDescriptionElement.innerText = selectedLaptop.description;
    laptopTitleElement.innerText = selectedLaptop.title;

    //Fetching the computer specs from the API.
    computerSpecs = selectedLaptop.specs;
    let temp = "";
    computerSpecs.forEach(x => {
        temp += x + "\n";
    })
    laptopSpecsElement.innerText = temp;

    //Get image 5 from the API
    if(selectedLaptop.id == 5){
        myImage.setAttribute('src', "https://noroff-komputer-store-api.herokuapp.com/assets/images/5.png");
    }
    else{
        myImage.setAttribute('src', `${url}${selectedLaptop.image}`);
    }
}

/**
 * Event listeners from the buttons and select list from the webpage.
 */
loanButtonElement.addEventListener("click", addNewLoan);
workButtonElement.addEventListener("click", updatePay);
bankButtonElement.addEventListener("click", bankPayAmount);
repayButtonElement.addEventListener("click", repayLoan);
laptopsElement.addEventListener("change", handleLaptopMenuChange);
buyLaptopElement.addEventListener("click", buyNewLaptop);