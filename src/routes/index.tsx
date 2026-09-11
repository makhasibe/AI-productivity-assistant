import { createFileRoute } from "@tanstack/react-router";
import { Download, Mail, MapPin, Phone, Printer, ShieldCheck } from "lucide-react";

const PORTRAIT_URL =
  "/__l5e/assets-v1/5d440a98-92ba-42bc-99b2-1f138c8ab20a/zimbini-portrait.png";

const NAME = "Zimbini Boqwana";
const ROLE_LINE = "Commis Chef · Messenger";
const TAGLINE =
  "Reliable, hardworking food-service professional with a Level 4 Professional Cookery qualification and hands-on kitchen experience — seeking her next Commis Chef or Messenger role.";
const CONTACT = {
  address: "27 Karee Street, Delft South, 7100, Cape Town",
  phone: "072 971 1527",
  phoneHref: "tel:+27729711527",
  email: "zimbiniboqwana@gmail.com",
};

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#references", label: "References" },
];

const SKILLS = [
  "Reliable and punctual, with a strong record of attendance",
  "Food preparation and basic knife skills",
  "Food safety and hygiene compliance, including temperature checks",
  "Cleaning and maintaining kitchen equipment to hygiene standards",
  "Teamwork and time management",
  "Calm and efficient under pressure in a fast-paced kitchen",
  "Physically fit — manages long, active shifts on her feet",
  "Basic customer service and query resolution",
];

const EXPERIENCE = [
  {
    role: "Clerk (Expanded Public Works Programme)",
    org: "City of Cape Town — Delft South Clinic",
    dates: "Sept 2025 – May 2026",
    duties: [
      "Filing and folder transfers to keep patient records accurate and accessible.",
      "Answering incoming calls and directing queries to the right department.",
      "Managing the patient queue system to keep the clinic running smoothly.",
      "Compiling daily reports for the facilities team.",
    ],
  },
  {
    role: "Food Service Assistant",
    org: "Feedem",
    dates: "Apr 2021 – Jan 2025",
    duties: [
      "Food preparation to specification across service periods.",
      "Maintaining kitchen hygiene and food-safety standards throughout each shift.",
      "Conducting and recording temperature checks on hot and cold holdings.",
    ],
  },
  {
    role: "General Worker",
    org: "Western Province Caterers",
    dates: "Jun 2019 – Mar 2021",
    duties: [
      "Catering setup and front-of-house service for events.",
      "Cleaning and breakdown of service areas after functions.",
    ],
  },
  {
    role: "Customer Service Representative",
    org: "WNS",
    dates: "Apr 2017 – Dec 2017",
    duties: [
      "Handling inbound customer calls and logging requests.",
      "Resolving routine customer issues and escalating where needed.",
    ],
  },
];

const EDUCATION = [
  {
    title: "National Certificate (NQF Level 4) — Professional Cookery",
    org: "CATHSSETA-accredited learnership · Feedem / Hospitality Academy",
    dates: "Sept 2023 – Sept 2024",
    detail: "Certificate No. HA/F/23/118 · Issued 31 January 2024",
  },
  {
    title: "Grade 12 (National Senior Certificate)",
    org: "Zibokhwana Senior Secondary School",
    dates: "Jan 2008 – Dec 2010",
    detail: "Matriculated with a national senior certificate.",
  },
];

const CERTIFICATES = [
  {
    title: "Google AI Essentials",
    org: "Google Career Certificate · Coursera",
    dates: "September 2026",
    verify: "https://coursera.org/verify/WEOV2WOAH3TT",
  },
];

const LANGUAGES = [
  { name: "isiXhosa", level: "Home language" },
  { name: "English", level: "Fluent" },
];

const REFERENCES = [
  {
    name: "Rene Philander",
    role: "Supervisor, Feedem",
    phone: "084 478 9396",
    email: "renephilander@gmail.com",
  },
  {
    name: "Jody-Ann Viljoen",
    role: "Facilities Manager, City of Cape Town (Delft South Clinic)",
    phone: "021 444 8978",
    email: "JodyAnn.Viljoen@capetown.gov.za",
  },
  {
    name: "Sumaya Anthea Quickfall",
    role: "Second in Charge, City of Cape Town (Delft South Clinic)",
    phone: "021 444 8978",
    email: "sumayaAnthea.quickfall@capetown.gov.za",
  },
  { name: "Vuyokazi Mthembu", role: "Western Province Caterers", phone: "084 562 5064" },
  { name: "Aselmo Mafanga", role: "Team Leader, WNS", phone: "077 400 8904" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zimbini Boqwana — Commis Chef & Messenger" },
      {
        name: "description",
        content:
          "Professional profile of Zimbini Boqwana: a Level 4 Professional Cookery graduate and experienced food-service professional seeking Commis Chef and Messenger roles in Cape Town.",
      },
      { property: "og:title", content: "Zimbini Boqwana — Commis Chef & Messenger" },
      {
        property: "og:description",
        content:
          "Level 4 Professional Cookery graduate and experienced food-service professional seeking Commis Chef and Messenger roles in Cape Town.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-8">
      <p className="font-serif text-sm uppercase tracking-[0.2em] text-gold-ink">{kicker}</p>
      <h2 className="font-serif mt-1 text-2xl font-semibold text-cream-foreground sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="profile-scroll min-h-screen bg-cream text-cream-foreground">
      {/* Sticky nav */}
      <header className="no-print sticky top-0 z-40 border-b border-gold/20 bg-cream/85 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#top" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-serif text-sm font-semibold text-gold">
              ZB
            </span>
            <span className="font-serif text-base font-semibold text-cream-foreground">
              Zimbini Boqwana
            </span>
          </a>
          <div className="hidden items-center gap-6 sm:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-cream-muted transition-colors hover:text-gold-ink"
              >
                {l.label}
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold-soft px-3.5 py-1.5 text-xs font-semibold text-gold-ink transition-colors hover:bg-gold/20"
          >
            <Printer className="h-3.5 w-3.5" aria-hidden="true" />
            Save as PDF
          </button>
        </nav>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="profile-hero relative overflow-hidden bg-ink text-ink-foreground">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, var(--gold) 0, transparent 45%), radial-gradient(circle at 85% 75%, var(--gold) 0, transparent 40%)",
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto grid max-w-5xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[280px_1fr] lg:py-24">
            <div className="mx-auto w-full max-w-[280px]">
              <div className="overflow-hidden rounded-2xl border-2 border-gold/60 shadow-2xl">
                <img
                  src={PORTRAIT_URL}
                  alt="Portrait of Zimbini Boqwana in a black blazer"
                  className="aspect-[4/5] w-full object-cover"
                  width={280}
                  height={350}
                />
              </div>
            </div>
            <div className="text-center lg:text-left">
              <p className="hero-on-dark font-serif text-sm uppercase tracking-[0.25em] text-gold">
                Professional Profile
              </p>
              <h1 className="hero-on-dark font-serif mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
                {NAME}
              </h1>
              <p className="hero-on-dark mt-2 text-lg font-medium text-ink-muted">
                {ROLE_LINE}
              </p>
              <div className="hero-gold-line mx-auto mt-5 h-px w-16 bg-gold lg:mx-0" />
              <p className="hero-on-dark mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-muted">
                {TAGLINE}
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-muted lg:justify-start">
                <span className="hero-on-dark inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
                  Cape Town, South Africa
                </span>
                <a
                  href={CONTACT.phoneHref}
                  className="hero-on-dark inline-flex items-center gap-1.5 transition-colors hover:text-gold"
                >
                  <Phone className="h-4 w-4 text-gold" aria-hidden="true" />
                  {CONTACT.phone}
                </a>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="hero-on-dark inline-flex items-center gap-1.5 transition-colors hover:text-gold"
                >
                  <Mail className="h-4 w-4 text-gold" aria-hidden="true" />
                  {CONTACT.email}
                </a>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                <a
                  href="#experience"
                  className="no-print inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gold/90"
                >
                  View experience
                </a>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="no-print inline-flex items-center gap-2 rounded-full border border-gold/50 px-5 py-2.5 text-sm font-semibold text-gold transition-colors hover:bg-gold/10"
                >
                  Contact me
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* About / summary */}
        <section id="about" className="scroll-mt-20 bg-cream py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <SectionHeading kicker="About" title="Professional summary" />
            <div className="profile-card rounded-2xl border border-gold/15 bg-white/60 p-6 shadow-sm sm:p-8">
              <p className="text-base leading-relaxed text-cream-foreground sm:text-lg">
                Zimbini is a reliable, hardworking food-service professional who has built her career
                across commercial kitchens and frontline clinic administration. She holds a
                National Certificate in Professional Cookery (NQF Level 4) earned through a
                CATHSSETA-accredited learnership, and brings hands-on experience in food
                preparation, kitchen hygiene and temperature control from nearly four years at
                Feedem.
              </p>
              <p className="mt-4 text-base leading-relaxed text-cream-foreground sm:text-lg">
                Equally comfortable managing a patient queue and filing records as a clinic clerk,
                she pairs kitchen discipline with front-line customer service. Punctual, physically
                fit and calm under pressure, she is now seeking her next role as a{" "}
                <span className="font-semibold text-gold-ink">Commis Chef</span> or{" "}
                <span className="font-semibold text-gold-ink">Messenger</span>.
              </p>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="scroll-mt-20 bg-cream py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <SectionHeading kicker="Strengths" title="Key skills" />
            <div className="grid gap-3 sm:grid-cols-2">
              {SKILLS.map((skill) => (
                <div
                  key={skill}
                  className="flex items-start gap-3 rounded-xl border border-gold/15 bg-white/60 p-4 shadow-sm"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                  <span className="text-sm leading-relaxed text-cream-foreground">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="scroll-mt-20 bg-white/40 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <SectionHeading kicker="Career" title="Work experience" />
            <ol className="relative space-y-8 border-l border-gold/30 pl-6">
              {EXPERIENCE.map((job) => (
                <li key={`${job.org}-${job.role}`} className="relative">
                  <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-gold bg-cream" />
                  <div className="profile-card rounded-2xl border border-gold/15 bg-cream p-5 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                      <h3 className="font-serif text-lg font-semibold text-cream-foreground">
                        {job.role}
                      </h3>
                      <span className="text-xs font-medium uppercase tracking-wide text-gold-ink">
                        {job.dates}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm font-medium text-cream-muted">{job.org}</p>
                    <ul className="mt-3 space-y-1.5">
                      {job.duties.map((duty) => (
                        <li key={duty} className="flex items-start gap-2 text-sm text-cream-foreground">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                          {duty}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Education & certificates */}
        <section id="education" className="scroll-mt-20 bg-cream py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <SectionHeading kicker="Credentials" title="Education & certificates" />
            <div className="grid gap-4 lg:grid-cols-2">
              {EDUCATION.map((edu) => (
                <div
                  key={edu.title}
                  className="profile-card rounded-2xl border border-gold/15 bg-white/60 p-6 shadow-sm"
                >
                  <h3 className="font-serif text-lg font-semibold text-cream-foreground">
                    {edu.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-cream-muted">{edu.org}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gold-ink">
                    {edu.dates}
                  </p>
                  {edu.detail ? (
                    <p className="mt-3 text-sm leading-relaxed text-cream-foreground">{edu.detail}</p>
                  ) : null}
                </div>
              ))}
              {CERTIFICATES.map((cert) => (
                <div
                  key={cert.title}
                  className="profile-card flex flex-col rounded-2xl border border-gold/15 bg-white/60 p-6 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-gold" aria-hidden="true" />
                    <h3 className="font-serif text-lg font-semibold text-cream-foreground">
                      {cert.title}
                    </h3>
                  </div>
                  <p className="mt-1 text-sm font-medium text-cream-muted">{cert.org}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gold-ink">
                    {cert.dates}
                  </p>
                  <a
                    href={cert.verify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-print mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-ink hover:underline"
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                    Verify certificate
                  </a>
                </div>
              ))}
            </div>

            {/* Languages */}
            <div className="mt-8">
              <h3 className="font-serif text-lg font-semibold text-cream-foreground">Languages</h3>
              <div className="mt-3 flex flex-wrap gap-3">
                {LANGUAGES.map((lang) => (
                  <span
                    key={lang.name}
                    className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold-soft px-4 py-1.5 text-sm font-medium text-cream-foreground"
                  >
                    <span className="font-semibold text-gold-ink">{lang.name}</span>
                    <span className="text-cream-muted">· {lang.level}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* References */}
        <section id="references" className="scroll-mt-20 bg-white/40 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <SectionHeading kicker="Endorsements" title="References" />
            <div className="grid gap-4 sm:grid-cols-2">
              {REFERENCES.map((ref) => (
                <div
                  key={`${ref.name}-${ref.role}`}
                  className="profile-card rounded-2xl border border-gold/15 bg-cream p-5 shadow-sm"
                >
                  <p className="font-serif text-base font-semibold text-cream-foreground">{ref.name}</p>
                  <p className="mt-0.5 text-sm text-cream-muted">{ref.role}</p>
                  <div className="mt-3 space-y-1 text-sm">
                    <a
                      href={`tel:${ref.phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-1.5 text-cream-foreground transition-colors hover:text-gold-ink"
                    >
                      <Phone className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                      {ref.phone}
                    </a>
                    {ref.email ? (
                      <a
                        href={`mailto:${ref.email}`}
                        className="flex items-center gap-1.5 break-all text-cream-foreground transition-colors hover:text-gold-ink"
                      >
                        <Mail className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                        {ref.email}
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs leading-relaxed text-cream-muted">
              References are listed with their consent and are provided for verification purposes.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-ink text-ink-foreground">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold font-serif text-sm font-semibold text-ink">
                ZB
              </span>
              <div>
                <p className="font-serif text-base font-semibold">{NAME}</p>
                <p className="text-sm text-ink-muted">{ROLE_LINE}</p>
              </div>
            </div>
            <div className="space-y-1 text-sm text-ink-muted">
              <p className="flex items-center justify-center gap-1.5 sm:justify-start">
                <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
                {CONTACT.address}
              </p>
              <a href={CONTACT.phoneHref} className="flex items-center justify-center gap-1.5 sm:justify-start hover:text-gold">
                <Phone className="h-4 w-4 text-gold" aria-hidden="true" />
                {CONTACT.phone}
              </a>
              <a href={`mailto:${CONTACT.email}`} className="flex items-center justify-center gap-1.5 break-all sm:justify-start hover:text-gold">
                <Mail className="h-4 w-4 text-gold" aria-hidden="true" />
                {CONTACT.email}
              </a>
            </div>
          </div>
          <div className="mt-10 border-t border-ink-foreground/10 pt-6 text-center text-xs text-ink-muted">
            © {new Date().getFullYear()} {NAME}. Professional profile.
          </div>
        </div>
      </footer>
    </div>
  );
}
