const topBar = document.querySelector("#top-bar");
const exteriorColorSection = document.querySelector("#exterior-buttons");
const interiorColorSection = document.querySelector("#interior-buttons");
const exteriorImage = document.querySelector("#exterior-image");
const interiorImage = document.querySelector("#interior-image");
const wheelButtonsSection = document.querySelector("#wheel-buttons");
const performanceBtn = document.querySelector("#performance-btn");
const totalPriceElement = document.querySelector("#total-price");
const fullSelfDrivingCheckbox = document.querySelector(
  "#full-self-driving-checkbox"
);
const accessoryCheckboxes = document.querySelectorAll(
  ".accessory-form-checkbox"
);
const downPaymentElement = document.querySelector("#down-payment");
const monthlyPaymentElement = document.querySelector("#monthly-payment");

const basePrice = 52490;
let currentPrice = basePrice;

let selectedColor = "Stealth Grey";
const selectedOptions = {
  "Performance Wheels": false,
  "Performance Package": false,
  "Full Self-Driving": false,
};

const pricing = {
  "Performance Wheels": 2500,
  "Performance Package": 5000,
  "Full Self-Driving": 8500,
  Accessories: {
    "Center Console Trays": 35,
    Sunshade: 105,
    "All-Weather Interior Liners": 225,
  },
};

//update total price in UI
const updateTotalPrice = () => {
  //reset current price to price base
  currentPrice = basePrice;

  //performance wheel option
  if (selectedOptions["Performance Wheels"]) {
    currentPrice += pricing["Performance Wheels"];
  }
  //performance pckg option
  if (selectedOptions["Performance Package"]) {
    currentPrice += pricing["Performance Package"];
  }
  //fullself driving option
  if (selectedOptions["Full Self-Driving"]) {
    currentPrice += pricing["Full Self-Driving"];
  }

  //accessories checkboxes
  accessoryCheckboxes.forEach((checkbox) => {
    //extract accessory label
    const accessoryLabel = checkbox
      .closest("label")
      .querySelector("span")
      .textContent.trim();

    const accessoryPrice = pricing["Accessories"][accessoryLabel];

    //add to current price if selected
    if (checkbox.checked) {
      currentPrice += accessoryPrice;
    }
  });

  //update total price in UI
  totalPriceElement.textContent = `$${currentPrice.toLocaleString()}`;

  updatePaymentBreakdown();
};

//update payment and monthly payment based on current price
const updatePaymentBreakdown = () => {
  //calculate down payment
  const downPayment = currentPrice * 0.1;
  downPaymentElement.textContent = `$${downPayment.toLocaleString()}`;

  //calculate loan details (60 months, 3% interest rate)
  const loanMonths = 60;
  const interestRate = 0.03;

  const loanAmount = currentPrice - downPayment;

  //monthly payment
  const monthlyInterestRate = interestRate / 12;
  const monthlyPayment =
    (loanAmount * monthlyInterestRate) /
    (1 - Math.pow(1 + monthlyInterestRate, -loanMonths));
  monthlyPaymentElement.textContent = `$${monthlyPayment.toFixed(2)}`;

  monthlyPaymentElement.textContent = `$${monthlyPayment
    .toFixed(2)
    .toLocaleString()}`;
};

//handle top bar on scroll
const handleScroll = () => {
  const atTop = window.scrollY === 0;
  topBar.classList.toggle("visible-bar", atTop);
  topBar.classList.toggle("hidden-bar", !atTop);
};

//image mapping
const exteriorImages = {
  "Stealth Grey": "./images/model-y-stealth-grey.jpg",
  "Pearl White": "./images/model-y-pearl-white.jpg",
  "Deep Blue": "./images/model-y-deep-blue-metallic.jpg",
  "Solid Black": "./images/model-y-solid-black.jpg",
  "Ultra Red": "./images/model-y-ultra-red.jpg",
  Quicksilver: "./images/model-y-quicksilver.jpg",
};

const interiorImages = {
  Dark: "./images/model-y-interior-dark.jpg",
  Light: "./images/model-y-interior-light.jpg",
};

//handle color selection
const handleColorButtonClick = (event) => {
  let button;

  //console.log(event.target.tagName);
  if (event.target.tagName === "IMG") {
    button = event.target.closest("button");
  } else if (event.target.tagName === "BUTTON") {
    button = event.target;
  }

  if (button) {
    const buttons = event.currentTarget.querySelectorAll("button");
    buttons.forEach((btn) => btn.classList.remove("btn-selected"));
    button.classList.add("btn-selected");

    //change exterior img
    if (event.currentTarget === exteriorColorSection) {
      selectedColor = button.querySelector("img").alt;
      //exteriorImage.src = exteriorImages[color];
      updateExteriorImage();
    }

    //change interior img
    if (event.currentTarget === interiorColorSection) {
      const color = button.querySelector("img").alt;
      interiorImage.src = interiorImages[color];
    }
  }
};

//update exterior img depending on color and wheels
const updateExteriorImage = () => {
  const performanceSuffix = selectedOptions["Performance Wheels"]
    ? "-performance"
    : "";
  const colorKey =
    selectedColor in exteriorImages ? selectedColor : "Stealth Grey";
  exteriorImage.src = exteriorImages[colorKey].replace(
    ".jpg",
    `${performanceSuffix}.jpg`
  );
};

//wheel selection
const handleWheelButtonClick = (event) => {
  if (event.target.tagName === "BUTTON") {
    const buttons = document.querySelectorAll("#wheel-buttons button");
    buttons.forEach((btn) => btn.classList.remove("bg-gray-700", "text-white"));

    //add selected styles to clicked button
    event.target.classList.add("bg-gray-700", "text-white");

    selectedOptions["Performance Wheels"] =
      event.target.textContent.includes("Performance");

    // exteriorImage.src = selectedWheel
    //   ? "./images/model-y-stealth-grey-performance.jpg"
    //   : "./images/model-y-stealth-grey.jpg";
    updateExteriorImage();

    updateTotalPrice();
  }
};

//performance pckg selection
const handlePerformanceButtonClick = () => {
  const isSelected = performanceBtn.classList.toggle("bg-gray-700");
  performanceBtn.classList.toggle("text-white");

  //update selected options
  selectedOptions["Performance Package"] = isSelected;

  updateTotalPrice();
};

//full self driving selection
const fullSelfDrivingChange = () => {
  selectedOptions["Full Self-Driving"] = fullSelfDrivingCheckbox.checked;

  updateTotalPrice();
};

//handle accessory cjeckbox listeners
accessoryCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    updateTotalPrice();
  });
});

//initial update total price
updateTotalPrice();

//event listener
window.addEventListener("scroll", () => requestAnimationFrame(handleScroll));
exteriorColorSection.addEventListener("click", handleColorButtonClick);
interiorColorSection.addEventListener("click", handleColorButtonClick);
wheelButtonsSection.addEventListener("click", handleWheelButtonClick);
performanceBtn.addEventListener("click", handlePerformanceButtonClick);
fullSelfDrivingCheckbox.addEventListener("change", fullSelfDrivingChange);
