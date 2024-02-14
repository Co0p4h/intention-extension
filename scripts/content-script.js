console.log('何かが起こるはずです。');


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

// document.open()
// document.write(new_page)
// document.close()

const html_test = chrome.runtime.getURL('test.html');
// fetch(html_test).then((html) => {
//     document.open()
//     document.write(html.json.toString)
//     document.close()
//     console.log("i got no clue if this is wokrign, htm_test");
// })

// do something when url changes
window.onclick = () => {
  console.log("clicked");
}

// window.setInterval(() => {
// page has finished loading
window.onload = () => {
  /** @type {HTMLVideoElement} */
  const video = document.querySelector("video");
  if (video) {
    console.log("Element found:", video);
    video.pause();

    const dim_video = document.createElement("div");
    dim_video.style.position = "absolute";
    dim_video.style.width = "100%";
    dim_video.style.height = "100%";
    dim_video.style.bottom = '0';
    dim_video.style.zIndex = "444"; dim_video.style.backgroundColor = "rgba(0,0,0,0.5)";
    video.parentElement.insertAdjacentElement("beforebegin", dim_video);

    // append html_test into the dim_video element

    dim_video.onclick = () => {
      dim_video.style.display = "none";
    }

    // const solid_box = document.createElement("div");
    const image = document.createElement("img");
    image.src = chrome.runtime.getURL("images/mem-webp.webp");
    video.style.position = "relative";
    image.style.position = "absolute";
    image.style.height = "55%";
    image.style.bottom = '0';
    image.style.right = '2rem';
    image.style.zIndex = "444";
    image.style.transition = "all 0.5s";
    video.parentElement.insertAdjacentElement("beforebegin", image);

    image.onclick = () => {
      image.style.width = "0";
      image.style.display = "none";

      chrome.runtime.sendMessage("close_tab", (response) => {
        console.log(response);
      });


    }

    const main_text = document.createElement("h1");
    main_text.style.position = "absolute";
    main_text.textContent = "死ね, ばか";
    main_text.style.color = "white";
    main_text.style.fontSize = "25px";
    main_text.style.transform = "translate(-50%, -50%)";
    main_text.style.top = "50%";
    main_text.style.left = "50%";
    dim_video.appendChild(main_text);

  } else {
    console.log("Element not found");
  };
  // let num1 = Math.ceil(Math.random() * 12);
  // let num2 = Math.ceil(Math.random() * 12);

  // let answer = prompt(`${num1} * ${num2}`);

  // alert((num1 * num2) == answer)
  // chrome.storage.local.set({ key: "value" }, () => {
  //   console.log(`Value is set to 'value'`);
  // });
};
// }, 1000);
