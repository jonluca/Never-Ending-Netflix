let options;
let fuse;

$(() => {
  $('body').on('click', 'a', function () {
    chrome.tabs.create({url: $(this).attr('href')});
    return false;
  });
  loadOptions(function (recOptions) {
    options = recOptions;
    $("#chkTitleSequence").prop('checked', options.skipTitleSequence);
    $("#chkPromptStillHere").prop('checked', options.skipStillHere);
    $("#chkPlayNext").prop('checked', options.autoPlayNext);
    $("#chkDisAutoPlayInBrowse").prop('checked', options.disableAutoPlayOnBrowse);
    $("#chkHideDownvoted").prop('checked', options.hideDisliked);
    $('input:checked').trigger('gumby.check');

    $('input').parent().on('gumby.onChange', function () {
      changeOption(this);
    });

    reloadSearchLibrary();
    searchOnTypingListener();
  });
});

function constructResultDiv(elem) {
  let divString = `<div class='entry'><a href="${elem.link}">${elem.genre}</a></div>`;
  return divString;
}

function reloadSearchLibrary() {
  $.ajax({
    method: 'GET',
    url: chrome.runtime.getURL("data/genres.json"),
    dataType: 'json',
    success: function (data, textStatus, jqXHR) {
      let options = {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 3,
        keys: ["genre"]
      };
      fuse = new Fuse(data, options); // Text search library through all genres
    }
  });
}

function searchOnTypingListener() {
  /*Event listenere for typing in genre*/
  $('#genreSearch').on('keyup', function () {
    $("#results").html("");
    if (this.value.length > 1 && fuse != undefined) {
      /* Clear div results*/
      // do search for this.value here
      var results = fuse.search(this.value);
      if (results.length) {
        for (let i = 0; i < 100; i++) {
          if (results.length === i - 1) {
            break;
          }
          let entry = constructResultDiv(results[i]);
          $("#results").append(entry);
        }
      }
    }
  });
}

function changeOption(elem) {
  switch (elem.htmlFor) {
    case "chkTitleSequence":
      options.skipTitleSequence = $('#chkTitleSequence')[0].checked;
      break;
    case "chkPlayNext":
      options.autoPlayNext = $('#chkPlayNext')[0].checked;
      break;
    case "chkPromptStillHere":
      options.skipStillHere = $('#chkPromptStillHere')[0].checked;
      break;
    case "chkDisAutoPlayInBrowse":
      options.disableAutoPlayOnBrowse = $('#chkDisAutoPlayInBrowse')[0].checked;
      break;
    case "chkHideDownvoted":
      options.hideDisliked = $('#chkHideDownvoted')[0].checked;
      break;

  }
  saveOptions();

}

function saveOptions() {
  chrome.storage.sync.set({
    'options': options
  }, () => {
    sendOptions(options);
  });
}
