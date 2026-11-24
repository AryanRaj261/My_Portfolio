import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { ThemeToggle } from "./ThemeToggle";

export function PortfolioNav({ activeSection, navItems, onOpenAuth, scrollProgress, user }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const originalOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => event.key === "Escape" && setMenuOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="portfolio-nav">
        <a className="portfolio-nav__brand" href="#top" aria-label="Aryan Raj home">AR<span>·</span>RJ</a>
        <nav className="portfolio-nav__links" aria-label="Portfolio navigation">
          {navItems.map(([label, id]) => <a key={id} href={`#${id}`} aria-current={activeSection === id ? "page" : undefined}>{label}</a>)}
        </nav>
        <div className="portfolio-nav__actions">
          <a className="portfolio-nav__availability" href="#contact"><i /> Available for work</a>
          <ThemeToggle />
          <button className="portfolio-nav__auth" type="button" onClick={onOpenAuth}>{user ? "Account" : "Log in"}</button>
        </div>
        <div className="portfolio-nav__mobile-actions"><ThemeToggle /></div>
        <button className="portfolio-nav__menu" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>{menuOpen ? <FiX /> : <FiMenu />}</button>
        <motion.span className="portfolio-nav__progress" style={{ scaleX: scrollProgress }} aria-hidden="true" />
      </header>
      <AnimatePresence>
        {menuOpen && (
          <motion.nav className="portfolio-nav__sheet" initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(100% 0 0 0)" }} transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }} aria-label="Mobile navigation">
            {navItems.map(([label, id], index) => <a onClick={() => setMenuOpen(false)} key={id} href={`#${id}`}><small>0{index + 1}</small>{label}</a>)}
            <button className="portfolio-nav__sheet-auth" type="button" onClick={() => { setMenuOpen(false); onOpenAuth(); }}>{user ? "Open account" : "Log in or sign up"}</button>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
