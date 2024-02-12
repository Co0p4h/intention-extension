console.log('何かが起こるはずです。');


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

window.setInterval(() => {
  console.log('every 60 seconds');
}, 1000 * 60)

// Page has finished loading
window.onload = function () {
  /** @type {HTMLVideoElement} */
  const video = document.querySelector("video");
  if (video) {
    const solid_box = document.createElement("div");
    video.style.position = "relative";
    solid_box.style.position = "absolute";
    solid_box.style.width = "100px";
    solid_box.style.height = "100px";
    solid_box.style.backgroundColor = "#FFC0CB";
    solid_box.style.bottom = '0';
    solid_box.style.zIndex = "99999";
    solid_box.style.transition = "all 0.5s";
    solid_box.style.left = "50%";
    solid_box.innerText = "死ね, ばか";
    solid_box.style.transform = "translateX(-50%)";
    video.parentElement.appendChild(solid_box);
    console.log("Element found:", video);
    // document.open()
    // document.write(new_page)
    // document.close()
    solid_box.onclick = () => {
      solid_box.style.display = "none";
    }
  } else {
    console.log("Element not found");
  }

  let num1 = Math.ceil(Math.random() * 12);
  let num2 = Math.ceil(Math.random() * 12);

  let answer = prompt(`${num1} * ${num2}`);

  alert((num1 * num2) == answer)
};

let currentVideo = "";


chrome.runtime.onMessage.addListener((obj, sender, response) => {
  console.log('i dont know if it works');
  const { type, value, videoId, random } = obj;
  if (type === "NEW") {
    currentVideo = videoId;
    newVideoLoaded(currentVideo);
    console.log('the new thing works lol');
  }
});

const newVideoLoaded = (video) => {
  console.log(`inside new video loaded ${video}`);
}

newVideoLoaded();
