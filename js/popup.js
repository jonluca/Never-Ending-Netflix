var options;
$(() => {
  loadOptions(function (recOptions) {
    options = recOptions;
    $("#chkTitleSequence").prop('checked', options.skipTitleSequence);
    $("#chkPromptStillHere").prop('checked', options.skipStillHere);
    $("#chkPlayNext").prop('checked', options.autoPlayNext);
    $('input:checked').trigger('gumby.check');

    $('input').parent().on('gumby.onChange', function () {
      changeOption(this);
    });
  });
});

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
