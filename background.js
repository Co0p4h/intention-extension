chrome.runtime.onInstalled.addListener((object) => {
  // set initial values
  chrome.storage.local.set({
    current_count: 0,
    max_count: 3,
    timer_minutes: 2, // 120
  }).then(() => {
    console.log("set initial values and timer");
    // does it need to start counting down straight after install?
    chrome.storage.local.get(["timer_minutes"]).then(({ timer_minutes }) => {
      chrome.alarms.create("reduce_count", { periodInMinutes: timer_minutes });
    });
  });
});

chrome.runtime.onMessage.addListener(async (message, sender, send_response) => {
  if (message === "add_count") {
    const { current_count } = await chrome.storage.local.get(["current_count"]);
    const new_count = current_count + 1;
    await chrome.storage.local.set({ current_count: new_count });
    console.log(`value is set to ${new_count}`);
  }
});

/**
 * @param {string} url 
 * @returns {boolean}
*/
const is_website = (url) => {
  // can I make this use the chrome website checker thing instead of regex?
  const websites = [
    "^https://.*\.instagram\.com/.*$",
    "^https://www\.youtube\.com/.*$",
    "^https://.*\.twitch\.tv/.*$"]

  if (url.match("^https://www\.youtube\.com/redirect.*$")) return false;
  return websites.some(website => url.match(website));
}

const check_count = async (tab_id, tab_url) => {
  const { current_count } = await chrome.storage.local.get(["current_count"]);
  const { max_count } = await chrome.storage.local.get(["max_count"]);
  if (current_count >= max_count && is_website(tab_url)) {
    console.log('tab_id', tab_id, 'tab_url', tab_url, "tab blocked?");
    chrome.tabs.update(tab_id, { url: chrome.runtime.getURL("pages/blocked.html") });
  }
}

chrome.runtime.onMessage.addListener(async (message, sender, send_response) => {
  if (message === "check_count") {
    check_count(sender.tab.id, sender.tab.url);
  }
});

// --------------------- alarm stuff start -------------------------- 

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

// --------------------- alarm stuff end -------------------------- 

// check the count when the tab url changes or the page is refreshed
chrome.tabs.onUpdated.addListener((tab_id, change_info, tab) => {
  if (change_info.status === "loading" && tab.active && is_website(tab.url)) {
    // console.log(tab.url, "tab updated from on updated listener loading");
    check_count(tab_id, tab.url);
    chrome.tabs.sendMessage(tab_id, {
      msg: 'url_changed',
      url: tab.url,
      tab_id: tab_id,
    })
  }
});

// -----------------------------------------------

chrome.runtime.onMessage.addListener((message, sender, send_response) => {
  if (message === "close_tab") {
    chrome.tabs.remove(sender.tab.id);
    // send_response({ msg: "tab_closed" });
  }
});

chrome.tabs.onCreated.addListener((tab) => {
  if (tab.id && tab.pendingUrl && is_website(tab.pendingUrl)) {
    // console.log('hello from on created', tab);
    check_count(tab.id, tab.pendingUrl);
  }
});

chrome.storage.onChanged.addListener(async (changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    // show changes in for debugging
    // console.log(
    //   `storage key "${key}" in namespace "${namespace}" changed.`,
    //   `old value was "${oldValue}", new value is "${newValue}".`
    // );
    // if current count is greater than or equal to max count run on_max_count()
    const { max_count } = await chrome.storage.local.get(["max_count"]);
    if (key === "current_count" && (newValue >= max_count)) {
      on_max_count();
    }
  }
});

const on_max_count = () => {
  chrome.tabs.query({
    active: false, url: [
      "*://www.instagram.com/*",
      "*://www.youtube.com/*",
      "*://www.twitch.tv/*"
    ]
  }, (tabs) => {
    tabs.forEach(tab => {
      if (tab.id && tab.url) {
        // check_count(tab.id, tab.url);
        // chrome.tabs.executeScript(tab.id, { file: "scripts/check.js" });
        chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["scripts/check.js"] })
      }
    });
  });
}