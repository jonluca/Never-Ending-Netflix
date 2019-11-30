function _findPropertyNameByRegex(o, r) {
  if (!o) {
    return null;
  }
  for (var key in o) {
    if (key.match(r)) {
      return key;
    }
  }
  return undefined;
}

function enableAutoPlayNext(selectors) {
  /*Pulls all classes that start with "Watch Next" */
  selectors.push(".WatchNext-autoplay"); // Unknown if other international have localized class names
  selectors.push('.WatchNext-still-hover-container');
  selectors.push('[aria-label^="Next episode"]');
  selectors.push('[data-uia^="next-episode-seamless-button"]');
}

function enableSkipTitleSequence(selectors) {
  /*Skip title sequence*/
  selectors.push('[aria-label="Skip Intro"]'); // American version will have this text, most reliable
  selectors.push('.skip-credits > a'); // Also include first descendant of skip-credits, in case it's international?
}

function enableSkipStillHere(selectors) {
  selectors.push('.interrupter-actions > .nf-icon-button:first-child');
  selectors.push('[aria-label^="Continue Playing"]');
}

function enableWatchCredits(selectors) {
  selectors.push('[aria-label^="Watch credits"]');
  selectors.push('[data-uia^="watch-credits-seamless-button"]');
}