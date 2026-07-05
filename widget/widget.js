(function () {
  "use strict";

  var WA_NUMBER = "33753813115"; // buraya ajans/Noce numarası
  var WIDGET_ID = "noce-habitat-wa-widget";
  var TOTAL_STEPS = 4;

  if (document.getElementById(WIDGET_ID)) return;

  var host = document.createElement("div");
  host.id = WIDGET_ID;
  host.setAttribute("data-noce-widget", "");
  document.documentElement.appendChild(host);

  var root = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;
  var answers = { usage: "", ville: "", delai: "", budget: "", prenom: "", note: "" };
  var step = 1;
  var lastFocus = null;

  root.innerHTML = [
    "<style>",
    ":host{--ground:#ECE9E3;--panel:#F6F4EF;--panel-2:#E3DFD6;--ink:#17191C;--ink-soft:#3C4046;--muted:#6B7078;--line:#D3CEC4;--line-strong:#B9B3A6;--corten:#C6491F;--corten-bright:#E1652E;--steel:#556069;--whatsapp:#1FA855;--shadow:0 1px 0 rgba(0,0,0,.04),0 18px 46px -22px rgba(20,20,20,.42);--radius:4px;--sans:system-ui,-apple-system,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif;--mono:ui-monospace,\"SF Mono\",\"JetBrains Mono\",\"Cascadia Code\",Menlo,Consolas,monospace;color-scheme:light;position:fixed;right:max(16px,env(safe-area-inset-right));bottom:max(16px,env(safe-area-inset-bottom));z-index:2147483000;font-family:var(--sans);}",
    "@media (prefers-color-scheme:dark){:host{--ground:#121417;--panel:#191C20;--panel-2:#23272C;--ink:#F2EFE9;--ink-soft:#C7C3BB;--muted:#8A8F97;--line:#2A2F34;--line-strong:#3A4046;--corten:#E1652E;--corten-bright:#F07B3E;--steel:#7E8A93;--whatsapp:#29C063;--shadow:0 1px 0 rgba(0,0,0,.4),0 18px 44px -22px rgba(0,0,0,.8);color-scheme:dark;}}",
    ".nw,.nw *{box-sizing:border-box;letter-spacing:0;}",
    ".nw{font:400 14px/1.45 var(--sans);color:var(--ink);}",
    "button,input,textarea{font:inherit;}",
    ".launcher{position:relative;display:flex;align-items:center;gap:10px;min-height:58px;padding:0 17px 0 15px;border:1px solid color-mix(in srgb,var(--corten) 78%,#000 12%);border-radius:999px;background:var(--corten);color:#fff;box-shadow:0 14px 34px -17px rgba(0,0,0,.55);cursor:pointer;font-weight:800;line-height:1;animation:nwPulse 2.8s ease-in-out infinite;transition:box-shadow .18s ease,filter .18s ease,transform .18s ease;}",
    ".launcher:hover{filter:brightness(1.05);box-shadow:0 16px 38px -16px rgba(0,0,0,.58),0 0 0 4px color-mix(in srgb,var(--corten-bright) 22%,transparent);}",
    ".launcher[aria-expanded=true]{display:none;}",
    ".launcher-badge{position:absolute;top:-4px;right:-3px;min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:#D71920;color:#fff;border:2px solid var(--panel);display:grid;place-items:center;font:850 10px/1 var(--mono);box-shadow:0 4px 10px -5px rgba(0,0,0,.7);}",
    ".launcher-mark{width:29px;height:29px;border-radius:3px;background:rgba(255,255,255,.16);box-shadow:inset 0 0 0 1px rgba(255,255,255,.25);display:grid;place-items:center;font:800 10px/1 var(--mono);}",
    ".launcher-text{display:flex;flex-direction:column;align-items:flex-start;gap:3px;white-space:nowrap;}",
    ".launcher-text small{font:700 11px/1 var(--mono);opacity:.82;}",
    ".teaser{position:absolute;right:0;bottom:calc(100% + 10px);width:max-content;max-width:min(268px,calc(100vw - 32px));display:flex;align-items:center;gap:9px;padding:10px 10px 10px 13px;border:1px solid color-mix(in srgb,var(--corten) 28%,var(--line-strong));border-radius:var(--radius);background:var(--panel);color:var(--ink);box-shadow:var(--shadow);font:800 13px/1.25 var(--sans);animation:nwTeaser .22s ease both;}",
    ".teaser[hidden]{display:none;}.teaser:after{content:\"\";position:absolute;right:21px;bottom:-6px;width:11px;height:11px;background:var(--panel);border-right:1px solid color-mix(in srgb,var(--corten) 28%,var(--line-strong));border-bottom:1px solid color-mix(in srgb,var(--corten) 28%,var(--line-strong));transform:rotate(45deg);}",
    ".teaser-close{position:relative;z-index:1;width:24px;height:24px;border:1px solid var(--line);border-radius:var(--radius);background:transparent;color:var(--muted);display:grid;place-items:center;cursor:pointer;font-size:17px;line-height:1;padding:0;}",
    ".teaser-close:hover{border-color:var(--corten);color:var(--ink);background:color-mix(in srgb,var(--corten) 8%,transparent);}",
    "@keyframes nwPulse{0%,100%{box-shadow:0 14px 34px -17px rgba(0,0,0,.55),0 0 0 0 color-mix(in srgb,var(--corten-bright) 0%,transparent);}55%{box-shadow:0 14px 34px -17px rgba(0,0,0,.55),0 0 0 8px color-mix(in srgb,var(--corten-bright) 13%,transparent);}}@keyframes nwTeaser{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}",
    ".panel{position:absolute;right:0;bottom:0;width:min(392px,calc(100vw - 32px));max-height:min(680px,calc(100vh - 32px));display:none;overflow:hidden;border:1px solid var(--line-strong);border-radius:var(--radius);background:var(--panel);box-shadow:var(--shadow);}",
    ".panel.open{display:block;}",
    ".head{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:15px 16px;border-bottom:1px solid var(--line);background:linear-gradient(0deg,transparent,color-mix(in srgb,var(--corten) 7%,transparent));}",
    ".brand{display:flex;align-items:center;gap:10px;min-width:0;}",
    ".mk{width:26px;height:26px;border-radius:3px;flex:none;background:var(--corten);position:relative;box-shadow:inset 0 0 0 1px rgba(255,255,255,.18);}",
    ".mk:before,.mk:after{content:\"\";position:absolute;left:4px;right:4px;height:2px;background:rgba(255,255,255,.58);}.mk:before{top:9px}.mk:after{top:15px}",
    ".title{min-width:0;}.title strong{display:block;font-size:14px;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}.title span{display:block;margin-top:3px;color:var(--muted);font:700 11px/1.2 var(--mono);}",
    ".close{width:34px;height:34px;border:1px solid var(--line-strong);border-radius:var(--radius);background:transparent;color:var(--muted);cursor:pointer;font-size:22px;line-height:1;display:grid;place-items:center;}",
    ".close:hover{border-color:var(--corten);color:var(--ink);}",
    ".progress{height:3px;background:var(--panel-2);}.progress>i{display:block;height:100%;width:25%;background:var(--corten);transition:width .35s cubic-bezier(.2,.7,.3,1);}",
    ".body{padding:19px 16px 16px;overflow:auto;max-height:calc(min(680px,100vh - 32px) - 62px);}",
    ".qwrap{display:none;animation:nwFade .24s ease both;}.qwrap.active{display:block;}@keyframes nwFade{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}",
    ".qlabel{font-size:15.5px;font-weight:800;margin:0 0 4px;line-height:1.25;color:var(--ink);}.qhint{font-size:12.5px;color:var(--muted);margin:0 0 15px;}",
    ".opts{display:grid;grid-template-columns:1fr 1fr;gap:9px;}.opt{position:relative;text-align:left;background:var(--panel-2);border:1px solid var(--line);border-radius:var(--radius);padding:12px 13px;cursor:pointer;color:var(--ink);font-size:13.5px;line-height:1.24;min-height:58px;display:flex;flex-direction:column;justify-content:center;gap:3px;transition:border-color .15s,background .15s,transform .05s;}.opt small{color:var(--muted);font-size:11.5px;}.opt:hover{border-color:var(--corten);}.opt:active{transform:translateY(1px);}.opt[aria-pressed=true]{border-color:var(--corten);background:color-mix(in srgb,var(--corten) 12%,var(--panel));box-shadow:inset 0 0 0 1px var(--corten);}.opt[aria-pressed=true]:after{content:\"\";position:absolute;top:10px;right:10px;width:7px;height:12px;border:solid var(--corten);border-width:0 2px 2px 0;transform:rotate(45deg);}",
    ".field{width:100%;font-size:15px;color:var(--ink);background:var(--panel-2);border:1px solid var(--line-strong);border-radius:var(--radius);padding:12px 13px;margin-top:2px;outline:none;}.field::placeholder{color:color-mix(in srgb,var(--muted) 78%,transparent);}textarea.field{resize:vertical;min-height:72px;}",
    ".field:focus,.opt:focus-visible,.btn:focus-visible,.close:focus-visible,.launcher:focus-visible,.restart:focus-visible,.btn-wa:focus-visible,.teaser-close:focus-visible{outline:2px solid var(--corten);outline-offset:2px;}",
    ".nav{display:flex;align-items:center;justify-content:space-between;margin-top:18px;gap:12px;}.btn{border-radius:var(--radius);padding:12px 15px;cursor:pointer;border:1px solid transparent;font-size:14px;font-weight:800;}.btn-primary{background:var(--corten);color:#fff;border-color:var(--corten);}.btn-primary:hover{filter:brightness(1.06);}.btn-primary[disabled]{opacity:.42;cursor:not-allowed;filter:none;}.btn-ghost{background:transparent;color:var(--muted);border-color:var(--line-strong);}.btn-ghost:hover{color:var(--ink);border-color:var(--ink-soft);}",
    ".result{display:none;}.result.show{display:block;animation:nwFade .24s ease both;}.brief{background:var(--panel-2);border:1px dashed var(--line-strong);border-radius:var(--radius);padding:14px 15px;font:600 12.5px/1.58 var(--mono);color:var(--ink-soft);margin:5px 0 16px;overflow-wrap:anywhere;}.brief .k{color:var(--muted);}.brief .v{color:var(--ink);font-weight:800;}",
    ".btn-wa{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;background:var(--whatsapp);color:#fff;font-size:15px;font-weight:850;padding:14px;border-radius:var(--radius);text-decoration:none;border:1px solid var(--whatsapp);box-shadow:0 10px 24px -12px color-mix(in srgb,var(--whatsapp) 80%,transparent);}.btn-wa:hover{filter:brightness(1.05);}.wa-dot{width:9px;height:9px;border-radius:999px;background:#fff;box-shadow:0 0 0 4px rgba(255,255,255,.22);}",
    ".after{font-size:12px;color:var(--muted);text-align:center;margin:11px 0 0;}.after a{color:var(--corten);font-weight:800;text-decoration:none;}.ownernote{margin-top:12px;font-size:12px;color:var(--muted);display:flex;gap:8px;align-items:flex-start;background:color-mix(in srgb,var(--steel) 8%,transparent);border-left:2px solid var(--steel);padding:10px 11px;border-radius:0 var(--radius) var(--radius) 0;}.ownernote b{color:var(--ink);}.restart{background:none;border:none;color:var(--muted);font:700 12px/1 var(--mono);cursor:pointer;text-decoration:underline;padding:0;}",
    ".sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}",
    "@media (min-width:560px){.teaser{right:calc(100% + 10px);bottom:7px;}.teaser:after{right:-6px;bottom:18px;border:0;border-top:1px solid color-mix(in srgb,var(--corten) 28%,var(--line-strong));border-right:1px solid color-mix(in srgb,var(--corten) 28%,var(--line-strong));}}",
    "@media (max-width:480px){:host{right:max(12px,env(safe-area-inset-right));bottom:max(12px,env(safe-area-inset-bottom));}.panel{width:calc(100vw - 24px);max-height:calc(100vh - 24px);}.opts{grid-template-columns:1fr;}.launcher{min-height:56px;padding:0 14px;}.launcher-text small{display:none;}.teaser{max-width:calc(100vw - 24px);font-size:12.5px;}.body{max-height:calc(100vh - 88px);}}",
    "@media (prefers-reduced-motion:reduce){.nw,.nw *{animation:none!important;transition:none!important;scroll-behavior:auto!important;}}",
    "</style>",
    "<div class=\"nw\" aria-live=\"polite\">",
    "  <div class=\"teaser\" role=\"status\" hidden><span>Recevez votre devis en 2 min 👉</span><button class=\"teaser-close\" type=\"button\" aria-label=\"Fermer l'invitation\">×</button></div>",
    "  <button class=\"launcher\" type=\"button\" aria-haspopup=\"dialog\" aria-expanded=\"false\" aria-controls=\"noce-panel\">",
    "    <span class=\"launcher-badge\" aria-hidden=\"true\">1</span><span class=\"sr\">1 nouveau message</span>",
    "    <span class=\"launcher-mark\" aria-hidden=\"true\">4Q</span>",
    "    <span class=\"launcher-text\"><span>Devis rapide</span><small>Noce Habitat</small></span>",
    "  </button>",
    "  <section class=\"panel\" id=\"noce-panel\" role=\"dialog\" aria-modal=\"false\" aria-labelledby=\"noce-title\">",
    "    <div class=\"head\">",
    "      <div class=\"brand\"><span class=\"mk\" aria-hidden=\"true\"></span><div class=\"title\"><strong id=\"noce-title\">Recevez votre devis</strong><span class=\"step-label\">Étape 1 / 4</span></div></div>",
    "      <button class=\"close\" type=\"button\" aria-label=\"Fermer\">×</button>",
    "    </div>",
    "    <div class=\"progress\" aria-hidden=\"true\"><i></i></div>",
    "    <div class=\"body\">",
    "      <div class=\"qwrap active\" data-step=\"1\">",
    "        <p class=\"qlabel\">Quel est l'usage prévu ?</p>",
    "        <p class=\"qhint\">Choisissez ce qui correspond le mieux.</p>",
    "        <div class=\"opts\" data-single=\"usage\">",
    "          <button class=\"opt\" type=\"button\" data-val=\"Bureau / chantier\">Bureau / chantier<small>base vie, algeco</small></button>",
    "          <button class=\"opt\" type=\"button\" data-val=\"Logement / studio\">Logement / studio<small>habitation, locatif</small></button>",
    "          <button class=\"opt\" type=\"button\" data-val=\"Commerce / snack\">Commerce / snack<small>point de vente, showroom</small></button>",
    "          <button class=\"opt\" type=\"button\" data-val=\"Stockage / dépôt\">Stockage / dépôt<small>atelier, garde</small></button>",
    "        </div>",
    "      </div>",
    "      <div class=\"qwrap\" data-step=\"2\">",
    "        <p class=\"qlabel\">Où livrer le module ?</p>",
    "        <p class=\"qhint\">Ville ou département, pour calculer la livraison.</p>",
    "        <input class=\"field ville\" type=\"text\" inputmode=\"text\" placeholder=\"Ex : Creil, Oise (60)\" autocomplete=\"off\">",
    "      </div>",
    "      <div class=\"qwrap\" data-step=\"3\">",
    "        <p class=\"qlabel\">Pour quand ?</p>",
    "        <p class=\"qhint\">Votre délai idéal.</p>",
    "        <div class=\"opts\" data-single=\"delai\">",
    "          <button class=\"opt\" type=\"button\" data-val=\"Urgent (moins d'1 mois)\">Urgent<small>moins d'1 mois</small></button>",
    "          <button class=\"opt\" type=\"button\" data-val=\"1 à 3 mois\">1 à 3 mois<small>projet en cours</small></button>",
    "          <button class=\"opt\" type=\"button\" data-val=\"Plus tard / je me renseigne\">Je me renseigne<small>pas pressé</small></button>",
    "          <button class=\"opt\" type=\"button\" data-val=\"Date non définie\">Pas encore décidé<small>à voir ensemble</small></button>",
    "        </div>",
    "      </div>",
    "      <div class=\"qwrap\" data-step=\"4\">",
    "        <p class=\"qlabel\">Budget indicatif &amp; détails</p>",
    "        <p class=\"qhint\">Optionnel, cela nous aide à viser juste du premier coup.</p>",
    "        <div class=\"opts\" data-single=\"budget\" style=\"margin-bottom:12px\">",
    "          <button class=\"opt\" type=\"button\" data-val=\"moins de 5 000 € HT\">&lt; 5 000 € HT</button>",
    "          <button class=\"opt\" type=\"button\" data-val=\"5 000 - 10 000 € HT\">5 000 - 10 000 €</button>",
    "          <button class=\"opt\" type=\"button\" data-val=\"plus de 10 000 € HT\">&gt; 10 000 € HT</button>",
    "          <button class=\"opt\" type=\"button\" data-val=\"budget à définir\">Je ne sais pas</button>",
    "        </div>",
    "        <input class=\"field prenom\" type=\"text\" placeholder=\"Votre prénom (optionnel)\" autocomplete=\"given-name\" style=\"margin-bottom:10px\">",
    "        <textarea class=\"field note\" placeholder=\"Une précision ? (dimensions, options, sanitaire, électricité...)\"></textarea>",
    "      </div>",
    "      <div class=\"result\">",
    "        <p class=\"qlabel\">C'est prêt, envoyez votre demande</p>",
    "        <p class=\"qhint\">On récapitule, puis on ouvre WhatsApp avec le message déjà écrit.</p>",
    "        <div class=\"brief\"></div>",
    "        <a class=\"btn-wa\" href=\"#\" target=\"_blank\" rel=\"noopener\"><span class=\"wa-dot\" aria-hidden=\"true\"></span>Envoyer sur WhatsApp</a>",
    "        <p class=\"after\">Pas de WhatsApp ? Appelez le <a class=\"phone\" href=\"#\"></a></p>",
    "        <div class=\"ownernote\"><span aria-hidden=\"true\">Noce</span><span>Chaque demande arrive déjà qualifiée : <b>usage, lieu, délai, budget</b>.</span></div>",
    "        <p style=\"text-align:center;margin:14px 0 0\"><button class=\"restart\" type=\"button\">Recommencer</button></p>",
    "      </div>",
    "      <div class=\"nav\">",
    "        <button class=\"btn btn-ghost prev\" type=\"button\" style=\"visibility:hidden\">Retour</button>",
    "        <button class=\"btn btn-primary next\" type=\"button\" disabled>Continuer</button>",
    "      </div>",
    "    </div>",
    "  </section>",
    "</div>"
  ].join("");

  var launcher = root.querySelector(".launcher");
  var teaser = root.querySelector(".teaser");
  var teaserClose = root.querySelector(".teaser-close");
  var panel = root.querySelector(".panel");
  var closeBtn = root.querySelector(".close");
  var wraps = Array.prototype.slice.call(root.querySelectorAll(".qwrap"));
  var bar = root.querySelector(".progress i");
  var stepLabel = root.querySelector(".step-label");
  var prev = root.querySelector(".prev");
  var next = root.querySelector(".next");
  var nav = root.querySelector(".nav");
  var result = root.querySelector(".result");
  var brief = root.querySelector(".brief");
  var waBtn = root.querySelector(".btn-wa");
  var phoneLink = root.querySelector(".phone");
  var ville = root.querySelector(".ville");
  var prenom = root.querySelector(".prenom");
  var note = root.querySelector(".note");

  function esc(text) {
    return String(text || "").replace(/[<>&"]/g, function (char) {
      return { "<": "&lt;", ">": "&gt;", "&": "&amp;", "\"": "&quot;" }[char];
    });
  }

  function displayPhone(number) {
    if (/^33[1-9][0-9]{8}$/.test(number)) {
      var local = "0" + number.slice(2);
      return local.replace(/(..)(?=.)/g, "$1 ").trim();
    }
    return "+" + number;
  }

  function focusable() {
    return Array.prototype.slice.call(root.querySelectorAll("button:not([disabled]),a[href],input,textarea"))
      .filter(function (el) {
        return el.offsetParent !== null || el === launcher;
      });
  }

  function openPanel() {
    lastFocus = document.activeElement;
    hideTeaser();
    panel.classList.add("open");
    launcher.setAttribute("aria-expanded", "true");
    setTimeout(function () {
      var activeStep = root.querySelector(".qwrap.active");
      var first = activeStep && activeStep.querySelector("button,input,textarea");
      (first || closeBtn).focus();
    }, 20);
  }

  function closePanel() {
    panel.classList.remove("open");
    launcher.setAttribute("aria-expanded", "false");
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    } else {
      launcher.focus();
    }
  }

  function hideTeaser() {
    teaser.hidden = true;
  }

  function stepValid(current) {
    if (current === 1) return !!answers.usage;
    if (current === 2) return answers.ville.length > 1;
    if (current === 3) return !!answers.delai;
    return true;
  }

  function refreshNext() {
    next.disabled = !stepValid(step);
  }

  function render() {
    wraps.forEach(function (wrap) {
      wrap.classList.toggle("active", Number(wrap.getAttribute("data-step")) === step);
    });
    bar.style.width = (step / TOTAL_STEPS * 100) + "%";
    stepLabel.textContent = "Étape " + step + " / " + TOTAL_STEPS;
    prev.style.visibility = step === 1 ? "hidden" : "visible";
    next.textContent = step === TOTAL_STEPS ? "Voir ma demande" : "Continuer";
    refreshNext();
    if (step === 2) setTimeout(function () { ville.focus(); }, 40);
  }

  function line(key, value) {
    return "<div><span class=\"k\">" + key + " :</span> <span class=\"v\">" + esc(value) + "</span></div>";
  }

  function finish() {
    var budget = answers.budget || "budget à définir";
    brief.innerHTML =
      line("Usage", answers.usage) +
      line("Livraison", answers.ville) +
      line("Délai", answers.delai) +
      line("Budget", budget) +
      (answers.prenom ? line("Prénom", answers.prenom) : "") +
      (answers.note ? line("Précision", answers.note) : "");

    var greet = answers.prenom ? ("Bonjour, je suis " + answers.prenom + ". ") : "Bonjour, ";
    var message =
      greet + "je souhaite un devis Noce Habitat.\n\n" +
      "- Usage : " + answers.usage + "\n" +
      "- Livraison : " + answers.ville + "\n" +
      "- Délai : " + answers.delai + "\n" +
      "- Budget : " + budget +
      (answers.note ? ("\n- Précision : " + answers.note) : "") +
      "\n\nMerci de me proposer le modèle adapté.";

    waBtn.href = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(message);
    wraps.forEach(function (wrap) { wrap.classList.remove("active"); });
    nav.style.display = "none";
    result.classList.add("show");
    bar.style.width = "100%";
    stepLabel.textContent = "Demande prête";
    setTimeout(function () { waBtn.focus(); }, 30);
  }

  function reset() {
    answers = { usage: "", ville: "", delai: "", budget: "", prenom: "", note: "" };
    step = 1;
    ville.value = "";
    prenom.value = "";
    note.value = "";
    root.querySelectorAll(".opt").forEach(function (btn) { btn.setAttribute("aria-pressed", "false"); });
    result.classList.remove("show");
    nav.style.display = "flex";
    render();
  }

  root.querySelectorAll(".opts[data-single]").forEach(function (group) {
    var key = group.getAttribute("data-single");
    group.querySelectorAll(".opt").forEach(function (btn) {
      btn.setAttribute("aria-pressed", "false");
      btn.addEventListener("click", function () {
        group.querySelectorAll(".opt").forEach(function (item) { item.setAttribute("aria-pressed", "false"); });
        btn.setAttribute("aria-pressed", "true");
        answers[key] = btn.getAttribute("data-val") || "";
        refreshNext();
      });
    });
  });

  launcher.addEventListener("click", openPanel);
  teaserClose.addEventListener("click", hideTeaser);
  closeBtn.addEventListener("click", closePanel);
  next.addEventListener("click", function () {
    if (!stepValid(step)) return;
    if (step < TOTAL_STEPS) {
      step += 1;
      render();
    } else {
      finish();
    }
  });
  prev.addEventListener("click", function () {
    if (step > 1) {
      step -= 1;
      render();
    }
  });
  ville.addEventListener("input", function () { answers.ville = ville.value.trim(); refreshNext(); });
  prenom.addEventListener("input", function () { answers.prenom = prenom.value.trim(); });
  note.addEventListener("input", function () { answers.note = note.value.trim(); });
  root.querySelector(".restart").addEventListener("click", reset);
  phoneLink.href = "tel:+" + WA_NUMBER;
  phoneLink.textContent = displayPhone(WA_NUMBER);

  root.addEventListener("keydown", function (event) {
    if (!panel.classList.contains("open")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closePanel();
      return;
    }
    if (event.key !== "Tab") return;

    var items = focusable().filter(function (el) { return el !== launcher; });
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (event.shiftKey && root.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && root.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  render();
  setTimeout(function () {
    if (launcher.getAttribute("aria-expanded") !== "true") teaser.hidden = false;
  }, 2500);
})();
