import React, { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion, useSpring } from "framer-motion";
// import { useNavigate } from "react-router-dom"; // CHANGED: Standard React Router import
// import { Button } from "@heroui/button";
// import { ArrowRight } from "lucide-react";
import SectionHeader from "./HomeSectionHeader";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

const TimelineItem = ({ item }: { item: TimelineEntry; index: number }) => {
  const itemRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start end", "center center"],
  });

  const dotScale = useTransform(scrollYProgress, [0.5, 1], [1, 1.5]);
  const dotColor = useTransform(
    scrollYProgress,
    [0.5, 1],
    ["#262626", "#ec4899"]
  );
  const dotBorder = useTransform(
    scrollYProgress,
    [0.5, 1],
    ["#404040", "#22d3ee"]
  );
  const dotGlow = useTransform(
    scrollYProgress,
    [0.5, 1],
    ["0px 0px 0px rgba(0,0,0,0)", "0px 0px 20px rgba(236,72,153,0.8)"]
  );

  const smoothScale = useSpring(dotScale, { stiffness: 200, damping: 20 });

  return (
    <div ref={itemRef} className="flex justify-start pt-10 md:pt-40 md:gap-10">
      <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
        <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-black flex items-center justify-center z-50">
          <motion.div
            style={{
              backgroundColor: dotColor,
              borderColor: dotBorder,
              scale: smoothScale,
              boxShadow: dotGlow,
            }}
            className="h-4 w-4 rounded-full border-2 transition-colors duration-200"
          />
        </div>

        <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-neutral-500 ">
          {item.title}
        </h3>
      </div>

      <div className="relative pl-20 pr-4 md:pl-4 w-full">
        <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500">
          {item.title}
        </h3>
        <div>{item.content}</div>
      </div>
    </div>
  );
};

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  // CHANGED: Using standard React Router hook

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full bg-[#030303] font-sans md:px-10" ref={containerRef}>
      <div className="max-w-7xl mx-auto py-10 px-4 md:px-8 lg:px-10">
        <SectionHeader
          title={
            <>
              The Journey of{" "}
              <span className="text-lolo-pink font-club">SRKR LOLO</span>
            </>
          }
          subtitle="From a small idea to an officially approved musical powerhouse."
        />
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <TimelineItem key={index} item={item} index={index} />
        ))}

        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-lolo-pink via-lolo-cyan to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>

      {/* Button with navigate function */}
      {/* <Link to="/about" className="w-[85%] sm:w-auto mx-auto flex justify-center mb-10">
        <Button className="w-full sm:w-auto px-10 py-6 rounded-full bg-white text-black font-bold text-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 border-none group ease-in-out ">
          View Full Journey
          <ArrowRight
            size={20}
            className="ml-2 group-hover:translate-x-1 transition-transform"
          />
        </Button>
      </Link> */}
    </div>
  );
};
