// console.log("何かが起こるはずです。");

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

const generate_video_overlay = () => {
  /** @type {HTMLVideoElement | null} */
  const video = document.querySelector("video");
  if (!video) return;

  // remove the elements from the page if they exist
  document.getElementById("reflect_main_text")?.remove();
  document.getElementById("reflect_image")?.remove();
  document.getElementById("reflect_video")?.remove();

  const pause_video = () => video.pause();
  // catch the video when page is initially loaded
  video.addEventListener("loadeddata", pause_video);
  // catch when the page is refreshed
  pause_video();

  const dim_video = document.createElement("div");
  dim_video.id = "reflect_video";
  dim_video.style.position = "absolute";
  dim_video.style.width = "100%";
  dim_video.style.height = "100%";
  dim_video.style.bottom = "0";
  dim_video.style.zIndex = "4444";
  dim_video.style.backgroundColor = "rgba(0,0,0,0.75)";
  video.parentElement.insertAdjacentElement("beforebegin", dim_video);

  // add the event listener to the video if they try to play it
  document.onkeydown = (e) => {
    const buttons = document.getElementById("reflect-buttons");
    if (e.code === "Space" && buttons) {
      video.addEventListener("playing", pause_video);
    }
  };

  const image = document.createElement("img");
  image.id = "reflect_image";
  image.src = chrome.runtime.getURL("images/mem-webp.webp");
  video.style.position = "relative";
  image.style.position = "absolute";
  image.style.height = "60%";
  image.style.bottom = "0";
  image.style.right = "2rem";
  image.style.zIndex = "4444";
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
  buttons.id = "reflect-buttons";
  buttons.style.display = "flex";
  buttons.style.gap = "1rem";
  dim_video_content.appendChild(buttons);

  const yes_button = createButton("yes", "white", "black");
  const no_button = createButton("no", "black", "white");
  buttons.appendChild(yes_button);
  buttons.appendChild(no_button);
  no_button.focus();

  const delay_time = 2000;

  const change_text_and_remove = async (text) => {
    main_text.textContent = text;
    buttons.remove();
    setTimeout(() => {
      dim_video.remove();
    }, delay_time);
  }

  const show_notification = (current_count, max_count) => {
    const notification = document.createElement("div");
    notification.style.position = "fixed";
    notification.style.bottom = "2rem";
    notification.style.right = "2rem";
    notification.style.padding = "2rem";
    notification.style.backgroundColor = "#212121";
    notification.style.boxShadow = "0 0 1rem 0.25rem rgba(0,0,0,0.25)";
    notification.style.color = "white";
    notification.style.borderRadius = "0.5rem";
    notification.style.zIndex = "4444";
    notification.style.fontSize = "1.25rem";
    notification.style.cursor = "pointer";
    if (current_count < max_count) {
      notification.innerHTML = `you have watched <span>${current_count}</span> videos. you can watch <span>${max_count - current_count}</span> more.`;
    } else {
      notification.innerHTML = `you have watched ${current_count} videos. this is your <span>last video!</span>`;
    }
    notification.querySelectorAll("span").forEach(span => {
      span.style.color = "red";
      span.style.fontWeight = "400";
      span.style.fontSize = "1.5rem";
    });

    notification.onclick = () => notification.remove();

    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  yes_button.onclick = () => {
    chrome.runtime.sendMessage("add_count", async (response) => {
      const { current_count } = response;
      const { max_count } = await chrome.storage.local.get("max_count");
      show_notification(current_count, max_count);
    });
    // change_text_and_remove('(*´∀`)~♥');
    change_text_and_remove("do better next time (´；ω；｀)");
    video.removeEventListener("playing", pause_video);
    video.play();
  };

  no_button.onclick = () => {
    change_text_and_remove("omg you are so brave (*´ω｀*)");
    setTimeout(() => {
      chrome.runtime.sendMessage("close_tab");
    }, delay_time);
  };

  // return video;
}

// -----------------------------------------------

// ALL OF THIS IS BAD 

const is_shorts_video = (url) => {
  const websites = ["^https://www\.youtube\.com/shorts.*$", "^https://www\.instagram\.com/reels.*$"];
  return websites.some(website => url.match(website));
  // return url.match("^https://www\.youtube\.com/shorts.*$");
}

// initial run when the page is initally loaded
window.onload = () => {
  if (is_shorts_video(window.location.href)) return;
  generate_video_overlay();
  // console.log('from on load');
};

// runs when url changes 
chrome.runtime.onMessage.addListener((request, sender, send_response) => {
  if (request.msg === "url_changed" && !is_shorts_video(request.url)) {
    generate_video_overlay();
    // console.log('from on message');
  }
});
