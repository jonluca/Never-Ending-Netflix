let options = {};
chrome.runtime.onMessage.addListener(onMessage);

function onMessage(message, sender, sendResponse) {
  if (message.action === 'optionsChanged') {
    options = message.options;
  }
}

$(() => {
  loadOptions(function (receivedOptions) {
    options = receivedOptions;
    if (receivedOptions.skipTitleSequence) {
      startHelper();
    }
  });
});

function startHelper() {
  let selectors = [];

  if (options.skipTitleSequence) {
    /*Skip title sequence*/
    selectors.push('[aria-label="Skip Intro"]'); // American version will have this text, most reliable
    selectors.push('.skip-credits > a'); // Also include first descendant of skip-credits, in case it's international?
  }

  if (options.autoPlayNext) {
    /*Pulls all classes that start with "Watch Next" */
    selectors.push("[class^=WatchNext]"); // Unknown if other international have localized class names
    selectors.push(".nfa-bot-6-em.nfa-right-5-em a:last-child");
    selectors.push('[aria-label^="Next episode"]');
  }

  if (options.skipStillHere) {
    /* Skip if still watching*/
    selectors.push('.postplay-button');
  }

  const monitor = new MutationObserver(function () {
    for (const selector of selectors) {
      let elem = document.querySelectorAll(selector);
      if (elem && elem.length) {
        elem[0].click();
      }
    }
  });

  monitor.observe(document.getElementById("appMountPoint"), {
    attributes: false, // Don't monitor attribute changes
    childList: true, //Monitor direct child elements (anything observable) changes
    subtree: true, // Monitor all descendants
    characterData: true // monitor direct text changes
  });

  if (options.disableAutoPlayOnBrowse) {
    disableAutoPreview();
    setTimeout(disableAutoPreview, 3 * 1000);
    /*Call this twice, in case someone is on slow internet */
  }

}

function disableAutoPreview() {
  $(".NFPlayer").hide();
  let staticImage = document.querySelectorAll(".static-image");
  if (staticImage.length) {
    staticImage[0].style.opacity = "1";
  }
  let audio = document.querySelectorAll(".icon-button-audio-on");
  if (audio.length) {
    audio[0].click();
  }

}