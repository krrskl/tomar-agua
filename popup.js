"use strict";
fetch("language/index.json")
  .then(response => response.json())
  .then(json => {
    chrome.storage.sync.get(["config"], item => {
      document.getElementById("txt1").innerText =
        json[`${item.config.language}`].popup.txt1;

      document.getElementById("txt2").innerText =
        json[`${item.config.language}`].popup.txt2;

      document.getElementById("pause").innerText =
        json[`${item.config.language}`].popup.buttonPause;

      document.getElementById("made").innerText =
        json[`${item.config.language}`].popup.rights.made;

      document.getElementById("by").innerText =
        json[`${item.config.language}`].popup.rights.by;

      document.getElementById("cbx").checked = item.config.sound;

      // values for select of languages
      json[`${item.config.language}`].languages.forEach(element => {
        document.getElementById(
          "selectLanguage"
        ).innerHTML += `<option value="${element.value}" ${
          element.value == item.config.language ? "selected" : ""
        }>${element.title}</option>`;
      });
    });
  });

function setAlarm(event) {
  let minutes = parseFloat(event.target.value);
  chrome.browserAction.setBadgeBackgroundColor({ color: "#f44336" });
  chrome.browserAction.setBadgeText({ text: "ON" });
  chrome.alarms.create({ delayInMinutes: minutes });
  chrome.storage.sync.set({ minutes: minutes });
  window.close();
}

function pauseAlarm() {
  chrome.browserAction.setBadgeText({ text: "" });
  chrome.alarms.clearAll();
  window.close();
}

function setConfig(language, audio) {
  chrome.storage.sync.get(["config"], item => {
    chrome.storage.sync.set({
      config: {
        language: language != null ? language : item.config.language,
        sound: audio != null ? audio : item.config.sound
      }
    });
  });
}

function selectLanguageChange() {
  let language = document.getElementById("selectLanguage").value;
  setConfig(language, null);
  window.close();
}

function changeCheckBox() {
  let audio = document.getElementById("cbx").checked;
  setConfig(null, audio);
}

document.getElementById("15min").addEventListener("click", setAlarm);
document.getElementById("30min").addEventListener("click", setAlarm);
document.getElementById("45min").addEventListener("click", setAlarm);
document.getElementById("60min").addEventListener("click", setAlarm);
document.getElementById("pause").addEventListener("click", pauseAlarm);
document
  .getElementById("selectLanguage")
  .addEventListener("change", selectLanguageChange);
document.getElementById("cbx").addEventListener("change", changeCheckBox);
