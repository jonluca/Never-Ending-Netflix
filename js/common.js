// Load options from local storage
// Return default values if none exist
function loadOptions(callback) {
  chrome.storage.sync.get('options', items => {
    let options = items['options'];
    if (options == null || options === "{}") {
      options = {};
    }

    options.skipStillHere = options.hasOwnProperty('skipStillHere') ? options.skipStillHere : true;
    options.autoPlayNext = options.hasOwnProperty('autoPlayNext') ? options.autoPlayNext : true;
    options.watchCredits = options.hasOwnProperty('watchCredits') ? options.watchCredits : false;
    options.skipTitleSequence = options.hasOwnProperty('skipTitleSequence') ? options.skipTitleSequence : true;
    options.disableAutoPlayOnBrowse = options.hasOwnProperty('disableAutoPlayOnBrowse') ? options.disableAutoPlayOnBrowse : false;
    options.hideDisliked = options.hasOwnProperty('hideDisliked') ? options.hideDisliked : false;
    options.highContrast = options.hasOwnProperty('highContrast') ? options.highContrast : false;

    chrome.storage.sync.set({
      'options': options
    }, _ => {
      callback(options);
    });
  });

}

// Send options to all tabs and extension pages
function sendOptions(options) {
  let request = {
    action: 'optionsChanged',
    'options': options
  };

  // Send options to all tabs
  chrome.windows.getAll(null, function (windows) {
    for (let i = 0; i < windows.length; i++) {
      chrome.tabs.getAllInWindow(windows[i].id, function (tabs) {
        for (let j = 0; j < tabs.length; j++) {
          chrome.tabs.sendMessage(tabs[j].id, request);
        }
      });
    }
  });

  // Send options to other extension pages
  chrome.runtime.sendMessage(request);
}