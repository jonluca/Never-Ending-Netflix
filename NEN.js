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
    selectors.push(".WatchNext-autoplay"); // Unknown if other international have localized class names
    selectors.push('.WatchNext-still-hover-container');
    selectors.push(".nfa-bot-6-em.nfa-right-5-em a:last-child");
    selectors.push('[aria-label^="Next episode"]');
  }

  if (options.skipStillHere) {
    /* Skip if still watching*/
    selectors.push('.postplay-button');
  }

  /*Mutation observer for skippable elements*/
  const monitor = new MutationObserver(function () {
    for (const selector of selectors) {
      let elem = document.querySelectorAll(selector);
      if (elem && elem.length) {
        elem[0].click();
      }
    }

    if (options.disableAutoPlayOnBrowse) {
      disableAutoPreview();
    }
  });

  /*Start monitoring at react's entry point*/
  monitor.observe(document.getElementById("appMountPoint"), {
    attributes: false, // Don't monitor attribute changes
    childList: true, //Monitor direct child elements (anything observable) changes
    subtree: true, // Monitor all descendants
    characterData: true // monitor direct text changes
  });

  if (options.disableAutoPlayOnBrowse) {
    disableAutoPreview();
  }

}

function disableAutoPreview() {
  // let hasMuted = false;
  let billboard = document.querySelectorAll(".billboard-row");
  if (billboard.length) {

    /*Mutation observer to actually remove the auto playing video*/
    const monitor = new MutationObserver(function () {
      // if (!hasMuted) {
      //   hasMuted = true;
      //   /*
      //    * This is a pretty hacky way of doing this - we hide the video player, force show the background card, and
      // then click * the mute button. TODO look into more concrete way of hiding player * */ $(".NFPlayer").hide();
      // let staticImage = document.querySelectorAll(".static-image"); if (staticImage.length) {
      // staticImage[0].style.opacity = "1"; } let audio = billboard[0].querySelector(".icon-button-audio-on"); if
      // (audio) { audio.click(); } }

      // This removes the top billboard entirely - that's better than the hacky way that was being done above
      $(".billboard-row").remove();
    });

    monitor.observe(billboard[0], {
      attributes: true, // Don't monitor attribute changes
      childList: true, //Monitor direct child elements (anything observable) changes
      subtree: true, // Monitor all descendants
      characterData: true // monitor direct text changes
    });
  }

}