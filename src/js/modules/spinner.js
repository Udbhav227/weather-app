const fullPageSpinner = document.getElementById("full-page-spinner");
const searchSpinner = document.getElementById("search-spinner");
const weatherAppContainer = document.querySelector(".weather-app-container");
const mainContent = document.querySelector(".main-content");
const rightPanel = document.querySelector(".right-panel");

export function showFullPageSpinner() {
  if (fullPageSpinner) {
    fullPageSpinner.style.display = "flex";
  }
  if (weatherAppContainer) {
    weatherAppContainer.classList.remove("loaded");
  }
}

export function hideFullPageSpinner() {
  if (fullPageSpinner) {
    fullPageSpinner.style.display = "none";
  }
  if (weatherAppContainer) {
    weatherAppContainer.classList.add("loaded");
  }
}

export function showSearchSpinner() {
  if (searchSpinner) {
    searchSpinner.style.display = "block";
  }
}

export function hideSearchSpinner() {
  if (searchSpinner) {
    searchSpinner.style.display = "none";
  }
}

export function hideContent() {
  if (mainContent) {
    mainContent.classList.remove("visible");
    mainContent.classList.add("hidden");
  }
  if (rightPanel) { 
    rightPanel.classList.remove("visible");
    rightPanel.classList.add("hidden");
  }
}

export function showContent() {
  if (mainContent) {
    mainContent.classList.remove("hidden");
    mainContent.classList.add("visible");
  }
  if (rightPanel) {
    rightPanel.classList.remove("hidden");
    rightPanel.classList.add("visible");
  }
}