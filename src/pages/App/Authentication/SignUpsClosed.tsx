import { ArrowLeft, Clock } from "lucide-react";

export default function SignupsClosed() {
    return (
        <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-lolo-pink/30 selection:text-white relative overflow-hidden">
            {/* Background Blobs */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-lolo-pink/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Back Button */}
            <button
                className="z-50 absolute sm:fixed top-6 left-6 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group cursor-pointer"
                onClick={() => window.history.back()}
            >
                <div className="p-2.5 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/5 transition-all">
                    <ArrowLeft size={18} />
                </div>
                <span className="hidden sm:inline font-bold text-sm">Back to Home</span>
            </button>

            {/* Main Container */}
            <div className="relative z-10 pt-24 px-4 pb-12 min-h-screen flex flex-col justify-center items-center">
                <div className="max-w-2xl mx-auto w-full -mt-20">

                    {/* Message Card (All content is now inside this card) */}
                    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-14 shadow-2xl relative overflow-hidden text-center">
                        {/* Subtle internal glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-lolo-pink/5 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col items-center">

                            {/* Header Icon */}
                            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(236,72,153,0.15)]">
                                <Clock size={36} className="text-lolo-pink" />
                            </div>

                            {/* Main Title */}
                            <h1 className="text-4xl md:text-5xl font-black text-center tracking-tight mb-8">
                                Signups are <span className="text-lolo-pink">Paused</span>
                            </h1>

                            {/* Subtext Content */}
                            <div className="space-y-4">
                                <h2 className="text-xl md:text-2xl font-bold text-white">
                                    We'll be back soon!
                                </h2>
                                <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
                                    Thank you for your interest in joining the community. We are currently preparing for the next phase and are not accepting new registrations at this moment.
                                </p>
                                <div className="pt-4 mt-2 border-t border-white/5">
                                    <p className="text-neutral-500 text-xs md:text-sm font-medium">
                                        Please check back later or keep an eye on our announcements for when we reopen.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
