function createMessageElement(msg) {
  const div = document.createElement("div");

  const isYou = msg.user === "You";

  div.className = `
  max-w-[85%] sm:max-w-[75%]
  px-4 py-3
  break-words
  shadow-sm
  transition-all duration-300
  relative 
 ${
   isYou
     ? "ml-auto bg-slate-700 text-white rounded-2xl rounded-br-md"
     : "bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-md"
 }
  `;

  let displayText = msg.text;

  if (regex && msg.isBad) {
    displayText = msg.text.replace(regex, (m) => {
      return `
       <span class="
    text-red-400
    font-semibold
    animate-pulse
  ">
        ${m}
      </span>
    `;
    });
  }

  div.innerHTML = `
  <div class="flex items-start justify-between mb-1">
   <span class="font-bold text-sm ${isYou ? "text-slate-200" : "text-gray-700"}">
  ${msg.user}
</span>

    <div class="flex items-center gap-1">
      <button
       class="
        editBtn
        w-6 h-6
        flex items-center justify-center
        rounded-full
        ${
          isYou
            ? "text-slate-200 hover:bg-white/20"
            : "text-blue-500 hover:bg-blue-200/60"
        }
        transition"
        data-id="${msg.id}"
      >
        ✏️
      </button>

      <button
       class="
        deleteBtn
        w-6 h-6
        flex items-center justify-center
        rounded-full
        ${isYou ? "text-red-100 hover:bg-white/20" : "text-red-500 hover:bg-red-200/60"}
        transition"
        data-id="${msg.id}"
      >
        🗑️
      </button>
    </div>
  </div>

 <div class="text-[15px] leading-relaxed ${
   isYou ? "text-white" : "text-gray-800"
 }">
    ${displayText}
  </div>

  <div class="flex justify-end mt-1">
    <span class="text-[11px] ${isYou ? "text-slate-200" : "text-gray-400"}">
      ${msg.time}
    </span>
  </div>
`;

  chatBox.appendChild(div);

  chatBox.scrollTo({
    top: chatBox.scrollHeight,
    behavior: "smooth",
  });
}

function renderMessages(searchText = "") {
  chatBox.innerHTML = "";

  const filteredMessages = messages.filter((msg) =>
    msg.text.toLowerCase().includes(searchText.toLowerCase()),
  );

  if (messages.length === 0) {
    chatBox.innerHTML = `
      <div class="h-full flex items-center justify-center">
        <div class="text-center text-gray-400">
          <div class="text-5xl mb-3">💬</div>

          <h2 class="font-semibold text-lg">
            Belum ada pesan
          </h2>

          <p class="text-sm mt-1">
            Mulai percakapan sekarang
          </p>
        </div>
      </div>
    `;

    return;
  }

  if (filteredMessages.length === 0) {
    chatBox.innerHTML = `
      <div class="h-full flex items-center justify-center">
        <div class="text-center text-gray-400">
          <div class="text-5xl mb-3">🔍</div>

          <h2 class="font-semibold text-lg">
            Pesan tidak ditemukan
          </h2>
        </div>
      </div>
    `;

    return;
  }

  filteredMessages.forEach((msg) => {
    createMessageElement(msg);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

chatBox.addEventListener("click", function (e) {
  const editBtn = e.target.closest(".editBtn");
  const deleteBtn = e.target.closest(".deleteBtn");

  if (deleteBtn) {
    const id = deleteBtn.dataset.id;

    messages = messages.filter((msg) => msg.id !== id);

    saveMessages();

    renderMessages();
  }

  if (editBtn) {
    const id = editBtn.dataset.id;

    const message = messages.find((msg) => msg.id === id);

    if (!message) return;

    editingMessageId = id;

    editInput.value = message.text;

    editModal.classList.remove("hidden");
    editModal.classList.add("flex");

    editInput.focus();
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

  chatBox.scrollTo({
    top: chatBox.scrollHeight,
    behavior: "smooth",
  });
}
