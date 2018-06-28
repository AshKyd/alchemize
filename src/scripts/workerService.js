var toolbox = require("sw-toolbox");
toolbox.options.debug = true;
toolbox.router.default = toolbox.fastest;

// Boilerplate to ensure our service worker takes control of the page as soon
// as possible.
global.addEventListener("install", event =>
  event.waitUntil(global.skipWaiting())
);
global.addEventListener("activate", event =>
  event.waitUntil(global.clients.claim())
);
