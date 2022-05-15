window.onload = function () {
  const button = document.querySelector("#btnNext");
  const hungryPirate = document.querySelector("#hungryPirate");
  const speechBubble = document.querySelector("#speechbubble");
  const thoughtBubble = document.querySelector("#thoughtbubble");
  const text = document.querySelector("#text");
  const bgm = document.querySelector("#bgm");
  const growl = document.querySelector("#growl");
  const seagull = document.querySelector("#seagull");

  var clickCount = 0;

  bgm.play();
  speechBubble.style.visibility = "visible";

  setInterval(function () {
    seagull.play();
  }, 10000);

  button.addEventListener("click", () => {
    playHungryPirate();
    hideSpeechBubble();
    clickCount++;

    if (clickCount > 1) window.location.replace("../fishing/fishing.html");
  });

  function playHungryPirate() {
    growl.play();
    hungryPirate.style.visibility = "visible";
    thoughtBubble.style.visibility = "visible";
    text.style.visibility = "visible";
    hungryPirate.addEventListener("click", growl.play());
  }

  function hideSpeechBubble() {
    speechBubble.style.visibility = "hidden";
  }
};
