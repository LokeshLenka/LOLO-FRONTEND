import { motion } from "framer-motion";

const SectionHeader: React.FC<{ title: React.ReactNode; subtitle: string }> = ({
  title,
  subtitle,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="text-center mb-16 md:mb-24 px-4"
  >
    <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
      {title}
    </h2>
    <div className="h-1 w-20 bg-gradient-to-r from-transparent via-lolo-pink to-transparent mx-auto mb-6 opacity-70"></div>
    <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed antialiased font-light">
      {subtitle}
    </p>
  </motion.div>
);
export default SectionHeader;
