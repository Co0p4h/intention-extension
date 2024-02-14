
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "close_tab") {
    sendResponse({ msg: "tab_closed" });
    // setTimeout(() => {
    chrome.tabs.remove(sender.tab.id);
    // }, 2000);
  }
})