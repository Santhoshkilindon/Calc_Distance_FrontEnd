document.getElementById("saveButton").addEventListener("click", () => {
    const startLocation = document.getElementById("startLocation").value;
    const endLocation = document.getElementById("endLocation").value;
  
    chrome.runtime.sendMessage(
      {
        type: "SAVE_LOCATIONS",
        data: { startLocation, endLocation }
      },
      (response) => {
        if (response.status === "success") {
          alert("Locations saved successfully!");
        }
      }
    );
  });
  