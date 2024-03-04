console.log("何かが起こるはずです。");

const add_and_check_count = async () => {
  await chrome.runtime.sendMessage("add_count");
  // await chrome.runtime.sendMessage("check_count");
}

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

const main = async () => {
  /** @type {HTMLVideoElement | null} */

  const video = document.querySelector("video");
  if (!video) { console.log("video not found"); return; }

  // remove the elements from the page if they exist
  document.getElementById("reflect_main_text")?.remove();
  document.getElementById("reflect_image")?.remove();
  document.getElementById("reflect_video")?.remove();

  console.log("element found:", video);

  // catch the video when page is loaded
  video.addEventListener("loadeddata", () => {
    video.pause();
    // I want to make it so you can't play the video until you click yes
  });

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

  const delay_time = 2000;

  const change_text_and_hide = (text) => {
    main_text.textContent = text;
    yes_button.style.display = "none";
    no_button.style.display = "none";
    setTimeout(() => {
      // dim_video.style.display = "none";
      dim_video.remove();
    }, delay_time);
  }

  yes_button.onclick = () => {
    change_text_and_hide("You are a bad person");
    // add_and_check_count();
    chrome.runtime.sendMessage("add_count");

    video.play();
    // chrome.runtime.sendMessage({ click_status: "yes" });
    // video.controls = true;
  };

  no_button.onclick = () => {
    change_text_and_hide("You are a good person");
    // chrome.runtime.sendMessage({ click_status: "yes" });

    setTimeout(() => {
      chrome.runtime.sendMessage("close_tab", (response) => {
        console.log(response);
      });
    }, delay_time);
  };

  // catch when the page is refreshed
  video.pause();
}

// -----------------------------------------------
// all of this is still bad 
window.onload = () => {
  if (window.location.href.match("^https://www\.youtube\.com/shorts.*$")) {
    console.log("shorts video");
    return;
  } else {
    // check count
    main();
    console.log('from on load');
  }
};

// runs when url changes 
chrome.runtime.onMessage.addListener((request, sender, send_response) => {
  if (request.msg === "url_changed") {

    if (request.url.match("^https://www\.youtube\.com/shorts.*$")) {
      console.log("shorts video");
      return;
    } else {

      main();
      console.log('from on message');
    }
  }
});
