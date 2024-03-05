console.log("we are all going to die!");

function set_max_count(event) {
  /** @type {number} */
  const max_count = event.target.value;
  chrome.storage.local.set({ max_count: max_count });
  // add s...
  const count_type_video = document.getElementById("count_type_video");
  count_type_video.innerText = "video" + (max_count > 1 ? "s" : "");
}

async function update_timer(event) {
  /** @type {number} */
  const timer_minutes = event.target.value;
  await chrome.storage.local.set({ timer_minutes: timer_minutes });
  chrome.runtime.sendMessage("update_timer");
}

chrome.storage.local.get("current_count").then((result) => {
  const current_count = document.getElementById("current_count")
  current_count.innerText = result.current_count;
  current_count.title = "current count: " + result.current_count;
  // chrome.action.setBadgeText({ text: result.current_count.toString() });
});

chrome.storage.local.get("max_count").then((result) => {
  const max_count = document.getElementById("max_count");
  max_count.value = result.max_count;
  max_count.addEventListener("change", set_max_count);
});

chrome.storage.local.get("timer_minutes").then((result) => {
  const reduce_count = document.getElementById("reduce_count");
  reduce_count.value = result.timer_minutes;
  reduce_count.addEventListener("change", update_timer);
});




