let kataTerlarang = [];
let regex = null;
let isLoaded = false;
let isError = false;

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
