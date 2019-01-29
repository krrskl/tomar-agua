"use strict";
const audio = new Audio("audio/pour_glass_water.mp3");

chrome.runtime.onInstalled.addListener(data => {
  if (data.reason === "install") {
    chrome.storage.sync.set({ config: { language: "es", sound: true } }, () => {
      chrome.tabs.create({ url: "welcome.html" });
    });
  }
});

chrome.alarms.onAlarm.addListener(() => {
  chrome.browserAction.setBadgeText({ text: "" });
  chrome.browserAction.setBadgeBackgroundColor({ color: "#f44336" });

  fetch("language/index.json")
    .then(response => response.json())
    .then(json => {
      chrome.storage.sync.get(["config"], item => {
        var options = {
          type: "basic",
          iconUrl: "img/water_logo_extension.png",
          title: json[`${item.config.language}`].title,
          message: json[`${item.config.language}`].message,
          buttons: [{ title: json[`${item.config.language}`].buttonText }],
          priority: 0
        };
        if (item.config.sound) audio.play();
        chrome.notifications.create(options);
      });
    });
});

function setTimeNotification() {
  chrome.storage.sync.get(["minutes"], item => {
    chrome.browserAction.setBadgeText({ text: "ON" });
    chrome.browserAction.setBadgeBackgroundColor({ color: "#f44336" });
    chrome.alarms.create({ delayInMinutes: item.minutes });
  });
}

chrome.runtime.onStartup.addListener(() => {
  setTimeNotification();
});

/* chrome.notifications.onButtonClicked.addListener(() => {
  setTimeNotification();
}); */

chrome.notifications.onClosed.addListener(() => {
  setTimeNotification();
});
