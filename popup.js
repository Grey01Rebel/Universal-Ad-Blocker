const toggle = document.getElementById("toggle-blocker");

chrome.storage.local.get("blockAdsEnabled", (data) => {
  toggle.checked = data.blockAdsEnabled ?? true;
});

toggle.addEventListener("change", async () => {
  const isEnabled = toggle.checked;

  chrome.storage.local.set({ blockAdsEnabled: isEnabled });

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