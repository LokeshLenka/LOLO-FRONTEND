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
    category: "Tech",
    question: "I heard this website is built by students?",
    answer:
      "Yes! Our platform is built entirely by students for students. It's a testament to the technical talent within our club. We are always looking for contributors to help improve the platform.",
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
  {
    category: "Payments",
    question: "How do refunds work for paid event registrations?",
    answer:
      "Refund eligibility depends on the event’s cancellation rules shown on the event page. If eligible, refunds are initiated to the original payment method through our payment partner(s). See the Refund & Cancellation Policy page for details.",
  },
  {
    category: "Payments",
    question:
      "My amount got debited but registration is not confirmed. What should I do?",
    answer:
      "Please contact us from the Contact page with event name, email used, amount, and transaction reference. We’ll verify the payment and initiate a refund or confirm your registration as applicable.",
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
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.05 }}
      className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? "bg-white/[0.03] border-lolo-pink/30 shadow-[0_0_30px_-10px_rgba(236,72,153,0.15)]"
          : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
      }`}
    >
      <button
        onClick={() => setExpanded(isOpen ? false : i)}
        className="flex items-center justify-between w-full p-6 text-left"
      >
        <span
          className={`text-lg font-medium transition-colors pr-4 ${
            isOpen ? "text-white" : "text-neutral-300 group-hover:text-white"
          }`}
        >
          {item.question}
        </span>
        <div
          className={`p-2 rounded-full border transition-all duration-300 shrink-0 ${
            isOpen
              ? "bg-lolo-pink text-white border-lolo-pink rotate-180"
              : "bg-transparent border-white/10 text-neutral-400 group-hover:border-white/30"
          }`}
        >
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: {
                  duration: 0.3,
                  ease: [0.04, 0.62, 0.23, 0.98], // Cheap spring-like ease
                },
                opacity: { duration: 0.2, delay: 0.1 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.2, ease: "easeInOut" },
                opacity: { duration: 0.1 },
              },
            }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-neutral-400 leading-relaxed text-sm md:text-base border-t border-white/5 pt-4">
              {item.answer.split("**").map((part, index) =>
                index % 2 === 1 ? (
                  <span key={index} className="text-lolo-pink font-bold">
                    {part}
                  </span>
                ) : (
                  part
                ),
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
      {/* Background Blobs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-lolo-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-lolo-pink/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-lolo-pink text-xs font-bold uppercase tracking-widest mb-6"
          >
            <MessageCircle size={14} />
            <span>Got Questions?</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
          >
            Frequently Asked <br />
            <span className="text-lolo-pink font-club">Questions</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-neutral-400 text-lg leading-relaxed max-w-xl mx-auto"
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
          className="mt-20 p-10 rounded-[2.5rem] bg-white/1 border border-white/5 text-center relative overflow-hidden group"
        >
          <h3 className="text-2xl font-bold text-white mb-2 relative z-10">
            Still have questions?
          </h3>
          <p className="text-neutral-400 mb-8 relative z-10 max-w-md mx-auto">
            Can't find the answer you're looking for? Drop us a line and we'll
            get back to you shortly.
          </p>
          <Link to="/contact">
            <button className="relative z-10 inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black rounded-full font-bold hover:bg-lolo-pink hover:text-white transition-all shadow-lg active:scale-95">
              Contact Support <ArrowRight size={18} />
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
