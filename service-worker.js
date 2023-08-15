chrome.tabs.onUpdated.addListener((tabId, tab) => {
    console.log(" i have no idea what the heck to call any of these anymore");
    if (tab.url && tab.url.includes("youtube.com/watch")) {
        const queryParameters = tab.url.split("?")[1];
        const urlParameters = new URLSearchParams(queryParameters);
        console.log(urlParameters, 'asdf');

        chrome.tabs.sendMessage(tabId, {
            type: "NEW",
            videoId: urlParameters.get("v"),
            random: "random"
        })
    }
});

console.log('from service background worker i dont know');
