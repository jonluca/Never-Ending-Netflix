/**
 * Internationalization Suite
 *
 * Label any feed that needs to be internationalized with the class "i18n". Then the id of the element should
 * correspond to the _locales/lang/messages.json top level key, and will be replaced with that keys message.
 *
 * If the language lookup fails, it defaults to the english string embedded within the HTML
 */

$(() => {
  $('.i18n').each((i, e) => {
    try {
      $(e).text(chrome.i18n.getMessage($(e).attr('id')));
    } catch (err) {
      console.log(e);
      console.log(err);
    }
  });

  $(".i18n-placeholder").each((i, e) => {
    try {
      $(e).attr('placeholder', chrome.i18n.getMessage($(e).attr('id')));
    } catch (err) {
      console.log(e);
      console.log(err);
    }
  });
});
