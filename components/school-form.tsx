"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { site } from "@/lib/content";
import { schoolFee, schoolTopics } from "@/lib/schools";

const input =
  "mt-2 block w-full rounded-none border border-ink/30 bg-transparent px-4 py-3 text-base leading-[1.3] text-ink focus:border-ink focus:outline-2 focus:outline-offset-2 focus:outline-gold";
const tick = "mt-1 size-5 shrink-0 accent-[#3b1f8e]";

function Field({ id, label, optional, wide, children }: { id: string; label: string; optional?: boolean; wide?: boolean; children: ReactNode }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label htmlFor={id} className="text-sm text-ink/70">
        {label}
        {optional && " (optional)"}
      </label>
      {children}
    </div>
  );
}

function Choice({ id, label, options }: { id: string; label: string; options: string[] }) {
  return (
    <Field id={id} label={label}>
      <select id={id} name={id} required defaultValue="" className={input}>
        <option value="" disabled>
          Choose one
        </option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </Field>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="m-0 grid gap-x-6 gap-y-6 border-0 border-t border-ink/25 p-0 pt-8 sm:grid-cols-2">
      <legend className="label float-left mb-2 w-full p-0 text-gold sm:col-span-2">{title}</legend>
      {children}
    </fieldset>
  );
}

const LABELS: Record<string, string> = {
  institution: "Institution",
  type: "Type",
  area: "Area",
  address: "Address",
  students: "Students",
  group: "Class or year",
  coordinator: "Coordinator (for the certificate)",
  designation: "Designation",
  mobile: "Mobile",
  whatsapp: "On WhatsApp",
  email: "Email",
  principal: "Principal",
  topic: "Topic",
  date1: "First choice date",
  date2: "Second choice date",
  slot: "Time slot",
  space: "Space",
  invited: "Invited by the Stallion team",
  inviter: "Team member",
  fee: `Understands the ${schoolFee} fee`,
  notes: "Notes",
  featured: "May be featured as a partner",
};

/**
 * The Schools & Colleges registration form: three short blocks, then consent.
 * With no mailbox or database yet, sending it opens WhatsApp with every answer
 * filled in, addressed to the team; nothing is stored on this website.
 */
export function SchoolForm() {
  const [invited, setInvited] = useState<"" | "Yes" | "No">("");
  const [done, setDone] = useState<{ name: string; link: string } | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const lines = Object.keys(LABELS).flatMap((k) => {
      const v = String(data.get(k) ?? "").trim();
      return v ? [`${LABELS[k]}: ${v === "on" ? "Yes" : v}`] : [];
    });
    const message = ["Stallion for Schools & Colleges: registration", "", ...lines].join("\n");
    const link = `https://wa.me/91${site.phone}?text=${encodeURIComponent(message)}`;
    setDone({ name: String(data.get("coordinator") ?? "").trim(), link });
    const tab = window.open(link, "_blank");
    if (tab) tab.opener = null;
  }

  if (done) {
    return (
      <div role="status" className="flex flex-col gap-5 border-t border-ink/25 pt-8">
        <p className="display m-0 text-[clamp(28px,2.31vw,44px)] leading-[1.1]">Thank you, {done.name || "coordinator"}.</p>
        <p className="m-0 max-w-xl text-lg leading-[1.45] text-ink/80">
          Your registration is ready in WhatsApp: press send there to finish. Our team will then contact you within 2 working
          days on the number you provided. Meanwhile, you can share this program with another institution.
        </p>
        <p className="m-0 flex flex-wrap gap-x-6 gap-y-2 text-base">
          <a href={done.link} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
            Open WhatsApp again
          </a>
          <a href={`tel:+91${site.phone}`} className="underline underline-offset-4">
            Or call {site.phoneDisplay}
          </a>
          <button type="button" onClick={() => setDone(null)} className="cursor-pointer border-0 bg-transparent p-0 text-base text-ink underline underline-offset-4">
            Edit the form
          </button>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} aria-label="Register your institution" className="flex flex-col gap-12">
      <Block title="A · Institution details">
        <Field id="institution" label="Institution name" wide>
          <input id="institution" name="institution" required maxLength={150} autoComplete="organization" className={input} />
        </Field>
        <Choice id="type" label="Type" options={["School", "Junior College", "Degree College", "Engineering College", "University"]} />
        <Field id="area" label="Area in Hyderabad">
          <input id="area" name="area" required maxLength={80} className={input} />
        </Field>
        <Field id="address" label="Full address and Google Maps link" optional wide>
          <textarea id="address" name="address" rows={2} maxLength={400} className={input} />
        </Field>
        <Field id="students" label="Approximate number of students who will attend">
          <input id="students" name="students" type="number" inputMode="numeric" min={1} max={5000} required className={input} />
        </Field>
        <Field id="group" label="Class or year group">
          <input id="group" name="group" required maxLength={80} placeholder="For example, classes 8 to 10" className={input} />
        </Field>
      </Block>

      <Block title="B · Coordinator details">
        <Field id="coordinator" label="Full name, exactly as it should appear on the certificate" wide>
          <input id="coordinator" name="coordinator" required maxLength={120} autoComplete="name" className={input} />
        </Field>
        <Field id="designation" label="Designation">
          <input id="designation" name="designation" required maxLength={80} autoComplete="organization-title" className={input} />
        </Field>
        <Field id="mobile" label="Mobile number">
          <input id="mobile" name="mobile" type="tel" inputMode="tel" required pattern="[0-9+ \(\)\-]{8,18}" title="A phone number, digits only" autoComplete="tel" className={input} />
          <label className="mt-3 flex items-start gap-3 text-sm text-ink/80">
            <input type="checkbox" name="whatsapp" defaultChecked className={tick} />
            This number is on WhatsApp
          </label>
        </Field>
        <Field id="email" label="Email">
          <input id="email" name="email" type="email" required maxLength={150} autoComplete="email" className={input} />
        </Field>
        <Field id="principal" label="Principal or head of institution" optional>
          <input id="principal" name="principal" maxLength={120} className={input} />
        </Field>
      </Block>

      <Block title="C · Workshop preferences">
        <Choice id="topic" label="Preferred workshop topic" options={schoolTopics.map((t) => t.title)} />
        <Choice id="slot" label="Preferred time slot" options={["Morning", "Afternoon"]} />
        <Field id="date1" label="Preferred date, first choice">
          <input id="date1" name="date1" type="date" required className={input} />
        </Field>
        <Field id="date2" label="Preferred date, second choice">
          <input id="date2" name="date2" type="date" required className={input} />
        </Field>
        <Choice id="space" label="Space available" options={["Auditorium", "Classroom", "Open ground", "Other"]} />
        <div>
          <p id="invited-label" className="m-0 text-sm text-ink/70">
            Were you invited by our Stallion team?
          </p>
          <div role="radiogroup" aria-labelledby="invited-label" className="mt-3 flex gap-6">
            {(["Yes", "No"] as const).map((v) => (
              <label key={v} className="flex items-center gap-2 text-base">
                <input type="radio" name="invited" value={v} required checked={invited === v} onChange={() => setInvited(v)} className="size-5 accent-[#3b1f8e]" />
                {v}
              </label>
            ))}
          </div>
        </div>
        {invited === "Yes" && (
          <Field id="inviter" label="Name of the team member who invited you" wide>
            <input id="inviter" name="inviter" required maxLength={120} className={input} />
          </Field>
        )}
        {invited === "No" && (
          <label className="flex items-start gap-3 text-base sm:col-span-2">
            <input type="checkbox" name="fee" required className={tick} />I understand the session fee is {schoolFee}.
          </label>
        )}
        <Field id="notes" label="Anything else we should know" optional wide>
          <textarea id="notes" name="notes" rows={3} maxLength={600} className={input} />
        </Field>
      </Block>

      <fieldset className="m-0 flex flex-col gap-4 border-0 border-t border-ink/25 p-0 pt-8">
        <legend className="label float-left mb-2 w-full p-0 text-gold">Consent and submit</legend>
        <label className="flex items-start gap-3 text-base">
          <input type="checkbox" name="authorised" required className={tick} />I am authorised to register on behalf of my institution.
        </label>
        <label className="flex items-start gap-3 text-base">
          <input type="checkbox" name="contact" required className={tick} />I agree to be contacted by the Stallion Marathon team.
        </label>
        <label className="flex items-start gap-3 text-base">
          <input type="checkbox" name="featured" className={tick} />
          Our institution may be featured as a partner on the Stallion Marathon website. (Optional)
        </label>
        <div className="mt-4 flex flex-col gap-3">
          <button
            type="submit"
            className="label w-full cursor-pointer border-0 bg-[#3b1f8e] px-6 py-5 text-[#f8f3fe] transition-colors duration-300 hover:bg-[#f2b705] hover:text-[#1e1146] sm:w-fit sm:px-10"
          >
            Submit registration
          </button>
          <p className="m-0 max-w-xl text-sm leading-[1.4] text-ink/70">
            This opens WhatsApp with your answers filled in. Press send there to finish.
          </p>
        </div>
      </fieldset>
    </form>
  );
}
