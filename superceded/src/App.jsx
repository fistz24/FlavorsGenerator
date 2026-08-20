import React, { useState, useEffect, useCallback, useRef } from "react";
import { Lock, LockOpen, Shuffle, Heart, X, Plus, Minus, Share2 } from "lucide-react";

// =========================================================
// Visual system v2 — soft rounded, pastel color-block cards,
// pill-shaped bars. Inspired by warm wellness-app reference.
// =========================================================
const C = {
  bg: "#EDE1D2",       // warm tan page background
  lavender: "#C7CBF0",
  mustard: "#EFC868",
  sage: "#A9C9AC",
  blush: "#E4C6AC",
  sky: "#B7D3DE",
  ink: "#221D18",       // near-black text
  white: "#FFFFFF",
  muted: "#8A8073",     // warm gray secondary text
};

const OCCASION_COLOR = { lebaran: C.mustard, imlek: C.blush, christmas: C.sage, easter: C.lavender, everyday: C.sky };

const FONT_IMPORT = "@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700&family=Inter:wght@400;500;600&display=swap');";

// =========================================================
// Data — Concept Generator (unchanged from prior version)
// =========================================================
const OCCASIONS = [
  { id: "lebaran", label: "Lebaran" },
  { id: "imlek", label: "Imlek" },
  { id: "christmas", label: "Christmas" },
  { id: "easter", label: "Easter" },
  { id: "everyday", label: "Everyday" },
];

const FLAVOR_ATTR = {
  lebaran: {
    base: ["Brown butter sponge", "Pandan chiffon", "Cardamom spice sponge", "Coconut milk sponge", "Honey butter sponge", "Semolina cake base", "Saffron milk sponge", "Rosewater semolina cake", "Tahini sesame sponge"],
    pairing: ["pineapple jam ribbon", "gula merah caramel core", "date caramel swirl", "salted egg custard center", "cashew praline layer", "rosewater cream filling", "fig & date compote", "pistachio rose cream", "tamarind caramel swirl"],
    topping: ["toasted cheese crumble", "desiccated coconut crust", "caramelized nut brittle", "crushed pistachio dust", "honey glaze drizzle", "sesame brittle shards", "saffron pistachio dust", "rosewater glaze", "toasted almond flakes"],
  },
  imlek: {
    base: ["Red bean chiffon", "Black sesame sponge", "Taro sponge", "Osmanthus honey sponge", "Glutinous rice cake base", "Green tea sponge", "Osmanthus jasmine chiffon", "Ube-inspired purple sponge", "Hojicha roasted tea sponge"],
    pairing: ["lychee rose cream", "mandarin honey glaze", "eight-treasure candied fruit", "red bean paste core", "golden pineapple jam", "sweet chestnut cream", "soursop cream filling", "yuzu marmalade core", "chestnut paste swirl"],
    topping: ["gold leaf accent", "candied kumquat garnish", "toasted sesame crust", "crispy rice pearls", "honey-glazed walnuts", "lotus seed crumble", "candied ginger garnish", "toasted coconut flakes", "gold dusted sesame"],
  },
  christmas: {
    base: ["Gingerbread spice sponge", "Cocoa sponge roll", "Rum-soaked fruit sponge", "Speculoos spice sponge", "Orange-spice sponge", "Chestnut sponge", "Chestnut spice sponge", "Earl Grey infused sponge", "Panettone-style fruit sponge"],
    pairing: ["peppermint cream filling", "cranberry compote core", "eggnog custard swirl", "salted caramel ribbon", "brandy-soaked fruit filling", "chestnut cream center", "fig & walnut compote", "mulled pear filling", "hazelnut praline core"],
    topping: ["cream cheese frosting", "dark chocolate ganache bark", "candied orange peel", "gingerbread crumble", "toasted pecan brittle", "powdered sugar snow dust", "candied chestnut crumble", "spiced sugar dust", "toasted hazelnut brittle"],
  },
  easter: {
    base: ["Carrot spice sponge", "Lemon poppy seed sponge", "Coconut sponge", "Vanilla funfetti sponge", "Almond marzipan sponge", "Orange blossom sponge", "Elderflower sponge", "Pistachio rose sponge", "Yuzu poppy seed sponge"],
    pairing: ["cream cheese core", "lemon curd swirl", "coconut cream filling", "raspberry compote ribbon", "honey-almond filling", "apricot glaze center", "passion fruit curd swirl", "guava cream filling", "hibiscus compote core"],
    topping: ["pastel buttercream swirls", "toasted coconut flakes", "candied flower petals", "sugared almonds", "soft pastel sprinkles", "citrus zest dust", "candied pistachio dust", "dried rose petals", "toasted coconut ribbons"],
  },
  everyday: {
    base: ["Vanilla bean sponge", "Dark chocolate sponge", "Matcha sponge", "Red velvet sponge", "Coffee walnut sponge", "Banana spice sponge", "Ube sponge", "Pandan coconut sponge", "Black sesame sponge"],
    pairing: ["silky buttercream core", "fudge ganache ribbon", "white chocolate cream", "cream cheese filling", "caramel drizzle center", "hazelnut praline swirl", "soursop cream core", "tahini caramel swirl", "calamansi curd center"],
    topping: ["chocolate shavings", "toasted nut crumble", "fresh berry garnish", "cocoa dust finish", "caramel drizzle", "edible flower accent", "toasted pistachio crumble", "candied ginger bits", "coconut flake crust"],
  },
};

const HAMPER_ATTR = {
  lebaran: { anchor: ["Mini nastar jar", "Kurma selection box", "Sarung / prayer mat charm", "Mini kue kering tin", "Rose-scented soap bar", "Mini dates & nuts platter"], secondary: ["chocolate-dipped dates", "cashew praline bites", "rose-scented soap", "mini prayer beads", "saffron tea sachet", "handmade tasbih charm"], note: ["handwritten Eid card", "ribbon-tied tag", "wax seal note", "gold foil card", "gold-embossed card", "linen pouch tag"] },
  imlek: { anchor: ["Mandarin oranges", "Mini angpao chocolate coins", "Fortune cookie set", "Tea sampler box", "Osmanthus tea box", "Mini ube pastry set"], secondary: ["oolong tea sachet", "red thread bracelet", "candied lotus seeds", "mini gold ingot charm", "dried longan snack", "mini jade charm"], note: ["fortune card", "red envelope note", "calligraphy tag", "gold foil card", "lucky red tag", "brush calligraphy note"] },
  christmas: { anchor: ["Mulled spice sachet", "Mini gingerbread cookies", "Hot chocolate mix", "Ornament-shaped soap", "Chestnut roast sachet", "Mini panettone slice"], secondary: ["peppermint stick", "candied orange slice", "pine sprig charm", "mini candle", "cinnamon stick bundle", "felt ornament"], note: ["handwritten card", "wax seal note", "kraft tag", "ribbon card", "linen gift tag", "twine-tied card"] },
  easter: { anchor: ["Mini chocolate eggs", "Dried flower bouquet", "Pastel macaron set", "Mini garden seed packet", "Mini herb garden kit", "Speckled egg soap set"], secondary: ["sugared almonds", "floral soap bar", "pastel candle", "mini ribbon charm", "chamomile tea sachet", "pastel wax crayon"], note: ["handwritten card", "pastel ribbon tag", "wax seal note", "floral card", "botanical print card", "linen ribbon tag"] },
  everyday: { anchor: ["Birthday candle set", "Mini flower bouquet", "Tea sampler", "Mini candle", "Mini succulent pot", "Assorted mochi box"], secondary: ["handwritten note", "ribbon charm", "chocolate bites", "mini soap bar", "thank-you sticker sheet", "mini incense stick"], note: ["handwritten card", "kraft tag", "wax seal note", "ribbon card", "kraft sticker seal", "confetti card"] },
};

const THEME_ATTR = {
  lebaran: { mood: ["Gold & linen minimalist", "Terracotta & cream earthy", "Soft sage & gold", "Ivory & bronze", "Blush rose minimalist", "Sand & sage neutral"], motif: ["crescent moon line art", "ketupat weave texture", "geometric lattice pattern", "calligraphy stamp accent", "floral vine border", "woven rattan texture"], accent: ["thin gold foil edge", "woven ribbon tie", "embossed wax seal", "tassel charm", "silk ribbon knot", "brass charm detail"], palette: [C.mustard, C.blush, C.sage] },
  imlek: { mood: ["Red & gold prosperity", "Jade green & gold", "Blush red minimalist", "Deep vermillion & bronze", "Emerald & gold luxe", "Warm coral minimalist"], motif: ["angpao silhouette", "bamboo line art", "cloud lattice pattern", "peony line art", "koi fish line art", "lotus blossom motif"], accent: ["gold foil edge", "tassel charm", "red thread tie", "wax seal stamp", "silk tassel", "jade bead charm"], palette: [C.blush, C.mustard, C.lavender] },
  christmas: { mood: ["Deep green & burgundy", "Scandinavian white & red", "Gold & pine", "Charcoal & cranberry", "Ivory & holly red", "Copper & forest green"], motif: ["pine branch line art", "snowflake lattice", "holly sprig accent", "plaid pattern", "star line art", "berry sprig accent"], accent: ["velvet ribbon tie", "gold foil edge", "wax seal stamp", "pinecone charm", "copper foil edge", "linen ribbon bow"], palette: [C.sage, C.blush, C.sky] },
  easter: { mood: ["Pastel speckled", "Spring floral white", "Sage & blush", "Buttercream yellow & sage", "Lilac & cream soft", "Honey & sage warm"], motif: ["speckled egg pattern", "botanical line art", "basket-weave texture", "bunny silhouette accent", "butterfly line art", "wildflower sprig"], accent: ["pastel ribbon tie", "dried flower sprig", "wax seal stamp", "gingham trim", "organza ribbon", "pressed flower detail"], palette: [C.lavender, C.sky, C.blush] },
  everyday: { mood: ["Warm linen minimalist", "Playful pastel dot", "Charcoal & cream modern", "Soft sage neutral", "Terracotta modern", "Sky blue playful"], motif: ["dot pattern", "minimal line art", "geometric grid", "botanical sprig", "wave line pattern", "confetti scatter"], accent: ["kraft twine tie", "wax seal stamp", "ribbon bow", "foil edge", "twine bow", "sticker seal"], palette: [C.sky, C.sage, C.mustard] },
};

// Card color pools -- so flavor/hamper card backgrounds change with the content
const CARD_COLORS = [C.mustard, C.blush, C.sage, C.lavender, C.sky];
function randomCardColor(exclude) {
  const pool = exclude ? CARD_COLORS.filter((c) => c !== exclude) : CARD_COLORS;
  return pool[Math.floor(Math.random() * pool.length)];
}

function composeTheme(occasion) {
  const a = THEME_ATTR[occasion];
  return { name: pick(a.mood), desc: `${pick(a.motif)}, ${pick(a.accent)}.`, swatch: pickN(a.palette.length >= 3 ? a.palette : [...a.palette, C.ink, C.white], 3) };
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickN(arr, n) {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length; i++) out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  return out;
}
function composeFlavor(occasion, prevColor) {
  const a = FLAVOR_ATTR[occasion];
  return { name: pick(a.base), desc: `with ${pick(a.pairing)}, finished with ${pick(a.topping)}.`, color: randomCardColor(prevColor) };
}
function composeHamper(occasion, prevColor) {
  const a = HAMPER_ATTR[occasion];
  const items = [pick(a.anchor), pick(a.secondary), pick(a.note)];
  return { name: items[0], items, color: randomCardColor(prevColor) };
}

const FLAVOR_NOTES = [
  { label: "Dark Chocolate", color: "#6B4A3A" }, { label: "Milk Chocolate", color: "#8A6248" }, { label: "White Chocolate", color: "#F0E2D0" }, { label: "Cocoa Nib", color: "#5C4433" },
  { label: "Salted Caramel", color: "#D69A4C" }, { label: "Vanilla Bean", color: "#EFDDB9" }, { label: "Brown Butter", color: "#C79A5F" }, { label: "Mascarpone", color: "#F5EFE0" },
  { label: "Espresso", color: "#5A4232" }, { label: "Hazelnut", color: "#A97C50" }, { label: "Pistachio", color: "#A9C08A" }, { label: "Almond", color: "#DCC69F" },
  { label: "Strawberry", color: "#E48A9A" }, { label: "Raspberry", color: "#C25A72" }, { label: "Blueberry", color: "#8189C4" }, { label: "Blackberry", color: "#6B5590" },
  { label: "Lemon", color: "#EFD46A" }, { label: "Orange", color: "#E8A15C" }, { label: "Mandarin", color: "#E8A968" }, { label: "Yuzu", color: "#E3CE72" },
  { label: "Passion Fruit", color: "#E8A94A" }, { label: "Mango", color: "#EBB157" }, { label: "Pineapple", color: "#EAC868" }, { label: "Coconut", color: "#F1E7D5" }, { label: "Lychee", color: "#F0C9CE" },
  { label: "Rose", color: "#E3B3BE" }, { label: "Lavender", color: "#B8AED6" }, { label: "Jasmine", color: "#EFE7D6" },
  { label: "Cinnamon", color: "#BD7B4E" }, { label: "Cardamom", color: "#9AAA7C" }, { label: "Ginger", color: "#DB9E63" },
  { label: "Fig", color: "#8C6478" }, { label: "Pear", color: "#D3D89F" }, { label: "Cherry", color: "#B4506A" }, { label: "Plum", color: "#8A6591" }, { label: "Pomegranate", color: "#C15E6F" },
  { label: "Matcha", color: "#9AAA7C" }, { label: "Black Sesame", color: "#4A423C" }, { label: "Brown Sugar", color: "#B4834D" },
  { label: "Mint", color: "#9BC29A" }, { label: "Basil", color: "#87AB78" },
  // -- global additions --
  { label: "Osmanthus", color: "#E8D08A" }, { label: "Ube", color: "#8B5FA3" }, { label: "Soursop", color: "#DCE8C8" }, { label: "Durian", color: "#D9C77A" },
  { label: "Guava", color: "#E58A73" }, { label: "Dragon Fruit", color: "#D8558A" }, { label: "Saffron", color: "#E0A020" }, { label: "Turmeric", color: "#D9A62E" },
  { label: "Gula Jawa", color: "#9C6B3E" }, { label: "Hojicha", color: "#8A6248" }, { label: "Earl Grey", color: "#7A6E6A" }, { label: "Chai Spice", color: "#8A5A34" },
  { label: "Tahini", color: "#D9C29A" }, { label: "Pandan", color: "#7FA37A" }, { label: "Calamansi", color: "#C4D46A" }, { label: "Tamarind", color: "#7A4A3A" },
  { label: "Hibiscus", color: "#B23A5A" }, { label: "Elderflower", color: "#E8E4C8" }, { label: "Chestnut", color: "#8A6A50" }, { label: "Kaffir Lime", color: "#8FAE6A" },
];

function luminance(hex) {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16) / 255, g = parseInt(c.substring(2, 4), 16) / 255, b = parseInt(c.substring(4, 6), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}
function randomPaletteRow(size, exclude = []) {
  const excludeLabels = new Set(exclude);
  return pickN(FLAVOR_NOTES.filter((f) => !excludeLabels.has(f.label)), size);
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 640 : false));
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return isMobile;
}

// Simple localStorage wrapper -- replaces the Claude-artifact-only storage API
// so this works in any real deployed browser, no backend needed.
const storage = {
  get(key) {
    try {
      const v = window.localStorage.getItem(key);
      return v ? { value: v } : null;
    } catch (e) {
      return null;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (e) {
      return false;
    }
  },
};

// =========================================================
// Shared bits
// =========================================================
function GlobalStyle() {
  return (
    <style>{`
      ${FONT_IMPORT}
      .cs-head { font-family: 'Quicksand', sans-serif; font-weight: 700; }
      .cs-pulse { animation: csFade 0.28s ease; }
      @keyframes csFade { 0% { opacity: 0.3; transform: scale(0.96); } 100% { opacity: 1; transform: scale(1); } }
      .cs-btn:active { transform: scale(0.97); }
      .cs-btn:focus-visible, .cs-tab:focus-visible, .cs-lock:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 2px; }
      @media (prefers-reduced-motion: reduce) { .cs-pulse { animation: none; } }
    `}</style>
  );
}

function badgeIcon(active) {
  return {
    width: "30px", height: "30px", borderRadius: "50%", background: active ? C.ink : "rgba(0,0,0,0.08)",
    display: "flex", alignItems: "center", justifyContent: "center", color: active ? C.white : C.ink,
    border: "none", cursor: "pointer", flexShrink: 0,
  };
}

// =========================================================
// Share — native share sheet where available (covers WhatsApp,
// Messages, Instagram, TikTok, and more automatically on mobile),
// with explicit fallback links for desktop browsers that don't
// support navigator.share.
// =========================================================
function ShareMenu({ shareText, appUrl }) {
  const [open, setOpen] = useState(false);
  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const nativeShare = async () => {
    try {
      await navigator.share({ title: "Cake Studio", text: shareText, url: appUrl });
    } catch (e) {
      // user cancelled the native share sheet -- no action needed
    }
  };

  const links = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(shareText + " " + appUrl)}` },
    { label: "Pinterest", href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(appUrl)}&description=${encodeURIComponent(shareText)}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}` },
    { label: "X / Twitter", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}` },
    { label: "Email", href: `mailto:?subject=${encodeURIComponent("Cake Studio")}&body=${encodeURIComponent(shareText + " " + appUrl)}` },
    { label: "SMS", href: `sms:?&body=${encodeURIComponent(shareText + " " + appUrl)}` },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${appUrl}`);
      setOpen(false);
    } catch (e) {}
  };

  if (canNativeShare) {
    return (
      <button className="cs-btn" onClick={nativeShare} style={secondaryBtn}>
        <Share2 size={16} /> Share
      </button>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <button className="cs-btn" onClick={() => setOpen((v) => !v)} style={secondaryBtn}>
        <Share2 size={16} /> Share
      </button>
      {open && (
        <div style={{ position: "absolute", top: "110%", left: "50%", transform: "translateX(-50%)", background: C.white, borderRadius: "14px", padding: "8px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 10, minWidth: "170px" }}>
          {links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}
              style={{ display: "block", padding: "8px 10px", fontSize: "13px", color: C.ink, textDecoration: "none", borderRadius: "8px", fontWeight: 500 }}>
              {l.label}
            </a>
          ))}
          <button onClick={copyLink} style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 10px", fontSize: "13px", color: C.ink, background: "none", border: "none", cursor: "pointer", borderRadius: "8px", fontWeight: 500 }}>
            Copy link
          </button>
        </div>
      )}
    </div>
  );
}

// =========================================================
// Footer -- copyright + legal links. Placeholder legal content;
// see the deployment guide for what to update before real launch.
// =========================================================
function Footer() {
  const [legalOpen, setLegalOpen] = useState(null); // 'privacy' | 'terms' | null
  const year = new Date().getFullYear();

  return (
    <div style={{ textAlign: "center", marginTop: "3rem", paddingTop: "1.5rem", borderTop: `1px solid rgba(0,0,0,0.08)` }}>
      <div style={{ fontSize: "12px", color: C.muted, marginBottom: "6px" }}>
        &copy; {year} Fonda Santoso. All rights reserved.
      </div>
      <div style={{ display: "flex", gap: "14px", justifyContent: "center", fontSize: "12px" }}>
        <button onClick={() => setLegalOpen("privacy")} style={linkBtn}>Privacy Policy</button>
        <button onClick={() => setLegalOpen("terms")} style={linkBtn}>Terms of Use</button>
      </div>

      {legalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "20px" }} onClick={() => setLegalOpen(null)}>
          <div style={{ background: C.white, borderRadius: "18px", padding: "24px", maxWidth: "480px", maxHeight: "70vh", overflowY: "auto", textAlign: "left" }} onClick={(e) => e.stopPropagation()}>
            <div className="cs-head" style={{ fontSize: "18px", color: C.ink, marginBottom: "10px" }}>
              {legalOpen === "privacy" ? "Privacy Policy" : "Terms of Use"}
            </div>
            <div style={{ fontSize: "13px", color: C.ink, opacity: 0.8, lineHeight: 1.6 }}>
              {legalOpen === "privacy" ? (
                <>
                  <p style={{ marginBottom: "10px" }}>This app does not require an account and does not collect personal information. Saved concepts are stored only in your browser's local storage on your own device -- they are never sent to or stored on any server.</p>
                  <p>If sign-in and cloud sync are added in the future, this policy will be updated to describe what account data is collected and how it's used.</p>
                </>
              ) : (
                <>
                  <p style={{ marginBottom: "10px" }}>Cake Studio is provided free, as-is, for personal and business use in generating cake and hamper concept ideas. Generated concepts are suggestions only -- always verify ingredients for allergens and dietary requirements before use.</p>
                  <p>All app design, code, and content &copy; {year} Fonda Santoso. Generated flavor and design concepts are yours to use freely in your own business.</p>
                </>
              )}
            </div>
            <button onClick={() => setLegalOpen(null)} style={{ ...secondaryBtn, marginTop: "16px" }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

const linkBtn = { background: "none", border: "none", color: "#8A8073", cursor: "pointer", textDecoration: "underline", fontWeight: 500, padding: 0 };

// =========================================================
// App shell
// =========================================================
export default function App() {
  const [mode, setMode] = useState("concept");
  const appUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif" }} className="w-full">
      <GlobalStyle />
      <div className="max-w-3xl mx-auto px-5 py-10">
        <div className="mb-6 text-center">
          <div className="cs-head" style={{ fontSize: "30px", color: C.ink, lineHeight: 1.15 }}>Cake Studio</div>
          <div style={{ fontSize: "13px", color: C.muted, marginTop: "6px", fontWeight: 500 }}>Two ways to break the creative block.</div>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {[["concept", "Concept Generator"], ["palette", "Flavor Palette"]].map(([id, label]) => (
            <button key={id} className="cs-tab cs-btn" onClick={() => setMode(id)} style={{
              padding: "10px 20px", borderRadius: "999px", fontSize: "13px", fontWeight: 700, fontFamily: "'Quicksand', sans-serif",
              border: "none", background: mode === id ? C.ink : "rgba(0,0,0,0.06)", color: mode === id ? C.white : C.ink, cursor: "pointer",
            }}>{label}</button>
          ))}
        </div>

        {mode === "concept" ? <ConceptGenerator appUrl={appUrl} /> : <FlavorPalette appUrl={appUrl} />}
        <Footer />
      </div>
    </div>
  );
}

// =========================================================
// Product 1: Concept Generator — big rounded color-block cards
// =========================================================
function ConceptGenerator({ appUrl }) {
  const [occasion, setOccasion] = useState("lebaran");
  const [locked, setLocked] = useState({ flavor: false, theme: false, hamper: false });
  const [current, setCurrent] = useState(() => ({ flavor: composeFlavor("lebaran"), theme: composeTheme("lebaran"), hamper: composeHamper("lebaran") }));
  const [saved, setSaved] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState("");
  const [pulse, setPulse] = useState({ flavor: false, theme: false, hamper: false });
  const toastTimer = useRef(null);

  useEffect(() => { (async () => { try { const r = await storage.get("cake-favorites"); if (r?.value) setSaved(JSON.parse(r.value)); } catch (e) {} finally { setLoaded(true); } })(); }, []);

  const generate = useCallback((targetOccasion = occasion, resetLocks = false) => {
    const nl = resetLocks ? { flavor: false, theme: false, hamper: false } : locked;
    setCurrent((prev) => ({
      flavor: nl.flavor ? prev.flavor : composeFlavor(targetOccasion, prev.flavor.color),
      theme: nl.theme ? prev.theme : composeTheme(targetOccasion),
      hamper: nl.hamper ? prev.hamper : composeHamper(targetOccasion, prev.hamper.color),
    }));
    if (resetLocks) setLocked({ flavor: false, theme: false, hamper: false });
    setPulse({ flavor: !nl.flavor, theme: !nl.theme, hamper: !nl.hamper });
  }, [occasion, locked]);

  useEffect(() => { const t = setTimeout(() => setPulse({ flavor: false, theme: false, hamper: false }), 280); return () => clearTimeout(t); }, [current]);
  useEffect(() => {
    const h = (e) => { if (e.code === "Space" && document.activeElement.tagName !== "BUTTON") { e.preventDefault(); generate(); } };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [generate]);

  const changeOccasion = (id) => { setOccasion(id); generate(id, true); };
  const toggleLock = (slot) => setLocked((p) => ({ ...p, [slot]: !p[slot] }));
  const showToast = (m) => { setToast(m); window.clearTimeout(toastTimer.current); toastTimer.current = window.setTimeout(() => setToast(""), 1800); };

  const saveConcept = async () => {
    const entry = { id: `${Date.now()}`, occasion, flavor: current.flavor, theme: current.theme, hamper: current.hamper };
    const next = [entry, ...saved].slice(0, 24);
    setSaved(next);
    try { await storage.set("cake-favorites", JSON.stringify(next)); showToast("Saved!"); } catch (e) { showToast("Couldn't save"); }
  };
  const removeSaved = async (id) => { const next = saved.filter((s) => s.id !== id); setSaved(next); try { await storage.set("cake-favorites", JSON.stringify(next)); } catch (e) {} };
  const loadSaved = (e) => { setOccasion(e.occasion); setCurrent({ flavor: e.flavor, theme: e.theme, hamper: e.hamper }); setLocked({ flavor: false, theme: false, hamper: false }); };

  return (
    <div>
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {OCCASIONS.map((o) => (
          <button key={o.id} onClick={() => changeOccasion(o.id)} className="cs-btn" style={{
            padding: "8px 16px", borderRadius: "999px", fontSize: "13px", fontWeight: 600, fontFamily: "'Quicksand', sans-serif",
            border: "none", background: occasion === o.id ? OCCASION_COLOR[o.id] : "rgba(0,0,0,0.06)", color: C.ink, cursor: "pointer",
          }}>{o.label}</button>
        ))}
      </div>

      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <ColorBlock label="Flavor" title={current.flavor.name} desc={current.flavor.desc} color={current.flavor.color} locked={locked.flavor} pulse={pulse.flavor} onLock={() => toggleLock("flavor")} />
        <ColorBlock label="Theme" title={current.theme.name} desc={current.theme.desc} color={C.white} locked={locked.theme} pulse={pulse.theme} onLock={() => toggleLock("theme")} swatch={current.theme.swatch} />
        <ColorBlock label="Hamper add-on" title={current.hamper.name} desc={current.hamper.items.slice(1).join(" · ")} color={current.hamper.color} locked={locked.hamper} pulse={pulse.hamper} onLock={() => toggleLock("hamper")} />
      </div>

      <div className="flex gap-3 justify-center items-center mb-2">
        <button className="cs-btn" onClick={() => generate()} style={primaryBtn}><Shuffle size={16} /> Generate</button>
        <button className="cs-btn" onClick={saveConcept} style={secondaryBtn}><Heart size={16} /> Save</button>
        <ShareMenu shareText={`Cake concept: ${current.flavor.name} ${current.flavor.desc} Theme: ${current.theme.name}. Hamper: ${current.hamper.items.join(", ")}.`} appUrl={appUrl} />
      </div>
      <div style={{ fontSize: "12px", color: C.muted, textAlign: "center", marginBottom: "8px" }}>Press space to generate</div>
      {toast && <div className="text-center mb-8" style={{ fontSize: "12px", color: C.muted, fontWeight: 600 }}>{toast}</div>}

      {loaded && saved.length > 0 && (
        <div>
          <div style={eyebrow}>Your saved concepts ({saved.length})</div>
          <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
            {saved.map((s) => (
              <div key={s.id} style={savedCard} onClick={() => loadSaved(s)}>
                <button onClick={(e) => { e.stopPropagation(); removeSaved(s.id); }} style={removeBtn} aria-label="Remove"><X size={14} /></button>
                <div style={{ fontSize: "10px", color: C.muted, fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>{OCCASIONS.find((o) => o.id === s.occasion)?.label}</div>
                <div className="cs-head" style={{ fontSize: "14px", color: C.ink }}>{s.flavor.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function mutedTint(hex) {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16), g = parseInt(c.substring(2, 4), 16), b = parseInt(c.substring(4, 6), 16);
  const mix = (v) => Math.round(v + (255 - v) * 0.45);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

function ColorBlock({ label, title, desc, color, locked, pulse, onLock, swatch }) {
  return (
    <div className={pulse ? "cs-pulse" : ""} style={{ background: color, borderRadius: "22px", padding: "20px", minHeight: "150px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div className="flex justify-between items-start">
        <div style={{ fontSize: "11px", fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.03em" }}>{label}</div>
        <button className="cs-lock cs-btn" onClick={onLock} aria-label={locked ? "Unlock" : "Lock"} aria-pressed={locked} style={badgeIcon(locked)}>
          {locked ? <Lock size={14} /> : <LockOpen size={14} />}
        </button>
      </div>
      <div>
        <div className="cs-head" style={{ fontSize: "18px", color: C.ink, lineHeight: 1.25, marginBottom: desc ? "4px" : 0 }}>{title}</div>
        {desc && <div style={{ fontSize: "12.5px", color: C.ink, opacity: 0.65, lineHeight: 1.5 }}>{desc}</div>}
        {swatch && (
          <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
            {swatch.map((c, i) => <div key={i} style={{ width: "22px", height: "22px", borderRadius: "50%", background: c }} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================
// Product 2: Flavor Palette — pill/capsule bars, white card
// on tan background, echoing the reference "Satisfaction" chart
// =========================================================
function FlavorPalette({ appUrl }) {
  const isMobile = useIsMobile();
  const [size, setSize] = useState(4);
  const [row, setRow] = useState(() => randomPaletteRow(4));
  const [locked, setLocked] = useState(Array(4).fill(false));
  const [saved, setSaved] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState("");
  const [pulseIdx, setPulseIdx] = useState([]);
  const toastTimer = useRef(null);

  useEffect(() => { (async () => { try { const r = await storage.get("flavor-palette-saves"); if (r?.value) setSaved(JSON.parse(r.value)); } catch (e) {} finally { setLoaded(true); } })(); }, []);

  const generate = useCallback(() => {
    setRow((prev) => {
      const keepLabels = prev.filter((_, i) => locked[i]).map((k) => k.label);
      const needed = size - keepLabels.length;
      const fresh = randomPaletteRow(needed, keepLabels);
      const next = []; let fi = 0; const pulses = [];
      for (let i = 0; i < size; i++) {
        if (locked[i] && prev[i]) next.push(prev[i]);
        else { next.push(fresh[fi]); pulses.push(i); fi++; }
      }
      setPulseIdx(pulses);
      return next;
    });
  }, [locked, size]);

  useEffect(() => { if (!pulseIdx.length) return; const t = setTimeout(() => setPulseIdx([]), 280); return () => clearTimeout(t); }, [pulseIdx]);
  useEffect(() => {
    const h = (e) => { if (e.code === "Space" && document.activeElement.tagName !== "BUTTON") { e.preventDefault(); generate(); } };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [generate]);

  const toggleLock = (i) => setLocked((p) => p.map((v, idx) => (idx === i ? !v : v)));
  const changeSize = (delta) => {
    const next = Math.max(3, Math.min(6, size + delta));
    if (next === size) return;
    if (next > size) { const extra = randomPaletteRow(next - size, row.map((r) => r.label)); setRow([...row, ...extra]); setLocked([...locked, ...Array(next - size).fill(false)]); }
    else { setRow(row.slice(0, next)); setLocked(locked.slice(0, next)); }
    setSize(next);
  };
  const showToast = (m) => { setToast(m); window.clearTimeout(toastTimer.current); toastTimer.current = window.setTimeout(() => setToast(""), 1800); };
  const savePalette = async () => {
    const entry = { id: `${Date.now()}`, row };
    const next = [entry, ...saved].slice(0, 24);
    setSaved(next);
    try { await storage.set("flavor-palette-saves", JSON.stringify(next)); showToast("Saved!"); } catch (e) { showToast("Couldn't save"); }
  };
  const removeSaved = async (id) => { const next = saved.filter((s) => s.id !== id); setSaved(next); try { await storage.set("flavor-palette-saves", JSON.stringify(next)); } catch (e) {} };
  const loadSaved = (e) => { setRow(e.row); setSize(e.row.length); setLocked(Array(e.row.length).fill(false)); };

  return (
    <div>
      <div className="flex justify-center items-center gap-3 mb-6">
        <button className="cs-btn" onClick={() => changeSize(-1)} aria-label="Remove a flavor" style={badgeIcon(false)}><Minus size={14} /></button>
        <div style={{ fontSize: "13px", color: C.muted, fontWeight: 600 }}>{size} flavors</div>
        <button className="cs-btn" onClick={() => changeSize(1)} aria-label="Add a flavor" style={badgeIcon(false)}><Plus size={14} /></button>
      </div>

      {/* white card echoing the reference "Satisfaction" chart card */}
      <div style={{ background: C.white, borderRadius: "22px", padding: "20px", marginBottom: "24px" }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="cs-head" style={{ fontSize: "16px", color: C.ink }}>Flavor palette</div>
            <div style={{ fontSize: "12px", color: C.muted, fontWeight: 500 }}>Lock what you love, reroll the rest</div>
          </div>
        </div>

        <div className="flex gap-2" style={isMobile ? { flexWrap: "wrap" } : { height: "200px" }}>
          {row.map((f, i) => {
            const textColor = luminance(f.color) > 0.6 ? C.ink : C.white;
            return (
              <div
                key={i}
                className={pulseIdx.includes(i) ? "cs-pulse" : ""}
                style={isMobile
                  ? { width: "calc(50% - 4px)", height: "108px", background: f.color, borderRadius: "999px", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", padding: "10px 8px" }
                  : { flex: 1, height: "100%", background: f.color, borderRadius: "999px", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", padding: "10px 6px", minWidth: 0 }
                }
              >
                <button className="cs-lock cs-btn" onClick={() => toggleLock(i)} aria-label={locked[i] ? "Unlock" : "Lock"} aria-pressed={locked[i]} style={{ background: "rgba(0,0,0,0.14)", border: "none", borderRadius: "50%", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: textColor, flexShrink: 0 }}>
                  {locked[i] ? <Lock size={11} /> : <LockOpen size={11} />}
                </button>
                <div style={{ fontSize: "10.5px", fontWeight: 700, color: textColor, textAlign: "center", writingMode: isMobile ? "horizontal-tb" : undefined, wordBreak: "break-word" }}>{f.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 justify-center items-center mb-2">
        <button className="cs-btn" onClick={generate} style={primaryBtn}><Shuffle size={16} /> Generate</button>
        <button className="cs-btn" onClick={savePalette} style={secondaryBtn}><Heart size={16} /> Save</button>
        <ShareMenu shareText={`Flavor palette idea: ${row.map((f) => f.label).join(" + ")}.`} appUrl={appUrl} />
      </div>
      <div style={{ fontSize: "12px", color: C.muted, textAlign: "center", marginBottom: "8px" }}>Press space to generate</div>
      {toast && <div className="text-center mb-8" style={{ fontSize: "12px", color: C.muted, fontWeight: 600 }}>{toast}</div>}

      {loaded && saved.length > 0 && (
        <div>
          <div style={eyebrow}>Your saved palettes ({saved.length})</div>
          <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
            {saved.map((s) => (
              <div key={s.id} style={savedCard} onClick={() => loadSaved(s)}>
                <button onClick={(e) => { e.stopPropagation(); removeSaved(s.id); }} style={removeBtn} aria-label="Remove"><X size={14} /></button>
                <div style={{ display: "flex", gap: "3px", marginBottom: "8px" }}>
                  {s.row.map((f, i) => <div key={i} style={{ flex: 1, height: "26px", borderRadius: "999px", background: f.color }} />)}
                </div>
                <div style={{ fontSize: "11px", color: C.muted, fontWeight: 500 }}>{s.row.map((f) => f.label).join(" · ")}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---- shared style objects ----
const primaryBtn = { display: "flex", alignItems: "center", gap: "8px", padding: "13px 26px", borderRadius: "999px", background: C.ink, color: C.white, fontWeight: 700, fontFamily: "'Quicksand', sans-serif", fontSize: "14px", border: "none", cursor: "pointer" };
const secondaryBtn = { display: "flex", alignItems: "center", gap: "8px", padding: "13px 22px", borderRadius: "999px", background: "rgba(0,0,0,0.06)", color: C.ink, fontWeight: 700, fontFamily: "'Quicksand', sans-serif", fontSize: "14px", border: "none", cursor: "pointer" };
const eyebrow = { fontSize: "11px", letterSpacing: "0.05em", color: C.muted, textTransform: "uppercase", fontWeight: 700, marginBottom: "12px" };
const savedCard = { background: C.white, borderRadius: "16px", padding: "12px", position: "relative", cursor: "pointer" };
const removeBtn = { position: "absolute", top: "10px", right: "10px", color: C.muted, background: "none", border: "none", cursor: "pointer" };
