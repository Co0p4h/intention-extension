console.log("from check script");

const reflect_video = document.getElementById("reflect_video");

if (reflect_video) {
  console.log("element found:", reflect_video);
  window.location.href = chrome.runtime.getURL("pages/blocked.html");
}