import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../ui/dialog.jsx";
import { toast } from "sonner";
import API from "../../../../utils/api";

const EditProductModal = ({ isOpen, onClose, product, onSuccess }) => {
  const [displayPrice, setDisplayPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product && isOpen) {
      const priceValue = (product.DisplayPrice || product.Price || product.OAmt || "").toString();
      setDisplayPrice(priceValue);
      setDiscountPrice((product.DiscountPrice || "").toString());
    }
  }, [product, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!displayPrice || parseFloat(displayPrice) < 0) {
      toast.error("❌ Please enter a valid price");
      return;
    }

    if (discountPrice && parseFloat(discountPrice) >= parseFloat(displayPrice)) {
      toast.error("❌ Discount price must be less than display price");
      return;
    }

    setLoading(true);

    try {
      const response = await API.put(
        `/products/admin/${product.ItemNo}/price`,
        {
          displayPrice: parseFloat(displayPrice),
          discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        }
      );

      if (response.data.success) {
        toast.success("✅ Price updated successfully!");
        onSuccess();
        onClose();
      } else {
        toast.error(response.data.message || "Failed to update price");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update product price");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="modal fade show d-block"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1050,
          width: "auto",
          maxWidth: "480px",  // ✅ SLIGHTLY BIGGER
          minWidth: "320px",
          backgroundColor: "#fef5e7",  // ✅ GOLD/CREAM
          borderRadius: "14px",
          border: "3px solid #d4a574",  // ✅ GOLD BORDER
          boxShadow: "0 15px 35px rgba(0, 0, 0, 0.15)",
          padding: "28px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <DialogHeader style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <DialogTitle style={{ color: "#000000", fontSize: "20px", fontWeight: "bold", margin: 0 }}>
              ✏️ Edit Price
            </DialogTitle>
            {/* <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#8b7355",
              }}
            >
              <X size={22} />
            </button> */}
          </div>
          <DialogDescription style={{ color: "#5d4e37", marginTop: "6px", fontSize: "13px" }}>
            Update customer display price
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {/* Product Info Card */}
          <div style={{
            backgroundColor: "#fff8dc",
            border: "2px solid #daa520",
            borderRadius: "10px",
            padding: "14px",
            marginBottom: "14px",
          }}>
            <p style={{ color: "#5d4e37", fontSize: "11px", fontWeight: "bold", marginBottom: "6px", textTransform: "uppercase" }}>
              Product
            </p>
            <p style={{ color: "#000000", fontSize: "15px", fontWeight: "bold", marginBottom: "6px" }}>
              {product?.Description}
            </p>
            <p style={{ color: "#654321", fontSize: "12px", margin: 0 }}>
              ItemNo: <code style={{ color: "#000000", backgroundColor: "#fffacd", padding: "2px 6px", borderRadius: "4px", fontFamily: "monospace" }}>
                {product?.ItemNo}
              </code>
            </p>
          </div>

          {/* Current Prices Card */}
          <div style={{
            backgroundColor: "#fef9e7",
            border: "2px solid #d4a574",
            borderRadius: "10px",
            padding: "14px",
            marginBottom: "16px",
          }}>
            <h6 style={{ color: "#000000", fontWeight: "bold", marginBottom: "10px", fontSize: "13px" }}>
              Current Prices
            </h6>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <p style={{ color: "#5d4e37", fontSize: "10px", fontWeight: "bold", marginBottom: "3px" }}>
                  Original (OAmt)
                </p>
                <p style={{ color: "#000000", fontSize: "15px", fontWeight: "bold", margin: 0 }}>
                  ₹{product?.OAmt?.toLocaleString() || "0"}
                </p>
              </div>
              <div>
                <p style={{ color: "#5d4e37", fontSize: "10px", fontWeight: "bold", marginBottom: "3px" }}>
                  Display Price
                </p>
                <p style={{ color: "#b8860b", fontSize: "15px", fontWeight: "bold", margin: 0 }}>
                  ₹{(product?.DisplayPrice || product?.Price || product?.OAmt)?.toLocaleString() || "0"}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Display Price Input */}
          <div style={{ marginBottom: "16px" }}>
            <Label 
              htmlFor="displayPrice" 
              style={{ 
                color: "#000000", 
                fontSize: "13px", 
                fontWeight: "bold", 
                display: "block",
                marginBottom: "8px"
              }}
            >
              New Display Price ₹ *
            </Label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{
                backgroundColor: "#b8860b",
                color: "#ffffff",
                fontWeight: "bold",
                fontSize: "15px",
                padding: "10px 12px",
                borderRadius: "8px 0 0 8px",
              }}>
                ₹
              </span>
              <Input
                id="displayPrice"
                type="number"
                value={displayPrice}
                onChange={(e) => setDisplayPrice(e.target.value)}
                placeholder="Enter price"
                style={{
                  color: "#000000",
                  backgroundColor: "#ffffff",
                  border: "2px solid #b8860b",
                  borderRadius: "0 8px 8px 0",
                  padding: "10px 12px",
                  fontSize: "14px",
                  width: "100%",
                  fontWeight: "500",
                }}
                disabled={loading}
                step="1"
                min="0"
                required
              />
            </div>
            <style>{`
              input::placeholder {
                color: #999999 !important;
                opacity: 0.7;
              }
            `}</style>
            <small style={{ color: "#5d4e37", fontSize: "11px", display: "block", marginTop: "6px" }}>
              💡 Shown to customers on dashboard
            </small>
          </div>

          {/* Discount Price Input */}
          <div style={{ marginBottom: "16px" }}>
            <Label 
              htmlFor="discountPrice" 
              style={{ 
                color: "#000000", 
                fontSize: "13px", 
                fontWeight: "bold", 
                display: "block",
                marginBottom: "8px"
              }}
            >
              Discount Price ₹ (Optional)
            </Label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{
                backgroundColor: "#b8860b",
                color: "#ffffff",
                fontWeight: "bold",
                fontSize: "15px",
                padding: "10px 12px",
                borderRadius: "8px 0 0 8px",
              }}>
                ₹
              </span>
              <Input
                id="discountPrice"
                type="number"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="Enter discount price"
                style={{
                  color: "#000000",
                  backgroundColor: "#ffffff",
                  border: "2px solid #b8860b",
                  borderRadius: "0 8px 8px 0",
                  padding: "10px 12px",
                  fontSize: "14px",
                  width: "100%",
                  fontWeight: "500",
                }}
                disabled={loading}
                step="1"
                min="0"
              />
            </div>
            {discountPrice && displayPrice && parseFloat(discountPrice) < parseFloat(displayPrice) && (
              <div style={{
                marginTop: "8px",
                padding: "8px",
                background: "rgba(212, 175, 55, 0.1)",
                border: "1px solid rgba(212, 175, 55, 0.3)",
                borderRadius: "6px",
              }}>
                <p style={{ color: "#5d4e37", fontSize: "11px", margin: 0 }}>
                  Discount: <strong style={{ color: "#b8860b" }}>
                    {Math.round(((parseFloat(displayPrice) - parseFloat(discountPrice)) / parseFloat(displayPrice)) * 100)}%
                  </strong> OFF
                </p>
              </div>
            )}
            <small style={{ color: "#5d4e37", fontSize: "11px", display: "block", marginTop: "6px" }}>
              💡 Leave empty to remove discount. Original price will show with strikethrough.
            </small>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "18px" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                backgroundColor: "#999999",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                fontSize: "13px",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: "#b8860b",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                fontSize: "13px",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                  Updating...
                </>
              ) : (
                "✏️ Update"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
