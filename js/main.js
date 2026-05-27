const ketik = document.getElementById("ketik");
const statusBox = document.getElementById("statusBox");
const searchBtn = document.getElementById("searchBtn");
const searchContainer = document.getElementById("searchContainer");
const searchInput = document.getElementById("searchInput");
const chatBox = document.getElementById("chatBox");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const userSelect = document.getElementById("userSelect");
const editModal = document.getElementById("editModal");
const editInput = document.getElementById("editInput");
const saveEditBtn = document.getElementById("saveEditBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

searchBtn.addEventListener("click", () => {
  searchContainer.classList.toggle("hidden");

  if (!searchContainer.classList.contains("hidden")) {
    searchInput.focus();
  }
});

searchInput.addEventListener("input", () => {
  renderMessages(searchInput.value);
});

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

  renderMessages();

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

  ketik.focus();
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

window.addEventListener("load", () => {
  ketik.focus();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && editModal.classList.contains("hidden")) {
    editModal.classList.add("hidden");

    editModal.classList.remove("flex");

    editingMessageId = null;

    ketik.focus();
  }
});
