let options = {};
chrome.runtime.onMessage.addListener(onMessage);

function onMessage(message, sender, sendResponse) {
  if (message.action === 'optionsChanged') {
    options = message.options;
  }
}

$(() => {
  loadOptions(receivedOptions => {
    options = receivedOptions;
    if (receivedOptions.skipTitleSequence) {
      // It's a react app, so anytime they navigate away or to another title, we need to rehide/do all our options
      $('.main-header').on('click', '*', function () {
        startHelper();
      });
      startHelper();
    }
  });
});

function startHelper() {
  let selectors = [];

  if (options.skipTitleSequence) {
    enableSkipTitleSequence(selectors);
  }

  if (options.autoPlayNext) {
    enableAutoPlayNext(selectors);
  }

  if (options.skipStillHere) {
    /* Skip if still watching*/
    enableSkipStillHere(selectors);
  }

  if (options.hideDisliked) {
    hideDisliked();
  }

  /*Mutation observer for skippable elements*/
  const monitor = new MutationObserver(() => {
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
    const monitor = new MutationObserver(() => {
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

function enableAutoPlayNext(selectors) {
  /*Pulls all classes that start with "Watch Next" */
  selectors.push(".WatchNext-autoplay"); // Unknown if other international have localized class names
  selectors.push('.WatchNext-still-hover-container');
  selectors.push(".nfa-bot-6-em.nfa-right-5-em a:last-child");
  selectors.push('[aria-label^="Next episode"]');
}

function enableSkipTitleSequence(selectors) {
  /*Skip title sequence*/
  selectors.push('[aria-label="Skip Intro"]'); // American version will have this text, most reliable
  selectors.push('.skip-credits > a'); // Also include first descendant of skip-credits, in case it's international?
  selectors.push('[aria-label="Play"]'); //If the play button is clickable after skipped intro, it should be clicked.
}

function enableSkipStillHere(selectors) {
  selectors.push('.postplay-button');
}

function hideDisliked() {
  const monitor = new MutationObserver(() => {
    let disliked = $(".is-disliked");
    /*jQuery will return an array if multiple, or a single object if only one. .each will throw an error if it's only one*/
    if (Array.isArray(disliked)) {
      for (let card of disliked) {
        hideSliderItem(card);
      }
    } else {
      hideSliderItem(disliked);
    }
  });
  let mainCardView = document.getElementsByClassName("lolomo");
  if (mainCardView.length) {
    /*Start monitoring at react's entry point*/
    monitor.observe(mainCardView[0], {
      attributes: false, // Don't monitor attribute changes
      childList: true, //Monitor direct child elements (anything observable) changes
      subtree: true, // Monitor all descendants
      characterData: false // monitor direct text changes
    });
  }

}

function hideSliderItem(elem) {
  let parent = $(elem).parents(".slider-item");
  if (parent.length) {
    $(parent[0]).remove();
  }
}
