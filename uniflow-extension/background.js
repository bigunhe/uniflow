// UniFlow Sync — Background Service Worker (Manifest V3)
// Minimal: all logic lives in content.js via Shadow DOM injection.
// This service worker stays alive to satisfy MV3 requirements.

chrome.runtime.onInstalled.addListener(() => {
  console.log('[UniFlow] Extension installed.');
});
