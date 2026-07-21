const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const header = document.querySelector(".site-header");
const logo = document.querySelector(".brand img");
const usesPreviewPaths = logo?.getAttribute("src")?.startsWith("public/");
const sitePaths = usesPreviewPaths
  ? {
      logoGreen: "public/assets/brand/logo-title-green.png",
      logoLight: "public/assets/brand/logo-title-light.png",
      spaces: "local-preview-terek.html",
      booking: "local-preview-foglalas.html",
      privacy: "local-preview-adatvedelem.html",
      brandAssets: "public/assets/brand"
    }
  : {
      logoGreen: "/assets/brand/logo-title-green.png",
      logoLight: "/assets/brand/logo-title-light.png",
      spaces: "/terek",
      booking: "/foglalas",
      privacy: "/adatvedelem",
      brandAssets: "/assets/brand"
    };

function updateHeaderState() {
  if (!header) return;
  const isOpen = document.body.classList.contains("nav-open");
  const isSolidPage = header.classList.contains("solid");
  const isScrolled = window.scrollY > 36;
  header.classList.toggle("is-scrolled", isScrolled);

  if (logo && !isSolidPage) {
    logo.src = isScrolled || isOpen
      ? sitePaths.logoGreen
      : sitePaths.logoLight;
  }
}

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("nav-open", !isOpen);
    updateHeaderState();
  });
}

window.addEventListener("scroll", updateHeaderState, { passive: true });
updateHeaderState();

const roomSlugs = {
  MAG: "mag",
  SZIGET: "sziget",
  Sószoba: "soszoba",
  FÓKUSZ: "fokusz",
  MŰHELY: "muhely",
  TÉR: "ter",
  CSILLAG: "csillag"
};

const roomDetailPage = document.querySelector(".room-detail-page");
if (roomDetailPage) {
  Array.from(document.querySelectorAll(".site-nav a")).find((link) => {
    return link.getAttribute("href") === sitePaths.spaces;
  })?.removeAttribute("aria-current");

  const roomName = roomDetailPage.querySelector(".page-hero h1")?.textContent.trim();
  const roomSlug = roomSlugs[roomName];
  const bookingButton = roomDetailPage.querySelector(".room-detail-copy .button");

  if (roomSlug && bookingButton) {
    bookingButton.href = `${sitePaths.booking}?ter=${encodeURIComponent(roomSlug)}`;
  }

  const backLink = document.createElement("a");
  backLink.className = "room-back-link";
  backLink.href = sitePaths.spaces;
  backLink.setAttribute("aria-label", "Vissza a Tereink oldalra");
  backLink.title = "Vissza a Tereink oldalra";
  backLink.innerHTML = '<span class="room-back-icon" aria-hidden="true"></span>';
  roomDetailPage.prepend(backLink);
}

const roomSelect = document.querySelector("#room");
const durationSelect = document.querySelector("#duration");
const summaryRoom = document.querySelector("#summary-room");
const summaryDuration = document.querySelector("#summary-duration");
const summaryTotal = document.querySelector("#summary-total");

function updateBookingPreview() {
  if (!roomSelect || !durationSelect || !summaryRoom || !summaryDuration || !summaryTotal) return;
  const price = Number(roomSelect.value);
  const duration = Number(durationSelect.value);
  summaryRoom.textContent = roomSelect.options[roomSelect.selectedIndex].text;
  summaryDuration.textContent = duration.toString().replace(".", ",") + " óra";
  summaryTotal.textContent = new Intl.NumberFormat("hu-HU", {
    style: "currency",
    currency: "HUF",
    maximumFractionDigits: 0
  }).format(Math.ceil(price * duration));
}

if (roomSelect) {
  const requestedRoom = new URLSearchParams(window.location.search).get("ter")
    || new URLSearchParams(window.location.search).get("room");

  if (requestedRoom) {
    const requestedOption = Array.from(roomSelect.options).find((option) => {
      return roomSlugs[option.textContent.trim()] === requestedRoom.toLowerCase();
    });

    if (requestedOption) requestedOption.selected = true;
  }
}

roomSelect?.addEventListener("change", updateBookingPreview);
durationSelect?.addEventListener("change", updateBookingPreview);
updateBookingPreview();

const bookingForm = document.querySelector(".booking-form");
bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!bookingForm.checkValidity()) {
    bookingForm.reportValidity();
    return;
  }

  const selectedRoom = roomSelect.options[roomSelect.selectedIndex];
  const duration = Number(durationSelect.value);
  const booking = {
    id: `LESZEK-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "pending",
    room: selectedRoom.dataset.room || selectedRoom.textContent.trim(),
    roomSlug: roomSlugs[selectedRoom.textContent.trim()],
    date: bookingForm.querySelector("#booking-date").value,
    time: bookingForm.querySelector("#booking-time").value,
    duration,
    participants: Number(bookingForm.querySelector("#booking-participants").value),
    name: bookingForm.querySelector("#booking-name").value.trim(),
    email: bookingForm.querySelector("#booking-email").value.trim(),
    phone: bookingForm.querySelector("#booking-phone").value.trim(),
    activity: bookingForm.querySelector("#booking-activity").value,
    notes: bookingForm.querySelector("#booking-notes").value.trim(),
    total: Math.ceil(Number(selectedRoom.value) * duration),
    privacyConsent: bookingForm.querySelector("#booking-consent").checked
  };

  const formNote = bookingForm.querySelector(".form-note");
  try {
    const storageKey = "leszek_bookings_v1";
    const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const bookings = Array.isArray(stored) ? stored : [];
    bookings.push(booking);
    localStorage.setItem(storageKey, JSON.stringify(bookings));
    if (formNote) {
      formNote.textContent = `A foglalási igény rögzítve. Azonosító: ${booking.id}`;
      formNote.classList.add("booking-success");
    }
  } catch {
    if (formNote) {
      formNote.textContent = "A foglalási igényt nem sikerült rögzíteni. Kérjük, próbáld meg újra.";
      formNote.classList.remove("booking-success");
  }
  }
});

document.querySelectorAll("[data-gallery]").forEach((gallery) => {
  const track = gallery.querySelector(".gallery-track");
  const prev = gallery.querySelector(".gallery-button.prev");
  const next = gallery.querySelector(".gallery-button.next");
  if (!track || !prev || !next) return;

  const originalSlides = Array.from(track.querySelectorAll(".room-detail-image"));
  if (originalSlides.length < 2) return;

  const firstClone = originalSlides[0].cloneNode(true);
  const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);
  firstClone.dataset.galleryClone = "true";
  lastClone.dataset.galleryClone = "true";
  firstClone.setAttribute("aria-hidden", "true");
  lastClone.setAttribute("aria-hidden", "true");
  track.prepend(lastClone);
  track.append(firstClone);

  const autoplayDelay = 3000;
  const transitionTime = 720;
  const slideCount = originalSlides.length;
  let currentIndex = 1;
  let autoplayTimer;
  let loopResetTimer;
  let resizeTimer;
  let isPaused = false;
  let isMoving = false;

  const slideWidth = () => track.clientWidth;

  const snapToCurrent = () => {
    if (!slideWidth()) return;
    track.scrollTo({ left: currentIndex * slideWidth(), behavior: "auto" });
  };

  const finishLoop = () => {
    if (currentIndex === slideCount + 1) {
      currentIndex = 1;
      snapToCurrent();
    } else if (currentIndex === 0) {
      currentIndex = slideCount;
      snapToCurrent();
    }
    isMoving = false;
  };

  const move = (direction) => {
    if (isMoving || !slideWidth()) return;
    isMoving = true;
    currentIndex += direction;
    track.scrollTo({
      left: currentIndex * slideWidth(),
      behavior: "smooth"
    });
    window.clearTimeout(loopResetTimer);
    loopResetTimer = window.setTimeout(finishLoop, transitionTime);
  };

  const stopAutoplay = () => {
    window.clearTimeout(autoplayTimer);
  };

  const scheduleAutoplay = () => {
    stopAutoplay();
    if (isPaused || document.hidden) return;
    autoplayTimer = window.setTimeout(() => {
      move(1);
      scheduleAutoplay();
    }, autoplayDelay);
  };

  const stepManually = (direction) => {
    stopAutoplay();
    move(direction);
    scheduleAutoplay();
  };

  prev.addEventListener("click", () => stepManually(-1));
  next.addEventListener("click", () => stepManually(1));

  gallery.addEventListener("mouseenter", () => {
    isPaused = true;
    stopAutoplay();
  });

  gallery.addEventListener("mouseleave", () => {
    isPaused = false;
    scheduleAutoplay();
  });

  track.addEventListener("touchstart", () => {
    isPaused = true;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener("touchend", () => {
    isPaused = false;
    if (slideWidth()) currentIndex = Math.round(track.scrollLeft / slideWidth());
    finishLoop();
    scheduleAutoplay();
  }, { passive: true });

  document.addEventListener("visibilitychange", scheduleAutoplay);
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(snapToCurrent, 120);
  });

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      snapToCurrent();
      scheduleAutoplay();
    });
  });
});

const consentCookieName = "leszek_cookie_consent";
const consentVersion = 1;

function readConsentCookie() {
  const cookiePrefix = `${consentCookieName}=`;
  const value = document.cookie.split("; ").find((cookie) => cookie.startsWith(cookiePrefix));
  if (!value) return null;

  try {
    const parsed = JSON.parse(decodeURIComponent(value.slice(cookiePrefix.length)));
    return parsed.version === consentVersion ? parsed : null;
  } catch {
    return null;
  }
}

function writeConsentCookie(consent) {
  const value = encodeURIComponent(JSON.stringify({
    version: consentVersion,
    necessary: true,
    external: Boolean(consent.external)
  }));
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${consentCookieName}=${value}; Max-Age=31536000; Path=/; SameSite=Lax${secure}`;
}

const brandAssetBase = sitePaths.brandAssets;
const privacyHref = sitePaths.privacy;

const consentLayer = document.createElement("div");
consentLayer.className = "cookie-consent-layer";
consentLayer.innerHTML = `
  <section class="cookie-consent-dialog" role="dialog" aria-modal="true" aria-labelledby="cookie-consent-title">
    <button class="cookie-dialog-close" type="button" aria-label="Sütibeállítások bezárása">×</button>
    <p class="script-word">Sütik</p>
    <h2 id="cookie-consent-title">Te döntöd el, mi töltődjön be</h2>
    <p class="cookie-consent-intro">A weboldal egy szükséges sütivel jegyzi meg a választásodat. Statisztikai és marketing sütiket nem használunk. A Google Térkép csak a hozzájárulásod után töltődik be, és a Google saját sütiket használhat.</p>
    <div class="cookie-options">
      <label class="cookie-option">
        <span><strong>Szükséges süti</strong><small>A sütiválasztás megjegyzéséhez, egy évig.</small></span>
        <input type="checkbox" checked disabled aria-label="Szükséges süti mindig aktív" />
      </label>
      <label class="cookie-option">
        <span><strong>Külső tartalom</strong><small>A Google Térkép megjelenítéséhez.</small></span>
        <input id="cookie-external-content" type="checkbox" />
      </label>
    </div>
    <a class="cookie-privacy-link" href="${privacyHref}">Adatvédelmi és sütitájékoztató</a>
    <div class="cookie-actions">
      <button class="button cookie-necessary" type="button">Csak szükséges</button>
      <button class="button cookie-save" type="button">Kiválasztottak mentése</button>
      <button class="button primary cookie-accept" type="button">Elfogadom</button>
    </div>
  </section>
`;

const consentBadge = document.createElement("button");
consentBadge.className = "cookie-settings-button";
consentBadge.type = "button";
consentBadge.setAttribute("aria-label", "Sütibeállítások megnyitása");
consentBadge.title = "Sütibeállítások";
consentBadge.innerHTML = `<img src="${brandAssetBase}/spiral-logo-light.png" alt="" aria-hidden="true" />`;

document.body.append(consentLayer, consentBadge);

const externalConsentToggle = consentLayer.querySelector("#cookie-external-content");
const closeConsentButton = consentLayer.querySelector(".cookie-dialog-close");
let currentConsent = readConsentCookie();

function updateExternalContent(consent) {
  document.querySelectorAll("iframe[data-cookie-src]").forEach((frame) => {
    const section = frame.closest(".map-section") || frame.parentElement;
    let placeholder = section?.querySelector(".map-consent-placeholder");

    if (!placeholder && section) {
      placeholder = document.createElement("div");
      placeholder.className = "map-consent-placeholder";
      placeholder.innerHTML = `
        <img src="${brandAssetBase}/spiral-logo-green.png" alt="" aria-hidden="true" />
        <h2>A térképhez engedély szükséges</h2>
        <p>A Google Térkép külső tartalom, ezért csak a hozzájárulásod után töltjük be.</p>
        <button class="button primary" type="button">Sütibeállítások</button>
      `;
      section.append(placeholder);
      placeholder.querySelector("button")?.addEventListener("click", openConsentDialog);
    }

    if (consent?.external) {
      if (!frame.getAttribute("src")) frame.setAttribute("src", frame.dataset.cookieSrc);
      frame.hidden = false;
      if (placeholder) placeholder.hidden = true;
      section?.classList.remove("cookie-blocked");
    } else {
      frame.removeAttribute("src");
      frame.hidden = true;
      if (placeholder) placeholder.hidden = false;
      section?.classList.add("cookie-blocked");
    }
  });
}

function openConsentDialog() {
  externalConsentToggle.checked = Boolean(currentConsent?.external);
  closeConsentButton.hidden = !currentConsent;
  consentLayer.classList.add("is-open");
  document.body.classList.add("cookie-dialog-open");
  window.setTimeout(() => externalConsentToggle.focus(), 50);
}

function closeConsentDialog() {
  if (!currentConsent) return;
  consentLayer.classList.remove("is-open");
  document.body.classList.remove("cookie-dialog-open");
  consentBadge.focus({ preventScroll: true });
}

function saveConsent(external) {
  currentConsent = { version: consentVersion, necessary: true, external: Boolean(external) };
  writeConsentCookie(currentConsent);
  updateExternalContent(currentConsent);
  consentLayer.classList.remove("is-open");
  document.body.classList.remove("cookie-dialog-open");
  consentBadge.classList.add("is-visible");
  updateConsentBadgeTheme();
}

consentLayer.querySelector(".cookie-necessary")?.addEventListener("click", () => saveConsent(false));
consentLayer.querySelector(".cookie-save")?.addEventListener("click", () => saveConsent(externalConsentToggle.checked));
consentLayer.querySelector(".cookie-accept")?.addEventListener("click", () => saveConsent(true));
closeConsentButton?.addEventListener("click", closeConsentDialog);
consentBadge.addEventListener("click", openConsentDialog);

consentLayer.addEventListener("click", (event) => {
  if (event.target === consentLayer) closeConsentDialog();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && consentLayer.classList.contains("is-open")) closeConsentDialog();
});

function isSageBackground(element) {
  let current = element;
  while (current && current !== document.documentElement) {
    const color = window.getComputedStyle(current).backgroundColor;
    const match = color.match(/[\d.]+/g)?.map(Number);
    if (match && match.length >= 3 && (match[3] ?? 1) > 0.08) {
      const [red, green, blue] = match;
      return red >= 85 && red <= 140 && green >= 100 && green <= 155 && blue >= 70 && blue <= 125;
    }
    current = current.parentElement;
  }
  return false;
}

let badgeThemeFrame;
function updateConsentBadgeTheme() {
  window.cancelAnimationFrame(badgeThemeFrame);
  badgeThemeFrame = window.requestAnimationFrame(() => {
    if (!consentBadge.classList.contains("is-visible")) return;
    const rect = consentBadge.getBoundingClientRect();
    const elementBelow = document.elementsFromPoint(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2
    ).find((element) => {
      return element !== consentBadge
        && !consentBadge.contains(element)
        && !consentLayer.contains(element);
    });
    const onSage = isSageBackground(elementBelow);
    consentBadge.classList.toggle("is-on-sage", onSage);
    consentBadge.querySelector("img").src = `${brandAssetBase}/${onSage ? "spiral-logo-green.png" : "spiral-logo-light.png"}`;
  });
}

window.addEventListener("scroll", updateConsentBadgeTheme, { passive: true });
window.addEventListener("resize", updateConsentBadgeTheme);

updateExternalContent(currentConsent);
if (currentConsent) {
  consentBadge.classList.add("is-visible");
  updateConsentBadgeTheme();
} else {
  openConsentDialog();
}

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  const fields = {
    name: {
      input: contactForm.querySelector("#contact-name"),
      error: contactForm.querySelector("#contact-name-error"),
      message: "Kérjük, add meg a neved."
    },
    email: {
      input: contactForm.querySelector("#contact-email"),
      error: contactForm.querySelector("#contact-email-error"),
      message: "Kérjük, érvényes e-mail-címet adj meg."
    },
    message: {
      input: contactForm.querySelector("#contact-message"),
      error: contactForm.querySelector("#contact-message-error"),
      message: "Kérjük, írd meg, mivel kapcsolatban keresel minket."
    },
    consent: {
      input: contactForm.querySelector("#contact-consent"),
      error: contactForm.querySelector("#contact-consent-error"),
      message: "Kérjük, fogadd el az adatvédelmi tájékoztatót."
    }
  };

  const clearFieldError = ({ input, error }) => {
    input?.removeAttribute("aria-invalid");
    if (error) error.textContent = "";
  };

  const showFieldError = ({ input, error, message }) => {
    input?.setAttribute("aria-invalid", "true");
    if (error) error.textContent = message;
  };

  Object.values(fields).forEach((field) => {
    field.input?.addEventListener(field.input.type === "checkbox" ? "change" : "input", () => clearFieldError(field));
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    Object.values(fields).forEach(clearFieldError);

    const invalidFields = [];
    if (!fields.name.input.value.trim()) invalidFields.push(fields.name);
    if (!fields.email.input.validity.valid || !fields.email.input.value.trim()) invalidFields.push(fields.email);
    if (!fields.message.input.value.trim()) invalidFields.push(fields.message);
    if (!fields.consent.input.checked) invalidFields.push(fields.consent);

    if (invalidFields.length) {
      invalidFields.forEach(showFieldError);
      invalidFields[0].input.focus();
      return;
    }

    const submitError = document.querySelector("#contact-submit-error");
    const success = document.querySelector("#contact-success");

    try {
      if (submitError) submitError.hidden = true;
      contactForm.hidden = true;
      if (success) {
        success.hidden = false;
        success.querySelector("h2")?.focus();
      }
    } catch (error) {
      if (submitError) submitError.hidden = false;
    }
  });
}
