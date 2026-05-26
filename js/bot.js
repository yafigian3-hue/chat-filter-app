function botReply(userText, isBad) {
  const typingIndicator = document.getElementById("typingIndicator");

  if (typingIndicator) {
    typingIndicator.remove();
  }

  const text = userText.toLowerCase();

  let reply = "";

  if (isBad) {
    reply = "Mohon gunakan bahasa yang sopan 🙏";
  } else if (text.includes("halo") || text.includes("hai")) {
    reply = "Halo juga 👋";
  } else {
    const randomReplies = ["Menarik 👀", "Oke 👍", "Saya mengerti 👌"];

    reply = randomReplies[Math.floor(Math.random() * randomReplies.length)];
  }

  const newMessage = {
    id: crypto.randomUUID(),
    user: "Bot",
    text: reply,
    isBad: false,
    time: getTime(),
  };

  messages.push(newMessage);

  saveMessages();

  createMessageElement(newMessage);
}
