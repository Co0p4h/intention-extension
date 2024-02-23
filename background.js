const websites = [
  "^https://.*\.instagram\.com/.*$",
  "^https://www\.youtube\.com/watch.*$",
  "^https://www\.youtube\.com/shorts.*$",
  "^https://.*\.twitch\.tv/.*$",
]

/**
 * @param {string} url 
 * @returns {boolean}
 */
const matches_regex = (url) => {
  return websites.some(website => url.match(website));
}

const STORAGE_KEY = "user-count";

chrome.storage.sync.set({ current_count: 0 }).then(() => {
  console.log("Value was set (testing sync)");
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});

// add 1 to the current count from content script
chrome.runtime.onMessage.addListener(async (message, sender, send_response) => {
  if (message === "add_count") {
    const { current_count } = await chrome.storage.sync.get(["current_count"]);
    const new_count = current_count + 1;
    await chrome.storage.sync.set({ current_count: new_count });
    console.log(`value is set to ${new_count}`);
  }
});

// check if the current count is greater than the max count
chrome.runtime.onMessage.addListener(async (message, sender, send_response) => {
  if (message === "check_count") {
    const { current_count } = await chrome.storage.sync.get(["current_count"]);
    const { max_count } = await chrome.storage.sync.get(["max_count"]);
    if (current_count >= max_count) {
      chrome.tabs.update({ url: chrome.runtime.getURL("test.html") });
    }
    console.log('checking count');
  }
});

// -----------------------------------------------

chrome.runtime.onMessage.addListener((message, sender, send_response) => {
  if (message === "close_tab") {
    send_response({ msg: "tab_closed" });

    // setTimeout(() => {
    //   chrome.tabs.remove(sender.tab.id);
    // }, 2000);
  }
});

chrome.tabs.onUpdated.addListener((tab_id, change_info, tab) => {
  if (change_info.url && tab.active && matches_regex(change_info.url)) { // TAB.ACTIVE == TRUE IS VERY IMPORTANT
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
