import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog@1.1.6";
import { XIcon } from "lucide-react";

function Dialog({ ...props }) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

// ✅ FIXED: Added React.forwardRef
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    data-slot="dialog-overlay"
    className={`fixed inset-0 z-50 bg-black bg-opacity-50 ${className || ""}`}
    style={{
      animation: "fadeIn 0.2s ease-in",
    }}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

function DialogContent({ className, children, ...props }) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={`modal fade show d-block bg-white ${className || ""}`}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1050,
          width: "100%",
          maxWidth: "calc(100% - 2rem)",
          backgroundColor: "white",
          borderRadius: "0.5rem",
          border: "1px solid rgba(0,0,0,0.1)",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          padding: "1.5rem",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className="btn-close"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "transparent",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
        >
          <XIcon size={20} />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }) {
  return (
    <div
      data-slot="dialog-header"
      className={`mb-3 ${className || ""}`}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }) {
  return (
    <div
      data-slot="dialog-footer"
      className={`d-flex gap-2 justify-content-end mt-4 ${className || ""}`}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={`h5 fw-semibold ${className || ""}`}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={`text-muted small ${className || ""}`}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
