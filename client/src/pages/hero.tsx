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

const topLogos = [
  { src: nodeLogo, label: "Node.js" },
  { src: pythonLogo, label: "Python" },
  { src: jsLogo, label: "JavaScript" },
  { src: html5Logo, label: "HTML5" },
  { src: css3Logo, label: "CSS3" },
];

const bottomLogos = [
  { src: postgresLogo, label: "PostgreSQL" },
  { src: mongoLogo, label: "MongoDB" },
  { src: apacheLogo, label: "Apache" },
  { src: confluenceLogo, label: "Confluence" },
  { src: jenkinsLogo, label: "Jenkins" },
];

function RibbonLogos({ logos }: { logos: typeof topLogos }) {
  const items = [...logos, ...logos, ...logos, ...logos];
  return (
    <div className="ribbon-scroll">
      {items.map((logo, i) => (
        <span key={i} className="ribbon-item">
          <img src={logo.src} alt={logo.label} className="ribbon-logo" />
          <span className="ribbon-label">{logo.label}</span>
        </span>
      ))}
    </div>
  );
}

export function HeroCard() {
  return (
    <div className="page-bg">
      <style>{`
        :root {
          --ribbon-bg:   #2a72cc;
          --ribbon-mid:  #2a72cc;
          --ribbon-dark: #111827;
          --text-main:   #ffffff;
          --dark-side:   #111827;
          --light-side:  #6f82c2;
        }

        .page-bg {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          width: 100vw;
          padding: 0 1.5rem;
          background-color: var(--light-side);
          font-family: system-ui, -apple-system, sans-serif;
        }

        .card-holder {
          position: relative;
          width: 100%;
          max-width: 1080px;
          margin: 0 auto;
        }

        /* ─── Card ─── */
        .portfolio-card {
          width: min(1080px, 100%);
          height: 620px;
          border-radius: 24px;
          box-shadow:
            0 30px 60px -15px rgba(0,0,0,0.3),
            0 10px 20px -5px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: row;
          overflow: hidden;
          position: relative;
        }

        /* ─── Left dark half ─── */
        .left-panel {
          width: 45%;
          flex-shrink: 0;
          background: var(--dark-side);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 50px 28px 36px 40px;
          position: relative;
        }

        /* ─── Right light half ─── */
        .right-panel {
          flex: 1;
          background: var(--light-side);
          position: relative;
        }

        /* ─── Photo sits centered on the boundary ─── */
        .photo-wrapper {
          position: absolute;
          /* horizontally centered on the left/right boundary */
          left: calc(50% - 160px);
          bottom: 0;
          width: 460px;
          height: 580px;
          z-index: 10;
        }

        .profile-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
          /* no border-radius — let the figure bleed to bottom */
        }

        /* ─── Text content ─── */
        .name {
          font-size: 26px;
          color: #ffffff;
          margin: 0 0 4px;
          font-weight: 900;
          line-height: 1.2;
        }

        .job-title {
          font-size: 11px;
          color: var(--ribbon-bg);
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.1em;
          margin-bottom: 18px;
        }

        .tagline {
          color: #9ca3af;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.6;
          margin-bottom: 32px;
          max-width: 220px;
        }

        .btn-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 200px;
        }

        .btn {
          padding: 11px 0;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: background 0.2s;
          text-align: center;
          width: 100%;
        }

        .btn-primary {
          background-color: var(--ribbon-bg);
          color: white;
        }
        .btn-primary:hover { background-color: var(--ribbon-dark); }

        .btn-secondary {
          border: 1.5px solid #2a72cc;
          background: transparent;
          color: #333866;
        }
        .btn-secondary:hover { background-color: #2a72cc; }

        /* ─────────────────────────────────────────────
           RIBBON SYSTEM
           top-right:   clip = upper-right triangle, rotate(45deg)
           bottom-left: clip = lower-left triangle,  rotate(45deg)
        ───────────────────────────────────────────── */
        .ribbon-wrapper {
          position: absolute;
          width: 230px;
          height: 230px;
          pointer-events: none;
          z-index: 20;
        }

        .ribbon-wrapper.top-right {
          top: -12px;
          right: -12px;
          clip-path: polygon(100% 0, 100% 100%, 0 0);
        }

        .ribbon-wrapper.bottom-left {
          bottom: -12px;
          left: -12px;
          clip-path: polygon(0 0, 0 100%, 100% 100%);
        }

        /* ── Band ── */
        .ribbon {
          position: absolute;
          width: 360px;
          height: 45px;
          background: linear-gradient(180deg,
            #2a72cc 0%,
            var(--ribbon-bg) 45%,
            var(--ribbon-mid) 100%
          );
          box-shadow: 0 6px 20px rgba(0,0,0,0.4);
          display: flex;
          align-items: stretch;
        }

        .top-right .ribbon {
          transform: rotate(45deg);
          right: -70px;
          top: 58px;
        }

        .bottom-left .ribbon {
          transform: rotate(45deg);
          left: -70px;
          bottom: 58px;
        }

        .ribbon-clip {
          flex: 1;
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        .ribbon-scroll {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          white-space: nowrap;
          animation: ribbon-marquee 26s linear infinite;
          padding: 0 10px;
        }

        .bottom-left .ribbon-scroll {
          animation-direction: reverse;
        }

        @keyframes ribbon-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }

        .ribbon-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          flex-shrink: 0;
        }

        .ribbon-logo {
          height: 24px;
          width: auto;
          max-width: 36px;
          object-fit: contain;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.45));
        }

        .ribbon-label {
          font-size: 9px;
          font-weight: 700;
          color: rgba(255,255,255,0.95);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
      `}</style>

      <div className="card-holder">
        <div className="portfolio-card">

          {/* ── Dark left panel with text ── */}
          <div className="left-panel">
            <div className="tagline" style={{ marginBottom: '24px', maxWidth: '100%' }}>
              <div style={{ fontSize: '48px', fontWeight: 900, color: '#ffffff', marginBottom: '16px', lineHeight: 1.2 }}>
                Digital<br />Creation
              </div>
              <p style={{ fontSize: '18px', color: '#ffffff', marginBottom: '24px', lineHeight: 1.6 }}>
                Engineering the Future.
              </p>
              <button className="btn btn-primary" style={{ maxWidth: '200px' }}>Explore Software</button>
            </div>
          </div>



          {/* ── Light right panel ── */}
          <div className="right-panel" />

          {/* ── Photo straddling the boundary ── */}
          <div className="photo-wrapper">
            <img
              src={profilePhoto}
              alt="Jackson Mativo"
              className="profile-photo"
            />
          </div>
        </div>

        {/* ── Top-right ribbon ── */}
        <div className="ribbon-wrapper top-right">
          <div className="ribbon">
            <div className="ribbon-clip">
              <RibbonLogos logos={topLogos} />
            </div>
          </div>
        </div>

        {/* ── Bottom-left ribbon ── */}
        <div className="ribbon-wrapper bottom-left">
          <div className="ribbon">
            <div className="ribbon-clip">
              <RibbonLogos logos={bottomLogos} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}