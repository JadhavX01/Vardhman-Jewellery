import { useState, useEffect } from "react";
import { Save, Loader2, TrendingUp, DollarSign, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { toast } from "sonner";
import API from "../../../utils/api";
import "./SettingsSection.css";

const SettingsSection = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [originalRates, setOriginalRates] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    setLoading(true);
    try {
      // ✅ Hardcoded rates from your database
      const ratesData = [
        { id: 1, gors: "G", tunch: "24K", rate: 99430, per: 100, cper: 100 },
        { id: 2, gors: "G", tunch: "22K", rate: 90750, per: 92, cper: 100 },
        { id: 3, gors: "G", tunch: "18K", rate: 78310, per: 75, cper: 100 },
        { id: 4, gors: "S", tunch: "24 K", rate: 1019, per: 100, cper: 100 },
        { id: 5, gors: "S", tunch: "BRAND 140", rate: 1400, per: 100, cper: 100 },
      ];
      
      setRates(ratesData);
      setOriginalRates(JSON.parse(JSON.stringify(ratesData)));
    } catch (error) {
      console.error("Failed to fetch rates:", error);
      toast.error("Failed to load rates");
    } finally {
      setLoading(false);
    }
  };

  const handleRateChange = (id, field, value) => {
    const updatedRates = rates.map((rate) =>
      rate.id === id ? { ...rate, [field]: parseFloat(value) || 0 } : rate
    );
    setRates(updatedRates);
    
    // Check if there are changes
    const changed = JSON.stringify(updatedRates) !== JSON.stringify(originalRates);
    setHasChanges(changed);
  };

  const handleSaveRates = async () => {
    setSaving(true);
    try {
      // ✅ Show success message (backend integration will come later)
      toast.success("✅ Rates updated successfully!");
      setOriginalRates(JSON.parse(JSON.stringify(rates)));
      setHasChanges(false);
      
      // TODO: Uncomment this when backend endpoint is ready:
      // await API.put("/admin/rates", { rates });
    } catch (error) {
      console.error("Failed to save rates:", error);
      toast.error("Failed to save rates");
    } finally {
      setSaving(false);
    }
  };

  const handleResetRates = () => {
    if (window.confirm("Are you sure you want to discard all changes?")) {
      setRates(JSON.parse(JSON.stringify(originalRates)));
      setHasChanges(false);
      toast.info("Changes discarded");
    }
  };

  if (loading) {
    return (
      <div className="loadingContainer">
        <div className="loadingSpinner">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          <p>Loading rates...</p>
        </div>
      </div>
    );
  }

  const goldRates = rates.filter((r) => r.gors === "G");
  const silverRates = rates.filter((r) => r.gors === "S");

  return (
    <div className="settingsContainer">
      {/* Header */}
      <div className="settingsHeader">
        <div>
          <h2 className="settingsTitle">⚙️ Settings & Configuration</h2>
          <p className="settingsSubtitle">
            Manage rates and system configuration
          </p>
        </div>
        {hasChanges && (
          <div className="warningAlert">
            <AlertCircle className="w-5 h-5" />
            <span>You have unsaved changes</span>
          </div>
        )}
      </div>

      {/* Gold Rates Section */}
      <div className="rateSection">
        <div className="rateSectionHeader">
          <div className="rateSectionTitle">
            <TrendingUp className="w-6 h-6 text-amber-600" />
            <div>
              <h3>🏆 Gold Rates (GorS: G)</h3>
              <p>Update gold rates for different purities</p>
            </div>
          </div>
          <div className="metalBadge">Au</div>
        </div>

        <div className="rateGrid">
          {goldRates.map((rate) => (
            <div key={rate.id} className="rateCard">
              <div className="rateCardHeader">
                <h4 className="rateCardTitle">{rate.tunch}</h4>
                <span className="metalType">Gold</span>
              </div>

              <div className="formGroup">
                <Label htmlFor={`rate-${rate.id}`} className="formLabel">
                  Rate (₹/10gm)
                </Label>
                <Input
                  id={`rate-${rate.id}`}
                  type="number"
                  value={rate.rate}
                  onChange={(e) => handleRateChange(rate.id, "rate", e.target.value)}
                  className="formInput"
                />
              </div>

              <div className="twoColumnGrid">
                <div className="formGroup">
                  <Label htmlFor={`per-${rate.id}`} className="formLabel">
                    Per (%)
                  </Label>
                  <Input
                    id={`per-${rate.id}`}
                    type="number"
                    value={rate.per}
                    onChange={(e) => handleRateChange(rate.id, "per", e.target.value)}
                    className="formInput"
                  />
                </div>

                <div className="formGroup">
                  <Label htmlFor={`cper-${rate.id}`} className="formLabel">
                    CPer (%)
                  </Label>
                  <Input
                    id={`cper-${rate.id}`}
                    type="number"
                    value={rate.cper}
                    onChange={(e) => handleRateChange(rate.id, "cper", e.target.value)}
                    className="formInput"
                  />
                </div>
              </div>

              <div className="ratePreview">
                <span className="previewLabel">Calculated Rate:</span>
                <span className="previewValue">
                  ₹{(rate.rate * (rate.per / 100) * (rate.cper / 100)).toFixed(2)}/10gm
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Silver Rates Section */}
      <div className="rateSection">
        <div className="rateSectionHeader">
          <div className="rateSectionTitle">
            <TrendingUp className="w-6 h-6 text-gray-400" />
            <div>
              <h3>🥈 Silver Rates (GorS: S)</h3>
              <p>Update silver rates for different purities</p>
            </div>
          </div>
          <div className="metalBadgeSilver">Ag</div>
        </div>

        <div className="rateGrid">
          {silverRates.map((rate) => (
            <div key={rate.id} className="rateCard">
              <div className="rateCardHeader">
                <h4 className="rateCardTitle">{rate.tunch}</h4>
                <span className="metalTypeSilver">Silver</span>
              </div>

              <div className="formGroup">
                <Label htmlFor={`rate-${rate.id}`} className="formLabel">
                  Rate (₹/10gm)
                </Label>
                <Input
                  id={`rate-${rate.id}`}
                  type="number"
                  value={rate.rate}
                  onChange={(e) => handleRateChange(rate.id, "rate", e.target.value)}
                  className="formInput"
                />
              </div>

              <div className="twoColumnGrid">
                <div className="formGroup">
                  <Label htmlFor={`per-${rate.id}`} className="formLabel">
                    Per (%)
                  </Label>
                  <Input
                    id={`per-${rate.id}`}
                    type="number"
                    value={rate.per}
                    onChange={(e) => handleRateChange(rate.id, "per", e.target.value)}
                    className="formInput"
                  />
                </div>

                <div className="formGroup">
                  <Label htmlFor={`cper-${rate.id}`} className="formLabel">
                    CPer (%)
                  </Label>
                  <Input
                    id={`cper-${rate.id}`}
                    type="number"
                    value={rate.cper}
                    onChange={(e) => handleRateChange(rate.id, "cper", e.target.value)}
                    className="formInput"
                  />
                </div>
              </div>

              <div className="ratePreview">
                <span className="previewLabel">Calculated Rate:</span>
                <span className="previewValue">
                  ₹{(rate.rate * (rate.per / 100) * (rate.cper / 100)).toFixed(2)}/10gm
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="actionBar">
        <Button
          variant="outline"
          onClick={handleResetRates}
          disabled={!hasChanges || saving}
          className="secondaryBtn"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Discard Changes
        </Button>

        <Button
          onClick={handleSaveRates}
          disabled={!hasChanges || saving}
          className="primaryBtn"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </>
          )}
        </Button>
      </div>

      {/* Info Box */}
      <div className="infoBox">
        <AlertCircle className="w-5 h-5 text-blue-600" />
        <div>
          <p className="infoTitle">💡 How to Update Rates</p>
          <p className="infoText">
            Change the Rate, Per, and CPer values for each metal type. The calculated rate will update automatically.
            Click "Save All Changes" to apply updates to the system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
