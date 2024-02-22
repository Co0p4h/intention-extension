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
  // if the current count is greater than the max count then print hello
  if (changes.current_count.newValue > 5) {
    console.log("hello");
  }

});

// add 1 to the current count from content script
chrome.runtime.onMessage.addListener((message, sender, send_response) => {
  if (message === "add_count") {
    chrome.storage.sync.get(["current_count"]).then((result) => {
      const new_count = result.current_count + 1;
      chrome.storage.sync.set({ current_count: new_count }).then(() => {
        console.log(`Value is set to ${new_count}`);
        send_response({ msg: "count_added", count: new_count });
      });
    });
  }
});


// -----------------------------------------------

chrome.runtime.onMessage.addListener((message, sender, send_response) => {
  if (message === "close_tab") {
    send_response({ msg: "tab_closed" });

    // chrome.storage.sync.get(["current_count"]).then((result) => {
    //   console.log("idk: ");
    //   console.log(result);
    // });

    // setTimeout(() => {
    //   chrome.tabs.remove(sender.tab.id);
    // }, 2000);
  }
});

chrome.tabs.onUpdated.addListener((tab_id, change_info, tab) => {
  if (change_info.url && matches_regex(change_info.url)) {
    console.log(change_info);
    console.log(tab);
    console.log(tab.id);
    console.log(tab_id);

    // THIS IS BROKEN (IT IS JUST BAD IN GENEARL I THINK)

    chrome.tabs.sendMessage(tab_id, {
      msg: 'whatasl;dkfjksladjfklsdjfklsdjfls',
      url: change_info.url,
      tab_id: tab_id,
    })
  }
});


