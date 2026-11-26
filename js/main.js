/* ============================================================
   AMORECA PET SPA — comportamento do site
   Navegação, menu mobile, WhatsApp, galeria, animações.
   ============================================================ */
(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};

  /* ---------- utilitários de mensuração (seção 9 do PRD) ---- */
  function track(event, params) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: event }, params || {}));
    if (window.gtag) window.gtag("event", event, params || {});
  }

  /* ---------- F02 — links do WhatsApp ----------------------- */
  function waUrl(contexto) {
    var msg = cfg.whatsappMensagem || "";
    if (contexto) {
      msg += "\n\nTenho interesse no serviço: " + contexto + ".";
    }
    return "https://wa.me/" + (cfg.whatsapp || "") + "?text=" + encodeURIComponent(msg);
  }

  function montarWhatsapp() {
    document.querySelectorAll("[data-wa]").forEach(function (el) {
      var contexto = el.getAttribute("data-wa") || "";
      el.setAttribute("href", waUrl(contexto));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
      el.addEventListener("click", function () {
        track("whatsapp_click", {
          origem: el.getAttribute("data-track") || "desconhecido",
          servico: contexto || "geral"
        });
      });
    });
  }

  /* ---------- Dados comerciais no rodapé -------------------- */
  function montarDadosComerciais() {
    function set(campo, valor) {
      document.querySelectorAll('[data-field="' + campo + '"]').forEach(function (el) {
        el.textContent = valor;
      });
    }

    set("endereco", cfg.endereco || "");
    set("cidade", cfg.cidade || "");
    set("whatsapp-exibicao", cfg.whatsappExibicao || "");
    set("instagram-exibicao", cfg.instagramExibicao || "");

    /* horários (lista) */
    var ulHorarios = document.querySelector('[data-field="horarios"]');
    if (ulHorarios && cfg.horarios && cfg.horarios.length) {
      ulHorarios.innerHTML = "";
      cfg.horarios.forEach(function (linha) {
        var li = document.createElement("li");
        li.textContent = linha;
        ulHorarios.appendChild(li);
      });
    }

    /* links diretos (tel: e instagram) */
    document.querySelectorAll('[data-field-link="whatsapp"]').forEach(function (el) {
      el.setAttribute("href", waUrl(""));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
      el.addEventListener("click", function () {
        track("whatsapp_click", { origem: "footer", servico: "geral" });
      });
    });
    document.querySelectorAll('[data-field-link="instagram"]').forEach(function (el) {
      el.setAttribute("href", cfg.instagram || "#");
      el.addEventListener("click", function () {
        track("instagram_click", {});
      });
    });

    /* ano do copyright */
    var ano = document.getElementById("ano");
    if (ano) ano.textContent = new Date().getFullYear();
  }

  /* ---------- Header fixo + transição suave ----------------- */
  function headerScroll() {
    var header = document.querySelector(".header");
    if (!header) return;
    var atualizar = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    atualizar();
    window.addEventListener("scroll", atualizar, { passive: true });
  }

  /* ---------- Menu mobile elegante -------------------------- */
  function menuMobile() {
    var toggle = document.querySelector(".nav__toggle");
    var nav = document.getElementById("nav");
    var overlay = document.querySelector(".nav__overlay");
    if (!toggle || !nav || !overlay) return;

    function abrir() {
      nav.classList.add("is-open");
      overlay.hidden = false;
      requestAnimationFrame(function () { overlay.classList.add("is-visible"); });
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Fechar menu");
      document.body.classList.add("nav-open");
    }

    function fechar() {
      nav.classList.remove("is-open");
      overlay.classList.remove("is-visible");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu");
      document.body.classList.remove("nav-open");
      setTimeout(function () { overlay.hidden = true; }, 400);
    }

    toggle.addEventListener("click", function () {
      nav.classList.contains("is-open") ? fechar() : abrir();
    });
    overlay.addEventListener("click", fechar);

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (nav.classList.contains("is-open")) fechar();
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) fechar();
    });
  }

  /* ---------- Rolagem suave com offset do header ------------ */
  function scrollSuave() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href");
        if (!id || id === "#") return;
        var alvo = document.querySelector(id);
        if (!alvo) return;
        e.preventDefault();
        var header = document.querySelector(".header");
        var offset = header ? header.offsetHeight + 8 : 0;
        var topo = alvo.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: topo, behavior: "smooth" });
        if (history.pushState) history.pushState(null, "", id);
      });
    });
  }

  /* ---------- Entrada suave de elementos na rolagem --------- */
  function animacoesScroll() {
    var itens = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      itens.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("is-visible");
          io.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    itens.forEach(function (el) { io.observe(el); });
  }

  /* ---------- F03 — Lightbox da galeria --------------------- */
  function galeria() {
    var lightbox = document.getElementById("lightbox");
    if (!lightbox) return;

    var figuras = Array.prototype.slice.call(document.querySelectorAll(".galeria__grid .gal"));
    var imgLb = lightbox.querySelector(".lightbox__img");
    var capLb = lightbox.querySelector(".lightbox__caption");
    var countLb = lightbox.querySelector(".lightbox__count");
    var indice = 0;
    var ultimoFoco = null;

    function mostrar(i) {
      var fig = figuras[i];
      var img = fig.querySelector("img");
      if (!img || img.classList.contains("is-missing")) return;
      indice = i;
      imgLb.src = img.getAttribute("src");
      imgLb.alt = img.getAttribute("alt") || "";
      capLb.textContent = fig.getAttribute("data-caption") || "";
      countLb.textContent = (i + 1) + " / " + figuras.length;
      track("galeria_foto_visualizada", { foto: img.getAttribute("src") });
    }

    function abrir(i) {
      ultimoFoco = document.activeElement;
      lightbox.hidden = false;
      requestAnimationFrame(function () { lightbox.classList.add("is-open"); });
      document.body.classList.add("lightbox-open");
      mostrar(i);
      lightbox.querySelector(".lightbox__close").focus();
    }

    function fechar() {
      lightbox.classList.remove("is-open");
      document.body.classList.remove("lightbox-open");
      setTimeout(function () {
        lightbox.hidden = true;
        imgLb.src = "";
      }, 300);
      if (ultimoFoco) ultimoFoco.focus();
    }

    function navegar(passo) {
      var proximo = indice;
      do {
        proximo = (proximo + passo + figuras.length) % figuras.length;
      } while (proximo !== indice && figuras[proximo].querySelector("img.is-missing"));
      mostrar(proximo);
    }

    figuras.forEach(function (fig, i) {
      fig.classList.add("gal--clicavel");
      fig.setAttribute("tabindex", "0");
      fig.setAttribute("role", "button");
      fig.setAttribute("aria-label", "Ampliar imagem " + (i + 1) + " de " + figuras.length);
      fig.addEventListener("click", function () { abrir(i); });
      fig.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(i); }
      });
    });

    lightbox.querySelector(".lightbox__close").addEventListener("click", fechar);
    lightbox.querySelector(".lightbox__prev").addEventListener("click", function () { navegar(-1); });
    lightbox.querySelector(".lightbox__next").addEventListener("click", function () { navegar(1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) fechar();
    });

    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") fechar();
      if (e.key === "ArrowLeft") navegar(-1);
      if (e.key === "ArrowRight") navegar(1);
    });

    /* swipe em telas sensíveis ao toque */
    var x0 = null;
    lightbox.addEventListener("touchstart", function (e) {
      x0 = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].screenX - x0;
      if (Math.abs(dx) > 50) navegar(dx < 0 ? 1 : -1);
      x0 = null;
    }, { passive: true });
  }

  /* ---------- Clique em "Ver galeria" ----------------------- */
  function ctasGaleria() {
    document.querySelectorAll('[data-track="ver_galeria"]').forEach(function (el) {
      el.addEventListener("click", function () { track("ver_galeria", {}); });
    });
  }

  /* ---------- Fotos sempre inteiras (sem corte) --------------
     A moldura passa a usar a proporção real da imagem carregada,
     então nenhuma foto é cortada — nem em PC, tablet ou celular. */
  function fotosInteiras() {
    document.querySelectorAll(".photo img").forEach(function (img) {
      function aplicar() {
        if (!img.naturalWidth || img.classList.contains("is-missing")) return;
        var figura = img.closest(".photo");
        if (figura) figura.style.aspectRatio = img.naturalWidth + " / " + img.naturalHeight;
      }
      if (img.complete) aplicar();
      else {
        img.addEventListener("load", aplicar);
        img.addEventListener("error", aplicar);
      }
    });
  }

  /* ---------- Inicialização --------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    montarWhatsapp();
    montarDadosComerciais();
    headerScroll();
    menuMobile();
    scrollSuave();
    animacoesScroll();
    galeria();
    ctasGaleria();
    fotosInteiras();
  });
})();
