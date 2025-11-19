import { useState, useEffect } from "react";
import { X, Plus, Calculator, Upload } from "lucide-react";
import API from "../../../../utils/api";
import { toast } from "sonner";

const AddProductModal = ({ show, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    description: "",
    subCategory: "",
    gorS: "G",
    gwt: "",
    owt: "0",
    lessWt: "0",
    labType: "Gm",
    labAmt: "",
    tunch: "",
    wastage: "0",
    boxNo: "",
    location: "",
    note: "",
    hmCode: "",
    rSize: "",
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [rate, setRate] = useState(0);
  const [per, setPer] = useState(100);
  const [cper, setCper] = useState(100);
  const [calc, setCalc] = useState({
    netWt: 0,
    metalAmt: 0,
    calcLabAmt: 0,
    subtotal: 0,
    gst: 0,
    grandTotal: 0,
  });

  // Auto-fetch rate with Per and CPer
  useEffect(() => {
    const fetchRate = async () => {
      if (!formData.gorS || !formData.tunch) {
        setRate(0);
        return;
      }
      try {
        const res = await API.get("/products/rate", {
          params: { gorS: formData.gorS, tunch: formData.tunch }
        });
        setRate(res.data.rate || 0);
        setPer(res.data.per || 100);
        setCper(res.data.cper || 100);
      } catch {
        setRate(0);
        setPer(100);
        setCper(100);
      }
    };
    fetchRate();
  }, [formData.gorS, formData.tunch]);

  // Recalculate with boss's formula
  useEffect(() => {
    const gwt = parseFloat(formData.gwt) || 0;
    const owt = parseFloat(formData.owt) || 0;
    const lessWt = parseFloat(formData.lessWt) || 0;
    const labAmt = parseFloat(formData.labAmt) || 0;
    const wastagePercent = parseFloat(formData.wastage) || 0;
    
    // Net Weight
    const netWt = gwt - (lessWt > 0 ? lessWt : owt);
    
    // Adjusted Rate (boss's formula with Per & CPer)
    const adjustedRate = rate * (per / 100) * (cper / 100);
    
    // Metal Amount
    const metalAmt = netWt * (adjustedRate / 10);

    // Labour Amount
    let calcLabAmt = 0;
    switch (formData.labType) {
      case 'Gm':
      case 'G':
        calcLabAmt = netWt * labAmt;
        break;
      case '%':
        calcLabAmt = (metalAmt * labAmt) / 100;
        break;
      case 'Fix':
      case 'Pc':
      default:
        calcLabAmt = labAmt;
        break;
    }

    // Wastage
    const wastageAmount = (metalAmt * wastagePercent) / 100;

    // Totals
    const subtotal = metalAmt + calcLabAmt + wastageAmount;
    const gst = subtotal * 0.03;
    const grandTotal = subtotal + gst;

    setCalc({ netWt, metalAmt, calcLabAmt, subtotal, gst, grandTotal });
  }, [formData, rate, per, cper]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    
    setSelectedImages(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      selectedImages.forEach((image) => {
        formDataToSend.append('images', image);
      });
      
      await API.post("/products", formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success("Product added successfully!");
      onClose();
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
    }
  };

  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div>
            <h3 style={styles.title}>Add New Product</h3>
            <p style={styles.subtitle}>Upload images & enter details</p>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} color="#6b7280" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          
          {/* Image Upload */}
          <div style={styles.uploadSection}>
            <label style={styles.label}>Product Images (Max 5)</label>
            <div style={styles.uploadBox}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
                id="imageUpload"
              />
              <label htmlFor="imageUpload" style={styles.uploadLabel}>
                <Upload size={32} color="#a855f7" />
                <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
                  Click to upload
                </p>
              </label>
            </div>
            
            {imagePreviews.length > 0 && (
              <div style={styles.previewGrid}>
                {imagePreviews.map((preview, index) => (
                  <div key={index} style={styles.previewItem}>
                    <img src={preview} alt={`Preview ${index + 1}`} style={styles.previewImg} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={styles.removeBtn}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category & Metal */}
          <div style={styles.row2}>
            <div style={styles.field}>
              <label style={styles.label}>Category *</label>
              <select
                required
                value={formData.description}
                onChange={(e) => {
                  handleChange('description', e.target.value);
                  handleChange('subCategory', e.target.value);
                }}
                style={styles.select}
              >
                <option value="">Select Category</option>
                <option value="G BANGLES">G BANGLES</option>
                <option value="G BABY BANGLES">G BABY BANGLES</option>
                <option value="CHAIN PATTI BRANDED">CHAIN PATTI BRANDED</option>
                <option value="22K Gold Necklace">22K Gold Necklace</option>
                <option value="BRACLET BRANDED">BRACLET BRANDED</option>
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Metal Type *</label>
              <select
                value={formData.gorS}
                onChange={(e) => handleChange('gorS', e.target.value)}
                style={styles.select}
                required
              >
                <option value="G">Gold</option>
                <option value="S">Silver</option>
              </select>
            </div>
          </div>

          {/* Tunch, Rate, Labour Type */}
          <div style={styles.row3}>
            <div style={styles.field}>
              <label style={styles.label}>Tunch (Purity) *</label>
              <select
                required
                value={formData.tunch}
                onChange={(e) => handleChange('tunch', e.target.value)}
                style={styles.select}
              >
                <option value="">Select Purity</option>
                <option value="24K">24K</option>
                <option value="916">916 (22K)</option>
                <option value="18KT">18KT</option>
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Rate (Auto)</label>
              <input
                readOnly
                value={rate > 0 ? `₹${rate.toLocaleString()}/10g` : 'Select purity'}
                style={styles.inputReadonly}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Labour Type *</label>
              <select
                value={formData.labType}
                onChange={(e) => handleChange('labType', e.target.value)}
                required
                style={styles.select}
              >
                <option value="Gm">Per Gram</option>
                <option value="%">Percent (%)</option>
                <option value="Fix">Fixed</option>
                <option value="Pc">Per Piece</option>
              </select>
            </div>
          </div>

          {/* Weights */}
          <div style={styles.row4}>
            <div style={styles.field}>
              <label style={styles.label}>Gross Wt (g) *</label>
              <input
                type="number"
                step="0.001"
                required
                value={formData.gwt}
                onChange={(e) => handleChange('gwt', e.target.value)}
                placeholder="5.000"
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Stone Wt (g)</label>
              <input
                type="number"
                step="0.001"
                value={formData.owt}
                onChange={(e) => handleChange('owt', e.target.value)}
                placeholder="0.000"
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Less Wt (g)</label>
              <input
                type="number"
                step="0.001"
                value={formData.lessWt}
                onChange={(e) => handleChange('lessWt', e.target.value)}
                placeholder="0.000"
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Net Wt (Auto)</label>
              <input
                readOnly
                value={calc.netWt.toFixed(3)}
                style={styles.inputReadonlyGreen}
              />
            </div>
          </div>

          {/* Labour & Wastage */}
          <div style={styles.row2}>
            <div style={styles.field}>
              <label style={styles.label}>
                Labour * {formData.labType === 'Gm' ? '(₹/g)' : formData.labType === '%' ? '(%)' : '(₹)'}
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.labAmt}
                onChange={(e) => handleChange('labAmt', e.target.value)}
                placeholder="100"
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Wastage (%)</label>
              <input
                type="number"
                step="0.01"
                value={formData.wastage}
                onChange={(e) => handleChange('wastage', e.target.value)}
                placeholder="0"
                style={styles.input}
              />
            </div>
          </div>

          {/* Optional Fields */}
          <div style={styles.row2}>
            <div style={styles.field}>
              <label style={styles.label}>Box No</label>
              <input
                value={formData.boxNo}
                onChange={(e) => handleChange('boxNo', e.target.value)}
                placeholder="Optional"
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Location</label>
              <input
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Optional"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea
              value={formData.note}
              onChange={(e) => handleChange('note', e.target.value)}
              placeholder="Product description for customers"
              style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
            />
          </div>

          {/* Price Preview */}
          <div style={styles.calcBox}>
            <div style={styles.calcHeader}>
              <Calculator size={18} color="#92400e" />
              <h4 style={styles.calcTitle}>Price Calculation</h4>
            </div>
            <div style={styles.calcGrid}>
              <div>
                <p style={styles.calcLabel}>Metal</p>
                <p style={styles.calcValue}>₹{calc.metalAmt.toFixed(2)}</p>
              </div>
              <div>
                <p style={styles.calcLabel}>Labour</p>
                <p style={styles.calcValue}>₹{calc.calcLabAmt.toFixed(2)}</p>
              </div>
              <div>
                <p style={styles.calcLabel}>Subtotal</p>
                <p style={styles.calcValue}>₹{calc.subtotal.toFixed(2)}</p>
              </div>
              <div>
                <p style={styles.calcLabel}>GST (3%)</p>
                <p style={styles.calcValue}>₹{calc.gst.toFixed(2)}</p>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <p style={styles.calcLabelBold}>Grand Total</p>
                <p style={styles.calcValueBold}>₹{calc.grandTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div style={styles.btnRow}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn}>
              <Plus size={18} />
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px', overflowY: 'auto' },
  modal: { background: '#ffffff', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxWidth: '750px', width: '100%', maxHeight: '95vh', overflowY: 'auto', border: '2px solid #a855f7' },
  header: { padding: '20px', borderBottom: '2px solid #e5e7eb', background: 'linear-gradient(to right, #f3e8ff, #e9d5ff)', position: 'sticky', top: 0, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: '20px', fontWeight: 'bold', color: '#1f2937' },
  subtitle: { fontSize: '12px', color: '#6b7280', marginTop: '4px' },
  closeBtn: { padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer' },
  form: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' },
  uploadSection: { marginBottom: '8px' },
  uploadBox: { border: '2px dashed #e5e7eb', borderRadius: '12px', padding: '32px', textAlign: 'center', background: '#f9fafb', cursor: 'pointer' },
  uploadLabel: { cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  previewGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginTop: '16px' },
  previewItem: { position: 'relative', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', border: '2px solid #e5e7eb' },
  previewImg: { width: '100%', height: '100%', objectFit: 'cover' },
  removeBtn: { position: 'absolute', top: '4px', right: '4px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  row3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' },
  row4: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#374151' },
  input: { width: '100%', padding: '12px 16px', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '14px', color: '#374151', outline: 'none' },
  select: { width: '100%', padding: '12px 16px', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '14px', color: '#374151', outline: 'none', cursor: 'pointer' },
  inputReadonly: { width: '100%', padding: '12px 16px', background: '#fef3c7', border: '2px solid #fde68a', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', color: '#7e22ce' },
  inputReadonlyGreen: { width: '100%', padding: '12px 16px', background: '#d1fae5', border: '2px solid #a7f3d0', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', color: '#065f46' },
  calcBox: { background: 'linear-gradient(to right, #fef3c7, #fed7aa)', borderRadius: '12px', padding: '20px 16px', border: '2px solid #fde68a' },
  calcHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' },
  calcTitle: { fontSize: '14px', fontWeight: 'bold', color: '#92400e' },
  calcGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' },
  calcLabel: { fontSize: '12px', color: '#92400e' },
  calcValue: { fontSize: '16px', fontWeight: 'bold', color: '#78350f' },
  calcLabelBold: { fontWeight: 'bold', color: '#0f172a', fontSize: '15px' },
  calcValueBold: { fontWeight: 'bold', color: '#be185d', fontSize: '20px' },
  btnRow: { display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' },
  cancelBtn: { flex: 1, padding: '12px 16px', border: '2px solid #d1d5db', color: '#374151', background: 'transparent', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  submitBtn: { flex: 1, padding: '12px 16px', background: 'linear-gradient(to right, #a855f7, #9333ea)', color: '#ffffff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 10px 15px -3px rgba(168, 85, 247, 0.3)' },
};

export default AddProductModal;
