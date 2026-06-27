// src/polyfills.js
import "core-js/stable";
import "regenerator-runtime/runtime";

// Additional polyfills if needed
if (typeof window !== "undefined") {
  // Buffer polyfill
  if (typeof window.Buffer === "undefined") {
    window.Buffer = require("buffer").Buffer;
  }

  // Process polyfill
  if (typeof window.process === "undefined") {
    window.process = require("process/browser");
  }
}
