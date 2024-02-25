console.log("we are all going to die!");

function set_max_count(event) {
  /** @type {number} */
  const max_count = event.target.value;
  chrome.storage.sync.set({ max_count: max_count });
}

async function update_timer(event) {
  /** @type {number} */
  const timer_minutes = event.target.value;
  await chrome.storage.sync.set({ timer_minutes: timer_minutes });
  chrome.runtime.sendMessage("update_timer");
}

chrome.storage.sync.get("current_count").then((result) => {
  document.getElementById("current_count").innerText = result.current_count;
});

chrome.storage.sync.get("max_count").then((result) => {
  document.getElementById("max_count").value = result.max_count;
  // chrome.action.setBadgeText({ text: result.max_count });
});

chrome.storage.sync.get("timer_minutes").then((result) => {
  document.getElementById("reduce_count").value = result.timer_minutes;
});

document.getElementById("max_count").addEventListener("change", set_max_count);
document.getElementById("reduce_count").addEventListener("change", update_timer);