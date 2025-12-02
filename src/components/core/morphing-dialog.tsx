import * as React from "react";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  type Transition,
  type Variants,
} from "framer-motion";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

// --- Utility: useClickOutside ---
function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: (event: MouseEvent | TouchEvent | FocusEvent) => void
) {
  React.useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent | FocusEvent) => {
      const el = ref?.current;
      if (!el || el.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

// --- Context ---
type MorphingDialogContextType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  uniqueId: string;
  triggerRef: React.RefObject<HTMLDivElement | null>;
};

const MorphingDialogContext = React.createContext<
  MorphingDialogContextType | undefined
>(undefined);

export function useMorphingDialog() {
  const context = React.useContext(MorphingDialogContext);
  if (!context) {
    throw new Error(
      "useMorphingDialog must be used within a MorphingDialogProvider"
    );
  }
  return context;
}

// ... rest of file ...

// --- Components ---

type MorphingDialogProps = {
  children: React.ReactNode;
  transition?: Transition;
};

export function MorphingDialog({
  children,
  transition = { type: "spring", bounce: 0.05, duration: 0.25 },
}: MorphingDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const uniqueId = React.useId();
  const triggerRef = React.useRef<HTMLDivElement>(null);

  return (
    <MorphingDialogContext.Provider
      value={{ isOpen, setIsOpen, uniqueId, triggerRef }}
    >
      <MotionConfig transition={transition}>{children}</MotionConfig>
    </MorphingDialogContext.Provider>
  );
}

export function MorphingDialogTrigger({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { setIsOpen, uniqueId, triggerRef } = useMorphingDialog();

  return (
    <motion.div
      ref={triggerRef as any}
      layoutId={`dialog-${uniqueId}`}
      className={className}
      style={{ cursor: "pointer", ...style }}
      // FIX: Use onClickCapture to ensure the event isn't swallowed by children
      onClickCapture={(e) => {
        e.stopPropagation();
        setIsOpen(true);
      }}
    >
      {children}
    </motion.div>
  );
}

export function MorphingDialogContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, uniqueId } = useMorphingDialog();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
          />
          <div className="relative w-full h-full flex items-center justify-center p-4 pointer-events-none">
            {children}
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function MorphingDialogContent({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { setIsOpen, uniqueId } = useMorphingDialog();
  const ref = React.useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setIsOpen(false));

  return (
    <motion.div
      ref={ref}
      layoutId={`dialog-${uniqueId}`}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function MorphingDialogClose({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const { setIsOpen } = useMorphingDialog();
  return (
    <div
      onClick={() => setIsOpen(false)}
      className={className || "absolute right-4 top-4 cursor-pointer z-10"}
    >
      {children ? (
        children
      ) : (
        <X size={20} className="text-gray-500 hover:text-gray-700" />
      )}
    </div>
  );
}

// --- Optional Subcomponents (matching your sample pattern) ---

export function MorphingDialogTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.h3 layoutId={`title-${React.useId()}`} className={className}>
      {children}
    </motion.h3>
  );
}

export function MorphingDialogSubtitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div layoutId={`subtitle-${React.useId()}`} className={className}>
      {children}
    </motion.div>
  );
}

export function MorphingDialogDescription({
  children,
  className,
  variants,
  disableLayoutAnimation,
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  disableLayoutAnimation?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={
        variants || {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0, transition: { delay: 0.1 } },
          exit: { opacity: 0, y: 10 },
        }
      }
      {...(!disableLayoutAnimation && { layout: true })}
    >
      {children}
    </motion.div>
  );
}

export function MorphingDialogImage({
  src,
  alt,
  className,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      style={style}
      layoutId={`image-${src}`}
    />
  );
}
