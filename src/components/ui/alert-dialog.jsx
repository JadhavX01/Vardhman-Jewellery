import React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog@1.1.6";

function AlertDialog({ ...props }) {
  return (
    <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
  );
}

function AlertDialogTrigger({ ...props }) {
  return (
    <AlertDialogPrimitive.Trigger
      data-slot="alert-dialog-trigger"
      {...props}
    />
  );
}

function AlertDialogPortal({ ...props }) {
  return (
    <AlertDialogPrimitive.Portal
      data-slot="alert-dialog-portal"
      {...props}
    />
  );
}

// ✅ FIXED: Added React.forwardRef
const AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    data-slot="alert-dialog-overlay"
    className={`fixed inset-0 z-50 bg-black bg-opacity-50 ${className || ""}`}
    style={{
      animation: "fadeIn 0.2s ease-in",
    }}
    {...props}
  />
));
AlertDialogOverlay.displayName = "AlertDialogOverlay";

function AlertDialogContent({ className, ...props }) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
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
        }}
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ className, ...props }) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={`mb-3 ${className || ""}`}
      {...props}
    />
  );
}

function AlertDialogFooter({ className, ...props }) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={`d-flex gap-2 justify-content-end mt-4 ${className || ""}`}
      {...props}
    />
  );
}

function AlertDialogTitle({ className, ...props }) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={`h5 fw-semibold text-danger ${className || ""}`}
      {...props}
    />
  );
}

function AlertDialogDescription({ className, ...props }) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={`text-muted small mt-2 ${className || ""}`}
      {...props}
    />
  );
}

function AlertDialogAction({ className, ...props }) {
  return (
    <AlertDialogPrimitive.Action
      className={`btn btn-danger ${className || ""}`}
      {...props}
    />
  );
}

function AlertDialogCancel({ className, ...props }) {
  return (
    <AlertDialogPrimitive.Cancel
      className={`btn btn-secondary ${className || ""}`}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
