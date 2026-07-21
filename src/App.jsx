import React, { useEffect, useMemo, useState } from "react";

const rooms = [
  {
    id: "mag",
    name: "MAG",
    price: 4000,
    unit: "óra",
    size: "9,5 nm",
    bestFor: "Páros foglalkozás, egyéni konzultáció, coaching",
    details: ["Padlófűtéses, laminált szoba", "Asztal, 3 szék, fali polc és puff", "Ásványvíz, tea és kávé bekészítés"]
  },
  {
    id: "sziget",
    name: "SZIGET",
    price: 4000,
    unit: "óra",
    size: "14 nm",
    bestFor: "Diszkrétebb, mélyebb témák megdolgozása",
    details: ["Épületen belüli külön bejárat", "Privát, nyugodt tér", "Ásványvíz, kávé és tea bekészítés"]
  },
  {
    id: "soszoba",
    name: "Sószoba",
    price: 1890,
    unit: "45 perc",
    size: "15,8 nm",
    bestFor: "Sószobai alkalmak, sóhomokozó, meseterápia kicsiknek",
    details: ["Laminált padló", "Padlófűtés", "Fan-coil hőszabályozás"]
  },
  {
    id: "fokusz",
    name: "FÓKUSZ",
    price: 4000,
    unit: "óra",
    size: "11 nm",
    bestFor: "Páros foglalkozás, egyéni konzultáció",
    details: ["Fan-coil fűtés-hűtés", "Asztal, két szék vagy kanapé", "Ásványvíz, tea és kávé bekészítés"]
  },
  {
    id: "muhely",
    name: "MŰHELY",
    price: 5000,
    unit: "óra",
    size: "20 nm",
    bestFor: "6-8 fős foglalkozások, női körök, családállítás, ifjúsági fejlesztés",
    details: ["Tároló polcok", "Sötétítési lehetőség", "Hangulatnak megfelelő színválasztás"]
  },
  {
    id: "ter",
    name: "TÉR",
    price: 5000,
    unit: "óra",
    size: "23,3 nm",
    bestFor: "Csoportos coaching, hangfürdő, mozgással egybekötött érzelmi feldolgozás",
    details: ["Keleti fekvésű nagyterem", "Szőnyeg, babzsákok és ülőpárnák", "Ásványvíz, tea és kávé bekészítés"]
  },
  {
    id: "csillag",
    name: "CSILLAG",
    price: 10000,
    unit: "óra",
    size: "47,5 nm",
    bestFor: "Csoportos foglalkozások, mozgásos tevékenységek, workshopok, előadások",
    details: ["Csillag alakú különterem", "Öltözőhasználat zárható szekrényekkel", "Padlófűtés és fan-coil hűtés"]
  }
];

const money = new Intl.NumberFormat("hu-HU", {
  style: "currency",
  currency: "HUF",
  maximumFractionDigits: 0
});

const navItems = [
  { path: "/", label: "Kezdőlap" },
  { path: "/terek", label: "Tereink" },
  { path: "/rolunk", label: "Rólunk" },
  { path: "/foglalas", label: "Foglalás" },
  { path: "/kapcsolat", label: "Kapcsolat" }
];

const socialItems = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/leszek.kozpont",
    icon: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.5l.5-4h-4V7a1 1 0 0 1 1-1h3V2z"
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/leszek_kozpont/",
    icon: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.2A3.8 3.8 0 1 0 12 15.8 3.8 3.8 0 0 0 12 8.2zm5.1-2.1a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2z"
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@leszek_kozpont",
    icon: "M14 2h3c.2 1.7 1.1 3.1 2.5 4.1A7 7 0 0 0 22 7v3.2a8.7 8.7 0 0 1-4.7-1.4v6.6A6.6 6.6 0 1 1 10.7 9v3.3a3.3 3.3 0 1 0 3.3 3.3V2z"
  }
];

function routeFromLocation() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  if (path.endsWith(".html")) {
    const file = path.split("/").pop().replace(".html", "");
    return file === "index" ? "/" : `/${file}`;
  }
  return path;
}

function navigateTo(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function App() {
  const [route, setRoute] = useState(routeFromLocation);

  useEffect(() => {
    const onPop = () => setRoute(routeFromLocation());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useReveal(route);

  const page = useMemo(() => {
    if (route === "/terek") return <SpacesPage />;
    if (route === "/rolunk") return <AboutPage />;
    if (route === "/foglalas") return <BookingPage />;
    if (route === "/kapcsolat") return <ContactPage />;
    if (route === "/adatvedelem") return <PrivacyPage />;
    if (route === "/impresszum") return <ImprintPage />;
    return <HomePage />;
  }, [route]);

  return (
    <>
      <Header route={route} />
      {page}
      <Footer />
    </>
  );
}

function Link({ to, children, className, current }) {
  return (
    <a
      href={to}
      className={className}
      aria-current={current ? "page" : undefined}
      onClick={(event) => {
        if (to === "/rolunk" || to === "/terek") return;
        event.preventDefault();
        navigateTo(to);
      }}
    >
      {children}
    </a>
  );
}

function Header({ route }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isSolid = route !== "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  useEffect(() => setOpen(false), [route]);

  const logo = isSolid || scrolled || open ? "/assets/brand/logo-title-green.png" : "/assets/brand/logo-title-light.png";

  return (
    <header className={`site-header${isSolid ? " solid" : ""}${scrolled ? " is-scrolled" : ""}`}>
      <Link to="/" className="brand">
        <img src={logo} alt="LESZEK logó" />
      </Link>
      <button className="nav-toggle" type="button" aria-label="Menü megnyitása" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <span></span>
        <span></span>
      </button>
      <nav className={`site-nav${open ? " is-open" : ""}`}>
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} current={route === item.path}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <nav className="footer-legal" aria-label="Jogi információk">
        <Link to="/adatvedelem">Adatvédelmi tájékoztató</Link>
        <Link to="/impresszum">Impresszum</Link>
      </nav>
      <img className="footer-logo" src="/assets/brand/logo-title-light.png" alt="LESZEK" />
      <div className="footer-social" aria-label="LESZEK közösségi média">
        {socialItems.map((item) => (
          <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={item.icon}></path>
            </svg>
          </a>
        ))}
      </div>
      <p className="footer-credit">
        © 2026 · Made by{" "}
        <a href="https://csitaryoffice.hu" target="_blank" rel="noopener noreferrer">
          Csitáry Office
        </a>
      </p>
    </footer>
  );
}

function HomePage() {
  return (
    <main>
      <section className="hero">
        <img className="hero-bg" src="/assets/images/hero-wellbeing.png" alt="Napfényes mező, nyugodt wellbeing hangulat" />
        <div className="hero-shade"></div>
        <div className="hero-content reveal">
          <h1>LESZEK</h1>
          <p className="hero-lead">Egy biztonságos, elfogadó tér, ahol az önismeret, az érzelmi intelligencia és az emberi kapcsolódás valódi értékké válik.</p>
          <Link className="button primary" to="/foglalas">
            Időpontot foglalok
          </Link>
        </div>
      </section>
      <section className="intro split-section">
        <div className="section-copy reveal">
          <p className="script-word">Megérkezés</p>
          <h2>A belső egyensúly kapcsolódásból születik.</h2>
          <p>A kutatások és a mindennapi tapasztalataink is ugyanarra mutatnak: a biztonságos, kölcsönös elismerésen alapuló emberi kapcsolatok adják testi-lelki egyensúlyunk egyik legfontosabb forrását.</p>
          <p>A LESZEK-ben kisgyermekkortól felnőttkorig teret adunk az önismeretnek, az érzelmek megértésének, a tudatos önvizsgálatnak és a megtartó közösségi élményeknek.</p>
          <Link className="button secondary" to="/rolunk">
            Ismerd meg a LESZEK-et
          </Link>
        </div>
        <div className="image-panel reveal">
          <img src="/assets/images/community-session.png" alt="Közösségi önismereti foglalkozás nyugodt térben" />
        </div>
      </section>
      <Benefits />
      <section className="spaces-preview split-section reverse">
        <div className="section-copy reveal">
          <p className="script-word">Tereink</p>
          <h2>Szobák egyéni folyamatokhoz, csoportokhoz és elmélyüléshez.</h2>
          <p>A MAG, FÓKUSZ, MŰHELY, TÉR és CSILLAG helyiségek különböző létszámhoz és munkamódhoz igazodnak. Egyéni konzultációhoz, páros foglalkozáshoz, női körhöz, hangfürdőhöz vagy workshophoz is találsz megfelelő teret.</p>
          <Link className="button primary" to="/terek">
            Megnézem a tereket
          </Link>
        </div>
        <div className="image-panel reveal">
          <img src="/assets/images/space-interior.png" alt="LESZEK terem hangulata párnákkal és természetes fénnyel" />
        </div>
      </section>
      <section className="cta-section">
        <div className="cta-inner reveal">
          <div className="cta-copy">
            <p className="eyebrow">Foglalható terek</p>
            <h2>Válassz termet, időpontot és küldd el a foglalási igényt.</h2>
            <p>A foglalási rendszer azonnal mutatja a választott terem adatait és a várható díjat, így gyorsan átlátható, melyik tér illik a folyamatodhoz.</p>
            <Link className="button secondary light" to="/foglalas">
              Foglalási rendszer
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Benefits() {
  const items = [
    ["Lelki stabilitás", "Biztonságos, elfogadó jelenlét, ahol a megérkezés nem teljesítmény, hanem természetes alap."],
    ["Belső tengely", "Támogatás ahhoz, hogy a mindennapok hullámzásában is kapcsolódni tudj a saját középpontodhoz."],
    ["Érzelmi intelligencia", "Tér az érzelmek megértéséhez, a határok tartásához és a felelősebb kapcsolódáshoz."]
  ];
  return (
    <section className="benefits band band-green">
      <div className="section-head reveal">
        <p className="eyebrow">Miben támogatunk?</p>
        <h2>Önismeret, stabilitás, kapcsolódás.</h2>
      </div>
      <div className="benefit-grid premium-benefits">
        {items.map(([title, text]) => (
          <article className="benefit-card reveal" key={title}>
            <span aria-hidden="true"></span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SpacesPage() {
  return (
    <main className="page">
      <section className="page-hero reveal">
        <p className="script-word">Tereink</p>
        <h1>Foglalható szobák a folyamatod ritmusához.</h1>
        <p>Egyéni konzultációtól a nagyobb csoportos foglalkozásig minden tér más hangulatot és másfajta megtartást ad.</p>
      </section>
      <section className="room-grid">
        {rooms.map((room) => (
          <article className="room-card reveal is-visible" key={room.id}>
            <div className="meta">
              <span className="pill">{room.size}</span>
              <span className="pill">
                {money.format(room.price)} / {room.unit}
              </span>
            </div>
            <h2>{room.name}</h2>
            <p>{room.bestFor}</p>
            <ul>
              {room.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
            <Link className="button primary" to={`/foglalas?room=${room.id}`}>
              Ezt a termet foglalom
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}

function AboutPage() {
  return (
    <main className="page">
      <section className="about-story split-section">
        <div className="section-copy reveal">
          <p className="script-word">Rólunk</p>
          <h1>Egy hely, ahol a fejlődés nem cél, hanem lehetőség.</h1>
          <p>A LESZEK egy olyan közösségi tér, ahol az érzelmi fejlődésre és a tudatos kapcsolódásokra helyezzük a hangsúlyt. Hiszünk abban, hogy az érzelmi intelligencia az önazonos működés, a belső stabilitás és az emberi kapcsolódás egyik alapja.</p>
          <p>Programjaink célja, hogy gyerekek és felnőttek egyaránt biztonságos, ítélkezésmentes közegben kapcsolódhassanak saját belső világukhoz.</p>
          <div className="about-highlights" aria-label="LESZEK értékek">
            <span>biztonság</span>
            <span>önismeret</span>
            <span>kapcsolódás</span>
          </div>
        </div>
        <div className="image-panel reveal">
          <img src="/assets/images/community-session.png" alt="LESZEK közösségi foglalkozás" />
        </div>
      </section>
      <section className="manifesto band">
        <div className="manifesto-layout">
          <div className="section-head reveal">
            <p className="eyebrow">Küldetésünk</p>
            <h2>Önismeretből kapcsolódás, kapcsolódásból megtartás.</h2>
          </div>
          <div className="manifesto-card reveal">
            <img src="/assets/brand/spiral-logo-green.png" alt="" />
            <p>Mindennapi életünkben meghatározó szerepe van annak, hogyan érzékeljük önmagunkat és másokat. Mennyire tudunk együttműködni, egészséges határokat tartani, jelen lenni egymás számára és felelősséget vállalni a saját érzéseinkért.</p>
            <p>Fontosnak tartjuk, hogy a család minden tagja támogatást kapjon a saját útján. Központunk egyszerre kínál élményeket, folyamatokat és közösségi megtartást szülőknek és gyermekeknek is.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function BookingPage() {
  const params = new URLSearchParams(window.location.search);
  const initialRoom = rooms.find((room) => room.id === params.get("room"))?.id || rooms[0].id;
  const [form, setForm] = useState({
    room: initialRoom,
    date: "",
    time: "10:00",
    duration: initialRoom === "soszoba" ? "0.75" : "1",
    people: "2",
    name: "",
    email: "",
    phone: "",
    purpose: "Egyéni konzultáció",
    message: ""
  });
  const [success, setSuccess] = useState("");

  const room = rooms.find((item) => item.id === form.room) || rooms[0];
  const duration = Number(form.duration);
  const total = room.id === "soszoba" ? Math.ceil(duration / 0.75) * room.price : Math.ceil(duration * room.price);

  function updateField(event) {
    const { name, value } = event.target;
    setSuccess("");
    setForm((current) => {
      if (name === "room") {
        return { ...current, room: value, duration: value === "soszoba" ? "0.75" : current.duration === "0.75" ? "1" : current.duration };
      }
      return { ...current, [name]: value };
    });
  }

  function submitBooking(event) {
    event.preventDefault();
    const booking = { ...form, room: room.name, total, createdAt: new Date().toISOString() };
    const saved = JSON.parse(localStorage.getItem("leszekBookings") || "[]");
    saved.push(booking);
    localStorage.setItem("leszekBookings", JSON.stringify(saved));
    setSuccess(`Foglalási igény rögzítve. Összegzés: ${room.name}, ${form.date} ${form.time}, ${money.format(total)}.`);
    setForm((current) => ({ ...current, name: "", email: "", phone: "", message: "" }));
  }

  return (
    <main className="page booking-page">
      <section className="page-hero reveal">
        <p className="script-word">Foglalás</p>
        <h1>Válassz teret, időpontot és küldd el a foglalási igényt.</h1>
        <p>Az űrlap kiszámolja a várható teremhasználati díjat. A beküldés után a foglalás visszaigazolással válik véglegessé.</p>
      </section>
      <section className="booking-layout">
        <form className="booking-form reveal" onSubmit={submitBooking}>
          <label>
            Terem
            <select name="room" value={form.room} onChange={updateField} required>
              {rooms.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <div className="form-grid">
            <label>
              Dátum <input type="date" name="date" value={form.date} onChange={updateField} required />
            </label>
            <label>
              Kezdés <input type="time" name="time" min="08:00" max="21:00" value={form.time} onChange={updateField} required />
            </label>
          </div>
          <div className="form-grid">
            <label>
              Időtartam
              <select name="duration" value={form.duration} onChange={updateField} required>
                <option value="0.75" disabled={room.id !== "soszoba"}>
                  45 perc
                </option>
                {["1", "1.5", "2", "3", "4"].map((value) => (
                  <option value={value} disabled={room.id === "soszoba"} key={value}>
                    {value.replace(".", ",")} óra
                  </option>
                ))}
              </select>
            </label>
            <label>
              Létszám <input type="number" name="people" min="1" max="35" value={form.people} onChange={updateField} required />
            </label>
          </div>
          <label>
            Név <input type="text" name="name" autoComplete="name" value={form.name} onChange={updateField} required />
          </label>
          <div className="form-grid">
            <label>
              E-mail <input type="email" name="email" autoComplete="email" value={form.email} onChange={updateField} required />
            </label>
            <label>
              Telefon <input type="tel" name="phone" autoComplete="tel" value={form.phone} onChange={updateField} required />
            </label>
          </div>
          <label>
            Foglalkozás típusa
            <select name="purpose" value={form.purpose} onChange={updateField}>
              <option>Egyéni konzultáció</option>
              <option>Páros foglalkozás</option>
              <option>Csoportos önismereti foglalkozás</option>
              <option>Workshop / előadás</option>
              <option>Hangfürdő / mozgásos foglalkozás</option>
              <option>Egyéb</option>
            </select>
          </label>
          <label>
            Megjegyzés <textarea name="message" rows="4" placeholder="Írd meg, mire szeretnéd használni a teret." value={form.message} onChange={updateField}></textarea>
          </label>
          <button className="button primary" type="submit">
            Foglalási igény küldése
          </button>
          <p className="form-note">Ez egy működő prototípus: a foglalási igényt a böngészőben rögzíti és összefoglalót készít. Élesítéskor e-mail vagy naptár integrációhoz köthető.</p>
        </form>
        <aside className="booking-summary reveal">
          <h2>Foglalási összegző</h2>
          <div className="summary-lines">
            <div className="summary-line">
              <strong>Terem</strong>
              <span>{room.name}</span>
            </div>
            <div className="summary-line">
              <strong>Ajánlott</strong>
              <span>{room.bestFor}</span>
            </div>
            <div className="summary-line">
              <strong>Dátum</strong>
              <span>{form.date || "válassz dátumot"}</span>
            </div>
            <div className="summary-line">
              <strong>Kezdés</strong>
              <span>{form.time || "válassz időpontot"}</span>
            </div>
            <div className="summary-line">
              <strong>Időtartam</strong>
              <span>{duration === 0.75 ? "45 perc" : `${duration} óra`}</span>
            </div>
            <div className="summary-total">{money.format(total)}</div>
          </div>
          {success ? <div className="booking-success">{success}</div> : null}
        </aside>
      </section>
    </main>
  );
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <main className="page contact-page">
      <section className="page-hero reveal">
        <p className="script-word">Kapcsolat</p>
        <h1>Vedd fel velünk a kapcsolatot</h1>
        <p>Térhasználattal, személyes megtekintéssel vagy együttműködéssel kapcsolatban küldj üzenetet, vagy keress minket telefonon és e-mailben.</p>
      </section>
      <section className="contact-layout">
        <div className="contact-card reveal">
          <h2>LESZEK KÖZPONT</h2>
          <a href="mailto:leszekkozpont@gmail.com">leszekkozpont@gmail.com</a>
          <a href="tel:+36203991937">+36 20 399 1937</a>
          <p>Székesfehérvár, Nagyszombati utca 169.</p>
        </div>
        <form
          className="contact-form reveal"
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
            event.currentTarget.reset();
          }}
        >
          <label>
            Név <input type="text" required />
          </label>
          <label>
            E-mail <input type="email" required />
          </label>
          <label>
            Üzenet <textarea rows="6" required></textarea>
          </label>
          <button className="button primary" type="submit">
            Üzenet küldése
          </button>
          {sent ? <p className="booking-success">Az üzenet prototípusként rögzítve. Élesítéskor e-mail küldésre köthető.</p> : null}
        </form>
      </section>
      <section className="map-section reveal" aria-label="LESZEK KÖZPONT térkép">
        <iframe
          title="LESZEK KÖZPONT térkép - Székesfehérvár, Nagyszombati utca 169"
          src="https://www.google.com/maps?q=Sz%C3%A9kesfeh%C3%A9rv%C3%A1r%2C%20Nagyszombati%20utca%20169&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        ></iframe>
      </section>
    </main>
  );
}

function PrivacyPage() {
  return (
    <main className="page legal-page">
      <section className="page-hero reveal">
        <p className="script-word">Adatvédelem</p>
        <h1>Adatvédelmi tájékoztató</h1>
        <p>Ez az oldal a LESZEK KÖZPONT weboldalán és foglalási felületein kezelt személyes adatok alapelveit foglalja össze. A végleges jogi szöveg élesítés előtt ügyvédi/adatvédelmi ellenőrzéssel pontosítható.</p>
      </section>
      <section className="legal-content reveal">
        <h2>Adatkezelő</h2>
        <p>LESZEK KÖZPONT, Székesfehérvár, Nagyszombati utca 169. Kapcsolat: leszekkozpont@gmail.com.</p>
        <h2>Kezelt adatok</h2>
        <p>Kapcsolatfelvétel és foglalási igény esetén név, e-mail cím, telefonszám, választott terem, időpont, létszám és az üzenetben önként megadott információk kezelése történhet.</p>
        <h2>Adatkezelés célja</h2>
        <p>A megkeresések megválaszolása, foglalási igények egyeztetése, szolgáltatások megszervezése és az ügyfélkapcsolat fenntartása.</p>
        <h2>Jogok</h2>
        <p>Az érintett kérheti adatai helyesbítését, törlését, kezelésének korlátozását, valamint tájékoztatást kérhet az adatkezelésről.</p>
      </section>
    </main>
  );
}

function ImprintPage() {
  return (
    <main className="page legal-page">
      <section className="page-hero reveal">
        <p className="script-word">Impresszum</p>
        <h1>Impresszum</h1>
        <p>A LESZEK KÖZPONT weboldalának szolgáltatói és kapcsolatfelvételi adatai. A cégadatok élesítéskor a végleges jogi információkkal pontosíthatók.</p>
      </section>
      <section className="legal-content reveal">
        <h2>Szolgáltató</h2>
        <p>LESZEK KÖZPONT</p>
        <h2>Székhely / működési hely</h2>
        <p>Székesfehérvár, Nagyszombati utca 169.</p>
        <h2>Kapcsolat</h2>
        <p>E-mail: leszekkozpont@gmail.com<br />Telefon: +36 20 399 1937</p>
        <h2>Weboldal készítés</h2>
        <p>Csitáry Office</p>
      </section>
    </main>
  );
}

function useReveal(dependency) {
  useEffect(() => {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [dependency]);
}

export default App;
