import { Card, Modal, ModalContent } from "@heroui/react";
import { X } from "lucide-react";
import { DecisionPanelContent } from "./DecisoinPanelContent";

export function DecisionPanel({
  asModal,
  isOpen,
  onClose,
  ...props
}: {
  asModal?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
} & React.ComponentProps<typeof DecisionPanelContent>) {
  if (!asModal) return <DecisionPanelContent {...props} />;

  return (
    <Modal
      isOpen={!!isOpen}
      // HeroUI will call this when:
      // - backdrop is clicked
      // - ESC is pressed
      // - our custom close button calls `close()`
      onClose={onClose}
      placement="center"
      size="lg"
      backdrop="opaque" // no extra blur → no white cast layer
      hideCloseButton={true}
      classNames={{
        backdrop: "bg-white/80 dark:bg-black/80 z-[99]", // dark, no blur
        base: "bg-transparent border border-white/10 shadow-2xl rounded-2xl z-[10001]",
        wrapper: "z-[10000]",
      }}
      motionProps={{
        variants: {
          enter: {
            scale: 1,
            opacity: 1,
            transition: { duration: 0.22, ease: "easeOut" },
          },
          exit: {
            scale: 0.96,
            opacity: 0,
            transition: { duration: 0.18, ease: "easeIn" },
          },
        },
      }}
    >
      <ModalContent>
        {(close) => (
          <div className="relative">
            {/* close button ABOVE the card */}
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition"
            >
              <X className="h-4 w-4" />
            </button>

            <Card className="bg-white dark:bg-white/1 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl pt-8 z-10">
              <DecisionPanelContent {...props} />
            </Card>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
