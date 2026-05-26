let messages = JSON.parse(localStorage.getItem("messages")) || [];

function saveMessages() {
  localStorage.setItem("messages", JSON.stringify(messages));
}
