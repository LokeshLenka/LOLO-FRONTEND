import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import {
  MapPin,
  Mail,
  Instagram,
  ArrowRight,
  ChevronDown,
  Loader2,
  Phone,
} from "lucide-react";

// ✅ TYPE DEFINITIONS
interface FormData {
  name: string;
  email: string;
  role: string;
  custom_role: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  custom_role?: string;
  message?: string;
}

const ContactUs = () => {
  // ✅ TYPED STATE
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    role: "Student",
    custom_role: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({}); // ✅ FIXED: Now TypeScript knows the shape
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState("Student");
  const [customRole, setCustomRole] = useState("");

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

  // ✅ Form validation with proper typing
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    else if (formData.name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email";

    if (role === "Others" && !customRole.trim()) {
      newErrors.custom_role = "Please specify your role";
    }

    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Typed change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // ✅ TypeScript-safe error clearing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name as keyof FormErrors]: "",
      }));
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setRole(newRole);
    setFormData((prev) => ({
      ...prev,
      role: newRole,
      custom_role: "",
    }));
    setCustomRole("");
  };

  // const handleCustomRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   setCustomRole(value);
  //   setFormData((prev) => ({ ...prev, custom_role: value }));

  //   if (errors.custom_role) {
  //     setErrors((prev) => ({ ...prev, custom_role: "" }));
  //   }
  // };

  // ✅ Typed form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        custom_role: role === "Others" ? customRole.trim() : null,
        message: formData.message.trim(),
      };

      await axios.post(`${API_BASE_URL}/contact-message`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Message sent successfully! We'll get back to you soon.");

      // Reset form
      setFormData({
        name: "",
        email: "",
        role: "Student",
        custom_role: "",
        message: "",
      });
      setRole("Student");
      setCustomRole("");
      setErrors({});
    } catch (error: any) {
      if (error.response?.status === 429) {
        toast.error("Too many requests. Please wait a moment.");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-24 bg-[#030303] overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lolo-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-lolo-pink/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left Side: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col pt-4"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Let's Make Some <br />
              <span className="text-lolo-pink font-club">Noise Together</span>
            </h2>
            <p className="text-neutral-400 text-lg mb-12 leading-relaxed max-w-md">
              Whether you're a student wanting to audition, a brand looking to
              sponsor, or just a fan — we want to hear from you.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 group-hover:border-lolo-pink/30 transition-all duration-300">
                  <MapPin className="text-white w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">
                    Visit Us
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    SRKR Engineering College
                    <br />
                    Bhimavaram, Andhra Pradesh, 534204
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 group-hover:border-lolo-cyan/30 transition-all duration-300">
                  <Mail className="text-white w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">
                    Email Us
                  </h3>
                  <a
                    href="mailto:bandloloplays0707@gmail.com"
                    className="text-neutral-500 hover:text-lolo-cyan transition-colors text-sm"
                  >
                    bandloloplays0707@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 group-hover:border-lolo-cyan/30 transition-all duration-300">
                  <Phone className="text-white w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">Call Us</h3>
                  <a
                    href="tel:+918333042318"
                    className="text-neutral-500 hover:text-lolo-cyan transition-colors text-sm mr-4"
                  >
                    +91 8333042318
                  </a>
                  <a
                    href="tel:+919133733532"
                    className="text-neutral-500 hover:text-lolo-cyan transition-colors text-sm"
                  >
                    +91 9133733532
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 group-hover:border-pink-500/30 transition-all duration-300">
                  <Instagram className="text-white w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">Socials</h3>
                  <a
                    href="https://www.instagram.com/lolo.band.official/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-neutral-500 hover:text-pink-400 transition-colors text-sm"
                  >
                    @lolo.band.official
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-8 md:p-10 rounded-[2.5rem]"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-bold text-neutral-500">
                    Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-neutral-700 focus:outline-none focus:border-lolo-pink transition-all duration-300 pr-8 ${
                      errors.name
                        ? "border-red-400 focus:border-red-400"
                        : "hover:border-white/20 focus:border-lolo-pink"
                    }`}
                    placeholder="Jane Doe"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1 animate-pulse">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Role Select */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-bold text-neutral-500">
                    I am a
                  </label>
                  <div className="relative">
                    <select
                      name="role"
                      value={role}
                      onChange={handleRoleChange}
                      className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-lolo-pink transition-all duration-300 appearance-none cursor-pointer pr-8"
                    >
                      <option
                        className="bg-neutral-900 text-neutral-300"
                        value="Student"
                      >
                        Student
                      </option>
                      <option
                        className="bg-neutral-900 text-neutral-300"
                        value="Musician"
                      >
                        Musician
                      </option>
                      <option
                        className="bg-neutral-900 text-neutral-300"
                        value="Faculty"
                      >
                        Faculty
                      </option>
                      <option
                        className="bg-neutral-900 text-neutral-300"
                        value="Sponsor"
                      >
                        Sponsor
                      </option>
                      <option
                        className="bg-neutral-900 text-neutral-300"
                        value="Others"
                      >
                        Others
                      </option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-600 pointer-events-none w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Dynamic Custom Role Input */}
              <AnimatePresence>
                {role === "Others" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="overflow-hidden space-y-2"
                  >
                    <label className="text-xs uppercase tracking-wider font-bold text-neutral-500">
                      Please Specify Role
                    </label>
                    <input
                      name="custom_role"
                      type="text"
                      value={customRole}
                      onChange={(e) => {
                        setCustomRole(e.target.value);
                        setFormData((prev) => ({
                          ...prev,
                          custom_role: e.target.value,
                        }));
                      }}
                      className={`w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-neutral-700 focus:outline-none focus:border-lolo-pink transition-all duration-300 pr-8 ${
                        errors.custom_role
                          ? "border-red-400 focus:border-red-400"
                          : "hover:border-white/20 focus:border-lolo-pink"
                      }`}
                      placeholder="e.g. Alumni, Sound Engineer..."
                    />
                    {errors.custom_role && (
                      <p className="text-red-400 text-xs mt-1 animate-pulse">
                        {errors.custom_role}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-bold text-neutral-500">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-neutral-700 focus:outline-none focus:border-lolo-pink transition-all duration-300 pr-8 ${
                    errors.email
                      ? "border-red-400 focus:border-red-400"
                      : "hover:border-white/20 focus:border-lolo-pink"
                  }`}
                  placeholder="jane@example.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1 animate-pulse">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Message Input */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-bold text-neutral-500">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-neutral-700 focus:outline-none focus:border-lolo-pink transition-all duration-300 resize-none leading-relaxed pr-8 ${
                    errors.message
                      ? "border-red-400 focus:border-red-400"
                      : "hover:border-white/20 focus:border-lolo-pink"
                  }`}
                  placeholder="Tell us about your project, idea, or just say hi..."
                />
                {errors.message && (
                  <p className="text-red-400 text-xs mt-1 animate-pulse">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`group w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-sm transition-all duration-300 ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : " hover:bg-lolo-pink hover:text-white"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
