import { useEffect, useMemo, useRef } from "react";
import { CONDENSATION_DEFAULTS, createCondensationRenderer } from "./condensationRenderer";

export function CondensationBackground({ className = "", speed, dropAmount, opacity }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const options = useMemo(() => ({ speed: speed ?? CONDENSATION_DEFAULTS.speed, dropAmount: dropAmount ?? CONDENSATION_DEFAULTS.dropAmount, opacity: opacity ?? CONDENSATION_DEFAULTS.opacity }), [dropAmount, opacity, speed]);
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return undefined;

    const renderer = createCondensationRenderer(canvas, () => optionsRef.current);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = true;

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      renderer.resize(bounds.width, bounds.height);
      renderer.render(performance.now());
    };
    const tick = (now) => {
      renderer.render(now);
      frame = visible && !document.hidden && !prefersReducedMotion.matches ? requestAnimationFrame(tick) : 0;
    };
    const resume = () => {
      if (visible && !document.hidden && !prefersReducedMotion.matches && !frame) frame = requestAnimationFrame(tick);
    };
    const resizeObserver = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (!visible && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      resume();
    });
    const motionChange = () => {
      if (prefersReducedMotion.matches && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      renderer.render(performance.now());
      resume();
    };

    resizeObserver.observe(host);
    intersection.observe(host);
    document.addEventListener("visibilitychange", resume);
    prefersReducedMotion.addEventListener("change", motionChange);
    resize();
    resume();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", resume);
      prefersReducedMotion.removeEventListener("change", motionChange);
      renderer.dispose();
    };
  }, []);

  return <div ref={hostRef} className={`threeui-background condensation${className ? ` ${className}` : ""}`} style={{ opacity: options.opacity }} aria-hidden="true"><canvas ref={canvasRef} /></div>;
}
