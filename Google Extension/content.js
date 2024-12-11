chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "PREFILL_LOCATIONS") {
      const { startLocation, endLocation } = request.data;
      const startInput = document.querySelector("input[placeholder='Select starting location']");
      const endInput = document.querySelector("input[placeholder='Select ending location']");
  
      if (startInput) startInput.value = startLocation;
      if (endInput) endInput.value = endLocation;
  
      sendResponse({ status: "success" });
    }
  });