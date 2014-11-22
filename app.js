chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    id: "container",
    bounds: {
      width: 320,
      height: 240
    }
  });
});
