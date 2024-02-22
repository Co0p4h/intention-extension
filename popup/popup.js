console.log("we are all going to die!");

function set_max_count(event) {
  /** @type {number} */
  const max_count = event.target.value;
  chrome.storage.sync.set({ max_count: max_count });
}

chrome.storage.sync.get("max_count").then((result) => {
  document.getElementById("max_count").value = result.max_count;
  // chrome.action.setBadgeText({ text: result.max_count });
});

chrome.storage.sync.get("current_count").then((result) => {
  document.getElementById("current_count").innerText = result.current_count;
});

document.getElementById("max_count").addEventListener("change", set_max_count);

// how it is structured
// user = {current_count: number,
//         max_count: number,
//         