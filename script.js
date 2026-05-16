const ketik = document.getElementById("ketik");
const statusBox = document.getElementById("statusBox");
const chatBox = document.getElementById("chatBox");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const userSelect = document.getElementById("userSelect");
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

loadBadwords().then(() => {
  renderMessages();
});

// ================= RENDER CHAT =================
function createMessageElement(msg) {
  const div = document.createElement("div");

  div.className = `p-3 rounded-2xl
max-w-[85%] sm:max-w-[75%]
break-words
transition-all duration-300 ease-out
opacity-0 translate-y-3
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
    <div class="flex items-center justify-between mb-1">
      <span class="text-xs font-bold">${msg.user}</span>
      <span class="text-[10px] text-gray-500">${msg.time}</span>
    </div>

    <div>${displayText}</div>
  `;

  chatBox.appendChild(div);

  setTimeout(() => {
    div.classList.remove("opacity-0", "translate-y-3");
  }, 10);

  chatBox.scrollTop = chatBox.scrollHeight;
}

function renderMessages() {
  chatBox.innerHTML = "";

  messages.forEach((msg) => {
    createMessageElement(msg);
  });
}

// =========== BOT TYPING =================
const oldTyping = document.getElementById("typingIndicator");

if (oldTyping) {
  oldTyping.remove();
}

function showTyping() {
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

// ============= CHAT BOT ===================
function botReply(userText, isBad) {
  const typingIndicator = document.getElementById("typingIndicator");

  if (typingIndicator) {
    typingIndicator.remove();
  }

  const text = userText.toLowerCase();

  let reply = "";

  //  BAD WORD 
  if (isBad) {
    reply = "Mohon gunakan bahasa yang sopan 🙏";
  }

  //  GREETING 
  else if (
    text.includes("halo") ||
    text.includes("hai") ||
    text.includes("hi")
  ) {
    const greetings = [
      "Halo juga 👋",
      "Hai 😄",
      "Hi, ada yang bisa dibantu?",
      "Halo! semoga harimu menyenangkan ✨",
    ];

    reply = greetings[Math.floor(Math.random() * greetings.length)];
  }

  //  APA KABAR 
  else if (text.includes("apa kabar") || text.includes("gimana kabar")) {
    const kabar = ["Saya baik 😄", "Baik dong 👍", "Lagi semangat hari ini 🚀"];

    reply = kabar[Math.floor(Math.random() * kabar.length)];
  }

  //  TERIMA KASIH 
  else if (text.includes("terima kasih") || text.includes("makasih")) {
    reply = "Sama-sama 😄";
  }

  //  JAM 
  else if (text.includes("jam berapa")) {
    reply = `Sekarang jam ${getTime()} ⏰`;
  }

  //  NAMA BOT 
  else if (text.includes("siapa kamu") || text.includes("nama kamu")) {
    reply = "Saya bot sederhana buatan JavaScript 🤖";
  }

  //  COMMAND 
  else if (text === "/help") {
    reply = `
Command tersedia:
- /help
- /clear
- /time
`;
  } else if (text === "/time") {
    reply = `Waktu sekarang ${getTime()} ⏰`;
  } else if (text === "/clear") {
    messages = [];
    saveMessages();
    renderMessages();

    reply = "Semua chat berhasil dihapus 🗑️";
  }

  //  FALLBACK 
  else {
    const randomReplies = [
      "Menarik 👀",
      "Oke 👍",
      "Saya mengerti 👌",
      "Bisa dijelaskan lebih detail?",
      "Pesan diterima ✔️",
      "Baik 😄",
    ];

    reply = randomReplies[Math.floor(Math.random() * randomReplies.length)];
  }

  const newMessage = {
    user: "Bot",
    text: reply,
    isBad: false,
    time: getTime(),
  };

  messages.push(newMessage);

  saveMessages();
  createMessageElement(newMessage);
}

//  DELETE BTN 
clearBtn.addEventListener("click", function () {
  if (confirm("apakah yakin ingin menghapus semua?")) {
    localStorage.removeItem("messages");
    messages = [];
    renderMessages();
    statusBox.textContent = "🗑️ Chat dihapus";
  }
});

//  SEND MESSAGE 
function handleSend() {
  if (!isLoaded || isError) return;

  const text = ketik.value.trim();
  if (!text) return;

  const matches = text.toLowerCase().match(regex) || [];
  const isBad = matches.length > 0;

  const sensor = text.replace(regex, "****");

  // simpan ke state
  const newMessage = {
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

ketik.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSend();
  }
});
