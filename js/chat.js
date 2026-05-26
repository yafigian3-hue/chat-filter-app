function createMessageElement(msg) {
  const div = document.createElement("div");

  div.className = `p-3 rounded-2xl
  max-w-[85%] sm:max-w-[75%]
  break-words
  transition-all duration-300
  shadow-sm
  ${
    msg.user === "You"
      ? "bg-blue-100 border border-blue-300 ml-auto"
      : msg.user === "Admin"
        ? "bg-purple-100 border border-purple-300"
        : "bg-gray-100 border border-gray-300"
  }`;

  let displayText = msg.text;

  if (regex && msg.isBad) {
    displayText = msg.text.replace(regex, (m) => {
      return `<span class="text-red-500 font-semibold">${m}</span>`;
    });
  }

  div.innerHTML = `
  <div class="flex items-start justify-between mb-1">
    <span class="font-bold text-gray-700">
      ${msg.user}
    </span>

    <div class="flex items-center gap-1">
      <button
        class="editBtn
        w-6 h-6
        flex items-center justify-center
        rounded-full
        text-blue-500
        hover:bg-blue-200/60
        transition"
        data-id="${msg.id}"
      >
        ✏️
      </button>

      <button
        class="deleteBtn
        w-6 h-6
        flex items-center justify-center
        rounded-full
        text-red-500
        hover:bg-red-200/60
        transition"
        data-id="${msg.id}"
      >
        🗑️
      </button>
    </div>
  </div>

  <div class="text-[15px] leading-relaxed text-gray-800">
    ${displayText}
  </div>

  <div class="flex justify-end mt-1">
    <span class="text-[11px] text-gray-400">
      ${msg.time}
    </span>
  </div>
`;

  chatBox.appendChild(div);

  chatBox.scrollTop = chatBox.scrollHeight;
}

function renderMessages() {
  chatBox.innerHTML = "";

  messages.forEach((msg) => {
    createMessageElement(msg);
  });
}

chatBox.addEventListener("click", function (e) {
  if (e.target.classList.contains("deleteBtn")) {
    const id = e.target.dataset.id;

    messages = messages.filter((msg) => msg.id !== id);

    saveMessages();

    renderMessages();
  }

  if (e.target.classList.contains("editBtn")) {
    const id = e.target.dataset.id;

    const message = messages.find((msg) => msg.id === id);

    if (!message) return;

    const newText = prompt("Edit Pesan:", message.text);

    if (newText === null) return;

    if (newText.trim() === "") return;

    message.text = newText;

    const matches = regex ? newText.match(regex) || [] : [];

    message.isBad = matches.length > 0;

    saveMessages();

    renderMessages();
  }
});

function showTyping() {
  const oldTyping = document.getElementById("typingIndicator");

  if (oldTyping) {
    oldTyping.remove();
  }

  const typingDiv = document.createElement("div");

  typingDiv.id = "typingIndicator";

  typingDiv.className =
    "bg-gray-100 border border-gray-300 p-3 rounded-2xl max-w-[85%] sm:max-w-[75%] text-sm text-gray-500 italic shadow-sm";

  typingDiv.innerHTML = `
    <div class="text-xs font-bold mb-2">Bot</div>

    <div class="flex gap-1 items-center">
      <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
      <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
      <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
    </div>
  `;

  chatBox.appendChild(typingDiv);

  chatBox.scrollTop = chatBox.scrollHeight;
}
