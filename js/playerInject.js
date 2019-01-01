/*
 This file was created to fix the pausing issue after the Netflix update of November 2018. Unfortunately content scripts
 don't have access to window variables. We have to inject this into the page to get access to the netflix API object, and
 from there subscribe to an event that will be published by the NEN.js script.
 */

function clickPlay() {
  const api = window.netflix.appContext.state.playerApp.getAPI();

  const sessionId = api.videoPlayer.getAllPlayerSessionIds()[0];

  const player = api.videoPlayer.getVideoPlayerBySessionId(sessionId);
  player.play(); // Clicking play multiple times is idempotent
}

document.addEventListener('playEvent', function () {
  try {
    clickPlay();
  } catch (e) {
    console.error(e);
  }
  // Try clicking play twice a second for 2 seconds, in case it pauses weirdly
  let interval = setInterval(clickPlay, 500);
  setTimeout(_ => {
    clearInterval(interval);
    // clear interval after 2s
  }, 2000);
});