/* =========================================================
   UNITY BANK — 3D ATM SIMULATOR
   ========================================================= */

/* -----------------------------
   SIMULATOR DATA
----------------------------- */

const ATM_PIN = "1234";

const accounts = {
  savings: {
    name: "Savings Account",
    shortName: "Savings",
    balance: 50000
  },

  current: {
    name: "Current Account",
    shortName: "Current",
    balance: 75000
  }
};

let selectedAccount = null;
let enteredPin = "";
let lastTransaction = "";
let lastAmount = 0;
let lastBalance = 0;
let isProcessing = false;


/* -----------------------------
   HELPER FUNCTIONS
----------------------------- */

function showScreen(screenId) {
  document.querySelectorAll(".screen-section").forEach(screen => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(screenId);

  if (target) {
    target.classList.add("active");
  }
}


function formatMoney(amount) {
  return "Rs " + Number(amount).toLocaleString("en-PK");
}


function getAccount() {
  if (!selectedAccount) return null;
  return accounts[selectedAccount];
}


function updateMenu() {
  const account = getAccount();

  if (!account) return;

  const name = document.getElementById("menuAccountName");
  const balance = document.getElementById("menuBalance");

  if (name) {
    name.textContent = account.name;
  }

  if (balance) {
    balance.textContent = formatMoney(account.balance);
  }
}


function updateReceipt() {
  const account = getAccount();

  if (!account) return;

  const receiptTransaction =
    document.getElementById("receiptTransaction");

  const receiptAccount =
    document.getElementById("receiptAccount");

  const receiptAmount =
    document.getElementById("receiptAmount");

  const receiptBalance =
    document.getElementById("receiptBalance");

  if (receiptTransaction) {
    receiptTransaction.textContent = lastTransaction;
  }

  if (receiptAccount) {
    receiptAccount.textContent = account.shortName;
  }

  if (receiptAmount) {
    receiptAmount.textContent = formatMoney(lastAmount);
  }

  if (receiptBalance) {
    receiptBalance.textContent = formatMoney(lastBalance);
  }

  const viewTransaction =
    document.getElementById("viewTransaction");

  const viewAccount =
    document.getElementById("viewAccount");

  const viewAmount =
    document.getElementById("viewAmount");

  const viewBalance =
    document.getElementById("viewBalance");

  if (viewTransaction) {
    viewTransaction.textContent = lastTransaction;
  }

  if (viewAccount) {
    viewAccount.textContent = account.shortName;
  }

  if (viewAmount) {
    viewAmount.textContent = formatMoney(lastAmount);
  }

  if (viewBalance) {
    viewBalance.textContent = formatMoney(lastBalance);
  }
}


function finishTransaction() {
  enteredPin = "";
  selectedAccount = null;
  lastTransaction = "";
  lastAmount = 0;
  lastBalance = 0;

  const pinDisplay = document.getElementById("pinDisplay");

  if (pinDisplay) {
    pinDisplay.textContent = "••••";
  }

  showScreen("finishedScreen");
}


/* -----------------------------
   START ATM
----------------------------- */

const startButton =
  document.getElementById("startButton");

if (startButton) {
  startButton.addEventListener("click", () => {
    enteredPin = "";

    const pinDisplay =
      document.getElementById("pinDisplay");

    const pinMessage =
      document.getElementById("pinMessage");

    if (pinDisplay) {
      pinDisplay.textContent = "••••";
    }

    if (pinMessage) {
      pinMessage.textContent = "Enter your 4-digit PIN";
    }

    showScreen("pinScreen");
  });
}


/* -----------------------------
   PIN KEYPAD
----------------------------- */

const pinButtons =
  document.querySelectorAll("#pinKeypad button[data-number]");

pinButtons.forEach(button => {
  button.addEventListener("click", () => {

    if (enteredPin.length >= 4) {
      return;
    }

    enteredPin += button.dataset.number;

    updatePinDisplay();
  });
});


function updatePinDisplay() {
  const display =
    document.getElementById("pinDisplay");

  if (!display) return;

  if (enteredPin.length === 0) {
    display.textContent = "••••";
    return;
  }

  let dots = "";

  for (let i = 0; i < enteredPin.length; i++) {
    dots += "●";
  }

  for (let i = enteredPin.length; i < 4; i++) {
    dots += "○";
  }

  display.textContent = dots;
}


/* -----------------------------
   CLEAR PIN
----------------------------- */

const clearPin =
  document.getElementById("clearPin");

if (clearPin) {
  clearPin.addEventListener("click", () => {
    enteredPin = "";
    updatePinDisplay();

    const message =
      document.getElementById("pinMessage");

    if (message) {
      message.textContent = "PIN cleared";
    }
  });
}


/* -----------------------------
   ENTER PIN
----------------------------- */

const enterPin =
  document.getElementById("enterPin");

if (enterPin) {
  enterPin.addEventListener("click", checkPin);
}


function checkPin() {
  const message =
    document.getElementById("pinMessage");

  if (enteredPin.length !== 4) {

    if (message) {
      message.textContent =
        "Please enter exactly 4 digits.";
    }

    return;
  }

  if (enteredPin === ATM_PIN) {

    if (message) {
      message.textContent = "PIN accepted.";
    }

    setTimeout(() => {
      showScreen("accountScreen");
    }, 400);

  } else {

    if (message) {
      message.textContent =
        "Incorrect PIN. Try again.";
    }

    enteredPin = "";

    setTimeout(updatePinDisplay, 300);
  }
}


/* -----------------------------
   KEYBOARD PIN SUPPORT
----------------------------- */

document.addEventListener("keydown", event => {

  const pinScreen =
    document.getElementById("pinScreen");

  if (!pinScreen ||
      !pinScreen.classList.contains("active")) {
    return;
  }

  if (/^[0-9]$/.test(event.key)) {

    if (enteredPin.length < 4) {
      enteredPin += event.key;
      updatePinDisplay();
    }

    return;
  }

  if (event.key === "Backspace") {

    enteredPin =
      enteredPin.slice(0, -1);

    updatePinDisplay();

    return;
  }

  if (event.key === "Enter") {
    checkPin();
  }
});


/* -----------------------------
   ACCOUNT SELECTION
----------------------------- */

const accountButtons =
  document.querySelectorAll("[data-account]");

accountButtons.forEach(button => {

  button.addEventListener("click", () => {

    const accountType =
      button.dataset.account;

    if (!accounts[accountType]) {
      return;
    }

    selectedAccount = accountType;

    updateMenu();

    showScreen("menuScreen");
  });
});


/* -----------------------------
   MAIN MENU
----------------------------- */

const transactionButtons =
  document.querySelectorAll(".transaction-button");

transactionButtons.forEach(button => {

  button.addEventListener("click", () => {

    const action =
      button.dataset.action;

    if (!selectedAccount) {
      showScreen("accountScreen");
      return;
    }

    if (action === "withdraw") {
      showScreen("withdrawScreen");
    }

    if (action === "deposit") {
      showScreen("depositScreen");
    }

    if (action === "transfer") {
      showScreen("transferScreen");
    }

    if (action === "balance") {

      const account = getAccount();

      const balanceAccount =
        document.getElementById("balanceAccount");

      const balanceAmount =
        document.getElementById("balanceAmount");

      if (balanceAccount) {
        balanceAccount.textContent =
          account.name;
      }

      if (balanceAmount) {
        balanceAmount.textContent =
          formatMoney(account.balance);
      }

      showScreen("balanceScreen");
    }
  });
});


/* -----------------------------
   CHANGE ACCOUNT
----------------------------- */

const changeAccount =
  document.getElementById("changeAccount");

if (changeAccount) {

  changeAccount.addEventListener("click", () => {

    selectedAccount = null;

    showScreen("accountScreen");
  });
}


/* -----------------------------
   BACK BUTTONS
----------------------------- */

document.querySelectorAll("[data-back]").forEach(button => {

  button.addEventListener("click", () => {

    const target =
      button.dataset.back;

    showScreen(target);
  });
});


/* =========================================================
   WITHDRAW
   ========================================================= */


/* QUICK AMOUNTS */

document.querySelectorAll(".amount-button").forEach(button => {

  button.addEventListener("click", () => {

    const amount =
      Number(button.dataset.amount);

    processWithdrawal(amount);
  });
});


/* OTHER AMOUNT */

const otherAmountButton =
  document.getElementById("otherAmountButton");

if (otherAmountButton) {

  otherAmountButton.addEventListener("click", () => {

    const input =
      document.getElementById("otherAmount");

    if (!input) return;

    const amount =
      Number(input.value);

    processWithdrawal(amount);
  });
}


/* -----------------------------
   WITHDRAW VALIDATION
----------------------------- */

function processWithdrawal(amount) {

  if (isProcessing) {
    return;
  }

  const message =
    document.getElementById("withdrawMessage");

  const account = getAccount();

  if (!account) {
    return;
  }

  if (!amount || amount <= 0) {

    if (message) {
      message.textContent =
        "Please enter a valid amount.";
    }

    return;
  }

  if (amount % 100 !== 0) {

    if (message) {
      message.textContent =
        "Amount must be in multiples of Rs 100.";
    }

    return;
  }

  if (amount > 50000) {

    if (message) {
      message.textContent =
        "Maximum withdrawal is Rs 50,000.";
    }

    return;
  }

  if (amount > account.balance) {

    if (message) {
      message.textContent =
        "Insufficient balance.";
    }

    return;
  }

  lastTransaction = "CASH WITHDRAWAL";
  lastAmount = amount;

  startProcessing(
    "Processing Withdrawal",
    "Please wait while your cash withdrawal is processed.",
    () => {

      account.balance -= amount;

      lastBalance = account.balance;

      updateMenu();

      const cashAmount =
        document.getElementById("cashAmount");

      if (cashAmount) {
        cashAmount.textContent =
          formatMoney(amount);
      }

      showScreen("cashScreen");
    }
  );
}


/* =========================================================
   CASH DISPENSER
   ========================================================= */

const cashTakenButton =
  document.getElementById("cashTakenButton");

if (cashTakenButton) {

  cashTakenButton.addEventListener("click", () => {

    updateReceipt();

    showScreen("receiptChoiceScreen");
  });
}


/* =========================================================
   RECEIPT CHOICE
   ========================================================= */

const receiptYes =
  document.getElementById("receiptYes");

if (receiptYes) {

  receiptYes.addEventListener("click", () => {

    updateReceipt();

    showScreen("receiptScreen");
  });
}


const receiptNo =
  document.getElementById("receiptNo");

if (receiptNo) {

  receiptNo.addEventListener("click", () => {

    finishTransaction();
  });
}


/* =========================================================
   RECEIPT SCREEN
   ========================================================= */

const seeReceipt =
  document.getElementById("seeReceipt");

if (seeReceipt) {

  seeReceipt.addEventListener("click", () => {

    updateReceipt();

    showScreen("receiptViewScreen");
  });
}


const finishAfterReceipt =
  document.getElementById("finishAfterReceipt");

if (finishAfterReceipt) {

  finishAfterReceipt.addEventListener("click", () => {

    finishTransaction();
  });
}


/* =========================================================
   RECEIPT VIEW
   ========================================================= */

const finishFromReceipt =
  document.getElementById("finishFromReceipt");

if (finishFromReceipt) {

  finishFromReceipt.addEventListener("click", () => {

    finishTransaction();
  });
}


/* =========================================================
   DEPOSIT
   ========================================================= */

const depositButton =
  document.getElementById("depositButton");

if (depositButton) {

  depositButton.addEventListener("click", () => {

    if (isProcessing) {
      return;
    }

    const input =
      document.getElementById("depositAmount");

    const message =
      document.getElementById("depositMessage");

    const account = getAccount();

    if (!account) {
      return;
    }

    const amount =
      Number(input ? input.value : 0);

    if (!amount || amount <= 0) {

      if (message) {
        message.textContent =
          "Please enter a valid amount.";
      }

      return;
    }

    if (amount % 100 !== 0) {

      if (message) {
        message.textContent =
          "Amount must be in multiples of Rs 100.";
      }

      return;
    }

    if (amount > 100000) {

      if (message) {
        message.textContent =
          "Maximum deposit is Rs 100,000.";
      }

      return;
    }

    lastTransaction = "CASH DEPOSIT";
    lastAmount = amount;

    startProcessing(
      "Processing Deposit",
      "Please wait while your deposit is being processed.",
      () => {

        account.balance += amount;

        lastBalance = account.balance;

        updateMenu();
        updateReceipt();

        showScreen("receiptChoiceScreen");
      }
    );
  });
}


/* =========================================================
   TRANSFER
   ========================================================= */

const transferButton =
  document.getElementById("transferButton");

if (transferButton) {

  transferButton.addEventListener("click", () => {

    if (isProcessing) {
      return;
    }

    const recipientInput =
      document.getElementById("recipient");

    const amountInput =
      document.getElementById("transferAmount");

    const message =
      document.getElementById("transferMessage");

    const account = getAccount();

    if (!account) {
      return;
    }

    const recipient =
      recipientInput
        ? recipientInput.value.trim()
        : "";

    const amount =
      Number(amountInput ? amountInput.value : 0);

    if (!recipient) {

      if (message) {
        message.textContent =
          "Please enter the recipient name.";
      }

      return;
    }

    if (!amount || amount <= 0) {

      if (message) {
        message.textContent =
          "Please enter a valid transfer amount.";
      }

      return;
    }

    if (amount % 100 !== 0) {

      if (message) {
        message.textContent =
          "Amount must be in multiples of Rs 100.";
      }

      return;
    }

    if (amount > account.balance) {

      if (message) {
        message.textContent =
          "Insufficient balance.";
      }

      return;
    }

    lastTransaction =
      "TRANSFER TO " +
      recipient.toUpperCase();

    lastAmount = amount;

    startProcessing(
      "Processing Transfer",
      "Please wait while the transfer is being completed.",
      () => {

        account.balance -= amount;

        lastBalance = account.balance;

        updateMenu();
        updateReceipt();

        showScreen("receiptChoiceScreen");
      }
    );
  });
}


/* =========================================================
   BALANCE SCREEN
   ========================================================= */

const balanceDone =
  document.getElementById("balanceDone");

if (balanceDone) {

  balanceDone.addEventListener("click", () => {

    showScreen("menuScreen");
  });
}


/* =========================================================
   PROCESSING SCREEN
   ========================================================= */

function startProcessing(title, text, callback) {

  if (isProcessing) {
    return;
  }

  isProcessing = true;

  const processingTitle =
    document.getElementById("processingTitle");

  const processingText =
    document.getElementById("processingText");

  if (processingTitle) {
    processingTitle.textContent = title;
  }

  if (processingText) {
    processingText.textContent = text;
  }

  showScreen("processingScreen");

  setTimeout(() => {

    isProcessing = false;

    if (typeof callback === "function") {
      callback();
    }

  }, 1600);
}


/* =========================================================
   FINISHED SCREEN
   ========================================================= */

const startAgain =
  document.getElementById("startAgain");

if (startAgain) {

  startAgain.addEventListener("click", () => {

    enteredPin = "";
    selectedAccount = null;

    const pinDisplay =
      document.getElementById("pinDisplay");

    if (pinDisplay) {
      pinDisplay.textContent = "••••";
    }

    showScreen("startScreen");
  });
}


/* =========================================================
   HELP BUTTON
   ========================================================= */

const helpButton =
  document.getElementById("helpButton");

if (helpButton) {

  helpButton.addEventListener("click", () => {

    alert(
      "ATM Simulator Help\n\n" +
      "1. Insert the simulated card.\n" +
      "2. Enter PIN: 1234\n" +
      "3. Choose Savings or Current.\n" +
      "4. Select a transaction.\n\n" +
      "This is a fictional ATM simulator. " +
      "No real bank account or money is connected."
    );
  });
}


/* =========================================================
   INITIAL STATE
   ========================================================= */

showScreen("startScreen");
