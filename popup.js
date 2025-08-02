// Get references to the checkbox and status label elements in the popup
const toggle = document.getElementById("toggle-blocker");
const statusLabel = document.getElementById("status-label");

// Load the saved ad blocker state from Chrome's local storage
chrome.storage.local.get("blockAdsEnabled", (data) => {
  // Set the checkbox state to saved value or true by default
  toggle.checked = data.blockAdsEnabled ?? true;

  // Update the status label text and color based on toggle state
  const statusLabel = document.getElementById("status-label");
  statusLabel.textContent = toggle.checked ? "Ad Blocker is ON" : "Ad Blocker is OFF";
  statusLabel.style.color = toggle.checked ? "green" : "red";
});

// Listen for changes to the checkbox (when the user toggles it)
toggle.addEventListener("change", async () => {
  const isEnabled = toggle.checked;

  // Save the new state to Chrome storage
  chrome.storage.local.set({ blockAdsEnabled: isEnabled });

  // Immediately update the status label to reflect the new state
  statusLabel.textContent = isEnabled ? "Ad Blocker is ON" : "Ad Blocker is OFF";
  statusLabel.style.color = isEnabled ? "green" : "red";

  // Define the ad-blocking rules (each rule blocks a specific domain)
  const rules = [
    {
      id: 1,
      priority: 1,
      action: { type: "block" },
      condition: {
        urlFilter: "doubleclick.net",
        resourceTypes: ["script", "image", "xmlhttprequest"]
      }
    },
    {
      id: 2,
      priority: 1,
      action: { type: "block" },
      condition: {
        urlFilter: "googlesyndication.com",
        resourceTypes: ["script", "image", "xmlhttprequest"]
      }
    },
  ];

  // If enabled, apply the rules; if disabled, remove them
  if (isEnabled) {
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: rules,
      removeRuleIds: rules.map(r => r.id)
    });
  } else {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: rules.map(r => r.id)
    });
  }
});

// Open the analytics/control panel (sidebar.html) in a new tab when button is clicked
document.getElementById("open-sidebar").addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("sidebar.html") });
});
