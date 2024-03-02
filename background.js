const websites = [
  "^https://.*\.instagram\.com/.*$",
  // "^https://www\.youtube\.com/.*$",
  "^https://www\.youtube\.com/?$",
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
let current_count = 1;
let max_count = 2; // 3
let timer_minutes = 1; // 120

chrome.runtime.onInstalled.addListener((object) => {
  // if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
  //   chrome.tabs.create({ url: "/pages/options.html" });
  // }

  // set initial values
  chrome.storage.local.set({
    current_count,
    max_count,
    timer_minutes,
    /** @type {Object<string, boolean>} */
    tab_click_status: {},
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

const check_count = async (tab_url) => {
  const { current_count } = await chrome.storage.local.get(["current_count"]);
  const { max_count } = await chrome.storage.local.get(["max_count"]);
  if (current_count >= max_count && is_website(tab_url)) {
    chrome.tabs.update({ url: chrome.runtime.getURL("pages/blocked.html") });
  }
}

// check if the current count is greater than the max count
chrome.runtime.onMessage.addListener(async (message, sender, send_response) => {
  if (message === "check_count") {
    // console.log('checking count');
    check_count(sender.tab.url);
  }
});

// check count when the tab changes
chrome.tabs.onActivated.addListener((active_info) => {
  // chrome.runtime.sendMessage("check_count");
  chrome.tabs.get(active_info.tabId, (tab) => {
    if (is_website(tab.url)) {
      console.log('tab changed: ' + tab.url);
      // updagte the current url
      chrome.storage.local.set({ current_url: tab.url });
      // check_count(tab.url);
    }
  });
});

// chrome.tabs.onUpdated.addListener((tab_id, change_info, tab) => {
//   // chrome.runtime.sendMessage("check_count");
//   if (tab.active && change_info.url && is_website(change_info.url)) {
//     console.log('tab updated', tab);
//     check_count(tab.url);
//   }
// });

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

// let tab_click_status = {};

// chrome.runtime.onMessage.addListener(async (message, sender, send_response) => {
//   // const { tab_click_status } = await chrome.storage.local.get(["tab_click_status"]);
//   // log url
//   console.log(sender.tab.url, "helelejrkjlwerjklerjke url");
//   if (message.click_status === "yes" && sender.tab) {
//     tab_click_status[sender.tab.id] = true;
//   } else if (sender.tab && message.click_status === "no") {
//     delete tab_click_status[sender.tab.id];
//   }
//   console.log("before", tab_click_status);
//   chrome.storage.local.set({ tab_click_status });
//   console.log("after", tab_click_status);
// });


// chrome.runtime.onMessage.addListener(async (message, sender, send_response) => {
//   if (message === "should_i_run") {
//     const { tab_click_status } = await chrome.storage.local.get(["tab_click_status"]);
//     console.log("should i run", tab_click_status);
//     // const should_run = "yes";
//     // console.log(sender);
//     // chrome.storage.local.get(["click_status"], (result) => {
//     //   console.log("should i run", result);
//     //   if (result.click_status[sender.tab.id]) {
//     //     send_response("no");
//     //   } else {
//     //     send_response("yes");
//     //   }
//     // });
//     send_response("yes");
//   }
// });

