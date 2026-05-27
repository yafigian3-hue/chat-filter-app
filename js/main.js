const ketik = document.getElementById("ketik");
const statusBox = document.getElementById("statusBox");
const chatBox = document.getElementById("chatBox");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const userSelect = document.getElementById("userSelect");
const editModal = document.getElementById("editModal");
const editInput = document.getElementById("editInput");
const saveEditBtn = document.getElementById("saveEditBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

let currentUser = "You";

let editingMessageId = null;

loadBadwords().then(() => {
  renderMessages();
});

sendBtn.addEventListener("click", handleSend);

ketik.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();

    handleSend();
  }
});

userSelect.addEventListener("change", function () {
  currentUser = this.value;
});

clearBtn.addEventListener("click", function () {
  if (confirm("Yakin hapus semua chat?")) {
    localStorage.removeItem("messages");

    messages = [];

    renderMessages();

    statusBox.textContent = "🗑️ Chat dihapus";
  }
});

function handleSend() {
  if (!isLoaded || isError) return;

  const text = ketik.value.trim();

  if (!text) return;

  const matches = regex ? text.match(regex) || [] : [];

  const isBad = matches.length > 0;

  const sensor = regex ? text.replace(regex, "****") : text;

  const newMessage = {
    id: crypto.randomUUID(),
    user: currentUser,
    text,
    isBad,
    time: getTime(),
  };

  messages.push(newMessage);

  saveMessages();

  createMessageElement(newMessage);

  if (currentUser !== "Bot") {
    showTyping();

    setTimeout(() => {
      botReply(text, isBad);
    }, 1500);
  }

  if (isBad) {
    statusBox.innerHTML = `⚠️ Terdeteksi kata terlarang<br>Sensor: ${sensor}`;

    statusBox.className = "text-xs px-4 pb-2 text-yellow-700";
  } else {
    statusBox.textContent = "✔️ Pesan aman";

    statusBox.className = "text-xs px-4 pb-2 text-green-700";
  }

  ketik.value = "";

  ketik.focus();
}

cancelEditBtn.addEventListener("click", () => {
  editModal.classList.add("hidden");

  editModal.classList.remove("flex");

  editingMessageId = null;
});

saveEditBtn.addEventListener("click", () => {
  if (editingMessageId === null) return;

  const message = messages.find((msg) => msg.id === editingMessageId);

  if (!message) return;

  const newText = editInput.value.trim();

  if (!newText) return;

  message.text = newText;

  const matches = regex ? newText.match(regex) || [] : [];

  message.isBad = matches.length > 0;

  saveMessages();

  renderMessages();

  editModal.classList.add("hidden");
  editModal.classList.remove("flex");

  editingMessageId = null;
});
