import { useEffect, useRef } from "react";
import nodeLogo from "@assets/Node.js_logo.svg_1779092546464.png";
import pythonLogo from "@assets/Python-logo-notext.svg_1779092546499.png";
import jsLogo from "@assets/JqxsAtj7G5bc4D8vfE5LKrGjLhm2dgYi7aRtEXBd_1775224864139.jpg";
import html5Logo from "@assets/HTML5_logo_and_wordmark.svg_1779092546185.png";
import css3Logo from "@assets/CSS3_logo_and_wordmark.svg_1779092546086.png";
import postgresLogo from "@assets/Postgresql_elephant.svg_1779092599094.png";
import mongoLogo from "@assets/Gold_MongoDB_FG_1779092599144.jpg";
import apacheLogo from "@assets/apache-logo-png_seeklogo-314278_1779092599210.png";
import confluenceLogo from "@assets/confluence-1320x743_1779092598984.png";
import jenkinsLogo from "@assets/jenkins_logo_icon_167854_1779092599048.webp";
import profilePhoto from "@assets/Adobe_Express_-_file_1779094823201.png";

/* ─── Token types ─── */
type TokenType = "k" | "fn" | "str" | "num" | "cm" | "pm" | "op" | "cl" | "";
interface Token { t: TokenType; s: string }
interface TypedToken { color: string; chars: string[] }
interface NewlineToken { type: "newline" }
type FlatToken = TypedToken | NewlineToken;

/* ─── Colour map (VS Code Tokyo Night) ─── */
const COLOR: Record<string, string> = {
  k: "#bb9af7",   // keyword
  fn: "#7aa2f7",  // function
  str: "#9ece6a", // string
  num: "#ff9e64", // number
  cm: "#565f89",  // comment
  pm: "#e0af68",  // parameter / property
  op: "#89ddff",  // operator / punctuation
  cl: "#2ac3de",  // class
  "": "#a9b1d6",  // default
};

/* ─── Code snippets ─── */
const SNIPPETS: Token[][] = [
  [
    { t: "cm", s: "// Fleet management — fetch vehicles" },
    { t: "op", s: "\n" },
    { t: "k", s: "async " }, { t: "k", s: "function " }, { t: "fn", s: "fetchVehicles" },
    { t: "op", s: "(" }, { t: "pm", s: "filters" }, { t: "op", s: ") {" },
    { t: "op", s: "\n" },
    { t: "", s: "  " }, { t: "k", s: "const " }, { t: "", s: "res " },
    { t: "op", s: "= " }, { t: "k", s: "await " }, { t: "", s: "api" },
    { t: "op", s: "." }, { t: "fn", s: "get" }, { t: "op", s: "(" },
    { t: "str", s: "'/vehicles'" }, { t: "op", s: ", { params: filters });" },
    { t: "op", s: "\n" },
    { t: "", s: "  " }, { t: "k", s: "return " }, { t: "", s: "res" },
    { t: "op", s: "." }, { t: "pm", s: "data" }, { t: "op", s: "." },
    { t: "fn", s: "map" }, { t: "op", s: "(" }, { t: "pm", s: "v" },
    { t: "op", s: " => ({" },
    { t: "op", s: "\n" },
    { t: "", s: "    id: v" }, { t: "op", s: "." }, { t: "pm", s: "id" },
    { t: "op", s: ", lat: v" }, { t: "op", s: "." }, { t: "pm", s: "lat" },
    { t: "op", s: ", lng: v" }, { t: "op", s: "." }, { t: "pm", s: "lng" },
    { t: "op", s: "\n" },
    { t: "op", s: "  }));" },
    { t: "op", s: "\n" },
    { t: "op", s: "}" },
  ],
  [
    { t: "cm", s: "// Real-time socket listener (Socket.io)" },
    { t: "op", s: "\n" },
    { t: "", s: "socket" }, { t: "op", s: "." }, { t: "fn", s: "on" },
    { t: "op", s: "(" }, { t: "str", s: "'vehicle:update'" }, { t: "op", s: ", (" },
    { t: "pm", s: "payload" }, { t: "op", s: ") => {" },
    { t: "op", s: "\n" },
    { t: "k", s: "  const " }, { t: "op", s: "{ " }, { t: "", s: "id, lat, lng, speed " },
    { t: "op", s: "} = " }, { t: "pm", s: "payload" }, { t: "op", s: ";" },
    { t: "op", s: "\n" },
    { t: "  " , s: "  " }, { t: "fn", s: "updateMarker" }, { t: "op", s: "(" },
    { t: "pm", s: "id" }, { t: "op", s: ", { " }, { t: "pm", s: "lat" },
    { t: "op", s: ", " }, { t: "pm", s: "lng" }, { t: "op", s: " });" },
    { t: "op", s: "\n" },
    { t: "k", s: "  if " }, { t: "op", s: "(" }, { t: "", s: "speed " },
    { t: "op", s: "> " }, { t: "num", s: "120" }, { t: "op", s: ") {" },
    { t: "op", s: "\n" },
    { t: "    ", s: "    " }, { t: "fn", s: "triggerAlert" }, { t: "op", s: "(" },
    { t: "pm", s: "id" }, { t: "op", s: ", " }, { t: "str", s: "'overspeed'" },
    { t: "op", s: ");" },
    { t: "op", s: "\n" },
    { t: "op", s: "  }" }, { t: "op", s: "\n" }, { t: "op", s: "});" },
  ],
  [
    { t: "cm", s: "// Send SMS via Africa's Talking" },
    { t: "op", s: "\n" },
    { t: "k", s: "const " }, { t: "fn", s: "sendSMS" }, { t: "op", s: " = " },
    { t: "k", s: "async " }, { t: "op", s: "(" }, { t: "pm", s: "to" },
    { t: "op", s: ", " }, { t: "pm", s: "message" }, { t: "op", s: ") => {" },
    { t: "op", s: "\n" },
    { t: "k", s: "  try " }, { t: "op", s: "{" },
    { t: "op", s: "\n" },
    { t: "k", s: "    const " }, { t: "", s: "result " }, { t: "op", s: "= " },
    { t: "k", s: "await " }, { t: "", s: "sms" }, { t: "op", s: "." },
    { t: "fn", s: "send" }, { t: "op", s: "({ " }, { t: "pm", s: "to" },
    { t: "op", s: ", " }, { t: "pm", s: "message" }, { t: "op", s: " });" },
    { t: "op", s: "\n" },
    { t: "", s: "    console" }, { t: "op", s: "." }, { t: "fn", s: "log" },
    { t: "op", s: "(" }, { t: "str", s: "'Sent:'" }, { t: "op", s: ", result);" },
    { t: "op", s: "\n" },
    { t: "k", s: "  } catch " }, { t: "op", s: "(" }, { t: "pm", s: "err" },
    { t: "op", s: ") {" },
    { t: "op", s: "\n" },
    { t: "", s: "    console" }, { t: "op", s: "." }, { t: "fn", s: "error" },
    { t: "op", s: "(" }, { t: "pm", s: "err" }, { t: "op", s: "." },
    { t: "pm", s: "message" }, { t: "op", s: ");" },
    { t: "op", s: "\n" },
    { t: "op", s: "  }" }, { t: "op", s: "\n" }, { t: "op", s: "};" },
  ],
  [
    { t: "cm", s: "// PostgreSQL — active routes query" },
    { t: "op", s: "\n" },
    { t: "k", s: "const " }, { t: "fn", s: "getActiveRoutes" }, { t: "op", s: " = " },
    { t: "k", s: "async " }, { t: "op", s: "(" }, { t: "pm", s: "userId" },
    { t: "op", s: ") => {" },
    { t: "op", s: "\n" },
    { t: "k", s: "  const " }, { t: "op", s: "{ " }, { t: "", s: "rows" },
    { t: "op", s: " } = " }, { t: "k", s: "await " }, { t: "", s: "db" },
    { t: "op", s: "." }, { t: "fn", s: "query" }, { t: "op", s: "(`" },
    { t: "op", s: "\n" },
    { t: "str", s: "    SELECT r.*, v.plate_number" },
    { t: "op", s: "\n" },
    { t: "str", s: "    FROM   routes r" },
    { t: "op", s: "\n" },
    { t: "str", s: "    JOIN   vehicles v ON v.id = r.vehicle_id" },
    { t: "op", s: "\n" },
    { t: "str", s: "    WHERE  r.user_id = $1" },
    { t: "op", s: "\n" },
    { t: "str", s: "    AND    r.status  = 'active'" },
    { t: "op", s: "\n" },
    { t: "op", s: "  `, [" }, { t: "pm", s: "userId" }, { t: "op", s: "]);" },
    { t: "op", s: "\n" },
    { t: "k", s: "  return " }, { t: "", s: "rows" }, { t: "op", s: ";" },
    { t: "op", s: "\n" }, { t: "op", s: "};" },
  ],
];

/* ─── Flatten tokens → char-level stream ─── */
function flatten(snippet: Token[]): FlatToken[] {
  const out: FlatToken[] = [];
  for (const tok of snippet) {
    const parts = tok.s.split("\n");
    parts.forEach((part, i) => {
      if (i > 0) out.push({ type: "newline" });
      if (part.length > 0)
        out.push({ color: COLOR[tok.t] ?? COLOR[""], chars: part.split("") });
    });
  }
  return out;
}

/* ─── Tech logos for ticker ─── */
const TICKER_ITEMS = [
  { src: nodeLogo, label: "Node.js" },
  { src: pythonLogo, label: "Python" },
  { src: jsLogo, label: "JavaScript" },
  { src: html5Logo, label: "HTML5" },
  { src: css3Logo, label: "CSS3" },
  { src: postgresLogo, label: "PostgreSQL" },
  { src: mongoLogo, label: "MongoDB" },
  { src: apacheLogo, label: "Apache" },
  { src: confluenceLogo, label: "Confluence" },
  { src: jenkinsLogo, label: "Jenkins" },
];

/* ─── Typewriter engine (runs in CodeBg) ─── */
function useTypewriter(containerRef: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let snippetIdx = 0;
    let tokenIdx = 0;
    let charIdx = 0;
    let lineNum = 0;
    let currentCodeEl: HTMLSpanElement | null = null;
    let cursorEl: HTMLSpanElement | null = null;
    let flatTokens: FlatToken[] = [];
    let timer: ReturnType<typeof setTimeout>;

    function newLine() {
      lineNum++;
      const row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:flex-start;min-height:22px";
      const ln = document.createElement("span");
      ln.style.cssText =
        "width:38px;text-align:right;padding-right:14px;color:#3b4261;font-size:11px;flex-shrink:0;padding-top:2px;user-select:none;font-family:monospace";
      ln.textContent = String(lineNum);
      row.appendChild(ln);
      currentCodeEl = document.createElement("span");
      currentCodeEl.style.cssText = "color:#a9b1d6;white-space:pre;flex:1;padding-right:12px;font-family:'Fira Code','Cascadia Code','Courier New',monospace;font-size:12.5px;line-height:1.75";
      row.appendChild(currentCodeEl);
      container.appendChild(row);
      container.scrollTop = container.scrollHeight;
    }

    function placeCursor() {
      if (!currentCodeEl) return;
      cursorEl = document.createElement("span");
      cursorEl.style.cssText =
        "display:inline-block;width:2px;height:14px;background:#7aa2f7;vertical-align:text-bottom;animation:blink .9s step-end infinite;margin-left:1px";
      currentCodeEl.appendChild(cursorEl);
    }

    function initSnippet(idx: number) {
      container.innerHTML = "";
      lineNum = 0;
      tokenIdx = 0;
      charIdx = 0;
      currentCodeEl = null;
      cursorEl = null;
      flatTokens = flatten(SNIPPETS[idx]);
      newLine();
      placeCursor();
    }

    function typeNext() {
      if (tokenIdx >= flatTokens.length) {
        timer = setTimeout(() => {
          snippetIdx = (snippetIdx + 1) % SNIPPETS.length;
          initSnippet(snippetIdx);
          scheduleNext(400);
        }, 2600);
        return;
      }

      const token = flatTokens[tokenIdx];

      if ("type" in token && token.type === "newline") {
        cursorEl?.remove();
        newLine();
        placeCursor();
        tokenIdx++;
        charIdx = 0;
        scheduleNext(38);
        return;
      }

      const typed = token as TypedToken;
      if (charIdx < typed.chars.length) {
        const span = document.createElement("span");
        span.style.color = typed.color;
        span.textContent = typed.chars[charIdx];
        if (cursorEl?.parentNode) {
          currentCodeEl!.insertBefore(span, cursorEl);
        } else {
          currentCodeEl!.appendChild(span);
        }
        charIdx++;
        container.scrollTop = container.scrollHeight;
        const ch = typed.chars[charIdx - 1];
        const delay =
          ch === " " ? 16 : ch === "." || ch === ";" ? 55 : 20 + Math.random() * 30;
        scheduleNext(delay);
      } else {
        tokenIdx++;
        charIdx = 0;
        scheduleNext(6);
      }
    }

    function scheduleNext(d = 28) {
      timer = setTimeout(typeNext, d);
    }

    initSnippet(0);
    scheduleNext(500);

    return () => clearTimeout(timer);
  }, []);
}

/* ─── Ticker ─── */
function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      height: 38, background: "rgba(30,32,48,0.92)",
      borderTop: "1px solid #2a2d3e", overflow: "hidden",
      display: "flex", alignItems: "center", zIndex: 10,
    }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 0,
        whiteSpace: "nowrap",
        animation: "tickerScroll 32s linear infinite",
      }}>
        {doubled.map((item, i) => (
          <span key={i} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "0 20px", height: 38,
            borderRight: "1px solid #2a2d3e", flexShrink: 0,
          }}>
            <img
              src={item.src}
              alt={item.label}
              style={{ height: 18, width: "auto", maxWidth: 28, objectFit: "contain",
                filter: "drop-shadow(0 0 0 transparent)" }}
            />
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#7aa2f7",
            }}>
              {item.label}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Code background ─── */
function CodeBackground() {
  const ref = useRef<HTMLDivElement>(null);
  useTypewriter(ref);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
      {/* Editor chrome */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 30,
        background: "#1e2030", display: "flex", alignItems: "center",
        padding: "0 12px", gap: 6, zIndex: 1,
      }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f56" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#27c93f" }} />
        <div style={{ display: "flex", alignItems: "center", marginLeft: 12, height: "100%" }}>
          {["app.js", "utils.js", "api.js"].map((tab, i) => (
            <div key={tab} style={{
              fontSize: 11, padding: "0 14px", height: "100%",
              display: "flex", alignItems: "center",
              color: i === 0 ? "#c0caf5" : "#636d83",
              borderRight: "1px solid #2a2d3e",
              borderBottom: i === 0 ? "2px solid #7aa2f7" : "none",
              background: i === 0 ? "#0f1117" : "transparent",
              fontFamily: "monospace", cursor: "default",
            }}>
              {tab}
            </div>
          ))}
        </div>
      </div>
      {/* Code lines */}
      <div
        ref={ref}
        style={{
          position: "absolute", top: 30, left: 0, right: 0, bottom: 0,
          padding: "14px 0", overflowY: "hidden",
        }}
      />
    </div>
  );
}

/* ─── Main hero ─── */
export function HeroCard() {
  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      minHeight: "100vh", width: "100vw", padding: "0 1.5rem",
      background: "#0d1117",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      <style>{`
        @keyframes tickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }

        /* ── Responsive ── */
        .hero-wrapper {
          position: relative;
          width: 100%;
          max-width: 1080px;
          min-height: 620px;
          border-radius: 16px;
          overflow: hidden;
          background: #0f1117;
          box-shadow: 0 40px 80px -20px rgba(0,0,0,0.6);
          display: flex;
        }

        /* gradient veil so left text stays readable */
        .hero-veil {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            90deg,
            #0f1117f5 0%,
            #0f1117cc 38%,
            #0f111744 65%,
            #0f111700 100%
          );
          pointer-events: none;
        }

        .hero-inner {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: row;
          width: 100%;
          min-height: 620px;
        }

        /* LEFT PANEL */
        .hero-left {
          width: 46%;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 56px 40px 56px 52px;
        }

        /* RIGHT PANEL */
        .hero-right {
          flex: 1;
          position: relative;
          overflow: hidden;
        }

        .hero-photo {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 480px;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }

        .hero-photo-fade {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            #0f1117 0%,
            transparent 28%,
            transparent 72%,
            #0f1117 100%
          );
          pointer-events: none;
        }

        /* ── Typography ── */
        .hero-eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
        }
        .hero-eyebrow-line {
          width: 28px; height: 1.5px; background: #7aa2f7;
        }
        .hero-eyebrow-text {
          font-size: 10px; font-weight: 700; letter-spacing: .2em;
          text-transform: uppercase; color: #7aa2f7;
        }

        .hero-title {
          font-size: 46px;
          font-weight: 900;
          color: #e9ecf0;
          line-height: 1.06;
          letter-spacing: -0.025em;
          margin-bottom: 24px;
        }
        .hero-title em {
          color: #7aa2f7;
          font-style: normal;
        }

        .hero-stats {
          display: flex;
          gap: 28px;
          margin-bottom: 28px;
        }
        .stat-n { font-size: 26px; font-weight: 900; color: #c0caf5; line-height: 1; }
        .stat-l { font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #3b4261; margin-top: 3px; }

        .hero-tagline {
          font-size: 14px;
          color: #636d83;
          line-height: 1.75;
          margin-bottom: 32px;
          max-width: 260px;
        }

        .hero-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .hero-btn {
          padding: 12px 24px; border-radius: 8px;
          font-size: 13px; font-weight: 700;
          cursor: pointer; border: none; text-decoration: none;
          display: inline-block; transition: transform .15s, background .15s;
        }
        .hero-btn-primary { background: #7aa2f7; color: #0f1117; }
        .hero-btn-primary:hover { background: #aac4ff; transform: translateY(-1px); }
        .hero-btn-outline {
          background: transparent; color: #7aa2f7;
          border: 1.5px solid #3b4261;
        }
        .hero-btn-outline:hover { border-color: #7aa2f7; transform: translateY(-1px); }

        /* ── Mobile ── */
        @media (max-width: 720px) {
          .hero-wrapper { min-height: unset; border-radius: 12px; }
          .hero-inner { flex-direction: column; min-height: unset; }
          .hero-left {
            width: 100%;
            padding: 36px 24px 28px;
            order: 2;
          }
          .hero-right { order: 1; height: 260px; }
          .hero-photo { width: 220px; }
          .hero-title { font-size: 32px; }
          .hero-tagline { max-width: 100%; }
          .hero-stats { gap: 18px; }
          .stat-n { font-size: 20px; }
          .hero-veil {
            background: linear-gradient(
              180deg,
              #0f111799 0%,
              #0f111733 50%,
              #0f111799 100%
            );
          }
        }

        @media (max-width: 420px) {
          .hero-left { padding: 28px 18px 24px; }
          .hero-title { font-size: 26px; }
          .hero-btns { flex-direction: column; }
          .hero-btn { text-align: center; }
        }
      `}</style>

      <div className="hero-wrapper">
        <CodeBackground />
        <div className="hero-veil" />

        <div className="hero-inner">
          {/* ── Left panel ── */}
          <div className="hero-left">
            <div className="hero-eyebrow">
              <div className="hero-eyebrow-line" />
              <span className="hero-eyebrow-text">Full-Stack Engineer</span>
            </div>

            <h1 className="hero-title">
              Digital<br />
              <em>Creation</em>
            </h1>

            <div className="hero-stats">
              <div>
                <div className="stat-n">2+</div>
                <div className="stat-l">Years</div>
              </div>
              <div>
                <div className="stat-n">40+</div>
                <div className="stat-l">Projects</div>
              </div>
              <div>
                <div className="stat-n">6+</div>
                <div className="stat-l">Tech</div>
              </div>
            </div>

            <p className="hero-tagline">
              Engineering scalable systems and elegant interfaces — from backend APIs to pixel-perfect UIs.
            </p>

            <div className="hero-btns">
              <a href="#" className="hero-btn hero-btn-primary">Explore Work</a>
              <a href="#" className="hero-btn hero-btn-outline">Contact Me</a>
            </div>
          </div>

          {/* ── Right panel ── */}
          <div className="hero-right">
            <img
              src={profilePhoto}
              alt="Jackson Mativo"
              className="hero-photo"
            />
            <div className="hero-photo-fade" />
            <Ticker />
          </div>
        </div>
      </div>
    </div>
  );
     }
