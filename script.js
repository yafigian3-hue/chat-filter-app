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

  <div class="flex items-center gap-2">
    <span class="text-[10px] text-gray-500">
      ${msg.time}
    </span>

    <button
      class="deleteBtn text-red-500 text-xs"
      data-id="${msg.id}"
    >
      ✕
    </button>
  </div>
</div>

    <div>${displayText}</div>
  `;

  chatBox.appendChild(div);

  setTimeout(() => {
    div.classList.remove("opacity-0", "translate-y-3");
  }, 10);

  chatBox.scrollTop = chatBox.scrollHeight;
}

chatBox.addEventListener("click", function (e) {
  if (e.target.classList.contains("deleteBtn")) {
    const id = e.target.dataset.id;

    messages = messages.filter((msg) => msg.id !== id);

    saveMessages();

    renderMessages();
  }
});