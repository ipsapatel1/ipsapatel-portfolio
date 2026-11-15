/* Edit the two lines below once, and every page updates. */
var SITE = {
  email: "your-email@example.com",
  instagram: "https://www.instagram.com/designedbyipsa",
  linkedin: "https://www.linkedin.com/",
  pinterest: "https://www.pinterest.com/"
};

(function () {
  // Fill in contact details wherever a page asks for them.
  document.querySelectorAll("[data-email]").forEach(function (el) { el.textContent = SITE.email; });
  document.querySelectorAll("[data-link]").forEach(function (a) { a.href = SITE[a.getAttribute("data-link")]; });

  function copyText(text, btn) {
    var done = function () {
      var old = btn.textContent; btn.textContent = "Copied";
      setTimeout(function () { btn.textContent = old; }, 1600);
    };
    try { navigator.clipboard.writeText(text).then(done, function () {}); } catch (e) {}
  }
  document.querySelectorAll("[data-copy-email]").forEach(function (b) {
    b.addEventListener("click", function () { copyText(SITE.email, b); });
  });

  // Work page: filters and photo viewer.
  var chips = document.querySelectorAll(".chip");
  var items = document.querySelectorAll(".item");
  var count = document.getElementById("count");
  var names = { all: "All work", etching: "Etching and lettering", weddings: "Weddings and events", signage: "Signage", digital: "Digital graphics" };
  function apply(cat) {
    if (!names[cat]) cat = "all";
    var shown = 0;
    chips.forEach(function (c) { c.setAttribute("aria-pressed", c.dataset.filter === cat ? "true" : "false"); });
    items.forEach(function (i) {
      var show = cat === "all" || i.dataset.cat === cat;
      i.hidden = !show; if (show) shown++;
    });
    if (count) count.textContent = shown + " pieces in " + names[cat];
    try { history.replaceState(null, "", cat === "all" ? location.pathname : "#" + cat); } catch (e) {}
  }
  if (chips.length) {
    chips.forEach(function (c) { c.addEventListener("click", function () { apply(c.dataset.filter); }); });
    apply(location.hash.replace("#", "") || "all");
  }

  var lb = document.getElementById("lb");
  if (lb) {
    var stage = lb.querySelector(".stage"), title = lb.querySelector("h3"), cap = lb.querySelector(".cap p");
    var current = 0, visible = [];
    function list() { return Array.prototype.filter.call(items, function (i) { return !i.hidden; }); }
    function show(n) {
      visible = list(); if (!visible.length) return;
      current = (n + visible.length) % visible.length;
      var it = visible[current], img = it.querySelector("img");
      stage.innerHTML = "";
      if (img) { var big = document.createElement("img"); big.src = img.src; big.alt = img.alt; stage.appendChild(big); }
      else { var ph = document.createElement("div"); ph.className = "ph"; ph.textContent = "IPA"; stage.appendChild(ph); }
      title.textContent = it.querySelector("h3").textContent;
      cap.textContent = it.querySelector("p").textContent;
    }
    function open(n) { show(n); lb.classList.add("open"); lb.querySelector("[data-close]").focus(); }
    function close() { lb.classList.remove("open"); }
    items.forEach(function (it) {
      it.querySelector("button.slot").addEventListener("click", function () { open(list().indexOf(it)); });
    });
    lb.querySelector("[data-close]").addEventListener("click", close);
    lb.querySelector("[data-prev]").addEventListener("click", function () { show(current - 1); });
    lb.querySelector("[data-next]").addEventListener("click", function () { show(current + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
  }

  // Inquiry form: builds a message to copy or open in an email app. Nothing is sent from the page.
  var form = document.getElementById("inq");
  if (form) {
    var out = document.getElementById("inqout"), mail = document.getElementById("inqmail");
    function build() {
      var f = new FormData(form);
      return "Hi Ipsa,\n\n" +
        "I'm " + (f.get("name") || "[name]") + ". I'm reaching out about: " + f.get("kind") + ".\n" +
        "Date: " + (f.get("date") || "not set yet") + "\n" +
        "Guests or quantity: " + (f.get("size") || "not sure yet") + "\n\n" +
        (f.get("note") || "") + "\n\nThanks,\n" + (f.get("name") || "");
    }
    function sync() { mail.href = "mailto:" + SITE.email + "?subject=" + encodeURIComponent("Inquiry: " + form.kind.value) + "&body=" + encodeURIComponent(build()); }
    form.addEventListener("input", sync); sync();
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    document.getElementById("inqcopy").addEventListener("click", function () {
      var msg = build(); var b = this;
      var done = function () { out.textContent = "Message copied. Paste it into an email to " + SITE.email + "."; };
      try { navigator.clipboard.writeText(msg).then(done, function () { out.textContent = "Copy did not work here. Select the text from your email app instead."; }); }
      catch (err) { out.textContent = "Copy did not work here."; }
    });
  }
})();
