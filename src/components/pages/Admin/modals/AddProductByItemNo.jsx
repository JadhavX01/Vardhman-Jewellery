// import { useState } from "react";
// import { Search, Loader2, Upload, Trash2, FileText } from "lucide-react";
// import { Button } from "../../../ui/button";
// import { Input } from "../../../ui/input";
// import { Label } from "../../../ui/label";
// import { toast } from "sonner";
// import API from "../../../../utils/api";
// import "./AddProductByItemNo.css";

// const AddProductByItemNo = ({ isOpen, onClose, onSuccess }) => {
//   const [itemNo, setItemNo] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [product, setProduct] = useState(null);
//   const [displayPrice, setDisplayPrice] = useState("");
//   const [discountPercent, setDiscountPercent] = useState("");
//   const [offerPrice, setOfferPrice] = useState("");
//   const [images, setImages] = useState([null, null, null, null]); // 🆕 4 slots
//   const [imagePreview, setImagePreview] = useState([null, null, null, null]); // 🆕 4 slots
//   const [existingImageIds, setExistingImageIds] = useState([null, null, null, null]); // 🆕 4 slots
//   const [saving, setSaving] = useState(false);
  
//   // Terms and Conditions state
//   const [termsAndCondition, setTermsAndCondition] = useState("");
//   const [showTermsEditor, setShowTermsEditor] = useState(false);

//   // Default Terms Template
//   const defaultTerms = `Terms and Conditions:
// 1. All sales are subject to approval.
// 2. Warranty and support are as per invoice.
// 3. Jewelry care and return policy apply.
// 4. Customizations are non-refundable.
// 5. Prices are subject to change based on market rates.`;

//   const breakdown = product?.priceBreakdown;

//   const handleDiscountChange = (value) => {
//     setDiscountPercent(value);
    
//     if (displayPrice && value && !isNaN(value)) {
//       const discount = parseFloat(value);
//       const original = parseFloat(displayPrice);
      
//       if (discount >= 0 && discount <= 100) {
//         const calculatedOffer = original - (original * discount / 100);
//         setOfferPrice(Math.round(calculatedOffer).toString());
//       } else {
//         setOfferPrice("");
//       }
//     } else {
//       setOfferPrice("");
//     }
//   };

//   // 🆕 FIXED: Fetch product and track image IDs (4 slots)
//   const handleFetchProduct = async () => {
//     if (!itemNo.trim()) {
//       toast.error("Please enter ItemNo");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await API.get(`/products/fetch-by-itemno/${itemNo.trim()}`);
      
//       if (response.data.success) {
//         setProduct(response.data.data);
//         setDisplayPrice(response.data.data.CalculatedPrice?.toString() || "");
//         setDiscountPercent("");
//         setOfferPrice("");
        
//         // Load existing terms or set default
//         try {
//           const termsResponse = await API.get(`/stock/terms/${itemNo.trim()}`);
//           if (termsResponse.data.success) {
//             setTermsAndCondition(termsResponse.data.data.TermsAndCondition || defaultTerms);
//           }
//         } catch {
//           setTermsAndCondition(defaultTerms);
//         }
        
//         const initialImages = [null, null, null, null]; // 🆕 4 slots
//         const initialPreviews = [null, null, null, null]; // 🆕 4 slots
//         const initialImageIds = [null, null, null, null]; // 🆕 4 slots
        
//         response.data.data.images?.slice(0, 4).forEach((img, idx) => { // 🆕 Only take first 4
//           initialPreviews[idx] = `http://localhost:5000${img.FilePath}`;
//           initialImageIds[idx] = img.ID;
//           console.log(`📸 Loaded image slot ${idx}: ID=${img.ID}, Path=${img.FilePath}`); // Debug
//         });
        
//         setImages(initialImages);
//         setImagePreview(initialPreviews);
//         setExistingImageIds(initialImageIds);
        
//         console.log('📊 All loaded image IDs:', initialImageIds); // Debug
//         toast.success("✅ Product loaded successfully");
//       } else {
//         toast.error(response.data.message || "Product not found");
//         setProduct(null);
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//       toast.error(error.response?.data?.message || "Failed to fetch product");
//       setProduct(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🆕 FIXED: Handle image upload
//   const handleImageUploadToSlot = (slotIndex, file) => {
//     if (!file) return;

//     const newImages = [...images];
//     const newPreviews = [...imagePreview];
//     const newImageIds = [...existingImageIds];

//     newImages[slotIndex] = file;
//     newImageIds[slotIndex] = null; // New upload has no ID

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       newPreviews[slotIndex] = reader.result;
//       setImagePreview(newPreviews);
//     };
//     reader.readAsDataURL(file);

//     setImages(newImages);
//     setExistingImageIds(newImageIds);
//     toast.success(`Image added to slot ${slotIndex + 1}`);
//   };

//   // 🆕 FIXED: Remove image with enhanced debugging
//   const removeImageFromSlot = async (slotIndex) => {
//     const imageId = existingImageIds[slotIndex];
    
//     console.log('🗑️ DELETE ATTEMPT:');
//     console.log('  - Slot Index:', slotIndex);
//     console.log('  - Image ID:', imageId);
//     console.log('  - All Image IDs:', existingImageIds);
//     console.log('  - Product Images:', product?.images);

//     const isExistingImage = imageId !== null && imageId !== undefined;

//     if (isExistingImage) {
//       try {
//         console.log(`🗑️ Calling API: DELETE /api/images/${imageId}`);
//         const response = await API.delete(`/images/${imageId}`);
        
//         console.log('📥 API Response:', response.data);
        
//         if (response.data.success) {
//           toast.success("✅ Image deleted successfully");
//           console.log('✅ Image deleted from database');
//         } else {
//           console.error('❌ Server returned error:', response.data.message);
//           toast.error(`❌ ${response.data.message || 'Failed to delete image'}`);
//           return;
//         }
//       } catch (error) {
//         console.error("❌ DELETE ERROR:");
//         console.error('  - Error:', error);
//         console.error('  - Response:', error.response?.data);
//         console.error('  - Status:', error.response?.status);
//         toast.error(error.response?.data?.message || "❌ Failed to delete image");
//         return;
//       }
//     } else {
//       console.log('ℹ️ No existing image ID - just removing from UI');
//     }

//     // Remove from UI
//     const newImages = [...images];
//     const newPreviews = [...imagePreview];
//     const newImageIds = [...existingImageIds];

//     newImages[slotIndex] = null;
//     newPreviews[slotIndex] = null;
//     newImageIds[slotIndex] = null;

//     setImages(newImages);
//     setImagePreview(newPreviews);
//     setExistingImageIds(newImageIds);
    
//     console.log('✅ Image removed from UI');
    
//     if (!isExistingImage) {
//       toast.success(`Image removed from slot ${slotIndex + 1}`);
//     }
//   };

//   // Use Default Terms
//   const handleUseDefaultTerms = () => {
//     setTermsAndCondition(defaultTerms);
//     toast.success("✅ Default terms loaded");
//   };

//   const handleSaveProduct = async () => {
//     if (!product) {
//       toast.error("No product loaded");
//       return;
//     }

//     if (!displayPrice) {
//       toast.error("Please enter display price");
//       return;
//     }

//     if (!termsAndCondition.trim()) {
//       toast.error("Please enter Terms and Conditions");
//       return;
//     }

//     setSaving(true);
//     try {
//       const formData = new FormData();
//       formData.append("itemNo", product.ItemNo);
      
//       const displayPriceValue = parseFloat(displayPrice);
//       const actualPriceValue = product.CalculatedPrice;

//       formData.append("displayPrice", displayPriceValue);
//       formData.append("actualPrice", actualPriceValue);
//       formData.append("termsAndCondition", termsAndCondition.trim());

//       if (offerPrice && parseFloat(offerPrice) < displayPriceValue) {
//         formData.append("discountPrice", parseFloat(offerPrice));
//       }

//       console.log("📤 Sending:", {
//         itemNo: product.ItemNo,
//         displayPrice: displayPriceValue,
//         discountPrice: offerPrice || "None",
//         hasTerms: !!termsAndCondition.trim(),
//         imagesCount: images.filter(f => f instanceof File).length
//       });
      
//       images.forEach((file) => {
//         if (file instanceof File) {
//           formData.append("images", file);
//         }
//       });

//       const response = await API.post("/products/add-to-inventory", formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });

//       if (response.data.success) {
//         const { termsSaved, imagesUploaded, discountPrice } = response.data.data;
        
//         if (termsSaved) {
//           toast.success("✅ Product, Terms & Images saved successfully!");
//         } else if (!termsAndCondition.trim()) {
//           toast.success("✅ Product saved (no terms provided)");
//         } else {
//           toast.warning("⚠️ Product saved but Terms failed to save");
//         }
        
//         console.log("📊 Result:", { termsSaved, imagesUploaded, discountPrice });
//         onSuccess();
//         handleReset();
//       } else {
//         toast.error(response.data.message || "Failed to save product");
//       }
//     } catch (error) {
//       console.error("❌ Save error:", error);
//       toast.error(error.response?.data?.message || "Failed to save product");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleReset = () => {
//     setItemNo("");
//     setProduct(null);
//     setDisplayPrice("");
//     setDiscountPercent("");
//     setOfferPrice("");
//     setImages([null, null, null, null]); // 🆕 4 slots
//     setImagePreview([null, null, null, null]); // 🆕 4 slots
//     setExistingImageIds([null, null, null, null]); // 🆕 4 slots
//     setTermsAndCondition("");
//     setShowTermsEditor(false);
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="addProductOverlay" onClick={(e) => e.target === e.currentTarget && handleReset()}>
//       <div className="addProductModal">
//         <button className="closeButton" onClick={handleReset} title="Close">
//           ✕
//         </button>

//         <div className="modalContent">
//           {!product ? (
//             <>
//               <h2 className="modalTitle">➕ Add Product to Inventory</h2>
//               <p className="modalSubtitle">
//                 Enter the ItemNo to fetch product details and manage images
//               </p>

//               <div className="searchSection">
//                 <div>
//                   <Label htmlFor="itemNo" className="inputLabel">
//                     Product ItemNo *
//                   </Label>

//                   <div className="inputGroup">
//                     <Input
//                       id="itemNo"
//                       placeholder="e.g., RA200076"
//                       value={itemNo}
//                       onChange={(e) => setItemNo(e.target.value)}
//                       onKeyPress={(e) => e.key === "Enter" && handleFetchProduct()}
//                       disabled={loading}
//                       className="itemNoInput"
//                     />
//                     <Button
//                       onClick={handleFetchProduct}
//                       disabled={loading || !itemNo.trim()}
//                       className="searchButton"
//                     >
//                       {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="infoBox">
//                   <p>🔍 Click each image box to upload or replace images (Max 4)</p>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <>
//               <div className="productHeaderBox">
//                 <h2 className="productName">
//                   <span>📦</span>
//                   {product.Description}
//                 </h2>
//                 <div className="productMeta">
//                   <div>
//                     <p className="metaLabel">Item Number</p>
//                     <p className="metaValue">{product.ItemNo}</p>
//                   </div>
//                   <div>
//                     <p className="metaLabel">Group</p>
//                     <p className="metaValue">{product.SubCategory || product.Description}</p>
//                   </div>
//                   <div>
//                     <p className="metaLabel">Rate (Per 10g)</p>
//                     <p className="metaValue">₹{Math.round(product.SRate).toLocaleString()}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="detailsGrid">
//                 <div className="weightGrid">
//                   <div className="gridItem">
//                     <p className="gridLabel">GWt (Gross Weight)</p>
//                     <p className="gridValue">{breakdown?.netWt.toFixed(2)}g</p>
//                   </div>
//                   <div className="gridItem">
//                     <p className="gridLabel">NWt (Net Weight)</p>
//                     <p className="gridValue">{breakdown?.netWt.toFixed(2)}g</p>
//                   </div>
//                   <div className="gridItem">
//                     <p className="gridLabel">Fine Grams</p>
//                     <p className="gridValueGreen">{breakdown?.fineGrams.toFixed(3)}</p>
//                   </div>
//                   <div className="gridItem">
//                     <p className="gridLabel">Wastage (%)</p>
//                     <p className="gridValue">{breakdown?.wastagePercent}%</p>
//                   </div>
//                 </div>

//                 <div className="amountGrid">
//                   <div className="gridItem">
//                     <p className="amountLabel">Making (Labour)</p>
//                     <p className="amountValue">₹{Math.round(breakdown?.labourAmount).toLocaleString()}</p>
//                   </div>
//                   <div className="gridItem">
//                     <p className="amountLabel">Amount (Subtotal)</p>
//                     <p className="amountValue">₹{Math.round(breakdown?.subtotal).toLocaleString()}</p>
//                   </div>
//                   <div className="gridItem">
//                     <p className="amountLabel">GST 3%</p>
//                     <p className="amountValue">₹{Math.round(breakdown?.gst).toLocaleString()}</p>
//                   </div>
//                   <div className="gridItem">
//                     <p className="amountLabel">OAmt (Net Amount)</p>
//                     <p className="amountValueLarge">₹{Math.round(breakdown?.grandTotal).toLocaleString()}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* PRICING SECTION WITH DISCOUNT */}
//               <div className="pricingSection">
//                 <div className="priceRow">
//                   <div className="priceField">
//                     <Label htmlFor="displayPrice" className="inputLabel">
//                       Display Price (Customer Sees) ₹ *
//                     </Label>
//                     <Input
//                       id="displayPrice"
//                       type="number"
//                       step="1"
//                       value={displayPrice}
//                       onChange={(e) => {
//                         setDisplayPrice(e.target.value);
//                         if (discountPercent) {
//                           handleDiscountChange(discountPercent);
//                         }
//                       }}
//                       placeholder="Enter display price"
//                       className="displayPriceInput"
//                     />
//                   </div>

//                   <div className="priceField">
//                     <Label htmlFor="discountPercent" className="inputLabel">
//                       Discount % (Optional)
//                     </Label>
//                     <Input
//                       id="discountPercent"
//                       type="number"
//                       min="0"
//                       max="100"
//                       step="1"
//                       value={discountPercent}
//                       onChange={(e) => handleDiscountChange(e.target.value)}
//                       placeholder="e.g., 20"
//                       className="discountInput"
//                     />
//                   </div>
//                 </div>

//                 {offerPrice && discountPercent && (
//                   <div className="offerPriceBox">
//                     <div className="offerBadge">
//                       🎉 {discountPercent}% OFF
//                     </div>
//                     <div className="priceComparison">
//                       <p className="originalPrice">₹{Math.round(parseFloat(displayPrice)).toLocaleString()}</p>
//                       <p className="finalPrice">₹{Math.round(parseFloat(offerPrice)).toLocaleString()}</p>
//                       <p className="savingsText">Customer saves ₹{Math.round(parseFloat(displayPrice) - parseFloat(offerPrice)).toLocaleString()}</p>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* TERMS AND CONDITIONS SECTION */}
//               <div style={{
//                 backgroundColor: "#fffef0",
//                 border: "2px solid #d4a574",
//                 borderRadius: "10px",
//                 padding: "16px",
//                 marginBottom: "16px",
//               }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
//                   <Label style={{ color: "#000000", fontSize: "13px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }}>
//                     <FileText size={16} />
//                     Terms & Conditions *
//                   </Label>
//                   <button
//                     type="button"
//                     onClick={() => setShowTermsEditor(!showTermsEditor)}
//                     style={{
//                       backgroundColor: "#b8860b",
//                       color: "#ffffff",
//                       border: "none",
//                       borderRadius: "6px",
//                       padding: "6px 12px",
//                       fontSize: "11px",
//                       fontWeight: "bold",
//                       cursor: "pointer",
//                     }}
//                   >
//                     {showTermsEditor ? "Hide" : "Edit T&C"}
//                   </button>
//                 </div>

//                 {showTermsEditor ? (
//                   <>
//                     <textarea
//                       value={termsAndCondition}
//                       onChange={(e) => setTermsAndCondition(e.target.value)}
//                       rows={8}
//                       style={{
//                         width: "100%",
//                         padding: "10px",
//                         border: "2px solid #d4a574",
//                         borderRadius: "8px",
//                         fontSize: "12px",
//                         fontFamily: "monospace",
//                         resize: "vertical",
//                         marginBottom: "10px",
//                       }}
//                       placeholder="Enter terms and conditions..."
//                     />
//                     <button
//                       type="button"
//                       onClick={handleUseDefaultTerms}
//                       style={{
//                         backgroundColor: "#999999",
//                         color: "#ffffff",
//                         border: "none",
//                         borderRadius: "6px",
//                         padding: "8px 14px",
//                         fontSize: "11px",
//                         fontWeight: "bold",
//                         cursor: "pointer",
//                       }}
//                     >
//                       Use Default Terms
//                     </button>
//                   </>
//                 ) : (
//                   <div style={{
//                     backgroundColor: "#ffffff",
//                     padding: "10px",
//                     borderRadius: "6px",
//                     fontSize: "11px",
//                     color: "#5d4e37",
//                     maxHeight: "100px",
//                     overflowY: "auto",
//                     whiteSpace: "pre-wrap",
//                   }}>
//                     {termsAndCondition || "No terms set"}
//                   </div>
//                 )}
//               </div>

//               {/* IMAGE SECTION - 4 SLOTS */}
//               <div className="imageSection">
//                 <Label className="inputLabel">
//                   Product Images (4 Slots) {/* 🆕 Changed from 5 to 4 */}
//                 </Label>

//                 <div className="imageGridContainer">
//                   {imagePreview.map((preview, idx) => (
//                     <div key={idx} className="imageSlotBox">
//                       {preview ? (
//                         <div className="imageSlotContent">
//                           <img src={preview} alt={`Slot ${idx + 1}`} />
//                           <div className="imageSlotOverlay">
//                             <button
//                               className="slotButton replaceBtn"
//                               onClick={() => document.getElementById(`imageInput${idx}`).click()}
//                               title="Replace Image"
//                             >
//                               Replace
//                             </button>
//                             <button
//                               className="slotButton deleteBtn"
//                               onClick={() => removeImageFromSlot(idx)}
//                               title="Delete Image"
//                             >
//                               <Trash2 size={16} />
//                             </button>
//                           </div>
//                         </div>
//                       ) : (
//                         <div
//                           className="imageSlotEmpty"
//                           onClick={() => document.getElementById(`imageInput${idx}`).click()}
//                         >
//                           <Upload size={32} />
//                           <p>Slot {idx + 1}</p>
//                           <span>Click to upload</span>
//                         </div>
//                       )}

//                       <input
//                         id={`imageInput${idx}`}
//                         type="file"
//                         accept="image/*"
//                         style={{ display: 'none' }}
//                         onChange={(e) => {
//                           if (e.target.files?.[0]) {
//                             handleImageUploadToSlot(idx, e.target.files[0]);
//                           }
//                         }}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* ACTION BUTTONS */}
//               <div className="actionButtons">
//                 <Button
//                   onClick={handleReset}
//                   disabled={saving}
//                   className="cancelButton"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={handleSaveProduct}
//                   disabled={saving || !displayPrice || !termsAndCondition.trim()}
//                   className="submitButton"
//                 >
//                   {saving ? (
//                     <>
//                       <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     "✅ Save Product"
//                   )}
//                 </Button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddProductByItemNo;

import { useState } from "react";
import { Search, Loader2, Upload, Trash2, FileText } from "lucide-react";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { toast } from "sonner";
import API from "../../../../utils/api";
import "./AddProductByItemNo.css";

const AddProductByItemNo = ({ isOpen, onClose, onSuccess }) => {
  const [itemNo, setItemNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [displayPrice, setDisplayPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [images, setImages] = useState([null, null, null, null]);
  const [imagePreview, setImagePreview] = useState([null, null, null, null]);
  const [existingImageIds, setExistingImageIds] = useState([null, null, null, null]);
  const [saving, setSaving] = useState(false);
  
  const [termsAndCondition, setTermsAndCondition] = useState("");
  const [showTermsEditor, setShowTermsEditor] = useState(false);

  const defaultTerms = `Terms and Conditions:
1. All sales are subject to approval.
2. Warranty and support are as per invoice.
3. Jewelry care and return policy apply.
4. Customizations are non-refundable.
5. Prices are subject to change based on market rates.`;

  const breakdown = product?.priceBreakdown;

  const handleDiscountChange = (value) => {
    setDiscountPercent(value);
    
    if (displayPrice && value && !isNaN(value)) {
      const discount = parseFloat(value);
      const original = parseFloat(displayPrice);
      
      if (discount >= 0 && discount <= 100) {
        const calculatedOffer = original - (original * discount / 100);
        setOfferPrice(Math.round(calculatedOffer).toString());
      } else {
        setOfferPrice("");
      }
    } else {
      setOfferPrice("");
    }
  };

  const handleFetchProduct = async () => {
    if (!itemNo.trim()) {
      toast.error("Please enter ItemNo");
      return;
    }

    setLoading(true);
    try {
      const response = await API.get(`/products/fetch-by-itemno/${itemNo.trim()}`);
      
      if (response.data.success) {
        setProduct(response.data.data);
        setDisplayPrice(response.data.data.CalculatedPrice?.toString() || "");
        setDiscountPercent("");
        setOfferPrice("");
        
        try {
          const termsResponse = await API.get(`/stock/terms/${itemNo.trim()}`);
          if (termsResponse.data.success) {
            setTermsAndCondition(termsResponse.data.data.TermsAndCondition || defaultTerms);
          }
        } catch {
          setTermsAndCondition(defaultTerms);
        }
        
        const initialImages = [null, null, null, null];
        const initialPreviews = [null, null, null, null];
        const initialImageIds = [null, null, null, null];
        
        response.data.data.images?.slice(0, 4).forEach((img, idx) => {
          initialPreviews[idx] = `http://localhost:5000${img.FilePath}`;
          initialImageIds[idx] = img.ID;
        });
        
        setImages(initialImages);
        setImagePreview(initialPreviews);
        setExistingImageIds(initialImageIds);
        
        toast.success("✅ Product loaded successfully");
      } else {
        toast.error(response.data.message || "Product not found");
        setProduct(null);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch product");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUploadToSlot = (slotIndex, file) => {
    if (!file) return;

    const newImages = [...images];
    const newPreviews = [...imagePreview];
    const newImageIds = [...existingImageIds];

    newImages[slotIndex] = file;
    newImageIds[slotIndex] = null;

    const reader = new FileReader();
    reader.onloadend = () => {
      newPreviews[slotIndex] = reader.result;
      setImagePreview(newPreviews);
    };
    reader.readAsDataURL(file);

    setImages(newImages);
    setExistingImageIds(newImageIds);
    toast.success(`Image added to slot ${slotIndex + 1}`);
  };

  const removeImageFromSlot = async (slotIndex) => {
    const imageId = existingImageIds[slotIndex];
    const isExistingImage = imageId !== null && imageId !== undefined;

    if (isExistingImage) {
      try {
        const response = await API.delete(`/images/${imageId}`);
        if (response.data.success) {
          toast.success("✅ Image deleted successfully");
        } else {
          toast.error(`❌ ${response.data.message || 'Failed to delete image'}`);
          return;
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "❌ Failed to delete image");
        return;
      }
    }

    const newImages = [...images];
    const newPreviews = [...imagePreview];
    const newImageIds = [...existingImageIds];

    newImages[slotIndex] = null;
    newPreviews[slotIndex] = null;
    newImageIds[slotIndex] = null;

    setImages(newImages);
    setImagePreview(newPreviews);
    setExistingImageIds(newImageIds);
    
    if (!isExistingImage) {
      toast.success(`Image removed from slot ${slotIndex + 1}`);
    }
  };

  const handleUseDefaultTerms = () => {
    setTermsAndCondition(defaultTerms);
    toast.success("✅ Default terms loaded");
  };

  const handleSaveProduct = async () => {
    if (!product) {
      toast.error("No product loaded");
      return;
    }

    if (!displayPrice) {
      toast.error("Please enter display price");
      return;
    }

    if (!termsAndCondition.trim()) {
      toast.error("Please enter Terms and Conditions");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("itemNo", product.ItemNo);
      
      const displayPriceValue = parseFloat(displayPrice);
      const actualPriceValue = product.CalculatedPrice;

      formData.append("displayPrice", displayPriceValue);
      formData.append("actualPrice", actualPriceValue);
      formData.append("termsAndCondition", termsAndCondition.trim());

      if (offerPrice && parseFloat(offerPrice) < displayPriceValue) {
        formData.append("discountPrice", parseFloat(offerPrice));
      }
      
      images.forEach((file) => {
        if (file instanceof File) {
          formData.append("images", file);
        }
      });

      const response = await API.post("/products/add-to-inventory", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {
        toast.success("✅ Product, Terms & Images saved successfully!");
        onSuccess();
        handleReset();
      } else {
        toast.error(response.data.message || "Failed to save product");
      }
    } catch (error) {
      console.error("❌ Save error:", error);
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setItemNo("");
    setProduct(null);
    setDisplayPrice("");
    setDiscountPercent("");
    setOfferPrice("");
    setImages([null, null, null, null]);
    setImagePreview([null, null, null, null]);
    setExistingImageIds([null, null, null, null]);
    setTermsAndCondition("");
    setShowTermsEditor(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="addProductOverlay" onClick={(e) => e.target === e.currentTarget && handleReset()}>
      <div className="addProductModal">
        <button className="closeButton" onClick={handleReset} title="Close">✕</button>

        <div className="modalContent">
          {!product ? (
            <>
              <h2 className="modalTitle">➕ Add Product to Inventory</h2>
              <p className="modalSubtitle">Enter the ItemNo to fetch product details and manage images</p>

              <div className="searchSection">
                <div>
                  <Label htmlFor="itemNo" className="inputLabel">Product ItemNo *</Label>
                  <div className="inputGroup">
                    <Input
                      id="itemNo"
                      placeholder="e.g., RA200076"
                      value={itemNo}
                      onChange={(e) => setItemNo(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleFetchProduct()}
                      disabled={loading}
                      className="itemNoInput"
                    />
                    <Button
                      onClick={handleFetchProduct}
                      disabled={loading || !itemNo.trim()}
                      className="searchButton"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
                <div className="infoBox">
                  <p>🔍 Click each image box to upload or replace images (Max 4)</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="productHeaderBox">
                <h2 className="productName">
                  <span>📦</span>
                  {product.Description}
                </h2>
                <div className="productMeta">
                  <div>
                    <p className="metaLabel">Item Number</p>
                    <p className="metaValue">{product.ItemNo}</p>
                  </div>
                  <div>
                    <p className="metaLabel">Purity</p>
                    <p className="metaValue">{product.Tunch}</p>
                  </div>
                  <div>
                    <p className="metaLabel">Pieces</p>
                    <p className="metaValue">{product.Pcs || 1} pc</p>
                  </div>
                </div>
              </div>

                                {/* WEIGHT SECTION */}
<div style={{ backgroundColor: '#fef9e7', border: '2px solid #d4a574', borderRadius: '10px', padding: '14px' }}>
  <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#555D6A', marginBottom: '12px', letterSpacing: '0.4px' }}>
    ⚖️ WEIGHT
  </h3>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '12px', color: '#858A9B' }}>Gross</span>
      <span style={{ fontSize: '13px', fontWeight: '600', color: '#222B45' }}>{(breakdown?.grossWt || 0).toFixed(2)}g</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '12px', color: '#858A9B' }}>Stone Wt</span>
      <span style={{ fontSize: '13px', fontWeight: '600', color: '#222B45' }}>{(breakdown?.lessWt || 0).toFixed(2)}g</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '12px', color: '#858A9B' }}>Net</span>
      <span style={{ fontSize: '13px', fontWeight: '600', color: '#222B45' }}>{(breakdown?.netWt || 0).toFixed(2)}g</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '12px', color: '#858A9B' }}>Fine</span>
      <span style={{ fontSize: '13px', fontWeight: '600', color: '#2563EB' }}>{(breakdown?.fineGrams || 0).toFixed(3)}</span>
    </div>
  </div>
</div>

{/* METAL SECTION */}
<div style={{ backgroundColor: '#fef9e7', border: '2px solid #d4a574', borderRadius: '10px', padding: '14px' }}>
  <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#555D6A', marginBottom: '12px', letterSpacing: '0.4px' }}>
    🪙 METAL
  </h3>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '12px', color: '#858A9B' }}>Purity</span>
      <span style={{ fontSize: '13px', fontWeight: '600', color: '#222B45' }}>{product.Tunch}</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '12px', color: '#858A9B' }}>Rate</span>
      <span style={{ fontSize: '13px', fontWeight: '600', color: '#222B45' }}>₹{((product.SRate || 0) / 10).toFixed(0)}/g</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '12px', color: '#858A9B' }}>Melting</span>
      <span style={{ fontSize: '13px', fontWeight: '600', color: '#222B45' }}>{(breakdown?.meltingPercent || 0).toFixed(1)}%</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '12px', color: '#858A9B' }}>Wastage</span>
      <span style={{ fontSize: '13px', fontWeight: '600', color: '#222B45' }}>{(breakdown?.wastagePercent || 0).toFixed(1)}%</span>
    </div>
  </div>
</div>

{/* MAKING CHARGES */}
<div style={{
  backgroundColor: "#fff8dc",
  border: "2px solid #daa520",
  borderRadius: "10px",
  padding: "14px",
  marginBottom: "16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
}}>
  <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#555D6A', margin: 0 }}>
    MAKING CHARGES @ {(product.LabAmt || 0).toFixed(0)} {product.LabType || 'G'}
  </p>
  <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#000', margin: 0 }}>
    ₹{Math.round(breakdown?.labourAmount || 0).toLocaleString()}
  </p>
</div>

{/* STONES SECTION */}
{breakdown?.stones && breakdown.stones.length > 0 && (
  <div style={{
    backgroundColor: "#fef9e7",
    border: "2px solid #d4a574",
    borderRadius: "10px",
    padding: "14px",
    marginBottom: "16px",
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#555D6A', margin: 0 }}>
        💎 Stones
      </h3>
      <span style={{
        backgroundColor: '#2563EB',
        color: '#fff',
        padding: '4px 10px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: 'bold'
      }}>
        {breakdown.stones.length}
      </span>
    </div>
    
    {breakdown.stones.map((stone, idx) => (
      <div key={idx} style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: idx < breakdown.stones.length - 1 ? '1px solid #e5e7eb' : 'none'
      }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '13px', fontWeight: '600', margin: 0 }}>Stone {stone.srNo}</p>
          <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>
            Wt: {(stone.wt || 0).toFixed(2)} {stone.rType} @ ₹{(stone.rate || 0).toFixed(0)}
          </p>
        </div>
        <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0,color: '#64748B' }}>
          ₹{(stone.amount || 0).toFixed(0)}
        </p>
      </div>
    ))}
    
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '12px',
      paddingTop: '12px',
      borderTop: '2px solid #d4a574'
    }}>
      <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 ,color: '#64748B'}}>Stone Total</p>
      <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#2563EB', margin: 0 }}>
        ₹{Math.round(breakdown?.stoneAmount || 0).toLocaleString()}
      </p>
    </div>
  </div>
)}

{/* PRICE BREAKDOWN */}
<div style={{ backgroundColor: '#fff', border: '2px solid #DFE7EF', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
  <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#2563EB', marginBottom: '12px' }}>
    💰 Price Breakdown
  </h3>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '13px', color: '#555D6A' }}>Metal</span>
      <span style={{ fontSize: '14px', fontWeight: '600',color: '#64748B' }}>₹{Math.round(breakdown?.metalAmount || 0).toLocaleString()}</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '13px', color: '#555D6A' }}>Making</span>
      <span style={{ fontSize: '14px', fontWeight: '600',color: '#64748B' }}>₹{Math.round(breakdown?.labourAmount || 0).toLocaleString()}</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '13px', color: '#555D6A' }}>Stones</span>
      <span style={{ fontSize: '14px', fontWeight: '600',color: '#64748B' }}>₹{Math.round(breakdown?.stoneAmount || 0).toLocaleString()}</span>
    </div>
    <div style={{ height: '1px', backgroundColor: '#ddd', margin: '8px 0' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#555D6A' }}>Subtotal</span>
      <span style={{ fontSize: '14px', fontWeight: 'bold',color: '#64748B' }}>₹{Math.round(breakdown?.subtotal || 0).toLocaleString()}</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '13px', color: '#555D6A' }}>GST (3%)</span>
      <span style={{ fontSize: '14px', fontWeight: '600',color: '#64748B' }}>₹{Math.round(breakdown?.gst || 0).toLocaleString()}</span>
    </div>
    <div style={{ height: '2px', backgroundColor: '#2563EB', margin: '8px 0' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f0f9ff', padding: '12px', borderRadius: '8px' }}>
      <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#000' }}>Final Total</span>
      <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563EB' }}>
        ₹{Math.round(breakdown?.grandTotal || 0).toLocaleString()}
      </span>
    </div>
  </div>
</div>



              {/* Rest of your existing code for pricing, terms, images, etc. stays exactly the same */}
              <div className="pricingSection">
                <div className="priceRow">
                  <div className="priceField">
                    <Label htmlFor="displayPrice" className="inputLabel">
                      Display Price (Customer Sees) ₹ *
                    </Label>
                    <Input
                      id="displayPrice"
                      type="number"
                      step="1"
                      value={displayPrice}
                      onChange={(e) => {
                        setDisplayPrice(e.target.value);
                        if (discountPercent) {
                          handleDiscountChange(discountPercent);
                        }
                      }}
                      placeholder="Enter display price"
                      className="displayPriceInput"
                    />
                  </div>

                  <div className="priceField">
                    <Label htmlFor="discountPercent" className="inputLabel">
                      Discount % (Optional)
                    </Label>
                    <Input
                      id="discountPercent"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={discountPercent}
                      onChange={(e) => handleDiscountChange(e.target.value)}
                      placeholder="e.g., 20"
                      className="discountInput"
                    />
                  </div>
                </div>

                {offerPrice && discountPercent && (
                  <div className="offerPriceBox">
                    <div className="offerBadge">
                      🎉 {discountPercent}% OFF
                    </div>
                    <div className="priceComparison">
                      <p className="originalPrice">₹{Math.round(parseFloat(displayPrice)).toLocaleString()}</p>
                      <p className="finalPrice">₹{Math.round(parseFloat(offerPrice)).toLocaleString()}</p>
                      <p className="savingsText">Customer saves ₹{Math.round(parseFloat(displayPrice) - parseFloat(offerPrice)).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* TERMS SECTION */}
              <div style={{
                backgroundColor: "#fffef0",
                border: "2px solid #d4a574",
                borderRadius: "10px",
                padding: "16px",
                marginBottom: "16px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <Label style={{ color: "#000000", fontSize: "13px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }}>
                    <FileText size={16} />
                    Terms & Conditions *
                  </Label>
                  <button
                    type="button"
                    onClick={() => setShowTermsEditor(!showTermsEditor)}
                    style={{
                      backgroundColor: "#b8860b",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      fontSize: "11px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    {showTermsEditor ? "Hide" : "Edit T&C"}
                  </button>
                </div>

                {showTermsEditor ? (
                  <>
                    <textarea
                      value={termsAndCondition}
                      onChange={(e) => setTermsAndCondition(e.target.value)}
                      rows={8}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "2px solid #d4a574",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontFamily: "monospace",
                        resize: "vertical",
                        marginBottom: "10px",
                      }}
                      placeholder="Enter terms and conditions..."
                    />
                    <button
                      type="button"
                      onClick={handleUseDefaultTerms}
                      style={{
                        backgroundColor: "#999999",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 14px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      Use Default Terms
                    </button>
                  </>
                ) : (
                  <div style={{
                    backgroundColor: "#ffffff",
                    padding: "10px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    color: "#5d4e37",
                    maxHeight: "100px",
                    overflowY: "auto",
                    whiteSpace: "pre-wrap",
                  }}>
                    {termsAndCondition || "No terms set"}
                  </div>
                )}
              </div>

              {/* IMAGE SECTION */}
              <div className="imageSection">
                <Label className="inputLabel">Product Images (4 Slots)</Label>
                <div className="imageGridContainer">
                  {imagePreview.map((preview, idx) => (
                    <div key={idx} className="imageSlotBox">
                      {preview ? (
                        <div className="imageSlotContent">
                          <img src={preview} alt={`Slot ${idx + 1}`} />
                          <div className="imageSlotOverlay">
                            <button
                              className="slotButton replaceBtn"
                              onClick={() => document.getElementById(`imageInput${idx}`).click()}
                              title="Replace Image"
                            >
                              Replace
                            </button>
                            <button
                              className="slotButton deleteBtn"
                              onClick={() => removeImageFromSlot(idx)}
                              title="Delete Image"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="imageSlotEmpty"
                          onClick={() => document.getElementById(`imageInput${idx}`).click()}
                        >
                          <Upload size={32} />
                          <p>Slot {idx + 1}</p>
                          <span>Click to upload</span>
                        </div>
                      )}
                      <input
                        id={`imageInput${idx}`}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleImageUploadToSlot(idx, e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="actionButtons">
                <Button onClick={handleReset} disabled={saving} className="cancelButton">
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProduct}
                  disabled={saving || !displayPrice || !termsAndCondition.trim()}
                  className="submitButton"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "✅ Save Product"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProductByItemNo;

