/* ========= SETTINGS LOGIC ========= */

const $ = id => document.getElementById(id);

/* ---------- TAB CLOAK ---------- */
const presets = {
  drive: { title: "Google Drive", icon: "https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png" },
  schoology: { title: "Schoology", icon: "https://asset-cdn.schoology.com/sites/all/themes/schoology_theme/favicon.ico" },
  docs: { title: "Google Docs", icon: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico" },
  google: { title: "Google", icon: "https://www.google.com/favicon.ico" }
};

$("cloak-select")?.addEventListener("change", e => {
  const v = e.target.value;
  $("cloak-custom").style.display = v === "custom" ? "block" : "none";

  if (presets[v]) {
    document.title = presets[v].title;
    setFavicon(presets[v].icon);
    localStorage.setItem("cloak", JSON.stringify(presets[v]));
  }
});

$("cloak-apply")?.addEventListener("click", () => {
  const title = $("cloak-title").value;
  const icon = $("cloak-icon").value;
  if (!title || !icon) return;
  document.title = title;
  setFavicon(icon);
  localStorage.setItem("cloak", JSON.stringify({ title, icon }));
});

$("cloak-reset")?.addEventListener("click", () => {
  document.title = "S0LACE";
  setFavicon("favicon.ico");
  localStorage.removeItem("cloak");
});

function setFavicon(url) {
  let link = document.querySelector("link[rel*='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = url;
}

/* ---------- THEME ---------- */
$("theme-select")?.addEventListener("change", e =>
  localStorage.setItem("s0laceTheme", e.target.value)
);

$("accent-select")?.addEventListener("change", e => {
  localStorage.setItem("s0laceAccent", e.target.value);
  window.dispatchEvent(new StorageEvent("storage"));
});

/* ---------- BACKGROUND ---------- */
$("bg-mode")?.addEventListener("change", e =>
  localStorage.setItem("bgMode", e.target.value)
);

$("bg-url")?.addEventListener("change", e =>
  localStorage.setItem("bgUrl", e.target.value)
);

/* ---------- MEDIA PLAYER ---------- */
$("media-source-select")?.addEventListener("change", e => {
  localStorage.setItem("mediaSource", e.target.value);
});

/* ---------- SECURITY ---------- */
$("anti-close-toggle")?.addEventListener("change", e =>
  localStorage.setItem("antiClose", e.target.checked)
);

$("blank-launch")?.addEventListener("click", () => {
  window.open("about:blank", "_blank");
});

/* ---------- EXPORT / IMPORT ---------- */
$("export-settings")?.addEventListener("click", () => {
  const data = JSON.stringify(localStorage, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "s0lace-settings.json";
  a.click();
});

$("import-settings")?.addEventListener("click", () =>
  $("import-file").click()
);

$("import-file")?.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const data = JSON.parse(reader.result);
    Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, v));
    location.reload();
  };
  reader.readAsText(file);
});
