import { motion } from "framer-motion";

const SectionHeader: React.FC<{
  title: React.ReactNode;
  subtitle?: string;
  align?: "center" | "left";
}> = ({ title, subtitle, align = "center" }) => {
  const alignmentClasses =
    align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`px-4 ${alignmentClasses}`}
    >
      {/* Title with improved spacing */}
      <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-[1.5]">
        {title}
      </h2>

      <p
        className={`text-gray-400 max-w-2xl text-base sm:text-lg lg:text-xl font-light mb-4 ${align === "center" ? "mx-auto" : ""}`}
      >
        {subtitle}
      </p>
    </motion.div>
  );
};

export default SectionHeader;
