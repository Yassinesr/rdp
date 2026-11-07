import Link from "next/link";
import s from "./landing.module.css";

export const metadata = {
  title: "Garmin Coach: daily cycling coaching from your own data",
  description:
    "Self-hosted coach that turns your Garmin sleep, HRV and training load into a daily plan: readiness, macros, ride fueling, hydration, recovery and overtraining warnings.",
};

/* ------------------------------------------------------------------ icons */

const ICONS: Record<string, string[]> = {
  gauge: ["m12 14 4-4", "M3.34 19a10 10 0 1 1 17.32 0"],
  activity: ["M22 12h-4l-3 9L9 3l-3 9H2"],
  calendar: ["M8 2v4", "M16 2v4", "M3 10h18", "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"],
  zap: ["M13 2 3 14h9l-1 8 10-12h-9l1-8z"],
  droplet: ["M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"],
  alert: ["m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z", "M12 9v4", "M12 17h.01"],
  moon: ["M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"],
  message: ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  arrow: ["M5 12h14", "m12 5 7 7-7 7"],
};

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <rect width="28" height="28" rx="8" fill="var(--accent)" />
      <path
        d="M5 15h4l2.5-6 4 11 2.5-5H23"
        fill="none"
        stroke="#0f1117"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------- data */

// Mirrors engine/nutrition.py: carbs scale g/kg with the planned session.
const RIDER_KG = 107;
const CARB_STEPS = [
  { type: "Recovery", gPerKg: 3, example: "Recovery Spin" },
  { type: "Endurance", gPerKg: 5, example: "Endurance Z2" },
  { type: "Threshold", gPerKg: 7, example: "Threshold 3×12" },
  { type: "VO2 max", gPerKg: 8, example: "VO2 Max 5×4" },
].map((r) => ({ ...r, grams: r.gPerKg * RIDER_KG }));
const CARB_MAX = 1000;

// Mirrors engine/training_load.py gauge scale.
const pct = (r: number) => ((r - 0.5) / (1.75 - 0.5)) * 100;

const FEATURES = [
  {
    icon: "gauge",
    title: "Readiness, explained",
    body: "Starts from Garmin's readiness score, then docks points for poor sleep, unbalanced HRV, a load spike, or a resting heart rate 5+ bpm above your normal. You get Green, Yellow, Orange or Red.",
  },
  {
    icon: "activity",
    title: "Training load sweet spot",
    body: "Tracks your acute:chronic workload ratio against the 0.8–1.3 band. Drift low and it plans a 5–10% weekly rebuild. Spike high and it tells you to ease off.",
  },
  {
    icon: "calendar",
    title: "Macros that follow your calendar",
    body: "Reads the next workout on your Garmin training calendar and sets that day's carbs to match it. Protein holds steady at 2.1 g/kg.",
  },
  {
    icon: "zap",
    title: "Ride fueling",
    body: "Under an hour, water is enough. One to two hours means 60 g of carbs per hour, and longer rides get 90 g per hour. You see the total to pack before you leave.",
  },
  {
    icon: "droplet",
    title: "Hydration & sodium",
    body: "A 35 ml/kg fluid baseline, scaled up when it's hot, with about 800 mg of sodium per litre. Your fluid target goes up on hot days.",
  },
  {
    icon: "alert",
    title: "Overtraining early warning",
    body: "HRV under 85% of your baseline, a resting HR 6+ bpm above it, or more than 12 h of sleep debt raises a flag and a plain instruction to cut load by 20–40%.",
  },
  {
    icon: "moon",
    title: "Recovery & mobility",
    body: "Ten to twenty minute routines matched to the day: hip openers and glute activation around VO2 work, foam rolling on recovery days, a nap when sleep was short.",
  },
  {
    icon: "message",
    title: "Coach notes (optional)",
    body: "Add an OpenAI key and the day's numbers come with a short plain-English summary. If you leave it unset, no data leaves your database.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Sync",
    body: "A background daemon pulls sleep, HRV, training load and activities every 15 minutes. It refreshes tokens, retries with backoff and writes idempotently, so a re-sync never duplicates a night.",
  },
  {
    n: "02",
    title: "Store",
    body: "Everything lands in your own Postgres or SQLite database, deduplicated per day. You can inspect it, back it up or delete it whenever you like.",
  },
  {
    n: "03",
    title: "Coach",
    body: "A FastAPI engine runs the readiness, load, nutrition, fueling, hydration, recovery and risk rules. Each one is a short, deterministic Python function you can read and tune.",
  },
  {
    n: "04",
    title: "Show",
    body: "The dashboard puts today on one screen, then lists your upcoming planned workouts with the carb, protein and fat targets for each.",
  },
];

const FAQ = [
  {
    q: "Do I need Garmin developer access?",
    a: "No. By default it signs in with your normal Garmin Connect account through the community garminconnect library. If you are an approved Garmin Health API partner, set GARMIN_SOURCE=health to use that instead.",
  },
  {
    q: "Is this an official Garmin product?",
    a: "No. It's an independent project. The default data source is an unofficial library, which is fine for personal use, but it can break when Garmin changes its internal API, and that kind of access is a gray area under Garmin's terms.",
  },
  {
    q: "Where does my data go?",
    a: "Into the database you run. Your login lives in a gitignored config file, and after the first sign-in a cached token is reused, so your password isn't sent on every sync. The only optional outbound call is the AI coach-notes summary.",
  },
  {
    q: "My account uses two-factor authentication. Will it work?",
    a: "Yes. Generate the token bundle once interactively, then the sync daemon reuses it without asking again.",
  },
  {
    q: "Is it only for cycling?",
    a: "The fueling rules, FTP field and workout classifier are tuned for riders. Readiness, sleep, load, hydration and recovery guidance apply to any endurance athlete.",
  },
];

/* ------------------------------------------------------------------- page */

export default function Landing() {
  return (
    <div className={s.page}>
      <a href="#main" className={s.skip}>
        Skip to content
      </a>

      <header className={s.nav}>
        <div className={`${s.wrap} ${s.navInner}`}>
          <Link href="/" className={s.brand} aria-label="Garmin Coach home">
            <LogoMark />
            <span>Garmin Coach</span>
          </Link>
          <nav aria-label="Primary" className={s.navLinks}>
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#faq">FAQ</a>
          </nav>
          <Link href="/dashboard" className={`${s.btn} ${s.btnSmall}`}>
            Open dashboard
          </Link>
        </div>
      </header>

      <main id="main">
        {/* ---------------------------------------------------------- hero */}
        <section className={s.hero}>
          <div className={`${s.wrap} ${s.heroGrid}`}>
            <div className={s.heroCopy}>
              <p className={s.eyebrow}>Self-hosted cycling coach · built on your Garmin data</p>
              <h1 className={s.h1}>
                Wake up knowing how hard to ride, <span className={s.accentText}>and what to eat for it.</span>
              </h1>
              <p className={s.lead}>
                Garmin Coach reads your sleep, HRV, resting heart rate and training load every 15 minutes and turns them
                into one daily plan. It covers readiness, calories, macros, ride fueling, hydration and recovery, and it
                warns you before you overcook it.
              </p>
              <div className={s.ctaRow}>
                <Link href="/dashboard" className={s.btn}>
                  See the dashboard <Icon name="arrow" size={18} />
                </Link>
                <a href="#get-started" className={`${s.btn} ${s.btnGhost}`}>
                  Run it yourself
                </a>
              </div>
              <ul className={s.proof}>
                <li>One Docker command</li>
                <li>No Garmin developer approval</li>
                <li>Your data stays in your database</li>
              </ul>
            </div>

            <TodayCard />
          </div>
        </section>

        {/* ------------------------------------------------ signals → plan */}
        <section className={s.section} aria-labelledby="signals-title">
          <div className={s.wrap}>
            <div className={s.sectionHead}>
              <p className={s.kicker}>Signals in, decisions out</p>
              <h2 id="signals-title" className={s.h2}>
                Your watch collects the data. Garmin Coach tells you what to do with it.
              </h2>
            </div>
            <div className={s.flow}>
              <div className={s.flowCol}>
                <h3 className={s.flowTitle}>What it reads</h3>
                <ul className={s.chips}>
                  <li>Sleep score &amp; sleep debt</li>
                  <li>Overnight HRV vs. your baseline</li>
                  <li>Resting HR vs. your baseline</li>
                  <li>Acute &amp; chronic training load</li>
                  <li>Body Battery</li>
                  <li>Planned workouts on your Garmin calendar</li>
                  <li>Your profile: age, weight, goals, diet</li>
                </ul>
              </div>
              <div className={s.flowArrow} aria-hidden="true">
                <Icon name="arrow" size={28} />
              </div>
              <div className={s.flowCol}>
                <h3 className={s.flowTitle}>What you get each morning</h3>
                <ul className={`${s.chips} ${s.chipsOut}`}>
                  <li>Readiness state</li>
                  <li>Load ratio &amp; build plan</li>
                  <li>Calorie target</li>
                  <li>Protein · carbs · fat</li>
                  <li>On-bike carbs per hour</li>
                  <li>Fluids &amp; sodium</li>
                  <li>Recovery &amp; mobility</li>
                  <li>Overtraining flags</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ features */}
        <section id="features" className={s.section} aria-labelledby="features-title">
          <div className={s.wrap}>
            <div className={s.sectionHead}>
              <p className={s.kicker}>Eight coaching engines</p>
              <h2 id="features-title" className={s.h2}>
                Every recommendation comes from a rule you can read.
              </h2>
              <p className={s.sub}>
                The engines are plain, deterministic rules drawn from sports-science conventions, so the same inputs
                always give the same advice.
              </p>
            </div>
            <div className={s.featureGrid}>
              {FEATURES.map((f) => (
                <article key={f.title} className={s.feature}>
                  <span className={s.featureIcon}>
                    <Icon name={f.icon} />
                  </span>
                  <h3 className={s.h3}>{f.title}</h3>
                  <p>{f.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- carbs spotlight */}
        <section className={s.section} aria-labelledby="carbs-title">
          <div className={`${s.wrap} ${s.split}`}>
            <div>
              <p className={s.kicker}>Fuel for the work you&apos;ll actually do</p>
              <h2 id="carbs-title" className={s.h2}>
                Carbs that follow your training calendar.
              </h2>
              <p className={s.sub}>
                The calorie baseline is the same on every day. What changes is the workout on your Garmin calendar.
                Garmin Coach classifies each planned session from its title and duration, then sets that day&apos;s
                carbohydrate to match it.
              </p>
              <ul className={s.ticks}>
                <li>Protein holds at 2.1 g/kg so you keep muscle while losing weight.</li>
                <li>Fat fills the remaining calories and never drops below 50 g.</li>
                <li>Your daily deficit comes from your profile, not from a guess.</li>
              </ul>
            </div>
            <CarbChart />
          </div>
        </section>

        {/* --------------------------------------------------- how it works */}
        <section id="how" className={s.section} aria-labelledby="how-title">
          <div className={s.wrap}>
            <div className={s.sectionHead}>
              <p className={s.kicker}>How it works</p>
              <h2 id="how-title" className={s.h2}>
                Four small services that run quietly on your own machine.
              </h2>
            </div>
            <ol className={s.steps}>
              {STEPS.map((st) => (
                <li key={st.n} className={s.step}>
                  <span className={s.stepNum}>{st.n}</span>
                  <h3 className={s.h3}>{st.title}</h3>
                  <p>{st.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------- profile */}
        <section className={s.section} aria-labelledby="profile-title">
          <div className={`${s.wrap} ${s.split} ${s.splitReverse}`}>
            <div>
              <p className={s.kicker}>Personal, not generic</p>
              <h2 id="profile-title" className={s.h2}>
                Garmin knows what your body does. Your profile says what you&apos;re training for.
              </h2>
              <p className={s.sub}>
                Answer a short questionnaire once and save it as JSON. Anything you skip falls back to a sensible
                default.
              </p>
              <ul className={s.ticks}>
                <li>
                  <strong>Calorie baseline</strong> computed from age, sex, height and weight (Mifflin–St Jeor), not a
                  guessed number.
                </li>
                <li>
                  <strong>Your baselines</strong> for resting HR and HRV become the reference for readiness and risk.
                </li>
                <li>
                  <strong>Diet, allergies and dislikes</strong> shape food suggestions. A sensitive stomach gets gentler
                  fueling.
                </li>
                <li>
                  <strong>Goal weight and target event</strong> set the size of your daily deficit.
                </li>
              </ul>
            </div>
            <figure className={s.code}>
              <figcaption className={s.codeBar}>
                <span className={s.dots} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                athlete_profile.json
              </figcaption>
              <pre>
                <code>{`{
  "age": 34,
  "sex": "male",
  "height_cm": 178,
  "weight_kg": 107,
  "target_weight_kg": 89,
  "ftp_watts": 240,
  "baseline_rhr": 50,
  "baseline_hrv": 65,
  "goal": "both",
  "target_event": "Gran Fondo",
  "weight_loss_target_kcal": 400,
  "diet_type": "omnivore",
  "allergies": ["lactose"],
  "gi_sensitive": false
}`}</code>
              </pre>
            </figure>
          </div>
        </section>

        {/* -------------------------------------------------- get started */}
        <section id="get-started" className={s.section} aria-labelledby="start-title">
          <div className={s.wrap}>
            <div className={s.startCard}>
              <div className={s.sectionHead}>
                <p className={s.kicker}>Get started</p>
                <h2 id="start-title" className={s.h2}>
                  Up and running in three steps.
                </h2>
              </div>
              <ol className={s.startSteps}>
                <li>
                  <h3 className={s.h3}>Add your Garmin Connect login</h3>
                  <p>
                    Put it in a <code>.env</code> file next to <code>docker-compose.yml</code>. This is the same account
                    you use in the Garmin Connect app.
                  </p>
                  <pre className={s.snippet}>
                    <code>{`GARMIN_EMAIL=you@example.com
GARMIN_PASSWORD=your-garmin-password`}</code>
                  </pre>
                </li>
                <li>
                  <h3 className={s.h3}>Start everything</h3>
                  <p>Database, coach API, sync daemon and dashboard, all in one command.</p>
                  <pre className={s.snippet}>
                    <code>docker compose up --build</code>
                  </pre>
                </li>
                <li>
                  <h3 className={s.h3}>Open your day</h3>
                  <p>
                    The dashboard is at <code>localhost:3000/dashboard</code>. Interactive API docs are at{" "}
                    <code>localhost:8000/docs</code>.
                  </p>
                  <Link href="/dashboard" className={s.btn}>
                    Open dashboard <Icon name="arrow" size={18} />
                  </Link>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ faq */}
        <section id="faq" className={s.section} aria-labelledby="faq-title">
          <div className={`${s.wrap} ${s.faqWrap}`}>
            <div className={s.sectionHead}>
              <p className={s.kicker}>FAQ</p>
              <h2 id="faq-title" className={s.h2}>
                Good questions to ask first.
              </h2>
            </div>
            <div className={s.faq}>
              {FAQ.map((f) => (
                <details key={f.q} className={s.qa}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={`${s.wrap} ${s.footerInner}`}>
          <div className={s.brand}>
            <LogoMark />
            <span>Garmin Coach</span>
          </div>
          <p className={s.disclaimer}>
            Garmin Coach is an independent project and is not affiliated with, endorsed by, or sponsored by Garmin Ltd.
            Garmin and Garmin Connect are trademarks of Garmin Ltd. or its subsidiaries. Guidance is informational and
            is not medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------- hero product card */

function TodayCard() {
  const ratio = 1.08;
  return (
    <div className={s.today} role="img" aria-label="Example daily plan: readiness green, score 82; load ratio 1.08, optimal; threshold day with 749 grams of carbs, 225 grams of protein and 60 grams of carbs per hour on the bike.">
      <div className={s.todayHead}>
        <div>
          <p className={s.todayLabel}>Today · example day</p>
          <p className={s.todayTitle}>Planned: Threshold 3×12</p>
        </div>
        <span className={s.pill} style={{ color: "var(--good)", borderColor: "var(--good)" }}>
          GREEN
        </span>
      </div>

      <div className={s.todayStats}>
        <div className={s.tStat}>
          <span>Readiness</span>
          <strong>82</strong>
        </div>
        <div className={s.tStat}>
          <span>Sleep</span>
          <strong>81</strong>
        </div>
        <div className={s.tStat}>
          <span>HRV</span>
          <strong>
            64<small> ms</small>
          </strong>
        </div>
        <div className={s.tStat}>
          <span>Resting HR</span>
          <strong>
            50<small> bpm</small>
          </strong>
        </div>
      </div>

      <div className={s.todayBlock}>
        <div className={s.todayRow}>
          <span>Training load</span>
          <span>
            <strong>{ratio}</strong> · optimal
          </span>
        </div>
        <div className={s.gauge}>
          <span className={s.gaugeBand} style={{ left: `${pct(0.8)}%`, width: `${pct(1.3) - pct(0.8)}%` }} />
          <span className={s.gaugeMark} style={{ left: `calc(${pct(ratio)}% - 2px)` }} />
        </div>
        <div className={s.gaugeScale}>
          <span>0.5</span>
          <span>0.8</span>
          <span>1.3</span>
          <span>1.75</span>
        </div>
      </div>

      <div className={s.todayMacros}>
        <div>
          <span>Carbs</span>
          <strong>749 g</strong>
        </div>
        <div>
          <span>Protein</span>
          <strong>225 g</strong>
        </div>
        <div>
          <span>On the bike</span>
          <strong>60 g/h</strong>
        </div>
      </div>

      <p className={s.todayNote}>
        <span className={s.dot} aria-hidden="true" />
        20 min pre-ride mobility: hip openers and glute activation.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------ carbs chart */

function CarbChart() {
  return (
    <figure className={s.chart}>
      <figcaption>
        <span className={s.chartTitle}>Daily carbohydrate target by planned session</span>
        <span className={s.chartSub}>Example: {RIDER_KG} kg rider, same calorie baseline</span>
      </figcaption>

      <div className={s.bars} aria-hidden="true">
        {CARB_STEPS.map((r) => (
          <div key={r.type} className={s.barRow}>
            <span className={s.barLabel}>{r.type}</span>
            <span className={s.barTrack}>
              <span className={s.bar} style={{ width: `calc((100% - 64px) * ${r.grams / CARB_MAX})` }} />
              <span className={s.barValue}>{r.grams} g</span>
            </span>
            <span className={s.tip}>
              <strong>{r.example}</strong>
              {r.gPerKg} g/kg × {RIDER_KG} kg = {r.grams} g · {(r.grams * 4).toLocaleString("en-US")} kcal
            </span>
          </div>
        ))}
      </div>

      <table className={s.srOnly}>
        <caption>Daily carbohydrate target for a {RIDER_KG} kg rider</caption>
        <thead>
          <tr>
            <th scope="col">Planned session</th>
            <th scope="col">g/kg</th>
            <th scope="col">Carbs (g)</th>
          </tr>
        </thead>
        <tbody>
          {CARB_STEPS.map((r) => (
            <tr key={r.type}>
              <th scope="row">{r.type}</th>
              <td>{r.gPerKg}</td>
              <td>{r.grams}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
