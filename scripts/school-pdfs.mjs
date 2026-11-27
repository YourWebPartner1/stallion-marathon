/**
 * Builds the two downloads on the Schools & Colleges page from the same wording
 * as the page (lib/schools.ts), printed to PDF by headless Chrome or Edge:
 *
 *   public/schools/stallion-schools-program-brief.pdf  for principals and coordinators
 *   public/schools/stallion-schools-flyer.pdf          one page, for students to hand on
 *
 *   node scripts/school-pdfs.mjs
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  schoolBenefits,
  schoolFaqs,
  schoolFee,
  schoolSteps,
  schoolTopics,
  schoolTrust,
  schoolWhoCanApply,
} from "../lib/schools.ts";

const ROOT = resolve(import.meta.dirname, "..");
const URL_TEXT = "stallionmarathon.com/schools";
const PHONE = "+91 98666 31658";
const EMAIL = "support@stallionmarathon.com";
const asset = (p) => pathToFileURL(join(ROOT, "public", p)).href;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const BROWSERS = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
];
const browser = BROWSERS.find((b) => existsSync(b));
if (!browser) throw new Error("Needs Chrome or Edge to print the PDFs.");

const style = `
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: "Segoe UI", Arial, sans-serif; color: #1e1146; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .page { width: 210mm; height: 297mm; padding: 16mm 16mm 14mm; position: relative; overflow: hidden; page-break-after: always; background: #f8f3fe; }
  .page:last-child { page-break-after: auto; }
  h1, h2, h3, .serif { font-family: Georgia, "Times New Roman", serif; font-weight: 400; margin: 0; }
  h1 { font-size: 34pt; line-height: 1.02; color: #3b1f8e; }
  h2 { font-size: 16pt; color: #3b1f8e; margin: 5.5mm 0 2.5mm; padding-bottom: 2mm; border-bottom: 0.4mm solid #3b1f8e; }
  h3 { font-size: 12.5pt; color: #1e1146; margin: 0 0 1mm; }
  p, li { font-size: 10pt; line-height: 1.45; margin: 0; }
  .label { font-size: 8pt; letter-spacing: 2.5pt; text-transform: uppercase; color: #8a6500; }
  .band { background: #3b1f8e; color: #f8f3fe; margin: 0 -16mm; padding: 9mm 16mm; }
  .band h1 { color: #f8f3fe; }
  .gold { color: #f2b705; }
  .grid { display: grid; gap: 3mm; }
  .card { background: #fff; border: 0.3mm solid #dccdf3; padding: 3mm 4mm; }
  .num { display: inline-grid; place-items: center; width: 7mm; height: 7mm; border-radius: 50%; background: #f2b705; color: #1e1146; font-size: 9.5pt; margin-right: 2mm; }
  ul.dots { list-style: none; padding: 0; margin: 0; display: grid; gap: 1.6mm; }
  ul.dots li::before { content: ""; display: inline-block; width: 1.6mm; height: 1.6mm; background: #f2b705; transform: rotate(45deg); margin: 0 2.4mm 0.4mm 0; }
  .foot { position: absolute; left: 16mm; right: 16mm; bottom: 10mm; display: flex; justify-content: space-between; font-size: 8.5pt; color: #6b6580; border-top: 0.3mm solid #dccdf3; padding-top: 2.5mm; }
  .logos { display: flex; gap: 5mm; align-items: center; }
  .logos img { height: 15mm; background: #3b1f8e; padding: 2mm 3mm; }
`;

const header = (title) => `
  <div class="band">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8mm">
      <div>
        <p class="label" style="color:#f2b705">Stallion for Schools &amp; Colleges</p>
        <h1 style="margin-top:3mm">${title}</h1>
      </div>
      <img src="${asset("brand/sm-crest-gold.png")}" style="height:26mm" alt="">
    </div>
  </div>`;

const foot = (n) => `<div class="foot"><span>Organised by Lemerian Workin Pvt Ltd, Banjara Hills, Hyderabad</span><span>${URL_TEXT} · ${PHONE}${n ? ` · ${n}` : ""}</span></div>`;

const brief = `<!doctype html><html><head><meta charset="utf-8"><style>${style}</style></head><body>
  <section class="page">
    ${header("Bring Stallion to your campus")}
    <p class="serif" style="font-size:12.5pt;line-height:1.4;margin-top:6mm">
      Our team and partner NGOs come to your school or college and run a hands-on workshop on animal care, wildlife and
      conservation. Free if our team invited you, ${schoolFee} per session if you book yourself. Certificates for everyone.
      Prizes for quiz winners.
    </p>
    <p style="margin-top:3.5mm;font-size:9pt;color:#6b6580">${schoolTrust.map(esc).join(" · ")}</p>

    <h2>What your institution gets</h2>
    <div class="grid" style="grid-template-columns:1fr 1fr">
      ${schoolBenefits.map((b, i) => `<div class="card"${i === 4 ? ' style="grid-column:span 2"' : ""}><h3><span class="num">${i + 1}</span>${esc(b.title)}</h3><p>${esc(b.body)}</p></div>`).join("")}
    </div>

    <h2>How it works</h2>
    <div class="grid" style="grid-template-columns:1fr 1fr;gap:3mm 6mm">
      ${schoolSteps.map((s, i) => `<div><h3><span class="num">${i + 1}</span>${esc(s.label)}</h3><p>${esc(s.value.replace("on this page", "on our website"))}</p>${s.note ? `<p style="margin-top:1.5mm;color:#6b6580;font-size:9pt">${esc(s.note)}</p>` : ""}</div>`).join("")}
    </div>
    ${foot("1 of 2")}
  </section>

  <section class="page">
    <h2 style="margin-top:0">Workshop topics</h2>
    <p>Led by partner NGOs working in animal care and wildlife conservation. The coordinator picks one when registering.
      Each workshop is 60 to 90 minutes, followed by a quiz round of about 30 minutes, for groups of 30 to 200 students.</p>
    <div class="grid" style="grid-template-columns:repeat(3,1fr);margin-top:3mm">
      ${schoolTopics.map((t) => `<div class="card"><h3>${esc(t.title)}</h3><p>${esc(t.body)}</p></div>`).join("")}
    </div>
    <div class="logos" style="margin-top:4mm">
      <p class="label" style="margin-right:2mm">Our partner NGOs</p>
      <img src="${asset("ngo/animal-warriors.webp")}" alt="Animal Warriors Conservation Society">
      <img src="${asset("ngo/kacche-raaste.webp")}" alt="Kacche Raaste Nature Awareness Center">
    </div>

    <div class="grid" style="grid-template-columns:1fr 1fr;gap:6mm">
      <div>
        <h2>Certificates</h2>
        <p>Every student who attends receives a Certificate of Participation. The school or college coordinator who organises
          the session receives one as well, in recognition of bringing the program to their campus.</p>
      </div>
      <div>
        <h2>Answer. Think. Win.</h2>
        <p>After the workshop, we run a quiz with a brainstorming round. Students answer questions, discuss with their teams
          and compete. Each quiz has a winner, and winners receive a prize or souvenir from Stallion Marathon.</p>
      </div>
    </div>

    <h2>Who can apply</h2>
    <ul class="dots">${schoolWhoCanApply.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>

    <h2>Questions schools ask</h2>
    <div class="grid" style="grid-template-columns:1fr 1fr;gap:2.5mm 6mm">
      ${schoolFaqs.slice(0, 4).map((f) => `<div><p style="font-weight:600">${esc(f.q)}</p><p>${esc(f.a.replace("through this page", "through our website"))}</p></div>`).join("")}
    </div>

    <div class="band" style="margin:6mm 0 0">
      <p class="serif" style="font-size:16pt">Register your institution in about 3 minutes</p>
      <p style="margin-top:1.5mm;font-size:11pt"><span class="gold">${URL_TEXT}</span> · Phone and WhatsApp ${PHONE} · ${EMAIL}</p>
    </div>
    ${foot("2 of 2")}
  </section>
</body></html>`;

const flyer = `<!doctype html><html><head><meta charset="utf-8"><style>${style}
  .page { background: #3b1f8e; color: #f8f3fe; }
  .page h2 { color: #f2b705; border-color: #f2b705; }
  .foot { color: #d9c9f5; border-color: #6c48c9; }
</style></head><body>
  <section class="page">
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      <p class="label" style="color:#f2b705">Stallion for Schools &amp; Colleges</p>
      <img src="${asset("brand/sm-crest-gold.png")}" style="height:24mm" alt="">
    </div>
    <h1 style="color:#f8f3fe;font-size:44pt;margin-top:6mm">Want this at your school or college?</h1>
    <p class="serif" style="font-size:24pt;color:#f2b705;margin-top:4mm">Tell your teachers.</p>
    <p style="font-size:13pt;line-height:1.5;margin-top:10mm;max-width:150mm">
      Learn about animals and wildlife from experts, get a certificate, and you could win a prize in the quiz.
    </p>
    <h2>What happens</h2>
    <ul class="dots" style="gap:3mm">
      <li style="font-size:12pt">Our team and partner NGOs come to your campus</li>
      <li style="font-size:12pt">A hands-on workshop: animal care, wildlife, or a live reptile and snake show</li>
      <li style="font-size:12pt">A quiz and brainstorming round, with prizes for the winners</li>
      <li style="font-size:12pt">A Certificate of Participation for every student, and for the coordinator</li>
    </ul>
    <div style="margin-top:12mm;background:#f8f3fe;color:#1e1146;padding:8mm 9mm">
      <p class="label">For your teacher, principal or student coordinator</p>
      <p class="serif" style="font-size:19pt;margin-top:2mm;color:#3b1f8e">Your school or college can book a session for ${schoolFee}.</p>
      <p style="font-size:12pt;margin-top:3mm">Register in about 3 minutes at <b>${URL_TEXT}</b></p>
      <p style="font-size:12pt;margin-top:1mm">Questions? Phone and WhatsApp ${PHONE} · ${EMAIL}</p>
    </div>
    <p class="serif" style="font-size:16pt;color:#f2b705;margin-top:10mm;font-style:italic">How&rsquo;s your horsepower?</p>
    ${foot("")}
  </section>
</body></html>`;

const OUT = join(ROOT, "public", "schools");
mkdirSync(OUT, { recursive: true });
const work = join(tmpdir(), `stallion-pdf-${process.pid}`);
mkdirSync(work, { recursive: true });
for (const [name, html] of [
  ["stallion-schools-program-brief", brief],
  ["stallion-schools-flyer", flyer],
]) {
  const src = join(work, `${name}.html`);
  writeFileSync(src, html);
  execFileSync(browser, [
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--allow-file-access-from-files",
    `--user-data-dir=${join(work, "profile")}`,
    `--print-to-pdf=${join(OUT, `${name}.pdf`)}`,
    pathToFileURL(src).href,
  ], { stdio: "ignore", timeout: 60000 });
  console.log(name, "done");
}
if (process.env.KEEP_HTML) console.log("kept", work);
else rmSync(work, { recursive: true, force: true });
