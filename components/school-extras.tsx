"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/content";
import { schoolShareMessage } from "@/lib/schools";

const PAGE = `${site.url}/schools`;

/** For students: send the page to a teacher on WhatsApp, or copy its link. */
export function SchoolShare() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PAGE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      window.prompt("Copy this link:", PAGE);
    }
  };
  const button = "label inline-flex items-center justify-center px-8 py-[18px] text-[0.8rem] transition-colors duration-300";
  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={`https://wa.me/?text=${encodeURIComponent(schoolShareMessage(PAGE))}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${button} bg-[#f2b705] text-[#1e1146] hover:bg-[#f8f3fe]`}
      >
        Share on WhatsApp
      </a>
      <button type="button" onClick={copy} className={`${button} cursor-pointer border border-[#f2b705] bg-transparent text-[#f2b705] hover:bg-[#f2b705] hover:text-[#1e1146]`}>
        {copied ? "Link copied" : "Copy page link"}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Page link copied" : ""}
      </span>
    </div>
  );
}

/**
 * "Register your institution", always at hand: a bar fixed to the bottom of the
 * screen on phones, a button at the top right on wider screens. Hidden while the
 * form itself is on screen.
 */
export function SchoolStickyButton() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("schools-hero-cta");
    const form = document.getElementById("register");
    const update = () => {
      const pastHero = !!hero && hero.getBoundingClientRect().bottom < 0;
      const f = form?.getBoundingClientRect();
      const atForm = !!f && f.top < window.innerHeight && f.bottom > 0;
      setShow(pastHero && !atForm);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return (
    <a
      href="#register"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={`label fixed z-40 bg-[#f2b705] text-center text-[0.8rem] text-[#1e1146] shadow-[0_8px_24px_rgba(30,17,70,0.25)] transition-[opacity,translate] duration-300 max-sm:inset-x-0 max-sm:bottom-0 max-sm:px-6 max-sm:py-5 max-sm:pb-[max(20px,env(safe-area-inset-bottom))] sm:right-[clamp(20px,2.78vw,64px)] sm:top-[120px] sm:px-8 sm:py-4 ${
        show ? "opacity-100" : "pointer-events-none opacity-0 max-sm:translate-y-full sm:-translate-y-2"
      }`}
    >
      Register your institution
    </a>
  );
}
