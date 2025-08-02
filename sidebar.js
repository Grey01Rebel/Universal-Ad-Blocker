chrome.storage.local.get("blockAdsEnabled", (data) => {
  const status = data.blockAdsEnabled ?? true;
  const statusText = status ? "Ad Blocker is ON" : "Ad Blocker is OFF";

  const label = document.getElementById("sidebar-status");
  label.textContent = statusText;
  label.style.color = status ? "green" : "red";
});
