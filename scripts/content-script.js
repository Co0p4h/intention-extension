(() => {
    console.log('from the content script yo');

    const new_page = `
        <html>
            <head>
                <title>A Ssdlkfjsimple HTML Document</title>
            </head>
            <body>
                <h2>
                I think that you have had enough
                </h2>
                <p>"random quote or something"</p>
            </body>
        </html>`

    const popup = `
    <div>
        <p>hello</p>
    </div>`

    // const html_test = chrome.runtime.getURL('../test.html');
    // fetch(html_test).then((html) => {
    //     document.open()
    //     document.write(html.json.toString)
    //     document.close()
    //     console.log("i got no clue if this is wokrign, htm_test");
    // })

    // Page has finished loading
    window.onload = function () {
        var video = document.querySelector("#container .html5-video-player .html5-video-container .video-stream");
        if (video) {
            console.log("Element found:", video);
            // document.open()
            // document.write(new_page)
            // document.close()
            alert("hello");
        } else {
            console.log("Element not found");
        }
    };

    let currentVideo = "";

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        console.log('i dont know if it works');
        const { type, value, videoId, random } = obj;
        if (type === "NEW") {
            currentVideo = videoId;
            newVideoLoaded();
            console.log('the new thing works lol');
        }
    });

    const newVideoLoaded = () => {
        console.log("inside new video loaded");
    }

    newVideoLoaded();
})();
