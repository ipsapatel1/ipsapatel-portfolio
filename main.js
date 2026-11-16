/* Edit the two lines below once, and every page updates. */
var SITE = {
  email: "ipsa.patel02@gmail.com",
  instagram: "https://www.instagram.com/designedbyipsa",
  linkedin: "https://www.linkedin.com/",
  pinterest: "https://www.pinterest.com/ipsapatel/"
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
  var names = { all: "All work", etching: "Etching and lettering", weddings: "Weddings and events", signage: "Signage", digital: "Print and digital design", art: "Art and handmade" };
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
    var stage = lb.querySelector(".stage");
    var current = 0, visible = [];
    function list() { return Array.prototype.filter.call(items, function (i) { return !i.hidden; }); }
    function show(n) {
      visible = list(); if (!visible.length) return;
      current = (n + visible.length) % visible.length;
      var it = visible[current], img = it.querySelector("img");
      stage.innerHTML = "";
      if (img) { var big = document.createElement("img"); big.src = img.src; big.alt = img.alt; stage.appendChild(big); }
      else { var ph = document.createElement("div"); ph.className = "ph"; ph.textContent = "IPA"; stage.appendChild(ph); }
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

// Floating photos: ease toward the cursor. Skipped when the visitor prefers reduced motion.
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  var root = document.documentElement, tx = 0, ty = 0, cx = 0, cy = 0, running = false;
  function tick() {
    cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
    root.style.setProperty("--mx", cx.toFixed(3)); root.style.setProperty("--my", cy.toFixed(3));
    if (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) requestAnimationFrame(tick); else running = false;
  }
  window.addEventListener("pointermove", function (e) {
    tx = (e.clientX / window.innerWidth) * 2 - 1; ty = (e.clientY / window.innerHeight) * 2 - 1;
    if (!running) { running = true; requestAnimationFrame(tick); }
  }, { passive: true });
})();

// Cover: a click anywhere on it scrolls down to the details.
(function () {
  var hero = document.querySelector(".hero"), target = document.getElementById("start");
  if (!hero || !target) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function go() { target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); }
  hero.addEventListener("click", function (e) { if (e.target.closest("a") && !e.target.closest(".cue")) return; e.preventDefault(); go(); });
  hero.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
})();

// Typed entrance for the cover headline. Text stays readable if scripts fail or motion is reduced.
(function () {
  var h1 = document.getElementById("type-h1"), hero = document.querySelector(".hero");
  if (!h1 || !hero) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  var text = h1.textContent.trim(), chars = [], caret = document.createElement("span");
  try {
    h1.setAttribute("aria-label", text);
    h1.textContent = "";
    text.split(" ").forEach(function (word, i, all) {
      var w = document.createElement("span"); w.className = "w"; w.setAttribute("aria-hidden", "true");
      word.split("").forEach(function (c) { var s = document.createElement("span"); s.className = "ch"; s.textContent = c; w.appendChild(s); chars.push(s); });
      h1.appendChild(w);
      if (i < all.length - 1) h1.appendChild(document.createTextNode(" "));
    });
    caret.className = "caret"; caret.setAttribute("aria-hidden", "true");
    hero.classList.add("typing");
  } catch (e) { return; }
  var n = 0, done = false;
  function finish() {
    if (done) return; done = true;
    chars.forEach(function (s) { s.classList.add("on"); });
    hero.classList.remove("typing");
    setTimeout(function () { if (caret.parentNode) caret.parentNode.removeChild(caret); }, 2200);
  }
  function step() {
    if (done) return;
    if (n >= chars.length) { finish(); return; }
    var s = chars[n++]; s.classList.add("on"); s.parentNode.insertBefore(caret, s.nextSibling);
    setTimeout(step, 45 + Math.random() * 55);
  }
  setTimeout(step, 500);
  setTimeout(finish, 6000); // safety net
})();

/* recording timecode */
(function(){ var t=document.getElementById('tc'); if(!t) return; var s=0; function p(n){return (n<10?'0':'')+n;} setInterval(function(){ s=(s+1)%3600; t.textContent='00:'+p(Math.floor(s/60))+':'+p(s%60); },1000); })();

/* video playlists and in-view reel */
(function(){
  document.querySelectorAll("video[data-playlist]").forEach(function(v){
    var list=v.dataset.playlist.split(","), i=0;
    v.addEventListener("ended",function(){ i=(i+1)%list.length; v.removeAttribute("poster"); v.src=list[i]; v.play().catch(function(){}); });
  });
  var rc=document.querySelectorAll("video[data-src]");
  if(rc.length && "IntersectionObserver" in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){
      var v=e.target; if(e.isIntersecting){ if(!v.src&&v.dataset.src) v.src=v.dataset.src; v.play().catch(function(){}); } else { v.pause(); }
    }); },{threshold:.5});
    rc.forEach(function(v){ io.observe(v); });
  }
})();

(function(){
  var hero=document.querySelector(".hero"); if(!hero) return;
  var box=document.createElement("div"); box.className="specks"; box.setAttribute("aria-hidden","true");
  var n=window.innerWidth<720?18:34;
  for(var i=0;i<n;i++){
    var s=document.createElement("i"); s.className="speck";
    var dia=Math.random()<.35; var size=dia?(9+Math.random()*8):(1.5+Math.random()*3.5); if(dia) s.className="speck dia";
    s.style.cssText="left:"+(Math.random()*100)+"%;top:"+(8+Math.random()*84)+"%;width:"+size+"px;height:"+size+"px;--t:"+(12+Math.random()*14)+"s;--dl:"+(-Math.random()*20)+"s;--o:"+(.25+Math.random()*.45)+";--dx:"+((Math.random()-.5)*60)+"px;--dy:"+(-40-Math.random()*110)+"px;--rot:"+((Math.random()-.5)*180)+"deg";
    box.appendChild(s);
  }
  [["68%","14%","4s"],["14%","30%","11s"]].forEach(function(a){var m=document.createElement("i");m.className="shoot";m.style.cssText="--x:"+a[0]+";--y:"+a[1]+";--sd:"+a[2];box.appendChild(m);});
  hero.insertBefore(box,hero.firstChild);
})();

// Opening shooting star: streaks in and lands where the headline starts typing.
(function(){
  var hero=document.querySelector(".hero"), h1=document.getElementById("type-h1");
  if(!hero||!h1||!hero.animate||window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var hr=hero.getBoundingClientRect(), f=h1.querySelector("span"), r=(f||h1).getBoundingClientRect();
  var ex=r.left-hr.left+(f?r.width*.4:8), ey=r.top-hr.top+r.height*.3;
  var sx=Math.max(20,ex-hr.width*.32), sy=Math.max(12,ey-hr.height*.42);
  var ang=Math.atan2(ey-sy,ex-sx)*180/Math.PI;
  var st=document.createElement("i"); st.className="intro-star"; st.setAttribute("aria-hidden","true");
  var fl=document.createElement("i"); fl.className="intro-flash"; fl.setAttribute("aria-hidden","true");
  hero.appendChild(st); hero.appendChild(fl);
  // star's head is its right edge (origin 100%), so offset by its width
  function pos(x,y){return "translate("+(x-170)+"px,"+(y-1)+"px) rotate("+ang+"deg)";}
  st.animate([{transform:pos(sx,sy),opacity:0},{opacity:1,offset:.15},{opacity:1,offset:.85},{transform:pos(ex,ey),opacity:0}],{duration:650,delay:0,easing:"cubic-bezier(.4,0,.8,.6)",fill:"both"});
  fl.animate([{transform:"translate("+ex+"px,"+ey+"px) scale(.2)",opacity:0},{transform:"translate("+ex+"px,"+ey+"px) scale(1)",opacity:.9,offset:.35},{transform:"translate("+ex+"px,"+ey+"px) scale(1.6)",opacity:0}],{duration:700,delay:520,fill:"both"});
  setTimeout(function(){st.remove();fl.remove();},2200);
})();

/* Design in motion: start each clip halfway through, including when it loops */
(function(){
  document.querySelectorAll(".rec video, .reel video").forEach(function(v){
    if(v.hasAttribute("data-full")) return;
    function half(){ if(v.duration && isFinite(v.duration)) { try { v.currentTime = v.duration/2; } catch(e){} } }
    v.addEventListener("loadedmetadata", half);
    if(v.readyState>=1 && v.currentTime<1) half();
    if(v.hasAttribute("loop")){
      v.removeAttribute("loop");
      v.addEventListener("ended", function(){ half(); v.play().catch(function(){}); });
    }
  });
})();
