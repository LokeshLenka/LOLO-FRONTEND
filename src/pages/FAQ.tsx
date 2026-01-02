import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// --- FAQ Data ---
const FAQS = [
  {
    category: "General",
    question: "What does SRKR LOLO actually do?",
    answer:
      "We are SRKR Engineering College's official Music Band & Club. We operate on two fronts: the **Music Wing** creates original music, scores short films, and performs live, while the **Management Wing** handles event logistics, branding, and campus culture.",
  },
  {
    category: "Membership",
    question: "How can I join the club?",
    answer:
      "We hold recruitment drives twice a year (usually at the start of semesters). For the Music Wing, you'll need to pass an audition. For the Management Wing, we conduct interviews to assess your organizational and creative skills.",
  },
  {
    category: "Membership",
    question: "Do I need to be a professional musician to join?",
    answer:
      "Not at all! While skill is important, we value passion and potential just as much. We have mentorship programs where seniors guide juniors. If you have the drive to learn, you're welcome.",
  },
  {
    category: "Tech & Open Source",
    question: "I heard this website is Open Source. How can I contribute?",
    answer:
      "Yes! Our platform is built by students for students. You can check out our repository on GitHub. We welcome contributions for UI improvements, bug fixes, or even new feature suggestions. Look for 'Good First Issues' to get started.",
  },
  {
    category: "Services",
    question: "Can LOLO compose music for my short film?",
    answer:
      "Absolutely. We have a dedicated production team that specializes in background scores, foley, and sound design. Reach out to us via the Contact page with your project details.",
  },
  {
    category: "Events",
    question: "Do you perform at private events or other colleges?",
    answer:
      "Primarily we focus on SRKR campus events, but we are open to collaborations and inter-college fests. Contact our Management Wing for booking inquiries.",
  },
];

const FAQItem = ({
  i,
  expanded,
  setExpanded,
  item,
}: {
  i: number;
  expanded: number | false;
  setExpanded: (i: number | false) => void;
  item: (typeof FAQS)[0];
}) => {
  const isOpen = i === expanded;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1 }}
      className={`group rounded-2xl border transition-all duration-300 ${
        isOpen
          ? "bg-white/5 border-lolo-cyan/30 shadow-[0_0_30px_-10px_rgba(34,211,238,0.15)]"
          : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
      }`}
    >
      <button
        onClick={() => setExpanded(isOpen ? false : i)}
        className="flex items-center justify-between w-full p-6 text-left"
      >
        <span
          className={`text-lg font-medium transition-colors ${
            isOpen ? "text-white" : "text-neutral-300 group-hover:text-white"
          }`}
        >
          {item.question}
        </span>
        <div
          className={`p-2 rounded-full border transition-all duration-300 ${
            isOpen
              ? "bg-lolo-cyan text-black border-lolo-cyan rotate-180"
              : "bg-transparent border-white/10 text-neutral-400 group-hover:border-white/30"
          }`}
        >
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-neutral-400 leading-relaxed text-sm md:text-base">
              {/* Simple parser for bold text in answer */}
              {item.answer.split("**").map((part, index) =>
                index % 2 === 1 ? (
                  <span key={index} className="text-lolo-cyan font-semibold">
                    {part}
                  </span>
                ) : (
                  part
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function FAQ() {
  const [expanded, setExpanded] = useState<number | false>(0);

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans pb-20 pt-24 relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-lolo-pink/10 rounded-full blur-[120px] pointer-events-none opacity-40" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-lolo-cyan text-xs font-bold uppercase tracking-widest mb-6"
          >
            <MessageCircle size={14} />
            <span>Got Questions?</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Frequently Asked <br />
            <span className="text-lolo-pink font-club">Questions</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-neutral-400 text-lg"
          >
            Everything you need to know about joining, contributing, and jamming
            with us.
          </motion.p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {FAQS.map((item, i) => (
            <FAQItem
              key={i}
              i={i}
              expanded={expanded}
              setExpanded={setExpanded}
              item={item}
            />
          ))}
        </div>

        {/* CTA Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-neutral-900 to-black border border-white/10 text-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-lolo-pink/10 to-lolo-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <h3 className="text-2xl font-bold text-white mb-2 relative z-10">
            Still have questions?
          </h3>
          <p className="text-neutral-400 mb-6 relative z-10">
            Can't find the answer you're looking for? Drop us a line.
          </p>
          <Link to="/contact">
            <button className="relative z-10 inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition-colors">
              Contact Support <ArrowRight size={18} />
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
