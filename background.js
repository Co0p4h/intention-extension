const websites = [
  "^https://.*\.instagram\.com/.*$",
  "^https://www\.youtube\.com/watch.*$",
  // "^https://www\.youtube\.com/shorts.*$",
  "^https://.*\.twitch\.tv/.*$",
]

/**
 * @param {string} url 
 * @returns {boolean}
 */
const is_website = (url) => {
  return websites.some(website => url.match(website));
}

// default values
let extension_enabled = true;
let current_count = 0;
let max_count = 3;
let timer_minutes = 120;

chrome.runtime.onInstalled.addListener((object) => {
  // if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
  //   chrome.tabs.create({ url: "/pages/options.html" });
  // }

  // set initial values
  chrome.storage.local.set({
    extension_enabled,
    current_count,
    max_count,
    timer_minutes,
  }).then(() => {
    console.log("set initial values and timer");
    chrome.storage.local.get(["timer_minutes"]).then(({ timer_minutes }) => {
      chrome.alarms.create("reduce_count", { periodInMinutes: timer_minutes });
    });
  });
});


// show changes in for debugging
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `storage key "${key}" in namespace "${namespace}" changed.`,
      `old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});

// add 1 to the current count from content script
chrome.runtime.onMessage.addListener(async (message, sender, send_response) => {
  if (message === "add_count") {
    const { current_count } = await chrome.storage.local.get(["current_count"]);
    const new_count = current_count + 1;
    await chrome.storage.local.set({ current_count: new_count });
    console.log(`value is set to ${new_count}`);
  }
});

// check if the current count is greater than the max count
chrome.runtime.onMessage.addListener(async (message, sender, send_response) => {
  if (message === "check_count") {
    // console.log('checking count');
    const { current_count } = await chrome.storage.local.get(["current_count"]);
    const { max_count } = await chrome.storage.local.get(["max_count"]);
    if (current_count >= max_count) {
      chrome.tabs.update({ url: chrome.runtime.getURL("test.html") });
    }
  }
});

// update the timer to user input
chrome.runtime.onMessage.addListener(async (message, sender, send_response) => {
  if (message === "update_timer") {
    const { timer_minutes } = await chrome.storage.local.get(["timer_minutes"]);
    chrome.alarms.clear("reduce_count");
    chrome.alarms.create("reduce_count", { periodInMinutes: parseInt(timer_minutes) });
  }
});

// -1 from the current count every time the alarm goes off
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "reduce_count") {
    const { current_count } = await chrome.storage.local.get(["current_count"]);
    if (current_count > 0) {
      const new_count = current_count - 1;
      await chrome.storage.local.set({ current_count: new_count });
    }
  }
});

// -----------------------------------------------

chrome.runtime.onMessage.addListener((message, sender, send_response) => {
  if (message === "close_tab") {
    chrome.tabs.remove(sender.tab.id);
    // send_response({ msg: "tab_closed" });
  }
});

chrome.tabs.onUpdated.addListener(async (tab_id, change_info, tab) => {
  const extension_enabled = await chrome.storage.local.get("extension_enabled");
  if (extension_enabled && change_info.url && is_website(change_info.url) && tab.active) { // TAB.ACTIVE == TRUE IS VERY IMPORTANT for when opening link in a new tab
    console.log(change_info);
    console.log(tab);

    // THIS IS BROKEN (IT IS JUST BAD IN GENEARL I THINK)
    chrome.tabs.sendMessage(tab_id, {
      msg: 'whatasl;dkfjksladjfklsdjfklsdjfls',
      url: change_info.url,
      tab_id: tab_id,
    })
  }
});
