console.log("何かが起こるはずです。");

const add_and_check_count = async () => {
  await chrome.runtime.sendMessage("add_count");
  await chrome.runtime.sendMessage("check_count");
}

// window.onclick = () => {
// chrome.runtime.sendMessage("add_count");
// }

// const test_style = "body { margin: 0; }\
//                     iframe {\
//                       position: absolute;\
//                       top: 0;\
//                       left: 0;\
//                       width: 100 %;\
//                       height: 100 %;\
//                       border: 0;\
//                     }"

// this should probably be in a background script...

//   // if (result.current_count < max_count) {
//   if (user_storage.current_count < user_storage.max_count) {
//     // chrome.storage.sync.set({ current_count: result.current_count + 1 }, () => {
//     chrome.storage.sync.set({ current_count: user_storage.current_count + 1 }, () => {
//       console.log("Value incremented");
//     });
//   } else { // this should be seperate function
//     // chrome.storage.sync.set({ current_count: 0 }, () => {
//     //   console.log("Value reset");
//     // });
//     // replace with a function that resets the value after a certain amount of time
//     // if the value is greater than 5 then replace the whole page with html and css 
//     // document.open();
//     // document.write(`<style>${test_style}</style>`)
//     // document.write(`<iframe src="${chrome.runtime.getURL("test.html")}"></iframe>`);
//     // document.close();
//     // replace url with extension url
//     // chrome.tabs.update({ url: chrome.runtime.getURL("test.html") });
//     console.log("You have reached the max count");
//   }
//   // });
// }

// function createDomElement(html) {
//   const dom = new DOMParser().parseFromString(html, 'text/html');
//   return dom.body.firstElementChild;
// }

// const element_test = createDomElement(`
//   <div>
//     <h1>testing element creation</h1>
//   </div>
// `);

// function to create button with different text
const createButton = (text, color = "black", background = "white") => {
  const button = document.createElement("button");
  button.textContent = text;
  button.style.color = color;
  button.style.backgroundColor = background;
  button.style.border = `1px solid white`
  button.style.padding = "0.75rem 1.75rem";
  button.style.borderRadius = "0.25rem";
  button.style.cursor = "pointer";
  return button;
}

const code = () => {
  /** @type {HTMLVideoElement | null} */
  const video = document.querySelector("video");
  if (!video) { console.log("Element not found"); return; }
  console.log("Element found:", video);

  // pause the video, there is probably a better way to do this using some wait function or something...
  setTimeout(() => {
    video.pause();
  }, 444);

  const dim_video = document.createElement("div");
  dim_video.id = "reflect_video";
  dim_video.style.position = "absolute";
  dim_video.style.width = "100%";
  dim_video.style.height = "100%";
  dim_video.style.bottom = "0";
  dim_video.style.zIndex = "444";
  dim_video.style.backgroundColor = "rgba(0,0,0,0.75)";
  video.parentElement.insertAdjacentElement("beforebegin", dim_video);

  const image = document.createElement("img");
  image.id = "reflect_image";
  image.src = chrome.runtime.getURL("images/mem-webp.webp");
  video.style.position = "relative";
  image.style.position = "absolute";
  image.style.height = "60%";
  image.style.bottom = "0";
  image.style.right = "2rem";
  image.style.zIndex = "444";
  image.style.transition = "all 0.5s";
  image.style.pointerEvents = "none";
  dim_video.appendChild(image);

  const dim_video_content = document.createElement("div");
  dim_video_content.style.display = "flex";
  dim_video_content.style.justifyContent = "center";
  dim_video_content.style.alignContent = "center";
  dim_video_content.style.flexWrap = "wrap";
  dim_video_content.style.alignItems = "center";
  dim_video_content.style.flexDirection = "column";
  dim_video_content.style.height = "100%";
  dim_video_content.style.gap = "0.75rem";
  dim_video.appendChild(dim_video_content);

  const main_text = document.createElement("h1");
  main_text.id = "reflect_main_text";
  // main_text.textContent = "死ね, ばか";
  main_text.innerHTML = "are you sure you<br>want to watch this?";
  main_text.style.color = "white";
  main_text.style.fontSize = "2.5rem";
  main_text.style.textAlign = "center";
  main_text.style.fontWeight = "400";
  main_text.style.letterSpacing = "0.1rem";
  dim_video_content.appendChild(main_text);

  const buttons = document.createElement("div");
  buttons.style.display = "flex";
  buttons.style.gap = "1rem";
  dim_video_content.appendChild(buttons);

  const yes_button = createButton("yes", "white", "black");
  const no_button = createButton("no", "black", "white");
  buttons.appendChild(yes_button);
  buttons.appendChild(no_button);
  no_button.focus();

  const change_text_and_hide = (text) => {
    main_text.textContent = text;
    yes_button.style.display = "none";
    no_button.style.display = "none";
    setTimeout(() => {
      dim_video.style.display = "none";
    }, 2000);
  }

  yes_button.onclick = () => {
    change_text_and_hide("You are a bad person");
    add_and_check_count();
  };

  no_button.onclick = () => {
    change_text_and_hide("You are a good person");

    // probably a better way to do this instead of changing both settimeouts
    chrome.runtime.sendMessage("close_tab", (response) => {
      console.log(response);
    });
  };
}

// before the page loads? TODO: look this up later
chrome.runtime.sendMessage("check_count");

// page has finished loading
window.onload = () => {
  code();

  chrome.runtime.onMessage.addListener((request, sender, send_response) => {
    document.getElementById("reflect_main_text").remove();
    document.getElementById("reflect_image").remove();
    document.getElementById("reflect_video").remove();
    code();
  });
};