const ketik = document.getElementById("ketik");
const statusBox = document.getElementById("statusBox");
const chatBox = document.getElementById("chatBox");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const userSelect = document.getElementById("userSelect");
const users = ["You", "Admin", "Bot"];
let currentUser = "You";

let kataTerlarang = [];
let regex = null;
let isLoaded = false;
let isError = false;

let messages = JSON.parse(localStorage.getItem("messages")) || [];

// =============== Local setorage ==========
function saveMessages() {
  localStorage.setItem("messages", JSON.stringify(messages));
}

// ================ TIME ===============
function getTime() {
  return new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ================= UTILS =================
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ================= LOAD DATA =================
async function loadBadwords() {
  try {
    statusBox.textContent = "⏳ Loading filter...";
    ketik.disabled = true;
    sendBtn.disabled = true;

    const res = await fetch("badwords.json");
    if (!res.ok) throw new Error();

    kataTerlarang = await res.json();

    regex = new RegExp(
      `\\b(${kataTerlarang.map(escapeRegex).join("|")})\\b`,
      "gi",
    );

    isLoaded = true;

    statusBox.textContent = "✔️ Siap";
    ketik.disabled = false;
    sendBtn.disabled = false;
  } catch {
    isError = true;
    statusBox.textContent = "❌ Gagal load filter";
  }
}

loadBadwords();
renderMessages();

// ================= RENDER CHAT =================
function renderMessages() {
  chatBox.innerHTML = "";

  messages.forEach((msg) => {
    const div = document.createElement("div");

    div.className = `p-2 rounded-lg max-w-[75%] ${
      msg.user === "You"
        ? "bg-blue-100 border border-blue-300 ml-auto"
        : msg.user === "Admin"
          ? "bg-purple-100 border border-purple-300"
          : "bg-gray-100 border border-gray-300"
    }`;

    const displayText = msg.isBad
      ? msg.text.replace(regex, (m) => {
          return `<span class="text-red-500 font-semibold">${m}</span>`;
        })
      : msg.text;

    div.innerHTML = `
  <div class="flex items-center justify-between mb-1">
    <span class="text-xs font-bold">${msg.user}</span>
    <span class="text-[10px] text-gray-500">${msg.time}</span>
  </div>

  <div>${displayText}</div>
`;

    chatBox.appendChild(div);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

// =========== BOT TYPING =================
function showTyping() {
  const typingDiv = document.createElement("div");

  typingDiv.id = "typingIndicator";

  typingDiv.className =
    "bg-gray-100 border border-gray-300 p-3 rounded-2xl max-w-[75%] text-sm text-gray-500 italic shadow-sm";

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

// ============= CHAT BOT ===================
function botReply(userText, isBad) {
  const typingIndicator = document.getElementById("typingIndicator");

  if (typingIndicator) {
    typingIndicator.remove();
  }

  let reply = "";

  if (isBad) {
    reply = "Mohon gunakan bahasa yang sopan🙏";
  } else if (userText.toLowerCase().includes("halo")) {
    reply = "halo juga 👋";
  } else if (userText.toLowerCase().includes("apa kabar")) {
    reply = "Saya baik 😄";
  } else {
    const randomReplies = [
      "Pesan diterima ✔️",
      "Baik, saya mengerti 👌",
      "Oke 👍",
      "Siap 😄",
    ];

    reply = randomReplies[Math.floor(Math.random() * randomReplies.length)];
  }

  messages.push({
    user: "Bot",
    text: reply,
    isBad: false,
    time: getTime(),
  });

  saveMessages();
  renderMessages();
}

// =============== DELETE BTN =================
clearBtn.addEventListener("click", function () {
  if (confirm("apakah yakin ingin menghapus semua?")) {
    localStorage.removeItem("messages");
    messages = [];
    renderMessages();
    statusBox.textContent = "🗑️ Chat dihapus";
  }
});

// ================= SEND MESSAGE =================
function handleSend() {
  if (!isLoaded || isError) return;

  const text = ketik.value.trim();
  if (!text) return;

  const matches = text.toLowerCase().match(regex) || [];
  const isBad = matches.length > 0;

  const sensor = text.replace(regex, "****");

  // simpan ke state
  messages.push({
    user: currentUser,
    text,
    isBad,
    time: getTime(),
  });

  saveMessages();
  renderMessages();

  if (currentUser !== "Bot") {
    showTyping();

    setTimeout(() => {
      botReply(text, isBad);
    }, 1500);
  }

  // STATUS BOX
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

userSelect.addEventListener("change", function () {
  currentUser = this.value;
});

// ================= EVENT =================
sendBtn.addEventListener("click", handleSend);

ketik.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSend();
});
