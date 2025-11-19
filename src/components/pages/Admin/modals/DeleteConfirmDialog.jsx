import { AlertCircle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../ui/alert-dialog.jsx";

const DeleteConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Product",
  description = "This product will be hidden from the dashboard but kept in the database.",
  itemName = "product",
  isLoading = false,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent 
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1050,
          width: "auto",
          maxWidth: "420px",  // ✅ SMALL CARD
          minWidth: "300px",
          backgroundColor: "#fef5e7",  // ✅ GOLD THEME
          borderRadius: "14px",
          border: "3px solid #d4a574",
          boxShadow: "0 15px 35px rgba(0, 0, 0, 0.15)",
          padding: "24px",
        }}
      >
        <AlertDialogHeader>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "44px",
              height: "44px",
              backgroundColor: "#ffebee",
              borderRadius: "50%",
            }}>
              <AlertCircle style={{ width: "24px", height: "24px", color: "#d32f2f" }} />
            </div>
            <AlertDialogTitle style={{ color: "#d32f2f", fontSize: "18px", fontWeight: "bold", margin: 0 }}>
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription style={{ color: "#5d4e37", fontSize: "13px", marginTop: "12px" }}>
            Are you sure you want to delete <strong style={{ color: "#000000" }}>{itemName}</strong>?
            <br />
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div style={{
          backgroundColor: "#fff8dc",
          border: "2px solid #daa520",
          borderRadius: "8px",
          padding: "10px",
          marginTop: "14px",
          marginBottom: "16px",
        }}>
          <p style={{ color: "#d32f2f", fontSize: "12px", fontWeight: "bold", margin: 0 }}>
            ⚠️ This action cannot be undone
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <AlertDialogCancel 
            disabled={isLoading}
            style={{
              backgroundColor: "#999999",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              fontSize: "13px",
              fontWeight: "bold",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              backgroundColor: "#d32f2f",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              fontSize: "13px",
              fontWeight: "bold",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                Deleting...
              </>
            ) : (
              "🗑️ Delete"
            )}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;
