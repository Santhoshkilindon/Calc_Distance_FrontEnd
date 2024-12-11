chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "SAVE_LOCATIONS") {
      chrome.storage.local.set(
        {
          savedLocations: request.data
        },
        () => {
          sendResponse({ status: "success" });
        }
      );
      return true; // Indicates asynchronous response.
    }
  });

  chrome.tabs.onActivated.addListener(async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.id) {
      chrome.storage.local.get(["savedLocations"], (result) => {
        if (result.savedLocations) {
          chrome.tabs.sendMessage(tab.id, {
            type: "PREFILL_LOCATIONS",
            data: result.savedLocations
          });
        }
      });
    }
  });
  
  