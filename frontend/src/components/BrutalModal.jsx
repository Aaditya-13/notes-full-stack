import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function BrutalModal({
  onClose,
  children,
  title,
  icon,
  size = "md", // md | lg
  customHeader = null,
  extraOutside = null,
}) {
  const modalRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Trap focus inside modal
  useEffect(() => {
    const currentRef = modalRef.current;
    if (!currentRef) return;
    
    // Find focusable elements
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex="0"], .ProseMirror';
    const focusableElements = Array.from(currentRef.querySelectorAll(focusableSelector))
      .filter(el => !el.hasAttribute('disabled') && el.getAttribute('tabindex') !== '-1');
      
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (firstElement) {
      // Focus the first input/editor or container
      setTimeout(() => {
        firstElement.focus();
      }, 50);
    }

    const handleTab = (e) => {
      if (e.key !== "Tab") return;

      const activeEl = document.activeElement;

      if (e.shiftKey) {
        if (activeEl === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (activeEl === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    currentRef.addEventListener("keydown", handleTab);
    return () => {
      currentRef.removeEventListener("keydown", handleTab);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-[1000] bg-pattern"
      onClick={onClose}
    >
      <div className="relative flex flex-col items-end w-full max-w-4xl">
        <div
          id="brutal-modal-card"
          ref={modalRef}
          className={`w-full bg-white border-4 border-brutal-dark brutal-shadow-xl relative flex flex-col focus:outline-none overflow-hidden ${
            size === "md" ? "max-w-lg max-h-[90vh]" : "h-[75vh]"
          }`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "brutal-modal-title" : undefined}
        >
          {/* Modal Header */}
          {customHeader ? (
            customHeader
          ) : (
            title && (
              <div className="flex justify-between items-center border-b-4 border-brutal-dark p-5 bg-brutal-bg select-none">
                <div className="flex items-center gap-3">
                  {icon}
                  <h2
                    id="brutal-modal-title"
                    className="text-xl md:text-2xl font-black uppercase tracking-wider text-brutal-dark"
                  >
                    {title}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 border-3 border-transparent hover:border-brutal-dark hover:bg-brutal-danger hover:text-white hover:brutal-shadow flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>
            )
          )}

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-5 md:p-6">
            {children}
          </div>
        </div>

        {/* Extra widgets rendered outside modal box frame */}
        {extraOutside && (
          <div
            className="w-full mt-3 select-none pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {extraOutside}
          </div>
        )}
      </div>
    </div>
  );
}
