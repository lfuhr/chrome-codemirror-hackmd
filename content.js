script = document.createElement("script");
// script.src = "https://cdn.jsdelivr.net/gh/lfuhr/chrome-codemirror-hackmd/remote.js";
script.src = 'chrome-extension://' + chrome.runtime.id + '/remote.js';
document.head.appendChild(script)