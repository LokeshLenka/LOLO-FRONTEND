import { useEffect, useState, useMemo } from "react";
import type { ReactNode } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { loadImageShape } from "tsparticles-shape-image";
import musicNote from "../assets/particles/music-note.svg";
import headphones from "../assets/particles/headphones.svg";
import microphone from "../assets/particles/microphone.svg";
import guitar from "../assets/particles/guitar.svg";
import piano from "../assets/particles/piano.svg";

interface MusicParticleBackgroundProps {
  children?: ReactNode;
  backgroundColor?: string;
  particleColors?: string[];
  enableInteraction?: boolean;
  className?: string;
  /** Optional: external icon URLs (Flaticon or hosted SVGs). If provided, these will be used for particles. */
  iconUrls?: string[];
}

const MusicParticleBackground = ({
  children,
  backgroundColor = "transparent",
  particleColors = ["#FF6B9D", "#4ECDC4", "#FF6B6B"],
  enableInteraction = true,
  className = "",
  iconUrls,
}: MusicParticleBackgroundProps) => {
  // no explicit `init` flag needed; we'll use the Particles `init` callback
  const [isMobile, setIsMobile] = useState(false);

  // Register particle plugins once (global registration for the react wrapper)
  useEffect(() => {
    initParticlesEngine(async (engine: any) => {
      await loadSlim(engine);
      await loadImageShape(engine);
    }).catch(() => {
      // swallow errors for now; plugins failing should not break the app
    });
  }, []);

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const particleCount = isMobile ? 30 : 40;
  const particleSpeed = isMobile ? 0.5 : 1;
  const animationSpeed = isMobile ? 1 : 2;

  const options = useMemo(
    () => ({
      background: {
        color: { value: backgroundColor },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: {
            enable: enableInteraction,
            mode: "bubble",
          },
          onClick: {
            enable: enableInteraction,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          bubble: {
            distance: 100,
            size: 10,
            duration: 2,
            opacity: 0.8,
          },
          push: {
            quantity: 2,
          },
        },
      },
      particles: {
        color: {
          value: particleColors,
        },
        move: {
          enable: true,
          speed: particleSpeed,
          direction: "none",
          random: true,
          straight: false,
          outModes: {
            default: "bounce",
          },
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: particleCount,
        },
        opacity: {
          value: { min: 0.2, max: 0.4 },
          animation: {
            enable: true,
            speed: 1,
            sync: false,
          },
        },
        shape: {
          type: "image",
          options: {
            image: (iconUrls && iconUrls.length
              ? iconUrls.map((u) => ({ src: u, width: 24, height: 24 }))
              : [
                  { src: musicNote, width: 24, height: 24 },
                  { src: headphones, width: 24, height: 24 },
                  { src: microphone, width: 24, height: 24 },
                  { src: guitar, width: 24, height: 24 },
                  { src: piano, width: 24, height: 24 },
                ]) as any,
          },
        },
        size: {
          // Reduced size by ~50% (was min:16,max:28)
          value: { min: 8, max: 14 },
        },
        rotate: {
          value: { min: 0, max: 360 },
          animation: {
            enable: true,
            speed: animationSpeed,
            sync: false,
          },
        },
        tilt: {
          enable: !isMobile,
          value: { min: 0, max: 360 },
          animation: {
            enable: true,
            speed: 10,
            sync: false,
          },
        },
        wobble: {
          enable: !isMobile,
          distance: 10,
          speed: 10,
        },
        roll: {
          enable: !isMobile,
          speed: 8,
        },
      },
      detectRetina: true,
    }),
    [backgroundColor, particleColors, enableInteraction, particleCount, particleSpeed, animationSpeed, isMobile]
  );

  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${className}`}>
      <Particles
        id="music-particles-bg"
        className="absolute inset-0 pointer-events-none"
        options={options as any}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default MusicParticleBackground;
