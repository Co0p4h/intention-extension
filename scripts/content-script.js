console.log("何かが起こるはずです。");

// const max_count = 3;

/** @type {number} */


// const user_storage = { current_count: 0, max_count: 0 };

// const stor = async () => {
//   const storage = chrome.storage.sync.get().then((items) => {
//     user_storage.current_count = items.current_count;
//     user_storage.max_count = items.max_count;
//     // console.log(user_storage, "user storage");
//   });

//   try {
//     await storage;
//     console.log("user storage", user_storage);
//   } catch (e) {
//     console.log(e, "you are stupid");
//   }
// }

const update_count = async () => {
  chrome.storage.sync.get("current_count").then((result) => {
    const new_count = result.current_count + 1;
    chrome.storage.sync.set({ current_count: new_count }).then(() => {
      console.log(`Value is set to ${new_count}`);
    });
  });
}


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
  if (video) {
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
    // dim_video.style.animationDuration = "0.5s";
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

    image.onclick = () => {
      image.style.width = "0";
      image.style.display = "none";
      video.play();

      test1();

    };

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
    // main_text.textContent = "";
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
    no_button.focus(); // auto focus on no button

    const change_text_and_hide = (text) => {
      main_text.textContent = text;
      yes_button.style.display = "none";
      no_button.style.display = "none";
      setTimeout(() => {
        dim_video.style.display = "none";
      }, 2000);
    }

    yes_button.onclick = () => {
      change_text_and_hide("You are a good person");
    };

    no_button.onclick = () => {
      change_text_and_hide("You are a bad person");
      // probably a better way to do this instead of changing both settimeouts
      chrome.runtime.sendMessage("close_tab", (response) => {
        console.log(response);
      });
    };

  } else {
    console.log("Element not found");
    console.log(document.getElementById("reflect_main_text"));
    console.log(document.getElementById("reflect_image"));
    console.log(document.getElementById("reflect_video"));
  }
}


// page has finished loading
window.onload = () => {
  code();
  test1();
  // let num1 = Math.ceil(Math.random() * 12);
  // let num2 = Math.ceil(Math.random() * 12);
  // let answer = prompt(`${num1} * ${num2}`);
  // alert((num1 * num2) == answer)
  // chrome.storage.local.set({ key: "value" }, () => {
  //   console.log(`Value is set to 'value'`);
  // });

  chrome.runtime.onMessage.addListener((request, sender, send_response) => {
    // if (request.msg === "tab_updated") {
    // if message is something to do with tab id...
    console.log(`what the fuck am I doing??????? ${request.msg}`);
    console.log(`what the fuck am I doing??????? ${request.url}`);
    console.log(`what the fuck am I doing??????? ${sender.id}`);
    console.log(`what the fuck am I doing??????? ${request.tab_id}`);

    document.getElementById("reflect_main_text").remove();
    document.getElementById("reflect_image").remove();
    document.getElementById("reflect_video").remove();

    code();
    // };
  });

  window.onclick = () => {
    chrome.runtime.sendMessage("close_tab", (response) => {
      console.log(response);
      update_count();
    });

    // chrome.runtime.sendMessage("add_count", (response) => {
    //   console.log('what the tkljwetkljwekltjwekl j');
    //   console.log("add c messaeg", response);
    //   console.log(response);
    // });
  }
};

async function test1() {
  const data = await chrome.storage.sync.get("test");
  console.log(data);

}