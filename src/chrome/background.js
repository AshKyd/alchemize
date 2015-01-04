chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    id: 'alchemize'+chrome.app.window.getAll().length,
    minWidth: 500,
    minHeight:400
  });
});
