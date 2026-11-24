import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { FiArrowDownRight, FiDownload, FiMail } from "react-icons/fi";
import portrait from "./assets/avatar.webp";
import { CondensationBackground } from "./effects/condensation/CondensationBackground";
import { PortfolioChatbot } from "./components/PortfolioChatbot";
import { PortfolioNav } from "./components/PortfolioNav";
import { contactEmail, credentials, documentedBuilds, githubProfile, linkedInProfile, portfolioRepository, projects } from "./data/portfolio";

const navItems = [
  ["About", "about"],
  ["Work", "work"],
  ["Experience", "experience"],
  ["Contact", "contact"],
];

const AuthDialog = lazy(() => import("./components/AuthDialog").then((module) => ({ default: module.AuthDialog })));

const embers = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  x: `${5 + ((index * 37) % 91)}%`,
  y: `${42 + ((index * 19) % 48)}%`,
  size: `${2 + (index % 3)}px`,
  delay: `${-(index % 7) * 0.72}s`,
  duration: `${5.6 + (index % 5) * 0.8}s`,
}));

function Scene({ pointerX, pointerY }) {
  const moonX = useTransform(pointerX, (value) => value * 12);
  const moonY = useTransform(pointerY, (value) => value * 8);
  const ridgeBackX = useTransform(pointerX, (value) => value * -8);
  const ridgeFrontX = useTransform(pointerX, (value) => value * -16);
  const gateX = useTransform(pointerX, (value) => value * -3);
  const gateY = useTransform(pointerY, (value) => value * -2);
  const waterX = useTransform(pointerX, (value) => value * 6);
  const waterY = useTransform(pointerY, (value) => value * 3);

  return (
    <div className="scene" aria-hidden="true">
      <CondensationBackground className="scene-condensation" speed={0.23} dropAmount={0.44} opacity={0.36} />
      <div className="scene-stars"><i /><i /><i /><i /><i /><i /></div>
      <motion.div className="scene-moon" style={{ x: moonX, y: moonY }} />
      <motion.div className="scene-moon-reflection" style={{ x: waterX, y: waterY }} />
      <div className="scene-haze" />
      <motion.div className="scene-ridge scene-ridge--back" style={{ x: ridgeBackX }} />
      <motion.div className="scene-ridge scene-ridge--front" style={{ x: ridgeFrontX }} />
      <motion.div className="scene-path" style={{ x: waterX }} />
      <motion.div className="scene-gate" style={{ x: gateX, y: gateY }}>
        <i /><i /><b /><b /><span />
      </motion.div>
      <div className="scene-lanterns"><i /><i /><i /><i /></div>
      <div className="scene-embers">
        {embers.map((ember) => <i key={ember.id} style={{ "--x": ember.x, "--y": ember.y, "--size": ember.size, "--delay": ember.delay, "--duration": ember.duration }} />)}
      </div>
      <div className="scene-grass"><i /><i /><i /><i /><i /><i /><i /><i /></div>
      <div className="scene-vignette" />
    </div>
  );
}

function Reveal({ children, className = "", delay = 0 }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div className={className} initial={reduceMotion ? false : { opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.82, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

export default function App() {
  const [activeProject, setActiveProject] = useState(0);
  const [activeSection, setActiveSection] = useState("top");
  const [authOpen, setAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scrollProgress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, restDelta: 0.001 });
  const rawPointerX = useMotionValue(0);
  const rawPointerY = useMotionValue(0);
  const pointerX = useSpring(rawPointerX, { stiffness: 34, damping: 18, mass: 0.8 });
  const pointerY = useSpring(rawPointerY, { stiffness: 34, damping: 18, mass: 0.8 });
  const currentProject = projects[activeProject];
  const selectProject = (index) => setActiveProject((index + projects.length) % projects.length);
  const handleProjectKeyDown = (event, index) => {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1, Home: -index, End: projects.length - 1 - index };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const nextIndex = (index + keys[event.key] + projects.length) % projects.length;
    selectProject(nextIndex);
    document.getElementById(`project-tab-${nextIndex}`)?.focus();
  };

  useEffect(() => {
    const move = (event) => {
      if (reduceMotion || event.pointerType === "touch") return;
      rawPointerX.set((event.clientX / window.innerWidth - 0.5) * 2);
      rawPointerY.set((event.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [rawPointerX, rawPointerY, reduceMotion]);

  useEffect(() => {
    const sections = ["top", ...navItems.map(([, id]) => id)]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (current) setActiveSection(current.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0.15, 0.4, 0.7] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="portfolio">
      <div className="noise" aria-hidden="true" />
      <a className="skip-link" href="#content">Skip to content</a>
      <PortfolioNav activeSection={activeSection} navItems={navItems} onOpenAuth={() => setAuthOpen(true)} scrollProgress={scrollProgress} user={currentUser} />

      <section id="top" className="hero" aria-labelledby="hero-title">
        <Scene pointerX={pointerX} pointerY={pointerY} />
        <div className="hero-copy">
          <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .25, duration: .6 }}><i /> Frontend developer · India</motion.p>
          <motion.h1 id="hero-title" initial={{ opacity: 0, y: 55 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1, duration: .95, ease: [0.16, 1, .3, 1] }}>FRONTENDS WITH<br /><em>A POINT OF VIEW.</em></motion.h1>
          <motion.p className="hero-body" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .45, duration: .75 }}>I’m Aryan Raj, a frontend developer building responsive interfaces with clear hierarchy, thoughtful interaction and dependable implementation.</motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .58, duration: .65 }}><a className="hero-actions__primary" href="#work">View selected work</a><a className="hero-actions__secondary" href={`mailto:${contactEmail}`}><FiMail /> Email Aryan</a></motion.div>
          <motion.a className="hero-explore" href="#work" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .95, duration: .5 }}>Explore selected work <FiArrowDownRight /></motion.a>
        </div>
        <div className="hero-portrait"><motion.img src={portrait} alt="Aryan Raj" initial={{ opacity: 0, y: 46 }} animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: [0, -8, 0] }} transition={{ opacity: { duration: .9, delay: .3 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }} /></div>
        <div className="hero-name" aria-hidden="true">ARYAN</div>
        <div className="hero-bottom"><span>Scroll to enter</span><span className="hero-bottom__line" /><span>01 — 08</span></div>
      </section>

      <div id="content">
      <section id="about" className="about section" aria-labelledby="about-title">
        <Reveal><p className="eyebrow eyebrow--dark">01 / Approach</p></Reveal>
        <div className="about-grid">
          <Reveal><h2 id="about-title">DESIGN WITH<br /><em>INTENTION.</em></h2></Reveal>
          <Reveal className="about-copy" delay={.1}><p>I build interfaces that are easy to understand and satisfying to use. The visual choices support the content instead of competing with it.</p><p>My current work centres on React, responsive layouts and the practical details that make a frontend feel finished.</p><a className="line-link" href="/Resume.pdf" download>Download résumé <FiDownload /></a></Reveal>
        </div>
        <Reveal className="skill-strip" delay={.18}>{["React", "JavaScript", "Responsive UI", "Python", "SQL"].map((skill) => <span key={skill}>{skill}</span>)}</Reveal>
      </section>

      <section id="work" className="work section" aria-labelledby="work-title">
        <Reveal className="section-heading"><p className="eyebrow">02 / Selected work</p><span>Independent concepts · choose a project</span></Reveal>
        <Reveal className="project-stage">
          <AnimatePresence mode="wait"><motion.div className="project-image" key={currentProject.id} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .98 }} transition={{ duration: .55, ease: [0.16, 1, .3, 1] }}><img src={currentProject.image} alt={currentProject.name + " project preview"} /><span className="project-image__wash" /><span className="project-image__label">Selected interface / {currentProject.id}</span></motion.div></AnimatePresence>
          <AnimatePresence mode="wait">
          <motion.div id="project-panel" role="tabpanel" aria-labelledby={`project-tab-${activeProject}`} className="project-content" key={currentProject.id} initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? {} : { opacity: 0, y: -12 }} transition={{ duration: .38, ease: [0.16, 1, .3, 1] }}>
            <div className="project-index"><span>{currentProject.id} / 03</span><span>Independent concept</span></div>
            <p>{currentProject.kind}</p>
            <h2 id="work-title">{currentProject.name}</h2>
            <div className="project-rule" />
            <dl className="case-study">
              <div><dt>Brief</dt><dd>{currentProject.problem}</dd></div>
              <div><dt>Contribution</dt><dd>{currentProject.contribution}</dd></div>
              <div><dt>Stack</dt><dd>{currentProject.stack.join(" · ")}</dd></div>
            </dl>
            <ul className="case-study__outcomes" aria-label={currentProject.name + " outcomes"}>
              {currentProject.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
            </ul>
            {(currentProject.liveUrl || currentProject.repositoryUrl) ? (
              <div className="project-links">
                {currentProject.liveUrl && <a href={currentProject.liveUrl} target="_blank" rel="noreferrer" className="line-link">Live site <FiArrowDownRight /></a>}
                {currentProject.repositoryUrl && <a href={currentProject.repositoryUrl} target="_blank" rel="noreferrer" className="line-link">Source code <FiArrowDownRight /></a>}
              </div>
            ) : <p className="project-availability">Visual concept only · public implementation links are not available.</p>}
          </motion.div>
          </AnimatePresence>
          <div className="project-arrows"><button onClick={() => selectProject(activeProject - 1)} aria-label="Previous project">←</button><button onClick={() => selectProject(activeProject + 1)} aria-label="Next project">→</button></div>
        </Reveal>
        <div className="project-tabs project-tabs--plates" role="tablist" aria-label="Selected interface concepts" aria-orientation="horizontal">
          {projects.map((project, index) => (
            <button key={project.id} id={`project-tab-${index}`} role="tab" aria-controls="project-panel" aria-selected={index === activeProject} tabIndex={index === activeProject ? 0 : -1} onKeyDown={(event) => handleProjectKeyDown(event, index)} onClick={() => selectProject(index)} className={index === activeProject ? "active" : ""}>
              <span className="project-tabs__plate" aria-hidden="true">{project.id}</span>
              <span className="project-tabs__copy"><small>{project.id} / 03 · Project</small>{project.name}</span>
              <span className="project-tabs__arrow" aria-hidden="true">↗</span>
              {index === activeProject && <motion.span className="project-tabs__active" layoutId="active-project-plate" transition={{ type: "spring", stiffness: 350, damping: 30 }} />}
            </button>
          ))}
        </div>
      </section>

      <section className="build-record section" aria-labelledby="build-record-title">
        <Reveal><p className="eyebrow eyebrow--dark">03 / Documented builds</p></Reveal>
        <div className="build-record__heading"><Reveal><h2 id="build-record-title">WORK WITH<br /><em>TRACEABLE CONTEXT.</em></h2></Reveal><Reveal delay={.1}><p>These projects are documented in Aryan’s résumé. Public repositories are not currently available, so the descriptions stay specific about the work without inventing links or outcomes.</p></Reveal></div>
        <div className="build-record__grid">
          {documentedBuilds.map((build, index) => <Reveal key={build.name} delay={index * .08}><article><p>{build.kind}</p><h3>{build.name}</h3><ul className="build-record__stack">{build.stack.map((item) => <li key={item}>{item}</li>)}</ul><ul>{build.details.map((detail) => <li key={detail}>{detail}</li>)}</ul></article></Reveal>)}
        </div>
        <Reveal delay={.2}><div className="build-record__actions"><a className="line-link" href="/Resume.pdf" download>Download résumé <FiDownload /></a><a className="line-link" href={githubProfile} target="_blank" rel="noreferrer">View GitHub profile <FiArrowDownRight /></a></div></Reveal>
      </section>

      <section id="experience" className="experience section" aria-labelledby="experience-title">
        <Reveal><p className="eyebrow">07 / Experience & craft</p></Reveal>
        <div className="experience-heading"><Reveal><h2 id="experience-title">CLEAR BY<br /><em>DESIGN.</em></h2></Reveal><Reveal delay={.12}><p>From structure to interaction, I pay attention to the small choices that make a site easier to navigate and more dependable across screen sizes.</p></Reveal></div>
        <div className="craft-grid">
          <Reveal delay={0}><article><small>01</small><h3>Interfaces</h3><p>Responsive, expressive web experiences made with React and modern frontend tools.</p></article></Reveal>
          <Reveal delay={.1}><article><small>02</small><h3>Motion</h3><p>Purposeful interaction and animation that guide attention without getting in the way.</p></article></Reveal>
          <Reveal delay={.2}><article><small>03</small><h3>Experience</h3><p><strong>CRM Intern · HighRadius</strong><br />October 2023 — February 2024</p></article></Reveal>
        </div>
        <div className="credential-row" aria-label="Selected credentials">{credentials.map((credential) => <span key={credential}>{credential}</span>)}</div>
      </section>

      <section id="contact" className="contact section" aria-labelledby="contact-title">
        <Reveal><p className="eyebrow">08 / Contact</p></Reveal>
        <div className="contact-grid"><Reveal><h2 id="contact-title">LET’S TALK<br />ABOUT THE<br /><em>WORK.</em></h2></Reveal><Reveal className="contact-copy" delay={.13}><p>For frontend roles, collaboration or a project conversation, email Aryan directly or connect on LinkedIn.</p><div className="contact-actions"><a className="contact-link" href={`mailto:${contactEmail}`}><FiMail /> {contactEmail}</a><a className="contact-link contact-link--secondary" href={linkedInProfile} target="_blank" rel="noreferrer">Connect on LinkedIn <FiArrowDownRight /></a></div><div><a href={githubProfile} target="_blank" rel="noreferrer"><FaGithub /> GitHub</a><a href={linkedInProfile} target="_blank" rel="noreferrer"><FaLinkedinIn /> LinkedIn</a></div></Reveal></div>
        <footer><span>© {new Date().getFullYear()} Aryan Raj</span><a href={portfolioRepository} target="_blank" rel="noreferrer">Portfolio source</a></footer>
      </section>
      </div>
      <PortfolioChatbot email={contactEmail} />
      {authOpen && <Suspense fallback={null}><AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} onSessionChange={setCurrentUser} /></Suspense>}
    </main>
  );
}
