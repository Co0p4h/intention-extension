console.log("we are all going to die!");

function set_max_count(event) {
  /** @type {number} */
  const max_count = event.target.value;
  chrome.storage.local.set({ max_count: max_count });
}

async function update_timer(event) {
  /** @type {number} */
  const timer_minutes = event.target.value;
  await chrome.storage.local.set({ timer_minutes: timer_minutes });
  // chrome.alarms.clear("reduce_count");
  // chrome.alarms.create("reduce_count", { periodInMinutes: parseInt(timer_minutes) });
  chrome.runtime.sendMessage("update_timer");
}

function toggle_extension(event) {
  chrome.storage.local.set({ extension_enabled: event.target.checked });
  if (!event.target.checked) {
    chrome.runtime.sendMessage("disable_extension");
    console.log("extension disabled");
  } else {
    chrome.runtime.sendMessage("enable_extension");
    console.log("extension enabled");
  }
}

chrome.storage.local.get("current_count").then((result) => {
  document.getElementById("current_count").innerText = result.current_count;
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

chrome.storage.local.get("extension_enabled").then((result) => {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'toggle';
  checkbox.checked = result.extension_enabled;
  document.getElementById("toggle_container").appendChild(checkbox);
  checkbox.addEventListener('change', toggle_extension);
});



