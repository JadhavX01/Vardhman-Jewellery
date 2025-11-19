import { X, Copy, Check } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../ui/dialog.jsx";
import { Button } from "../../../ui/button";
import { toast } from "sonner";

const ViewProductModal = ({ isOpen, onClose, product }) => {
  const [copiedField, setCopiedField] = useState(null);

  if (!product) return null;

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`✅ ${fieldName} copied!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const DetailRow = ({ label, value, copyable = false, isMoney = false }) => (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 12px",
      backgroundColor: "#fef9e7",
      borderRadius: "8px",
      border: "1px solid #daa520",
      marginBottom: "8px",
    }}>
      <span style={{ fontSize: "12px", fontWeight: "bold", color: "#5d4e37" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{
          fontSize: "12px",
          fontWeight: "bold",
          color: isMoney ? "#b8860b" : "#000000",
        }}>
          {isMoney ? `₹${value?.toLocaleString() || "N/A"}` : value || "N/A"}
        </span>
        {copyable && value && (
          <button
            onClick={() => copyToClipboard(String(value), label)}
            style={{
              padding: "4px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#999999",
            }}
            title="Copy"
          >
            {copiedField === label ? (
              <Check size={14} style={{ color: "#2e7d32" }} />
            ) : (
              <Copy size={14} />
            )}
          </button>
        )}
      </div>
    </div>
  );

  const soldStatus = product.Sold === "Y" ? "Sold" : "Available";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1050,
          width: "auto",
          maxWidth: "520px",  // ✅ MEDIUM CARD (NOT FULL SCREEN)
          minWidth: "300px",
          maxHeight: "80vh",
          backgroundColor: "#fef5e7",  // ✅ GOLD THEME
          borderRadius: "14px",
          border: "3px solid #d4a574",
          boxShadow: "0 15px 35px rgba(0, 0, 0, 0.15)",
          padding: "24px",
          overflowY: "auto",
        }}
      >
        <DialogHeader style={{ marginBottom: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <DialogTitle style={{ color: "#000000", fontSize: "18px", fontWeight: "bold", margin: 0 }}>
                📦 {product.Description}
              </DialogTitle>
              <p style={{ fontSize: "12px", color: "#5d4e37", marginTop: "6px" }}>
                ItemNo: <code style={{ color: "#000000", backgroundColor: "#fffacd", padding: "2px 6px", borderRadius: "4px" }}>
                  {product.ItemNo}
                </code>
              </p>
            </div>
            {/* <Button
              variant="ghost"
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#8b7355",
                padding: "4px",
              }}
            >
              <X size={20} />
            </Button> */}
          </div>
        </DialogHeader>

        <div style={{ maxHeight: "calc(80vh - 100px)" }}>
          {/* Status & Price */}
          <div style={{
            backgroundColor: "#fff8dc",
            border: "2px solid #daa520",
            borderRadius: "10px",
            padding: "14px",
            marginBottom: "14px",
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <p style={{ color: "#5d4e37", fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }}>Status</p>
                <p style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: soldStatus === "Available" ? "#2e7d32" : "#d32f2f",
                  margin: 0
                }}>
                  {soldStatus === "Available" ? "✅ Available" : "❌ Sold"}
                </p>
              </div>
              <div>
                <p style={{ color: "#5d4e37", fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }}>Price</p>
                <p style={{ fontSize: "16px", fontWeight: "bold", color: "#b8860b", margin: 0 }}>
                  ₹{(product.OAmt || 0)?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Images */}
          {product.images && product.images.length > 0 && (
            <div style={{
              backgroundColor: "#fef9e7",
              border: "2px solid #d4a574",
              borderRadius: "10px",
              padding: "12px",
              marginBottom: "14px",
            }}>
              <h4 style={{ color: "#000000", fontSize: "13px", fontWeight: "bold", margin: "0 0 10px 0" }}>
                🖼️ Images
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                {product.images.slice(0, 4).map((img, idx) => (
                  <img
                    key={idx}
                    src={`http://localhost:5000${img.FilePath}`}
                    alt={`Product ${idx + 1}`}
                    style={{
                      width: "100%",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "2px solid #daa520",
                    }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/80?text=Error";
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Weight & Measurements */}
          <div style={{ marginBottom: "14px" }}>
            <h4 style={{ color: "#000000", fontSize: "13px", fontWeight: "bold", margin: "0 0 8px 0" }}>
              ⚖️ Weight
            </h4>
            <DetailRow label="Gross Weight (gm)" value={product.GWT} copyable />
            <DetailRow label="Net Weight (gm)" value={product.TotWt} copyable />
          </div>

          {/* Pricing */}
          <div style={{ marginBottom: "14px" }}>
            <h4 style={{ color: "#000000", fontSize: "13px", fontWeight: "bold", margin: "0 0 8px 0" }}>
              💰 Pricing
            </h4>
            <DetailRow label="Standard Rate" value={product.SRate} isMoney copyable />
            <DetailRow label="Labour Amount" value={product.LabAmt} isMoney copyable />
          </div>

          {/* Details */}
          <div style={{ marginBottom: "14px" }}>
            <h4 style={{ color: "#000000", fontSize: "13px", fontWeight: "bold", margin: "0 0 8px 0" }}>
              📋 Details
            </h4>
            <DetailRow label="Category" value={product.SubCategory} copyable />
            <DetailRow label="Purity" value={product.Tunch || "24K"} copyable />
            <DetailRow label="Location" value={product.Location} copyable />
          </div>

          {/* Close Button */}
          <Button
            onClick={onClose}
            style={{
              width: "100%",
              backgroundColor: "#b8860b",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              padding: "10px",
              fontSize: "13px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProductModal;
