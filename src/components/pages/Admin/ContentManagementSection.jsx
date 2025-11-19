import { useEffect, useMemo, useState } from "react";
import { Plus, Save, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { useContent } from "../../../context/ContentContext";
import { defaultContent } from "../../../data/defaultContent";
import 'bootstrap/dist/css/bootstrap.min.css';

// ========== UPDATED PROFESSIONAL STYLES (with responsive adjustments) ==========

const cardStyle = {
  background: "linear-gradient(to bottom, #ffffff, #fafbfc)",
  borderRadius: "16px",
  padding: "clamp(16px, 4vw, 28px)",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)",
  border: "1px solid #e8eaed",
  display: "flex",
  flexDirection: "column",
  gap: "clamp(16px, 3vw, 24px)",
  transition: "all 0.3s ease",
};

const sectionTitleStyle = {
  fontSize: "clamp(18px, 4vw, 22px)",
  fontWeight: 700,
  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  margin: 0,
  letterSpacing: "-0.02em",
};

const sectionDescriptionStyle = {
  color: "#64748b",
  fontSize: "clamp(12px, 2.5vw, 14px)",
  margin: "4px 0 0 0",
  lineHeight: "1.6",
};

const buttonStyle = {
  border: "none",
  borderRadius: "12px",
  padding: "clamp(10px, 2vw, 14px) clamp(16px, 3vw, 24px)",
  fontSize: "clamp(12px, 2.5vw, 14px)",
  fontWeight: 600,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  transition: "all 0.2s ease",
  fontFamily: "inherit",
  width: "100%",
};

const primaryButtonStyle = {
  ...buttonStyle,
  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  color: "#ffffff",
  boxShadow: "0 4px 12px rgba(245, 158, 11, 0.25)",
};

const secondaryButtonStyle = {
  ...buttonStyle,
  background: "#ffffff",
  color: "#475569",
  border: "1.5px solid #e2e8f0",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
};

const dangerButtonStyle = {
  ...buttonStyle,
  background: "#fff5f5",
  border: "1.5px solid #fed7d7",
  color: "#c53030",
  padding: "clamp(8px, 2vw, 10px) clamp(14px, 2.5vw, 18px)",
};

const inputStyle = {
  width: "100%",
  padding: "clamp(10px, 2vw, 12px) clamp(12px, 2.5vw, 16px)",
  borderRadius: "10px",
  border: "1.5px solid orange",
  fontSize: "clamp(12px, 2.5vw, 14px)",
  color: "#1e293b",
  background: "#ffffff",
  transition: "all 0.2s ease",
  fontFamily: "inherit",
  outline: "none",
};

const textareaStyle = {
  ...inputStyle,
  minHeight: "clamp(80px, 15vw, 120px)",
  resize: "vertical",
  lineHeight: "1.6",
};

const labelStyle = {
  fontSize: "clamp(11px, 2.5vw, 13px)",
  fontWeight: 600,
  color: "#334155",
  marginBottom: "6px",
  display: "block",
  letterSpacing: "0.01em",
};

const dividerStyle = {
  height: "1px",
  background: "linear-gradient(to right, transparent, #e2e8f0, transparent)",
  margin: "8px 0",
};

const SlideCard = ({ children }) => (
  <div
    style={{
      border: "1.5px solid #e8eaed",
      borderRadius: "14px",
      padding: "clamp(16px, 3vw, 20px)",
      background: "#fafbfc",
      display: "flex",
      flexDirection: "column",
      gap: "clamp(12px, 2.5vw, 16px)",
      transition: "all 0.2s ease",
    }}
  >
    {children}
  </div>
);

const useSectionState = (contentSection, defaultSection) => {
  const [state, setState] = useState(defaultSection);

  useEffect(() => {
    if (contentSection && Object.keys(contentSection).length > 0) {
      const merged = { ...defaultSection };
      Object.keys(contentSection).forEach((key) => {
        merged[key] = contentSection[key];
      });
      setState(merged);
    } else {
      setState(defaultSection);
    }
  }, [contentSection, defaultSection]);

  return [state, setState];
};

const SectionCard = ({ title, description, onSave, saving, children }) => (
  <div style={cardStyle}>
    <div style={{ borderBottom: "2px solid #f1f5f9", paddingBottom: "16px" }}>
      <h3 style={sectionTitleStyle}>{title}</h3>
      {description && <p style={sectionDescriptionStyle}>{description}</p>}
    </div>
    {children}
    <div className="row">
      <div className="col-12 d-flex justify-content-end pt-2">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          style={{
            ...primaryButtonStyle,
            opacity: saving ? 0.7 : 1,
            cursor: saving ? "not-allowed" : "pointer",
            transform: saving ? "scale(0.98)" : "scale(1)",
            maxWidth: "200px",
          }}
          onMouseEnter={(e) => {
            if (!saving) {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(245, 158, 11, 0.35)";
            }
          }}
          onMouseLeave={(e) => {
            if (!saving) {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(245, 158, 11, 0.25)";
            }
          }}
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  </div>
);

const MediaUploader = ({ label, onUpload, accept = "image/*,video/*" }) => (
  <label
    style={{
      ...secondaryButtonStyle,
      cursor: "pointer",
      minWidth: "fit-content",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "#f8fafc";
      e.currentTarget.style.borderColor = "#cbd5e1";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "#ffffff";
      e.currentTarget.style.borderColor = "#e2e8f0";
    }}
  >
    <Upload size={16} />
    {label}
    <input
      type="file"
      accept={accept}
      onChange={(event) => {
        if (event.target.files && event.target.files[0]) {
          onUpload(event.target.files[0]);
        }
      }}
      style={{ display: "none" }}
    />
  </label>
);

const normalizeArray = (value, fallback) => {
  if (Array.isArray(value) && value.length > 0) return value;
  return fallback;
};

const ContentManagementSection = () => {
  const { content, updateSection, uploadMedia, resolveMediaUrl } = useContent();

  const [heroDraft, setHeroDraft] = useSectionState(content.hero, defaultContent.hero);
  const [aboutDraft, setAboutDraft] = useSectionState(content.about, defaultContent.about);
  const [categoriesDraft, setCategoriesDraft] = useSectionState(
    content.categories,
    defaultContent.categories
  );
  const [whyDraft, setWhyDraft] = useSectionState(content.whyChoose, defaultContent.whyChoose);
  const [trendingDraft, setTrendingDraft] = useSectionState(
    content.trending,
    defaultContent.trending
  );
  const [testimonialsDraft, setTestimonialsDraft] = useSectionState(
    content.testimonials,
    defaultContent.testimonials
  );
  const [footerDraft, setFooterDraft] = useSectionState(content.footer, defaultContent.footer);
  const [contactDraft, setContactDraft] = useSectionState(content.contact, defaultContent.contact);

  const [savingSection, setSavingSection] = useState(null);

  const heroSlides = useMemo(
    () => normalizeArray(heroDraft.slides, defaultContent.hero.slides),
    [heroDraft.slides]
  );
  const aboutStats = useMemo(
    () => normalizeArray(aboutDraft.stats, defaultContent.about.stats),
    [aboutDraft.stats]
  );
  const categoriesItems = useMemo(
    () => normalizeArray(categoriesDraft.items, defaultContent.categories.items),
    [categoriesDraft.items]
  );
  const whyItems = useMemo(
    () => normalizeArray(whyDraft.items, defaultContent.whyChoose.items),
    [whyDraft.items]
  );
  const trendingItems = useMemo(
    () => normalizeArray(trendingDraft.items, defaultContent.trending.items),
    [trendingDraft.items]
  );
  const testimonialItems = useMemo(
    () => normalizeArray(testimonialsDraft.items, defaultContent.testimonials.items),
    [testimonialsDraft.items]
  );
  const socialItems = useMemo(
    () => normalizeArray(footerDraft.socials, defaultContent.footer.socials),
    [footerDraft.socials]
  );
  const quickLinks = useMemo(
    () => normalizeArray(footerDraft.quickLinks, defaultContent.footer.quickLinks),
    [footerDraft.quickLinks]
  );
  const customerLinks = useMemo(
    () => normalizeArray(footerDraft.customerLinks, defaultContent.footer.customerLinks),
    [footerDraft.customerLinks]
  );
  const benefits = useMemo(
    () => normalizeArray(footerDraft.newsletterBenefits, defaultContent.footer.newsletterBenefits),
    [footerDraft.newsletterBenefits]
  );
  const contactCards = useMemo(
    () => normalizeArray(contactDraft.infoCards, defaultContent.contact.infoCards),
    [contactDraft.infoCards]
  );

  const saveSection = async (key, payload) => {
    setSavingSection(key);
    try {
      await updateSection(key, payload);
    } finally {
      setSavingSection(null);
    }
  };

  const handleHeroUpload = async (index, file) => {
    const path = await uploadMedia(file);
    setHeroDraft((prev) => ({
      ...prev,
      slides: heroSlides.map((slide, idx) => (idx === index ? { ...slide, mediaUrl: path } : slide)),
    }));
  };

  const handleAboutUpload = async (file) => {
    const path = await uploadMedia(file);
    setAboutDraft((prev) => ({
      ...prev,
      media: {
        ...(prev.media || {}),
        type: file.type.startsWith("video/") ? "video" : "image",
        url: path,
      },
    }));
  };

  const handleCategoriesUpload = async (index, file) => {
    const path = await uploadMedia(file);
    setCategoriesDraft((prev) => ({
      ...prev,
      items: categoriesItems.map((item, idx) => (idx === index ? { ...item, imageUrl: path } : item)),
    }));
  };

  const handleWhyUpload = async (index, file) => {
    const path = await uploadMedia(file);
    setWhyDraft((prev) => ({
      ...prev,
      items: whyItems.map((item, idx) => (idx === index ? { ...item, iconUrl: path } : item)),
    }));
  };

  const handleTrendingUpload = async (index, file) => {
    const path = await uploadMedia(file);
    setTrendingDraft((prev) => ({
      ...prev,
      items: trendingItems.map((item, idx) => (idx === index ? { ...item, mediaUrl: path } : item)),
    }));
  };

  const handleTestimonialUpload = async (index, file) => {
    const path = await uploadMedia(file);
    setTestimonialsDraft((prev) => ({
      ...prev,
      items: testimonialItems.map((item, idx) => (idx === index ? { ...item, photoUrl: path } : item)),
    }));
  };

  const handleFooterLogoUpload = async (file) => {
    const path = await uploadMedia(file);
    setFooterDraft((prev) => ({ ...prev, logoUrl: path }));
  };

  const heroManagement = (
    <div style={{ 
      ...cardStyle, 
      border: "2px solid #f59e0b",
      boxShadow: "0 4px 16px rgba(245, 158, 11, 0.15)"
    }}>
      <div style={{ borderBottom: "2px solid #f1f5f9", paddingBottom: "16px" }}>
        <h3 style={sectionTitleStyle}>🎯 Hero Section</h3>
        <p style={sectionDescriptionStyle}>Manage your homepage carousel with compelling headlines, imagery, and call-to-action buttons</p>
      </div>
  
      <div className="container-fluid px-0">
        {heroSlides.map((slide, index) => (
          <SlideCard key={slide.id || index}>
            <div className="row align-items-center mb-2">
              <div className="col-6 col-md-8">
                <h4
                  style={{
                    margin: 0,
                    fontSize: "clamp(14px, 3vw, 17px)",
                    fontWeight: 700,
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      background: "linear-gradient(135deg, #f59e0b, #d97706)",
                      color: "white",
                      width: "clamp(24px, 5vw, 28px)",
                      height: "clamp(24px, 5vw, 28px)",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "clamp(11px, 2.5vw, 13px)",
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </span>
                  Slide {index + 1}
                </h4>
              </div>
              <div className="col-6 col-md-4 text-end">
                {heroSlides.length > 1 && (
                  <button
                    type="button"
                    style={{...dangerButtonStyle, maxWidth: "150px"}}
                    onClick={() =>
                      setHeroDraft((prev) => ({
                        ...prev,
                        slides: heroSlides.filter((_, idx) => idx !== index),
                      }))
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fed7d7";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff5f5";
                    }}
                  >
                    <Trash2 size={14} /> <span className="d-none d-sm-inline">Remove</span>
                  </button>
                )}
              </div>
            </div>
  
            {/* BOOTSTRAP RESPONSIVE GRID */}
            <div className="row g-3">
              {/* LEFT COLUMN - Text Fields */}
              <div className="col-12 col-md-6">
                <div className="mb-3">
                  <label style={labelStyle}>Headline</label>
                  <input
                    style={inputStyle}
                    value={slide.headline || ""}
                    onChange={(event) =>
                      setHeroDraft((prev) => ({
                        ...prev,
                        slides: heroSlides.map((item, idx) =>
                          idx === index ? { ...item, headline: event.target.value } : item
                        ),
                      }))
                    }
                    placeholder="Enter a powerful headline..."
                    onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                    onBlur={(e) => (e.target.style.borderColor = "orange")}
                  />
                </div>
  
                <div className="mb-3">
                  <label style={labelStyle}>Subheadline</label>
                  <input
                    style={inputStyle}
                    value={slide.subheadline || ""}
                    onChange={(event) =>
                      setHeroDraft((prev) => ({
                        ...prev,
                        slides: heroSlides.map((item, idx) =>
                          idx === index ? { ...item, subheadline: event.target.value } : item
                        ),
                      }))
                    }
                    placeholder="Add supporting text..."
                    onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                    onBlur={(e) => (e.target.style.borderColor = "orange")}
                  />
                </div>
  
                <div className="mb-3">
                  <label style={labelStyle}>Description</label>
                  <textarea
                    style={textareaStyle}
                    value={slide.description || ""}
                    onChange={(event) =>
                      setHeroDraft((prev) => ({
                        ...prev,
                        slides: heroSlides.map((item, idx) =>
                          idx === index ? { ...item, description: event.target.value } : item
                        ),
                      }))
                    }
                    placeholder="Describe what makes this slide special..."
                    onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                    onBlur={(e) => (e.target.style.borderColor = "orange")}
                  />
                </div>
  
                <div style={dividerStyle} />
  
                <div className="row g-2">
                  <div className="col-12 col-sm-6">
                    <label style={labelStyle}>Primary Button</label>
                    <input
                      style={inputStyle}
                      value={slide.primaryButton?.text || ""}
                      onChange={(event) =>
                        setHeroDraft((prev) => ({
                          ...prev,
                          slides: heroSlides.map((item, idx) =>
                            idx === index
                              ? {
                                  ...item,
                                  primaryButton: {
                                    ...(item.primaryButton || {}),
                                    text: event.target.value,
                                  },
                                }
                              : item
                          ),
                        }))
                      }
                      placeholder="Shop Now"
                      onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                      onBlur={(e) => (e.target.style.borderColor = "orange")}
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <label style={labelStyle}>Button Link</label>
                    <input
                      style={inputStyle}
                      value={slide.primaryButton?.link || ""}
                      onChange={(event) =>
                        setHeroDraft((prev) => ({
                          ...prev,
                          slides: heroSlides.map((item, idx) =>
                            idx === index
                              ? {
                                  ...item,
                                  primaryButton: {
                                    ...(item.primaryButton || {}),
                                    link: event.target.value,
                                  },
                                }
                              : item
                          ),
                        }))
                      }
                      placeholder="/collections"
                      onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                      onBlur={(e) => (e.target.style.borderColor = "orange")}
                    />
                  </div>
                </div>
  
                <div className="row g-2 mt-2">
                  <div className="col-12 col-sm-6">
                    <label style={labelStyle}>Secondary Button</label>
                    <input
                      style={inputStyle}
                      value={slide.secondaryButton?.text || ""}
                      onChange={(event) =>
                        setHeroDraft((prev) => ({
                          ...prev,
                          slides: heroSlides.map((item, idx) =>
                            idx === index
                              ? {
                                  ...item,
                                  secondaryButton: {
                                    ...(item.secondaryButton || {}),
                                    text: event.target.value,
                                  },
                                }
                              : item
                          ),
                        }))
                      }
                      placeholder="Learn More"
                      onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                      onBlur={(e) => (e.target.style.borderColor = "orange")}
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <label style={labelStyle}>Button Link</label>
                    <input
                      style={inputStyle}
                      value={slide.secondaryButton?.link || ""}
                      onChange={(event) =>
                        setHeroDraft((prev) => ({
                          ...prev,
                          slides: heroSlides.map((item, idx) =>
                            idx === index
                              ? {
                                  ...item,
                                  secondaryButton: {
                                    ...(item.secondaryButton || {}),
                                    link: event.target.value,
                                  },
                                }
                              : item
                          ),
                        }))
                      }
                      placeholder="/about"
                      onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                      onBlur={(e) => (e.target.style.borderColor = "orange")}
                    />
                  </div>
                </div>
              </div>
  
              {/* RIGHT COLUMN - Media Upload & Preview */}
              <div className="col-12 col-md-6">
                <div className="mb-3">
                  <label style={labelStyle}>Media Upload</label>
                  <input
                    style={{...inputStyle, marginBottom: "12px"}}
                    value={slide.mediaUrl || ""}
                    onChange={(event) =>
                      setHeroDraft((prev) => ({
                        ...prev,
                        slides: heroSlides.map((item, idx) =>
                          idx === index ? { ...item, mediaUrl: event.target.value } : item
                        ),
                      }))
                    }
                    placeholder="/uploads/content/hero-image.jpg"
                    onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                    onBlur={(e) => (e.target.style.borderColor = "orange")}
                  />
                  <MediaUploader label="Upload Image/Video" onUpload={(file) => handleHeroUpload(index, file)} />
                </div>
  
                {/* Image Preview */}
                {slide.mediaUrl ? (
                  <div
                    style={{
                      border: "2px solid #e8eaed",
                      borderRadius: "12px",
                      overflow: "hidden",
                      background: "#f8fafc",
                      padding: "8px",
                    }}
                  >
                    <img
                      src={resolveMediaUrl(slide.mediaUrl)}
                      alt={slide.headline}
                      style={{
                        width: "100%",
                        borderRadius: "8px",
                        objectFit: "cover",
                        display: "block",
                        minHeight: "150px",
                        maxHeight: "300px",
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      border: "2px dashed #cbd5e1",
                      borderRadius: "12px",
                      background: "#f8fafc",
                      padding: "clamp(24px, 5vw, 48px)",
                      textAlign: "center",
                      color: "#94a3b8",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "12px",
                      minHeight: "150px",
                      justifyContent: "center",
                    }}
                  >
                    <ImageIcon size={window.innerWidth < 400 ? 32 : 48} strokeWidth={1.5} />
                    <p style={{ margin: 0, fontSize: "clamp(12px, 2.5vw, 14px)" }}>No media uploaded</p>
                    <p style={{ margin: 0, fontSize: "clamp(10px, 2vw, 12px)" }}>Upload an image or video for this slide</p>
                  </div>
                )}
              </div>
            </div>
          </SlideCard>
        ))}
      </div>
  
      <button
        type="button"
        style={{...secondaryButtonStyle, maxWidth: "100%", marginTop: "12px"}}
        onClick={() =>
          setHeroDraft((prev) => ({
            ...prev,
            slides: [
              ...heroSlides,
              {
                id: `slide-${Date.now()}`,
                headline: "New Slide",
                subheadline: "",
                description: "",
                primaryButton: { text: "Shop Now", link: "/collections" },
                secondaryButton: { text: "Contact Us", link: "/contact" },
                mediaUrl: "",
                mediaType: "image",
              },
            ],
          }))
        }
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#f8fafc";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#ffffff";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <Plus size={18} /> Add New Slide
      </button>
  
      {/* Save Button */}
      <div className="row">
        <div className="col-12 d-flex justify-content-end pt-2">
          <button
            type="button"
            onClick={() => saveSection("hero", heroDraft)}
            disabled={savingSection === "hero"}
            style={{
              ...primaryButtonStyle,
              opacity: savingSection === "hero" ? 0.7 : 1,
              cursor: savingSection === "hero" ? "not-allowed" : "pointer",
              transform: savingSection === "hero" ? "scale(0.98)" : "scale(1)",
              maxWidth: "200px",
            }}
            onMouseEnter={(e) => {
              if (savingSection !== "hero") {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(245, 158, 11, 0.35)";
              }
            }}
            onMouseLeave={(e) => {
              if (savingSection !== "hero") {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(245, 158, 11, 0.25)";
              }
            }}
          >
            <Save size={18} />
            {savingSection === "hero" ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
  

// ========== ABOUT MANAGEMENT WITH BOOTSTRAP RESPONSIVE GRID ==========
const aboutManagement = (
  <div style={{ 
    ...cardStyle, 
    border: "2px solid #f59e0b",
    boxShadow: "0 4px 16px rgba(245, 158, 11, 0.15)"
  }}>
    <div style={{ borderBottom: "2px solid #f1f5f9", paddingBottom: "16px" }}>
      <h3 style={sectionTitleStyle}>📖 About Section</h3>
      <p style={sectionDescriptionStyle}>Control the about text, supporting copy, stats, and media</p>
    </div>

    {/* BOOTSTRAP RESPONSIVE GRID */}
    <div className="container-fluid px-0">
      <div className="row g-3 g-md-4">
        {/* LEFT COLUMN - Text Fields */}
        <div className="col-12 col-md-6">
          <div className="d-flex flex-column" style={{ gap: "clamp(12px, 2.5vw, 16px)" }}>
            <div>
              <label style={{
                ...labelStyle,
                border: "1px solid #f59e0b",
                padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                borderRadius: "6px",
                display: "inline-block",
                background: "#fffbeb",
              }}>
                Title
              </label>
              <input
                style={{
                  ...inputStyle,
                  marginTop: "8px",
                }}
                value={aboutDraft.title || ""}
                onChange={(event) => setAboutDraft((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Enter section title..."
                onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                onBlur={(e) => (e.target.style.borderColor = "orange")}
              />
            </div>

            <div>
              <label style={{
                ...labelStyle,
                border: "1px solid #f59e0b",
                padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                borderRadius: "6px",
                display: "inline-block",
                background: "#fffbeb",
              }}>
                Subtitle
              </label>
              <input
                style={{
                  ...inputStyle,
                  marginTop: "8px",
                }}
                value={aboutDraft.subtitle || ""}
                onChange={(event) =>
                  setAboutDraft((prev) => ({ ...prev, subtitle: event.target.value }))
                }
                placeholder="Enter subtitle..."
                onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                onBlur={(e) => (e.target.style.borderColor = "orange")}
              />
            </div>

            <div>
              <label style={{
                ...labelStyle,
                border: "1px solid #f59e0b",
                padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                borderRadius: "6px",
                display: "inline-block",
                background: "#fffbeb",
              }}>
                Description
              </label>
              <textarea
                style={{
                  ...textareaStyle,
                  marginTop: "8px",
                }}
                value={aboutDraft.description || ""}
                onChange={(event) =>
                  setAboutDraft((prev) => ({ ...prev, description: event.target.value }))
                }
                placeholder="Write a compelling description about your business..."
                onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                onBlur={(e) => (e.target.style.borderColor = "orange")}
              />
            </div>

            <div>
              <label style={{
                ...labelStyle,
                border: "1px solid #f59e0b",
                padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                borderRadius: "6px",
                display: "inline-block",
                background: "#fffbeb",
              }}>
                Paragraphs (one per line)
              </label>
              <textarea
                style={{
                  ...textareaStyle,
                  marginTop: "8px",
                }}
                value={(aboutDraft.richText || []).join("\n")}
                onChange={(event) =>
                  setAboutDraft((prev) => ({
                    ...prev,
                    richText: event.target.value.split("\n"),
                  }))
                }
                placeholder="Add detailed paragraphs here...&#10;Each line will be a new paragraph.&#10;You can add multiple lines."
                onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                onBlur={(e) => (e.target.style.borderColor = "orange")}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Media Upload & Preview */}
        <div className="col-12 col-md-6">
          <div className="d-flex flex-column" style={{ gap: "clamp(12px, 2.5vw, 16px)" }}>
            <div>
              <label style={{
                ...labelStyle,
                border: "1px solid #f59e0b",
                padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                borderRadius: "6px",
                display: "inline-block",
                background: "#fffbeb",
              }}>
                Media Upload
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
                <input
                  style={inputStyle}
                  value={aboutDraft.media?.url || ""}
                  onChange={(event) =>
                    setAboutDraft((prev) => ({
                      ...prev,
                      media: {
                        ...(prev.media || {}),
                        url: event.target.value,
                      },
                    }))
                  }
                  placeholder="Enter media URL..."
                  onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                  onBlur={(e) => (e.target.style.borderColor = "orange")}
                />
                
                <div className="row g-2">
                  <div className="col-6">
                    <select
                      style={inputStyle}
                      value={aboutDraft.media?.type || "video"}
                      onChange={(event) =>
                        setAboutDraft((prev) => ({
                          ...prev,
                          media: {
                            ...(prev.media || {}),
                            type: event.target.value,
                          },
                        }))
                      }
                      onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                      onBlur={(e) => (e.target.style.borderColor = "orange")}
                    >
                      <option value="video">Video</option>
                      <option value="image">Image</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <MediaUploader label="Upload" onUpload={handleAboutUpload} />
                  </div>
                </div>
              </div>
            </div>

            {/* Video/Image Preview */}
            {aboutDraft.media?.url ? (
              <div
                style={{
                  marginTop: "8px",
                  border: "2px solid #f59e0b",
                  borderRadius: "12px",
                  overflow: "hidden",
                  background: "#000",
                  padding: "8px",
                }}
              >
                {aboutDraft.media?.type === "video" ? (
                  <video
                    src={resolveMediaUrl(aboutDraft.media.url)}
                    controls
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      display: "block",
                      minHeight: "clamp(150px, 30vw, 200px)",
                      maxHeight: "400px",
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={resolveMediaUrl(aboutDraft.media.url)}
                    alt="About"
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      objectFit: "cover",
                      display: "block",
                      minHeight: "clamp(150px, 30vw, 200px)",
                      maxHeight: "400px",
                    }}
                  />
                )}
              </div>
            ) : (
              <div
                style={{
                  marginTop: "8px",
                  border: "2px dashed #f59e0b",
                  borderRadius: "12px",
                  background: "#fffbeb",
                  padding: "clamp(24px, 6vw, 48px) clamp(16px, 4vw, 24px)",
                  textAlign: "center",
                  color: "#d97706",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  minHeight: "clamp(150px, 30vw, 200px)",
                  justifyContent: "center",
                }}
              >
                <ImageIcon size={window.innerWidth < 400 ? 32 : 48} strokeWidth={1.5} />
                <p style={{ margin: 0, fontSize: "clamp(12px, 2.5vw, 14px)", fontWeight: 600 }}>No media uploaded</p>
                <p style={{ margin: 0, fontSize: "clamp(10px, 2vw, 12px)" }}>Upload a video or image</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    <div style={dividerStyle} />

    {/* Statistics Section */}
    <div className="container-fluid px-0">
      <label style={{
        ...labelStyle,
        border: "1px solid #f59e0b",
        padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
        borderRadius: "6px",
        display: "inline-block",
        background: "#fffbeb",
        marginBottom: "12px",
      }}>
        Statistics
      </label>
      <div style={{ display: "grid", gap: "12px" }}>
        {aboutStats.map((stat, index) => (
          <div
            key={stat.label || index}
            style={{
              background: "#fafbfc",
              padding: "clamp(10px, 2vw, 12px)",
              borderRadius: "10px",
              border: "1px solid #e8eaed",
            }}
          >
            <div className="row g-2 align-items-center">
              <div className="col-6 col-md-5">
                <input
                  style={inputStyle}
                  value={stat.value || ""}
                  onChange={(event) =>
                    setAboutDraft((prev) => ({
                      ...prev,
                      stats: aboutStats.map((item, idx) =>
                        idx === index ? { ...item, value: event.target.value } : item
                      ),
                    }))
                  }
                  placeholder="e.g., 500+"
                  onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                  onBlur={(e) => (e.target.style.borderColor = "orange")}
                />
              </div>
              <div className="col-6 col-md-5">
                <input
                  style={inputStyle}
                  value={stat.label || ""}
                  onChange={(event) =>
                    setAboutDraft((prev) => ({
                      ...prev,
                      stats: aboutStats.map((item, idx) =>
                        idx === index ? { ...item, label: event.target.value } : item
                      ),
                    }))
                  }
                  placeholder="e.g., Happy Customers"
                  onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                  onBlur={(e) => (e.target.style.borderColor = "orange")}
                />
              </div>
              {aboutStats.length > 1 && (
                <div className="col-12 col-md-2">
                  <button
                    type="button"
                    style={{...dangerButtonStyle, width: "100%"}}
                    onClick={() =>
                      setAboutDraft((prev) => ({
                        ...prev,
                        stats: aboutStats.filter((_, idx) => idx !== index),
                      }))
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fed7d7";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff5f5";
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        style={{
          ...secondaryButtonStyle,
          marginTop: "12px",
        }}
        onClick={() =>
          setAboutDraft((prev) => ({
            ...prev,
            stats: [...aboutStats, { value: "New", label: "Metric" }],
          }))
        }
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#f8fafc";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#ffffff";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <Plus size={16} /> Add Stat
      </button>
    </div>

    {/* Save Button */}
    <div className="row">
      <div className="col-12 d-flex justify-content-end pt-2">
        <button
          type="button"
          onClick={() =>
            saveSection("about", {
              ...aboutDraft,
              richText: Array.isArray(aboutDraft.richText)
                ? aboutDraft.richText
                : (aboutDraft.richText || "").split("\n"),
            })
          }
          disabled={savingSection === "about"}
          style={{
            ...primaryButtonStyle,
            opacity: savingSection === "about" ? 0.7 : 1,
            cursor: savingSection === "about" ? "not-allowed" : "pointer",
            transform: savingSection === "about" ? "scale(0.98)" : "scale(1)",
            maxWidth: "200px",
          }}
          onMouseEnter={(e) => {
            if (savingSection !== "about") {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(245, 158, 11, 0.35)";
            }
          }}
          onMouseLeave={(e) => {
            if (savingSection !== "about") {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(245, 158, 11, 0.25)";
            }
          }}
        >
          <Save size={18} />
          {savingSection === "about" ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  </div>
);

// ========== CATEGORIES MANAGEMENT WITH BOOTSTRAP RESPONSIVE GRID ==========
const categoriesManagement = (
  <div style={{ 
    ...cardStyle, 
    border: "2px solid #f59e0b",
    boxShadow: "0 4px 16px rgba(245, 158, 11, 0.15)"
  }}>
    <div style={{ borderBottom: "2px solid #f1f5f9", paddingBottom: "16px" }}>
      <h3 style={sectionTitleStyle}>🏷️ Category Showcase</h3>
      <p style={sectionDescriptionStyle}>Update featured category cards</p>
    </div>

    <div className="container-fluid px-0">
      <div style={{ display: "grid", gap: "clamp(16px, 3vw, 20px)" }}>
        {categoriesItems.map((item, index) => (
          <div 
            key={item.id || index}
            style={{
              border: "1.5px solid #e8eaed",
              borderRadius: "14px",
              padding: "clamp(14px, 3vw, 20px)",
              background: "#fafbfc",
              transition: "all 0.2s ease",
            }}
          >
            {/* Header Row */}
            <div className="row align-items-center mb-3">
              <div className="col-6 col-md-8">
                <h4
                  style={{
                    margin: 0,
                    fontSize: "clamp(14px, 3vw, 17px)",
                    fontWeight: 700,
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      background: "linear-gradient(135deg, #f59e0b, #d97706)",
                      color: "white",
                      width: "clamp(24px, 5vw, 28px)",
                      height: "clamp(24px, 5vw, 28px)",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "clamp(11px, 2.5vw, 13px)",
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </span>
                  <span className="d-none d-sm-inline">Category {index + 1}</span>
                  <span className="d-inline d-sm-none">Cat {index + 1}</span>
                </h4>
              </div>
              <div className="col-6 col-md-4 text-end">
                {categoriesItems.length > 1 && (
                  <button
                    type="button"
                    style={{...dangerButtonStyle, maxWidth: "150px"}}
                    onClick={() =>
                      setCategoriesDraft((prev) => ({
                        ...prev,
                        items: categoriesItems.filter((_, idx) => idx !== index),
                      }))
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fed7d7";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff5f5";
                    }}
                  >
                    <Trash2 size={14} /> <span className="d-none d-sm-inline">Remove</span>
                  </button>
                )}
              </div>
            </div>

            {/* BOOTSTRAP RESPONSIVE GRID */}
            <div className="row g-3 g-md-4">
              {/* LEFT COLUMN - Text Fields */}
              <div className="col-12 col-md-6">
                <div className="d-flex flex-column" style={{ gap: "clamp(12px, 2.5vw, 16px)" }}>
                  <div>
                    <label style={{
                      ...labelStyle,
                      border: "1px solid #f59e0b",
                      padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                      borderRadius: "6px",
                      display: "inline-block",
                      background: "#fffbeb",
                    }}>
                      Category Name
                    </label>
                    <input
                      style={{
                        ...inputStyle,
                        marginTop: "8px",
                      }}
                      value={item.name || ""}
                      onChange={(event) =>
                        setCategoriesDraft((prev) => ({
                          ...prev,
                          items: categoriesItems.map((category, idx) =>
                            idx === index ? { ...category, name: event.target.value } : category
                          ),
                        }))
                      }
                      placeholder="e.g., Rings, Necklaces, Bracelets..."
                      onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                      onBlur={(e) => (e.target.style.borderColor = "orange")}
                    />
                  </div>

                  <div>
                    <label style={{
                      ...labelStyle,
                      border: "1px solid #f59e0b",
                      padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                      borderRadius: "6px",
                      display: "inline-block",
                      background: "#fffbeb",
                    }}>
                      Description
                    </label>
                    <input
                      style={{
                        ...inputStyle,
                        marginTop: "8px",
                      }}
                      value={item.description || ""}
                      onChange={(event) =>
                        setCategoriesDraft((prev) => ({
                          ...prev,
                          items: categoriesItems.map((category, idx) =>
                            idx === index ? { ...category, description: event.target.value } : category
                          ),
                        }))
                      }
                      placeholder="Short description of this category..."
                      onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                      onBlur={(e) => (e.target.style.borderColor = "orange")}
                    />
                  </div>

                  <div>
                    <label style={{
                      ...labelStyle,
                      border: "1px solid #f59e0b",
                      padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                      borderRadius: "6px",
                      display: "inline-block",
                      background: "#fffbeb",
                    }}>
                      Link URL
                    </label>
                    <input
                      style={{
                        ...inputStyle,
                        marginTop: "8px",
                      }}
                      value={item.link || ""}
                      onChange={(event) =>
                        setCategoriesDraft((prev) => ({
                          ...prev,
                          items: categoriesItems.map((category, idx) =>
                            idx === index ? { ...category, link: event.target.value } : category
                          ),
                        }))
                      }
                      placeholder="/collections?category=rings"
                      onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                      onBlur={(e) => (e.target.style.borderColor = "orange")}
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN - Image Upload & Preview */}
              <div className="col-12 col-md-6">
                <div className="d-flex flex-column" style={{ gap: "clamp(12px, 2.5vw, 16px)" }}>
                  <div>
                    <label style={{
                      ...labelStyle,
                      border: "1px solid #f59e0b",
                      padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                      borderRadius: "6px",
                      display: "inline-block",
                      background: "#fffbeb",
                    }}>
                      Category Image
                    </label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
                      <input
                        style={inputStyle}
                        value={item.imageUrl || ""}
                        onChange={(event) =>
                          setCategoriesDraft((prev) => ({
                            ...prev,
                            items: categoriesItems.map((category, idx) =>
                              idx === index ? { ...category, imageUrl: event.target.value } : category
                            ),
                          }))
                        }
                        placeholder="Enter image URL..."
                        onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                        onBlur={(e) => (e.target.style.borderColor = "orange")}
                      />
                      <MediaUploader label="Upload Image" onUpload={(file) => handleCategoriesUpload(index, file)} />
                    </div>
                  </div>

                  {/* Image Preview */}
                  {item.imageUrl ? (
                    <div
                      style={{
                        marginTop: "8px",
                        border: "2px solid #f59e0b",
                        borderRadius: "12px",
                        overflow: "hidden",
                        background: "#f8fafc",
                        padding: "8px",
                      }}
                    >
                      <img
                        src={resolveMediaUrl(item.imageUrl)}
                        alt={item.name}
                        style={{
                          width: "100%",
                          borderRadius: "8px",
                          objectFit: "cover",
                          display: "block",
                          minHeight: "clamp(150px, 30vw, 180px)",
                          maxHeight: "300px",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        marginTop: "8px",
                        border: "2px dashed #f59e0b",
                        borderRadius: "12px",
                        background: "#fffbeb",
                        padding: "clamp(24px, 6vw, 48px) clamp(16px, 4vw, 24px)",
                        textAlign: "center",
                        color: "#d97706",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "12px",
                        minHeight: "clamp(150px, 30vw, 180px)",
                        justifyContent: "center",
                      }}
                    >
                      <ImageIcon size={window.innerWidth < 400 ? 32 : 48} strokeWidth={1.5} />
                      <p style={{ margin: 0, fontSize: "clamp(12px, 2.5vw, 14px)", fontWeight: 600 }}>No image uploaded</p>
                      <p style={{ margin: 0, fontSize: "clamp(10px, 2vw, 12px)" }}>Upload a category image</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <button
      type="button"
      style={{
        ...secondaryButtonStyle,
        marginTop: "12px",
      }}
      onClick={() =>
        setCategoriesDraft((prev) => ({
          ...prev,
          items: [
            ...categoriesItems,
            {
              id: `category-${Date.now()}`,
              name: "New Category",
              description: "",
              link: "/collections",
              imageUrl: "",
            },
          ],
        }))
      }
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#f8fafc";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#ffffff";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <Plus size={18} /> Add New Category
    </button>

    {/* Save Button */}
    <div className="row">
      <div className="col-12 d-flex justify-content-end pt-2">
        <button
          type="button"
          onClick={() => saveSection("categories", categoriesDraft)}
          disabled={savingSection === "categories"}
          style={{
            ...primaryButtonStyle,
            opacity: savingSection === "categories" ? 0.7 : 1,
            cursor: savingSection === "categories" ? "not-allowed" : "pointer",
            transform: savingSection === "categories" ? "scale(0.98)" : "scale(1)",
            maxWidth: "200px",
          }}
          onMouseEnter={(e) => {
            if (savingSection !== "categories") {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(245, 158, 11, 0.35)";
            }
          }}
          onMouseLeave={(e) => {
            if (savingSection !== "categories") {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(245, 158, 11, 0.25)";
            }
          }}
        >
          <Save size={18} />
          {savingSection === "categories" ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  </div>
);

// ========== WHY CHOOSE MANAGEMENT WITH BOOTSTRAP RESPONSIVE GRID ==========
const whyManagement = (
  <div style={{ 
    ...cardStyle, 
    border: "2px solid #f59e0b",
    boxShadow: "0 4px 16px rgba(245, 158, 11, 0.15)"
  }}>
    <div style={{ borderBottom: "2px solid #f1f5f9", paddingBottom: "16px" }}>
      <h3 style={sectionTitleStyle}>⭐ Why Choose Section</h3>
      <p style={sectionDescriptionStyle}>Highlight the brand's unique selling points</p>
    </div>

    {/* SECTION TITLE & SUBTITLE */}
    <div className="container-fluid px-0">
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label style={{
            ...labelStyle,
            border: "1px solid #f59e0b",
            padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
            borderRadius: "6px",
            display: "inline-block",
            background: "#fffbeb",
          }}>
            Section Title
          </label>
          <input
            style={{
              ...inputStyle,
              marginTop: "8px",
              border: "2px solid #f59e0b",
            }}
            value={whyDraft.title || ""}
            onChange={(event) => setWhyDraft((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="e.g., Why Choose Us..."
            onFocus={(e) => {
              e.target.style.borderColor = "#d97706";
              e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#f59e0b";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <div className="col-12 col-md-6">
          <label style={{
            ...labelStyle,
            border: "1px solid #f59e0b",
            padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
            borderRadius: "6px",
            display: "inline-block",
            background: "#fffbeb",
          }}>
            Section Subtitle
          </label>
          <input
            style={{
              ...inputStyle,
              marginTop: "8px",
              border: "2px solid #f59e0b",
            }}
            value={whyDraft.subtitle || ""}
            onChange={(event) => setWhyDraft((prev) => ({ ...prev, subtitle: event.target.value }))}
            placeholder="Add supporting subtitle..."
            onFocus={(e) => {
              e.target.style.borderColor = "#d97706";
              e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#f59e0b";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      </div>
    </div>

    <div style={dividerStyle} />

    {/* HIGHLIGHTS ITEMS */}
    <div className="container-fluid px-0">
      <div style={{ display: "grid", gap: "clamp(16px, 3vw, 20px)" }}>
        {whyItems.map((item, index) => (
          <div 
            key={item.title || index}
            style={{
              border: "1.5px solid #e8eaed",
              borderRadius: "14px",
              padding: "clamp(14px, 3vw, 20px)",
              background: "#fafbfc",
              transition: "all 0.2s ease",
            }}
          >
            {/* Header Row */}
            <div className="row align-items-center mb-3">
              <div className="col-6 col-md-8">
                <h4
                  style={{
                    margin: 0,
                    fontSize: "clamp(14px, 3vw, 17px)",
                    fontWeight: 700,
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      background: "linear-gradient(135deg, #f59e0b, #d97706)",
                      color: "white",
                      width: "clamp(24px, 5vw, 28px)",
                      height: "clamp(24px, 5vw, 28px)",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "clamp(11px, 2.5vw, 13px)",
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </span>
                  <span className="d-none d-sm-inline">Highlight {index + 1}</span>
                  <span className="d-inline d-sm-none">#{index + 1}</span>
                </h4>
              </div>
              <div className="col-6 col-md-4 text-end">
                {whyItems.length > 1 && (
                  <button
                    type="button"
                    style={{...dangerButtonStyle, maxWidth: "150px"}}
                    onClick={() =>
                      setWhyDraft((prev) => ({
                        ...prev,
                        items: whyItems.filter((_, idx) => idx !== index),
                      }))
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fed7d7";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff5f5";
                    }}
                  >
                    <Trash2 size={14} /> <span className="d-none d-sm-inline">Remove</span>
                  </button>
                )}
              </div>
            </div>

            {/* BOOTSTRAP RESPONSIVE GRID */}
            <div className="row g-3 g-md-4">
              {/* LEFT COLUMN - Text Fields */}
              <div className="col-12 col-md-6">
                <div className="d-flex flex-column" style={{ gap: "clamp(12px, 2.5vw, 16px)" }}>
                  <div>
                    <label style={{
                      ...labelStyle,
                      border: "1px solid #f59e0b",
                      padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                      borderRadius: "6px",
                      display: "inline-block",
                      background: "#fffbeb",
                    }}>
                      Feature Title
                    </label>
                    <input
                      style={{
                        ...inputStyle,
                        marginTop: "8px",
                        border: "2px solid #f59e0b",
                      }}
                      value={item.title || ""}
                      onChange={(event) =>
                        setWhyDraft((prev) => ({
                          ...prev,
                          items: whyItems.map((feature, idx) =>
                            idx === index ? { ...feature, title: event.target.value } : feature
                          ),
                        }))
                      }
                      placeholder="e.g., Premium Quality..."
                      onFocus={(e) => {
                        e.target.style.borderColor = "#d97706";
                        e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#f59e0b";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      ...labelStyle,
                      border: "1px solid #f59e0b",
                      padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                      borderRadius: "6px",
                      display: "inline-block",
                      background: "#fffbeb",
                    }}>
                      Description
                    </label>
                    <textarea
                      style={{
                        ...textareaStyle,
                        marginTop: "8px",
                        border: "2px solid #f59e0b",
                      }}
                      value={item.description || ""}
                      onChange={(event) =>
                        setWhyDraft((prev) => ({
                          ...prev,
                          items: whyItems.map((feature, idx) =>
                            idx === index ? { ...feature, description: event.target.value } : feature
                          ),
                        }))
                      }
                      placeholder="Explain this feature in detail..."
                      onFocus={(e) => {
                        e.target.style.borderColor = "#d97706";
                        e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#f59e0b";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      ...labelStyle,
                      border: "1px solid #f59e0b",
                      padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                      borderRadius: "6px",
                      display: "inline-block",
                      background: "#fffbeb",
                    }}>
                      Icon Keyword
                    </label>
                    <input
                      style={{
                        ...inputStyle,
                        marginTop: "8px",
                        border: "2px solid #f59e0b",
                      }}
                      value={item.icon || ""}
                      onChange={(event) =>
                        setWhyDraft((prev) => ({
                          ...prev,
                          items: whyItems.map((feature, idx) =>
                            idx === index ? { ...feature, icon: event.target.value } : feature
                          ),
                        }))
                      }
                      placeholder="e.g., award, star, shield..."
                      onFocus={(e) => {
                        e.target.style.borderColor = "#d97706";
                        e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#f59e0b";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN - Icon Upload & Preview */}
              <div className="col-12 col-md-6">
                <div className="d-flex flex-column" style={{ gap: "clamp(12px, 2.5vw, 16px)" }}>
                  <div>
                    <label style={{
                      ...labelStyle,
                      border: "1px solid #f59e0b",
                      padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                      borderRadius: "6px",
                      display: "inline-block",
                      background: "#fffbeb",
                    }}>
                      Icon Upload
                    </label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
                      <input
                        style={{
                          ...inputStyle,
                          border: "2px solid #f59e0b",
                        }}
                        value={item.iconUrl || ""}
                        onChange={(event) =>
                          setWhyDraft((prev) => ({
                            ...prev,
                            items: whyItems.map((feature, idx) =>
                              idx === index ? { ...feature, iconUrl: event.target.value } : feature
                            ),
                          }))
                        }
                        placeholder="Enter icon URL..."
                        onFocus={(e) => {
                          e.target.style.borderColor = "#d97706";
                          e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#f59e0b";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                      <MediaUploader label="Upload Icon" accept="image/*" onUpload={(file) => handleWhyUpload(index, file)} />
                    </div>
                  </div>

                  {/* Icon Preview */}
                  {item.iconUrl ? (
                    <div
                      style={{
                        marginTop: "8px",
                        border: "2px solid #f59e0b",
                        borderRadius: "12px",
                        overflow: "hidden",
                        background: "#fffbeb",
                        padding: "clamp(20px, 5vw, 32px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={resolveMediaUrl(item.iconUrl)}
                        alt={item.title}
                        style={{
                          width: "clamp(60px, 15vw, 80px)",
                          height: "clamp(60px, 15vw, 80px)",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        marginTop: "8px",
                        border: "2px dashed #f59e0b",
                        borderRadius: "12px",
                        background: "#fffbeb",
                        padding: "clamp(24px, 6vw, 48px) clamp(16px, 4vw, 24px)",
                        textAlign: "center",
                        color: "#d97706",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "12px",
                        minHeight: "clamp(140px, 30vw, 160px)",
                        justifyContent: "center",
                      }}
                    >
                      <ImageIcon size={window.innerWidth < 400 ? 32 : 48} strokeWidth={1.5} />
                      <p style={{ margin: 0, fontSize: "clamp(12px, 2.5vw, 14px)", fontWeight: 600 }}>No icon uploaded</p>
                      <p style={{ margin: 0, fontSize: "clamp(10px, 2vw, 12px)" }}>Upload an icon image</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <button
      type="button"
      style={{
        ...secondaryButtonStyle,
        marginTop: "12px",
      }}
      onClick={() =>
        setWhyDraft((prev) => ({
          ...prev,
          items: [
            ...whyItems,
            { title: "New Highlight", description: "", icon: "award", iconUrl: "" },
          ],
        }))
      }
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#f8fafc";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#ffffff";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <Plus size={18} /> Add New Highlight
    </button>

    {/* Save Button */}
    <div className="row">
      <div className="col-12 d-flex justify-content-end pt-2">
        <button
          type="button"
          onClick={() => saveSection("whyChoose", whyDraft)}
          disabled={savingSection === "whyChoose"}
          style={{
            ...primaryButtonStyle,
            opacity: savingSection === "whyChoose" ? 0.7 : 1,
            cursor: savingSection === "whyChoose" ? "not-allowed" : "pointer",
            transform: savingSection === "whyChoose" ? "scale(0.98)" : "scale(1)",
            maxWidth: "200px",
          }}
          onMouseEnter={(e) => {
            if (savingSection !== "whyChoose") {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(245, 158, 11, 0.35)";
            }
          }}
          onMouseLeave={(e) => {
            if (savingSection !== "whyChoose") {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(245, 158, 11, 0.25)";
            }
          }}
        >
          <Save size={18} />
          {savingSection === "whyChoose" ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  </div>
);

// ========== TRENDING MANAGEMENT WITH BOOTSTRAP RESPONSIVE GRID ==========
const trendingManagement = (
  <div style={{ 
    ...cardStyle, 
    border: "2px solid #f59e0b",
    boxShadow: "0 4px 16px rgba(245, 158, 11, 0.15)"
  }}>
    <div style={{ borderBottom: "2px solid #f1f5f9", paddingBottom: "16px" }}>
      <h3 style={sectionTitleStyle}>🔥 Trending Section</h3>
      <p style={sectionDescriptionStyle}>Curate products or stories to highlight</p>
    </div>

    {/* SECTION TITLE & SUBTITLE */}
    <div className="container-fluid px-0">
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label style={{
            ...labelStyle,
            border: "1px solid #f59e0b",
            padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
            borderRadius: "6px",
            display: "inline-block",
            background: "#fffbeb",
          }}>
            Section Title
          </label>
          <input
            style={{
              ...inputStyle,
              marginTop: "8px",
              border: "2px solid #f59e0b",
            }}
            value={trendingDraft.title || ""}
            onChange={(event) => setTrendingDraft((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="e.g., Trending Now..."
            onFocus={(e) => {
              e.target.style.borderColor = "#d97706";
              e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#f59e0b";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <div className="col-12 col-md-6">
          <label style={{
            ...labelStyle,
            border: "1px solid #f59e0b",
            padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
            borderRadius: "6px",
            display: "inline-block",
            background: "#fffbeb",
          }}>
            Section Subtitle
          </label>
          <textarea
            style={{
              ...textareaStyle,
              marginTop: "8px",
              border: "2px solid #f59e0b",
            }}
            value={trendingDraft.subtitle || ""}
            onChange={(event) => setTrendingDraft((prev) => ({ ...prev, subtitle: event.target.value }))}
            placeholder="Add supporting subtitle..."
            onFocus={(e) => {
              e.target.style.borderColor = "#d97706";
              e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#f59e0b";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      </div>
    </div>

    <div style={dividerStyle} />

    {/* TRENDING ITEMS */}
    <div className="container-fluid px-0">
      <div style={{ display: "grid", gap: "clamp(16px, 3vw, 20px)" }}>
        {trendingItems.map((item, index) => (
          <div 
            key={item.id || index}
            style={{
              border: "1.5px solid #e8eaed",
              borderRadius: "14px",
              padding: "clamp(14px, 3vw, 20px)",
              background: "#fafbfc",
              transition: "all 0.2s ease",
            }}
          >
            {/* Header Row */}
            <div className="row align-items-center mb-3">
              <div className="col-6 col-md-8">
                <h4
                  style={{
                    margin: 0,
                    fontSize: "clamp(14px, 3vw, 17px)",
                    fontWeight: 700,
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      background: "linear-gradient(135deg, #f59e0b, #d97706)",
                      color: "white",
                      width: "clamp(24px, 5vw, 28px)",
                      height: "clamp(24px, 5vw, 28px)",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "clamp(11px, 2.5vw, 13px)",
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </span>
                  <span className="d-none d-sm-inline">Trending Item {index + 1}</span>
                  <span className="d-inline d-sm-none">Item {index + 1}</span>
                </h4>
              </div>
              <div className="col-6 col-md-4 text-end">
                {trendingItems.length > 1 && (
                  <button
                    type="button"
                    style={{...dangerButtonStyle, maxWidth: "150px"}}
                    onClick={() =>
                      setTrendingDraft((prev) => ({
                        ...prev,
                        items: trendingItems.filter((_, idx) => idx !== index),
                      }))
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fed7d7";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff5f5";
                    }}
                  >
                    <Trash2 size={14} /> <span className="d-none d-sm-inline">Remove</span>
                  </button>
                )}
              </div>
            </div>

            {/* BOOTSTRAP RESPONSIVE GRID */}
            <div className="row g-3 g-md-4">
              {/* LEFT COLUMN - Text Fields */}
              <div className="col-12 col-md-6">
                <div className="d-flex flex-column" style={{ gap: "clamp(12px, 2.5vw, 16px)" }}>
                  <div>
                    <label style={{
                      ...labelStyle,
                      border: "1px solid #f59e0b",
                      padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                      borderRadius: "6px",
                      display: "inline-block",
                      background: "#fffbeb",
                    }}>
                      Item Title
                    </label>
                    <input
                      style={{
                        ...inputStyle,
                        marginTop: "8px",
                        border: "2px solid #f59e0b",
                      }}
                      value={item.title || ""}
                      onChange={(event) =>
                        setTrendingDraft((prev) => ({
                          ...prev,
                          items: trendingItems.map((trend, idx) =>
                            idx === index ? { ...trend, title: event.target.value } : trend
                          ),
                        }))
                      }
                      placeholder="e.g., Best Seller Ring..."
                      onFocus={(e) => {
                        e.target.style.borderColor = "#d97706";
                        e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#f59e0b";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      ...labelStyle,
                      border: "1px solid #f59e0b",
                      padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                      borderRadius: "6px",
                      display: "inline-block",
                      background: "#fffbeb",
                    }}>
                      Description
                    </label>
                    <textarea
                      style={{
                        ...textareaStyle,
                        marginTop: "8px",
                        border: "2px solid #f59e0b",
                      }}
                      value={item.description || ""}
                      onChange={(event) =>
                        setTrendingDraft((prev) => ({
                          ...prev,
                          items: trendingItems.map((trend, idx) =>
                            idx === index ? { ...trend, description: event.target.value } : trend
                          ),
                        }))
                      }
                      placeholder="Describe what makes this item trending..."
                      onFocus={(e) => {
                        e.target.style.borderColor = "#d97706";
                        e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#f59e0b";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      ...labelStyle,
                      border: "1px solid #f59e0b",
                      padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                      borderRadius: "6px",
                      display: "inline-block",
                      background: "#fffbeb",
                    }}>
                      Badge / Meta
                    </label>
                    <input
                      style={{
                        ...inputStyle,
                        marginTop: "8px",
                        border: "2px solid #f59e0b",
                      }}
                      value={item.badge || ""}
                      onChange={(event) =>
                        setTrendingDraft((prev) => ({
                          ...prev,
                          items: trendingItems.map((trend, idx) =>
                            idx === index ? { ...trend, badge: event.target.value } : trend
                          ),
                        }))
                      }
                      placeholder="e.g., 🔥 50+ Sales, New Arrival..."
                      onFocus={(e) => {
                        e.target.style.borderColor = "#d97706";
                        e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#f59e0b";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      ...labelStyle,
                      border: "1px solid #f59e0b",
                      padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                      borderRadius: "6px",
                      display: "inline-block",
                      background: "#fffbeb",
                    }}>
                      Link URL
                    </label>
                    <input
                      style={{
                        ...inputStyle,
                        marginTop: "8px",
                        border: "2px solid #f59e0b",
                      }}
                      value={item.link || ""}
                      onChange={(event) =>
                        setTrendingDraft((prev) => ({
                          ...prev,
                          items: trendingItems.map((trend, idx) =>
                            idx === index ? { ...trend, link: event.target.value } : trend
                          ),
                        }))
                      }
                      placeholder="/collections/trending-item"
                      onFocus={(e) => {
                        e.target.style.borderColor = "#d97706";
                        e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#f59e0b";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN - Media Upload & Preview */}
              <div className="col-12 col-md-6">
                <div className="d-flex flex-column" style={{ gap: "clamp(12px, 2.5vw, 16px)" }}>
                  <div>
                    <label style={{
                      ...labelStyle,
                      border: "1px solid #f59e0b",
                      padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                      borderRadius: "6px",
                      display: "inline-block",
                      background: "#fffbeb",
                    }}>
                      Media Upload
                    </label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
                      <input
                        style={{
                          ...inputStyle,
                          border: "2px solid #f59e0b",
                        }}
                        value={item.mediaUrl || ""}
                        onChange={(event) =>
                          setTrendingDraft((prev) => ({
                            ...prev,
                            items: trendingItems.map((trend, idx) =>
                              idx === index ? { ...trend, mediaUrl: event.target.value } : trend
                            ),
                          }))
                        }
                        placeholder="Enter media URL..."
                        onFocus={(e) => {
                          e.target.style.borderColor = "#d97706";
                          e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#f59e0b";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                      <MediaUploader label="Upload Image/Video" onUpload={(file) => handleTrendingUpload(index, file)} />
                    </div>
                  </div>

                  {/* Media Preview */}
                  {item.mediaUrl ? (
                    <div
                      style={{
                        marginTop: "8px",
                        border: "2px solid #f59e0b",
                        borderRadius: "12px",
                        overflow: "hidden",
                        background: "#f8fafc",
                        padding: "8px",
                      }}
                    >
                      <img
                        src={resolveMediaUrl(item.mediaUrl)}
                        alt={item.title}
                        style={{
                          width: "100%",
                          borderRadius: "8px",
                          objectFit: "cover",
                          display: "block",
                          minHeight: "clamp(150px, 35vw, 200px)",
                          maxHeight: "350px",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        marginTop: "8px",
                        border: "2px dashed #f59e0b",
                        borderRadius: "12px",
                        background: "#fffbeb",
                        padding: "clamp(24px, 6vw, 48px) clamp(16px, 4vw, 24px)",
                        textAlign: "center",
                        color: "#d97706",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "12px",
                        minHeight: "clamp(150px, 35vw, 200px)",
                        justifyContent: "center",
                      }}
                    >
                      <ImageIcon size={window.innerWidth < 400 ? 32 : 48} strokeWidth={1.5} />
                      <p style={{ margin: 0, fontSize: "clamp(12px, 2.5vw, 14px)", fontWeight: 600 }}>No media uploaded</p>
                      <p style={{ margin: 0, fontSize: "clamp(10px, 2vw, 12px)" }}>Upload an image or video</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <button
      type="button"
      style={{
        ...secondaryButtonStyle,
        marginTop: "12px",
      }}
      onClick={() =>
        setTrendingDraft((prev) => ({
          ...prev,
          items: [
            ...trendingItems,
            {
              id: `trend-${Date.now()}`,
              title: "New Trend",
              description: "",
              mediaUrl: "",
              badge: "",
              link: "/collections",
            },
          ],
        }))
      }
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#f8fafc";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#ffffff";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <Plus size={18} /> Add Trending Item
    </button>

    {/* Save Button */}
    <div className="row">
      <div className="col-12 d-flex justify-content-end pt-2">
        <button
          type="button"
          onClick={() => saveSection("trending", trendingDraft)}
          disabled={savingSection === "trending"}
          style={{
            ...primaryButtonStyle,
            opacity: savingSection === "trending" ? 0.7 : 1,
            cursor: savingSection === "trending" ? "not-allowed" : "pointer",
            transform: savingSection === "trending" ? "scale(0.98)" : "scale(1)",
            maxWidth: "200px",
          }}
          onMouseEnter={(e) => {
            if (savingSection !== "trending") {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(245, 158, 11, 0.35)";
            }
          }}
          onMouseLeave={(e) => {
            if (savingSection !== "trending") {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(245, 158, 11, 0.25)";
            }
          }}
        >
          <Save size={18} />
          {savingSection === "trending" ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  </div>
);


// ========== TESTIMONIALS MANAGEMENT WITH BOOTSTRAP RESPONSIVE GRID ==========
const testimonialsManagement = (
  <div style={{ 
    ...cardStyle, 
    border: "2px solid #f59e0b",
    boxShadow: "0 4px 16px rgba(245, 158, 11, 0.15)"
  }}>
    <div style={{ borderBottom: "2px solid #f1f5f9", paddingBottom: "16px" }}>
      <h3 style={sectionTitleStyle}>💬 Testimonials</h3>
      <p style={sectionDescriptionStyle}>Update customer stories and quotes</p>
    </div>

    {/* SECTION TITLE & SUBTITLE */}
    <div className="container-fluid px-0">
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label style={{
            ...labelStyle,
            border: "1px solid #f59e0b",
            padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
            borderRadius: "6px",
            display: "inline-block",
            background: "#fffbeb",
          }}>
            Section Title
          </label>
          <input
            style={{
              ...inputStyle,
              marginTop: "8px",
              border: "2px solid #f59e0b",
            }}
            value={testimonialsDraft.title || ""}
            onChange={(event) =>
              setTestimonialsDraft((prev) => ({ ...prev, title: event.target.value }))
            }
            placeholder="e.g., What Our Customers Say..."
            onFocus={(e) => {
              e.target.style.borderColor = "#d97706";
              e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#f59e0b";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <div className="col-12 col-md-6">
          <label style={{
            ...labelStyle,
            border: "1px solid #f59e0b",
            padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
            borderRadius: "6px",
            display: "inline-block",
            background: "#fffbeb",
          }}>
            Section Subtitle
          </label>
          <textarea
            style={{
              ...textareaStyle,
              marginTop: "8px",
              border: "2px solid #f59e0b",
            }}
            value={testimonialsDraft.subtitle || ""}
            onChange={(event) =>
              setTestimonialsDraft((prev) => ({ ...prev, subtitle: event.target.value }))
            }
            placeholder="Add supporting subtitle..."
            onFocus={(e) => {
              e.target.style.borderColor = "#d97706";
              e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#f59e0b";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      </div>
    </div>

    <div style={dividerStyle} />

    {/* TESTIMONIAL ITEMS */}
    <div className="container-fluid px-0">
      <div style={{ display: "grid", gap: "clamp(16px, 3vw, 20px)" }}>
        {testimonialItems.map((item, index) => (
          <div 
            key={item.id || index}
            style={{
              border: "1.5px solid #e8eaed",
              borderRadius: "14px",
              padding: "clamp(14px, 3vw, 20px)",
              background: "#fafbfc",
              transition: "all 0.2s ease",
            }}
          >
            {/* Header Row */}
            <div className="row align-items-center mb-3">
              <div className="col-6 col-md-8">
                <h4
                  style={{
                    margin: 0,
                    fontSize: "clamp(14px, 3vw, 17px)",
                    fontWeight: 700,
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      background: "linear-gradient(135deg, #f59e0b, #d97706)",
                      color: "white",
                      width: "clamp(24px, 5vw, 28px)",
                      height: "clamp(24px, 5vw, 28px)",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "clamp(11px, 2.5vw, 13px)",
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </span>
                  <span className="d-none d-sm-inline">Testimonial {index + 1}</span>
                  <span className="d-inline d-sm-none">Review {index + 1}</span>
                </h4>
              </div>
              <div className="col-6 col-md-4 text-end">
                {testimonialItems.length > 1 && (
                  <button
                    type="button"
                    style={{...dangerButtonStyle, maxWidth: "150px"}}
                    onClick={() =>
                      setTestimonialsDraft((prev) => ({
                        ...prev,
                        items: testimonialItems.filter((_, idx) => idx !== index),
                      }))
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fed7d7";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff5f5";
                    }}
                  >
                    <Trash2 size={14} /> <span className="d-none d-sm-inline">Remove</span>
                  </button>
                )}
              </div>
            </div>

            {/* BOOTSTRAP RESPONSIVE GRID */}
            <div className="row g-3 g-md-4">
              {/* LEFT COLUMN - Text Fields */}
              <div className="col-12 col-md-6">
                <div className="d-flex flex-column" style={{ gap: "clamp(12px, 2.5vw, 16px)" }}>
                  <div>
                    <label style={{
                      ...labelStyle,
                      border: "1px solid #f59e0b",
                      padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                      borderRadius: "6px",
                      display: "inline-block",
                      background: "#fffbeb",
                    }}>
                      Customer Name
                    </label>
                    <input
                      style={{
                        ...inputStyle,
                        marginTop: "8px",
                        border: "2px solid #f59e0b",
                      }}
                      value={item.name || ""}
                      onChange={(event) =>
                        setTestimonialsDraft((prev) => ({
                          ...prev,
                          items: testimonialItems.map((testimonial, idx) =>
                            idx === index ? { ...testimonial, name: event.target.value } : testimonial
                          ),
                        }))
                      }
                      placeholder="e.g., Sarah Johnson..."
                      onFocus={(e) => {
                        e.target.style.borderColor = "#d97706";
                        e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#f59e0b";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      ...labelStyle,
                      border: "1px solid #f59e0b",
                      padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                      borderRadius: "6px",
                      display: "inline-block",
                      background: "#fffbeb",
                    }}>
                      Location / Role
                    </label>
                    <input
                      style={{
                        ...inputStyle,
                        marginTop: "8px",
                        border: "2px solid #f59e0b",
                      }}
                      value={item.role || ""}
                      onChange={(event) =>
                        setTestimonialsDraft((prev) => ({
                          ...prev,
                          items: testimonialItems.map((testimonial, idx) =>
                            idx === index ? { ...testimonial, role: event.target.value } : testimonial
                          ),
                        }))
                      }
                      placeholder="e.g., New York, USA or CEO..."
                      onFocus={(e) => {
                        e.target.style.borderColor = "#d97706";
                        e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#f59e0b";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      ...labelStyle,
                      border: "1px solid #f59e0b",
                      padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                      borderRadius: "6px",
                      display: "inline-block",
                      background: "#fffbeb",
                    }}>
                      Review
                    </label>
                    <textarea
                      style={{
                        ...textareaStyle,
                        marginTop: "8px",
                        border: "2px solid #f59e0b",
                      }}
                      value={item.review || ""}
                      onChange={(event) =>
                        setTestimonialsDraft((prev) => ({
                          ...prev,
                          items: testimonialItems.map((testimonial, idx) =>
                            idx === index ? { ...testimonial, review: event.target.value } : testimonial
                          ),
                        }))
                      }
                      placeholder="Write the customer's review here..."
                      onFocus={(e) => {
                        e.target.style.borderColor = "#d97706";
                        e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#f59e0b";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      ...labelStyle,
                      border: "1px solid #f59e0b",
                      padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                      borderRadius: "6px",
                      display: "inline-block",
                      background: "#fffbeb",
                    }}>
                      Rating (1-5)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      style={{
                        ...inputStyle,
                        marginTop: "8px",
                        border: "2px solid #f59e0b",
                      }}
                      value={item.rating || 5}
                      onChange={(event) =>
                        setTestimonialsDraft((prev) => ({
                          ...prev,
                          items: testimonialItems.map((testimonial, idx) =>
                            idx === index
                              ? { ...testimonial, rating: Number(event.target.value) }
                              : testimonial
                          ),
                        }))
                      }
                      onFocus={(e) => {
                        e.target.style.borderColor = "#d97706";
                        e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#f59e0b";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN - Photo Upload & Preview */}
              <div className="col-12 col-md-6">
                <div className="d-flex flex-column" style={{ gap: "clamp(12px, 2.5vw, 16px)" }}>
                  <div>
                    <label style={{
                      ...labelStyle,
                      border: "1px solid #f59e0b",
                      padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                      borderRadius: "6px",
                      display: "inline-block",
                      background: "#fffbeb",
                    }}>
                      Customer Photo
                    </label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
                      <input
                        style={{
                          ...inputStyle,
                          border: "2px solid #f59e0b",
                        }}
                        value={item.photoUrl || ""}
                        onChange={(event) =>
                          setTestimonialsDraft((prev) => ({
                            ...prev,
                            items: testimonialItems.map((testimonial, idx) =>
                              idx === index ? { ...testimonial, photoUrl: event.target.value } : testimonial
                            ),
                          }))
                        }
                        placeholder="Enter photo URL..."
                        onFocus={(e) => {
                          e.target.style.borderColor = "#d97706";
                          e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#f59e0b";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                      <MediaUploader
                        label="Upload Photo"
                        accept="image/*"
                        onUpload={(file) => handleTestimonialUpload(index, file)}
                      />
                    </div>
                  </div>

                  {/* Photo Preview */}
                  {item.photoUrl ? (
                    <div
                      style={{
                        marginTop: "8px",
                        border: "2px solid #f59e0b",
                        borderRadius: "12px",
                        overflow: "hidden",
                        background: "#fffbeb",
                        padding: "clamp(20px, 5vw, 32px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={resolveMediaUrl(item.photoUrl)}
                        alt={item.name}
                        style={{
                          width: "clamp(80px, 20vw, 120px)",
                          height: "clamp(80px, 20vw, 120px)",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "3px solid #f59e0b",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        marginTop: "8px",
                        border: "2px dashed #f59e0b",
                        borderRadius: "12px",
                        background: "#fffbeb",
                        padding: "clamp(24px, 6vw, 48px) clamp(16px, 4vw, 24px)",
                        textAlign: "center",
                        color: "#d97706",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "12px",
                        minHeight: "clamp(150px, 32vw, 180px)",
                        justifyContent: "center",
                      }}
                    >
                      <ImageIcon size={window.innerWidth < 400 ? 32 : 48} strokeWidth={1.5} />
                      <p style={{ margin: 0, fontSize: "clamp(12px, 2.5vw, 14px)", fontWeight: 600 }}>No photo uploaded</p>
                      <p style={{ margin: 0, fontSize: "clamp(10px, 2vw, 12px)" }}>Upload customer photo</p>
                    </div>
                  )}

                  {/* Star Rating Display */}
                  {item.rating && (
                    <div
                      style={{
                        background: "#fffbeb",
                        border: "1px solid #f59e0b",
                        borderRadius: "10px",
                        padding: "clamp(10px, 2vw, 12px)",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: "clamp(16px, 4vw, 20px)", marginBottom: "4px" }}>
                        {"⭐".repeat(item.rating)}
                      </div>
                      <p style={{ margin: 0, fontSize: "clamp(10px, 2vw, 12px)", color: "#d97706", fontWeight: 600 }}>
                        {item.rating} out of 5 stars
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <button
      type="button"
      style={{
        ...secondaryButtonStyle,
        marginTop: "12px",
      }}
      onClick={() =>
        setTestimonialsDraft((prev) => ({
          ...prev,
          items: [
            ...testimonialItems,
            {
              id: `testimonial-${Date.now()}`,
              name: "New Customer",
              role: "",
              review: "",
              rating: 5,
              photoUrl: "",
            },
          ],
        }))
      }
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#f8fafc";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#ffffff";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <Plus size={18} /> Add Testimonial
    </button>

    {/* Save Button */}
    <div className="row">
      <div className="col-12 d-flex justify-content-end pt-2">
        <button
          type="button"
          onClick={() => saveSection("testimonials", testimonialsDraft)}
          disabled={savingSection === "testimonials"}
          style={{
            ...primaryButtonStyle,
            opacity: savingSection === "testimonials" ? 0.7 : 1,
            cursor: savingSection === "testimonials" ? "not-allowed" : "pointer",
            transform: savingSection === "testimonials" ? "scale(0.98)" : "scale(1)",
            maxWidth: "200px",
          }}
          onMouseEnter={(e) => {
            if (savingSection !== "testimonials") {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(245, 158, 11, 0.35)";
            }
          }}
          onMouseLeave={(e) => {
            if (savingSection !== "testimonials") {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(245, 158, 11, 0.25)";
            }
          }}
        >
          <Save size={18} />
          {savingSection === "testimonials" ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  </div>
);

// ========== FOOTER MANAGEMENT WITH BOOTSTRAP RESPONSIVE GRID ==========
const footerManagement = (
  <div style={{ 
    ...cardStyle, 
    border: "2px solid #f59e0b",
    boxShadow: "0 4px 16px rgba(245, 158, 11, 0.15)"
  }}>
    <div style={{ borderBottom: "2px solid #f1f5f9", paddingBottom: "16px" }}>
      <h3 style={sectionTitleStyle}>🔗 Footer & Contact</h3>
      <p style={sectionDescriptionStyle}>Manage footer branding, newsletter, social links, and quick links</p>
    </div>

    {/* Brand Information */}
    <div className="container-fluid px-0">
      <div className="row g-3">
        <div className="col-12">
          <label style={{
            ...labelStyle,
            border: "1px solid #f59e0b",
            padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
            borderRadius: "6px",
            display: "inline-block",
            background: "#fffbeb",
          }}>
            Brand Name
          </label>
          <input
            style={{
              ...inputStyle,
              marginTop: "8px",
              border: "2px solid #f59e0b",
            }}
            value={footerDraft.brandName || ""}
            onChange={(event) => setFooterDraft((prev) => ({ ...prev, brandName: event.target.value }))}
            placeholder="Your Brand Name..."
            onFocus={(e) => {
              e.target.style.borderColor = "#d97706";
              e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#f59e0b";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <div className="col-12">
          <label style={{
            ...labelStyle,
            border: "1px solid #f59e0b",
            padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
            borderRadius: "6px",
            display: "inline-block",
            background: "#fffbeb",
          }}>
            Brand Description
          </label>
          <textarea
            style={{
              ...textareaStyle,
              marginTop: "8px",
              border: "2px solid #f59e0b",
            }}
            value={footerDraft.description || ""}
            onChange={(event) =>
              setFooterDraft((prev) => ({ ...prev, description: event.target.value }))
            }
            placeholder="Short description about your brand..."
            onFocus={(e) => {
              e.target.style.borderColor = "#d97706";
              e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#f59e0b";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <div className="col-12">
          <label style={{
            ...labelStyle,
            border: "1px solid #f59e0b",
            padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
            borderRadius: "6px",
            display: "inline-block",
            background: "#fffbeb",
          }}>
            Logo Upload
          </label>
          <div className="row g-2 mt-2">
            <div className="col-12 col-md-8">
              <input
                style={{
                  ...inputStyle,
                  border: "2px solid #f59e0b",
                }}
                value={footerDraft.logoUrl || ""}
                onChange={(event) => setFooterDraft((prev) => ({ ...prev, logoUrl: event.target.value }))}
                placeholder="Enter logo URL..."
                onFocus={(e) => {
                  e.target.style.borderColor = "#d97706";
                  e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#f59e0b";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
            <div className="col-12 col-md-4">
              <MediaUploader label="Upload Logo" accept="image/*" onUpload={handleFooterLogoUpload} />
            </div>
          </div>
        </div>

        {footerDraft.logoUrl && (
          <div className="col-12">
            <div
              style={{
                border: "2px solid #f59e0b",
                borderRadius: "12px",
                background: "#fffbeb",
                padding: "clamp(16px, 3vw, 20px)",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src={resolveMediaUrl(footerDraft.logoUrl)}
                alt="Footer logo"
                style={{ 
                  width: "clamp(70px, 15vw, 100px)", 
                  height: "clamp(70px, 15vw, 100px)", 
                  borderRadius: "50%", 
                  objectFit: "cover" 
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>

    <div style={dividerStyle} />

    {/* Contact Information */}
    <div className="container-fluid px-0">
      <h4 style={{
        margin: "0 0 16px 0",
        fontSize: "clamp(15px, 3vw, 17px)",
        fontWeight: 700,
        color: "#1e293b",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}>
        <span style={{
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          color: "white",
          width: "clamp(24px, 5vw, 28px)",
          height: "clamp(24px, 5vw, 28px)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "clamp(14px, 3vw, 16px)",
        }}>📞</span>
        Contact Information
      </h4>
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label style={{
            ...labelStyle,
            border: "1px solid #f59e0b",
            padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
            borderRadius: "6px",
            display: "inline-block",
            background: "#fffbeb",
          }}>
            Address Line 1
          </label>
          <input
            style={{
              ...inputStyle,
              marginTop: "8px",
              border: "2px solid #f59e0b",
            }}
            value={footerDraft.contact?.addressLine1 || ""}
            onChange={(event) =>
              setFooterDraft((prev) => ({
                ...prev,
                contact: { ...(prev.contact || {}), addressLine1: event.target.value },
              }))
            }
            placeholder="123 Main Street..."
            onFocus={(e) => {
              e.target.style.borderColor = "#d97706";
              e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#f59e0b";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
        <div className="col-12 col-md-6">
          <label style={{
            ...labelStyle,
            border: "1px solid #f59e0b",
            padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
            borderRadius: "6px",
            display: "inline-block",
            background: "#fffbeb",
          }}>
            Address Line 2
          </label>
          <input
            style={{
              ...inputStyle,
              marginTop: "8px",
              border: "2px solid #f59e0b",
            }}
            value={footerDraft.contact?.addressLine2 || ""}
            onChange={(event) =>
              setFooterDraft((prev) => ({
                ...prev,
                contact: { ...(prev.contact || {}), addressLine2: event.target.value },
              }))
            }
            placeholder="Suite 100, City, State..."
            onFocus={(e) => {
              e.target.style.borderColor = "#d97706";
              e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#f59e0b";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
        <div className="col-12 col-md-6">
          <label style={{
            ...labelStyle,
            border: "1px solid #f59e0b",
            padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
            borderRadius: "6px",
            display: "inline-block",
            background: "#fffbeb",
          }}>
            Primary Phone
          </label>
          <input
            style={{
              ...inputStyle,
              marginTop: "8px",
              border: "2px solid #f59e0b",
            }}
            value={footerDraft.contact?.phone || ""}
            onChange={(event) =>
              setFooterDraft((prev) => ({
                ...prev,
                contact: { ...(prev.contact || {}), phone: event.target.value },
              }))
            }
            placeholder="+1 (555) 123-4567..."
            onFocus={(e) => {
              e.target.style.borderColor = "#d97706";
              e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#f59e0b";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
        <div className="col-12 col-md-6">
          <label style={{
            ...labelStyle,
            border: "1px solid #f59e0b",
            padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
            borderRadius: "6px",
            display: "inline-block",
            background: "#fffbeb",
          }}>
            Secondary Phone
          </label>
          <input
            style={{
              ...inputStyle,
              marginTop: "8px",
              border: "2px solid #f59e0b",
            }}
            value={footerDraft.contact?.secondaryPhone || ""}
            onChange={(event) =>
              setFooterDraft((prev) => ({
                ...prev,
                contact: { ...(prev.contact || {}), secondaryPhone: event.target.value },
              }))
            }
            placeholder="+1 (555) 987-6543..."
            onFocus={(e) => {
              e.target.style.borderColor = "#d97706";
              e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#f59e0b";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
        <div className="col-12 col-md-6">
          <label style={{
            ...labelStyle,
            border: "1px solid #f59e0b",
            padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
            borderRadius: "6px",
            display: "inline-block",
            background: "#fffbeb",
          }}>
            Email Address
          </label>
          <input
            style={{
              ...inputStyle,
              marginTop: "8px",
              border: "2px solid #f59e0b",
            }}
            value={footerDraft.contact?.email || ""}
            onChange={(event) =>
              setFooterDraft((prev) => ({
                ...prev,
                contact: { ...(prev.contact || {}), email: event.target.value },
              }))
            }
            placeholder="contact@example.com..."
            onFocus={(e) => {
              e.target.style.borderColor = "#d97706";
              e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#f59e0b";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
        <div className="col-12 col-md-6">
          <label style={{
            ...labelStyle,
            border: "1px solid #f59e0b",
            padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
            borderRadius: "6px",
            display: "inline-block",
            background: "#fffbeb",
          }}>
            Working Hours
          </label>
          <input
            style={{
              ...inputStyle,
              marginTop: "8px",
              border: "2px solid #f59e0b",
            }}
            value={footerDraft.contact?.hours || ""}
            onChange={(event) =>
              setFooterDraft((prev) => ({
                ...prev,
                contact: { ...(prev.contact || {}), hours: event.target.value },
              }))
            }
            placeholder="Mon-Fri: 9AM-6PM..."
            onFocus={(e) => {
              e.target.style.borderColor = "#d97706";
              e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#f59e0b";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      </div>
    </div>

    <div style={dividerStyle} />

    {/* Newsletter Section */}
    <div className="container-fluid px-0">
      <h4 style={{
        margin: "0 0 16px 0",
        fontSize: "clamp(15px, 3vw, 17px)",
        fontWeight: 700,
        color: "#1e293b",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}>
        <span style={{
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          color: "white",
          width: "clamp(24px, 5vw, 28px)",
          height: "clamp(24px, 5vw, 28px)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "clamp(14px, 3vw, 16px)",
        }}>📧</span>
        Newsletter
      </h4>
      <div className="row g-3">
        <div className="col-12">
          <label style={{
            ...labelStyle,
            border: "1px solid #f59e0b",
            padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
            borderRadius: "6px",
            display: "inline-block",
            background: "#fffbeb",
          }}>
            Newsletter Title
          </label>
          <input
            style={{
              ...inputStyle,
              marginTop: "8px",
              border: "2px solid #f59e0b",
            }}
            value={footerDraft.newsletter?.title || ""}
            onChange={(event) =>
              setFooterDraft((prev) => ({
                ...prev,
                newsletter: { ...(prev.newsletter || {}), title: event.target.value },
              }))
            }
            placeholder="Subscribe to our newsletter..."
            onFocus={(e) => {
              e.target.style.borderColor = "#d97706";
              e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#f59e0b";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
        <div className="col-12">
          <label style={{
            ...labelStyle,
            border: "1px solid #f59e0b",
            padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
            borderRadius: "6px",
            display: "inline-block",
            background: "#fffbeb",
          }}>
            Newsletter Description
          </label>
          <textarea
            style={{
              ...textareaStyle,
              marginTop: "8px",
              border: "2px solid #f59e0b",
            }}
            value={footerDraft.newsletter?.description || ""}
            onChange={(event) =>
              setFooterDraft((prev) => ({
                ...prev,
                newsletter: { ...(prev.newsletter || {}), description: event.target.value },
              }))
            }
            placeholder="Get exclusive deals and updates..."
            onFocus={(e) => {
              e.target.style.borderColor = "#d97706";
              e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#f59e0b";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      </div>

      <label style={{
        ...labelStyle,
        border: "1px solid #f59e0b",
        padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
        borderRadius: "6px",
        display: "inline-block",
        background: "#fffbeb",
        marginTop: "16px",
      }}>
        Newsletter Benefits
      </label>
      <div style={{ display: "grid", gap: "12px", marginTop: "12px" }}>
        {benefits.map((benefit, index) => (
          <div
            key={benefit.title || index}
            style={{
              background: "#fafbfc",
              padding: "clamp(10px, 2vw, 12px)",
              borderRadius: "10px",
              border: "1px solid #e8eaed",
            }}
          >
            <div className="row g-2 align-items-center">
              <div className="col-6 col-md-2">
                <input
                  style={{
                    ...inputStyle,
                    border: "2px solid #f59e0b",
                  }}
                  value={benefit.icon || ""}
                  onChange={(event) =>
                    setFooterDraft((prev) => ({
                      ...prev,
                      newsletterBenefits: benefits.map((b, idx) =>
                        idx === index ? { ...b, icon: event.target.value } : b
                      ),
                    }))
                  }
                  placeholder="Icon (✨)"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#d97706";
                    e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#f59e0b";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              <div className="col-6 col-md-3">
                <input
                  style={{
                    ...inputStyle,
                    border: "2px solid #f59e0b",
                  }}
                  value={benefit.title || ""}
                  onChange={(event) =>
                    setFooterDraft((prev) => ({
                      ...prev,
                      newsletterBenefits: benefits.map((b, idx) =>
                        idx === index ? { ...b, title: event.target.value } : b
                      ),
                    }))
                  }
                  placeholder="Title"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#d97706";
                    e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#f59e0b";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              <div className="col-12 col-md-6">
                <input
                  style={{
                    ...inputStyle,
                    border: "2px solid #f59e0b",
                  }}
                  value={benefit.description || ""}
                  onChange={(event) =>
                    setFooterDraft((prev) => ({
                      ...prev,
                      newsletterBenefits: benefits.map((b, idx) =>
                        idx === index ? { ...b, description: event.target.value } : b
                      ),
                    }))
                  }
                  placeholder="Description"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#d97706";
                    e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#f59e0b";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              {benefits.length > 1 && (
                <div className="col-12 col-md-1 text-end">
                  <button
                    type="button"
                    style={{...dangerButtonStyle, width: "100%"}}
                    onClick={() =>
                      setFooterDraft((prev) => ({
                        ...prev,
                        newsletterBenefits: benefits.filter((_, idx) => idx !== index),
                      }))
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fed7d7";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff5f5";
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          style={secondaryButtonStyle}
          onClick={() =>
            setFooterDraft((prev) => ({
              ...prev,
              newsletterBenefits: [
                ...benefits,
                { icon: "✨", title: "Benefit", description: "Value proposition" },
              ],
            }))
          }
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f8fafc";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ffffff";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <Plus size={16} /> Add Benefit
        </button>
      </div>
    </div>

    <div style={dividerStyle} />

    {/* Social Links */}
    <div className="container-fluid px-0">
      <h4 style={{
        margin: "0 0 16px 0",
        fontSize: "clamp(15px, 3vw, 17px)",
        fontWeight: 700,
        color: "#1e293b",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}>
        <span style={{
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          color: "white",
          width: "clamp(24px, 5vw, 28px)",
          height: "clamp(24px, 5vw, 28px)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "clamp(14px, 3vw, 16px)",
        }}>🌐</span>
        Social Links
      </h4>
      <div style={{ display: "grid", gap: "12px" }}>
        {socialItems.map((item, index) => (
          <div
            key={item.platform || index}
            style={{
              background: "#fafbfc",
              padding: "clamp(10px, 2vw, 12px)",
              borderRadius: "10px",
              border: "1px solid #e8eaed",
            }}
          >
            <div className="row g-2 align-items-center">
              <div className="col-12 col-md-4">
                <input
                  style={{
                    ...inputStyle,
                    border: "2px solid #f59e0b",
                  }}
                  value={item.platform || ""}
                  onChange={(event) =>
                    setFooterDraft((prev) => ({
                      ...prev,
                      socials: socialItems.map((social, idx) =>
                        idx === index ? { ...social, platform: event.target.value } : social
                      ),
                    }))
                  }
                  placeholder="Platform (Instagram)"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#d97706";
                    e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#f59e0b";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              <div className="col-12 col-md-7">
                <input
                  style={{
                    ...inputStyle,
                    border: "2px solid #f59e0b",
                  }}
                  value={item.url || ""}
                  onChange={(event) =>
                    setFooterDraft((prev) => ({
                      ...prev,
                      socials: socialItems.map((social, idx) =>
                        idx === index ? { ...social, url: event.target.value } : social
                      ),
                    }))
                  }
                  placeholder="https://instagram.com/..."
                  onFocus={(e) => {
                    e.target.style.borderColor = "#d97706";
                    e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#f59e0b";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              {socialItems.length > 1 && (
                <div className="col-12 col-md-1 text-end">
                  <button
                    type="button"
                    style={{...dangerButtonStyle, width: "100%"}}
                    onClick={() =>
                      setFooterDraft((prev) => ({
                        ...prev,
                        socials: socialItems.filter((_, idx) => idx !== index),
                      }))
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fed7d7";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff5f5";
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          style={secondaryButtonStyle}
          onClick={() =>
            setFooterDraft((prev) => ({
              ...prev,
              socials: [...socialItems, { platform: "Instagram", url: "https://" }],
            }))
          }
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f8fafc";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ffffff";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <Plus size={16} /> Add Social Link
        </button>
      </div>
    </div>

    <div style={dividerStyle} />

    {/* Quick Links */}
    <div className="container-fluid px-0">
      <h4 style={{
        margin: "0 0 16px 0",
        fontSize: "clamp(15px, 3vw, 17px)",
        fontWeight: 700,
        color: "#1e293b",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}>
        <span style={{
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          color: "white",
          width: "clamp(24px, 5vw, 28px)",
          height: "clamp(24px, 5vw, 28px)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "clamp(14px, 3vw, 16px)",
        }}>⚡</span>
        Quick Links
      </h4>
      <div style={{ display: "grid", gap: "12px" }}>
        {quickLinks.map((link, index) => (
          <div
            key={link.label || index}
            style={{
              background: "#fafbfc",
              padding: "clamp(10px, 2vw, 12px)",
              borderRadius: "10px",
              border: "1px solid #e8eaed",
            }}
          >
            <div className="row g-2 align-items-center">
              <div className="col-12 col-md-4">
                <input
                  style={{
                    ...inputStyle,
                    border: "2px solid #f59e0b",
                  }}
                  value={link.label || ""}
                  onChange={(event) =>
                    setFooterDraft((prev) => ({
                      ...prev,
                      quickLinks: quickLinks.map((item, idx) =>
                        idx === index ? { ...item, label: event.target.value } : item
                      ),
                    }))
                  }
                  placeholder="Label (About Us)"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#d97706";
                    e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#f59e0b";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              <div className="col-12 col-md-7">
                <input
                  style={{
                    ...inputStyle,
                    border: "2px solid #f59e0b",
                  }}
                  value={link.url || ""}
                  onChange={(event) =>
                    setFooterDraft((prev) => ({
                      ...prev,
                      quickLinks: quickLinks.map((item, idx) =>
                        idx === index ? { ...item, url: event.target.value } : item
                      ),
                    }))
                  }
                  placeholder="/about"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#d97706";
                    e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#f59e0b";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              {quickLinks.length > 1 && (
                <div className="col-12 col-md-1 text-end">
                  <button
                    type="button"
                    style={{...dangerButtonStyle, width: "100%"}}
                    onClick={() =>
                      setFooterDraft((prev) => ({
                        ...prev,
                        quickLinks: quickLinks.filter((_, idx) => idx !== index),
                      }))
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fed7d7";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff5f5";
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          style={secondaryButtonStyle}
          onClick={() =>
            setFooterDraft((prev) => ({
              ...prev,
              quickLinks: [...quickLinks, { label: "New Link", url: "/" }],
            }))
          }
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f8fafc";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ffffff";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <Plus size={16} /> Add Quick Link
        </button>
      </div>
    </div>

    <div style={dividerStyle} />

    {/* Customer Links */}
    <div className="container-fluid px-0">
      <h4 style={{
        margin: "0 0 16px 0",
        fontSize: "clamp(15px, 3vw, 17px)",
        fontWeight: 700,
        color: "#1e293b",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}>
        <span style={{
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          color: "white",
          width: "clamp(24px, 5vw, 28px)",
          height: "clamp(24px, 5vw, 28px)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "clamp(14px, 3vw, 16px)",
        }}>👥</span>
        Customer Links
      </h4>
      <div style={{ display: "grid", gap: "12px" }}>
        {customerLinks.map((link, index) => (
          <div
            key={link.label || index}
            style={{
              background: "#fafbfc",
              padding: "clamp(10px, 2vw, 12px)",
              borderRadius: "10px",
              border: "1px solid #e8eaed",
            }}
          >
            <div className="row g-2 align-items-center">
              <div className="col-12 col-md-4">
                <input
                  style={{
                    ...inputStyle,
                    border: "2px solid #f59e0b",
                  }}
                  value={link.label || ""}
                  onChange={(event) =>
                    setFooterDraft((prev) => ({
                      ...prev,
                      customerLinks: customerLinks.map((item, idx) =>
                        idx === index ? { ...item, label: event.target.value } : item
                      ),
                    }))
                  }
                  placeholder="Label (Support)"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#d97706";
                    e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#f59e0b";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              <div className="col-12 col-md-7">
                <input
                  style={{
                    ...inputStyle,
                    border: "2px solid #f59e0b",
                  }}
                  value={link.url || ""}
                  onChange={(event) =>
                    setFooterDraft((prev) => ({
                      ...prev,
                      customerLinks: customerLinks.map((item, idx) =>
                        idx === index ? { ...item, url: event.target.value } : item
                      ),
                    }))
                  }
                  placeholder="/contact"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#d97706";
                    e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#f59e0b";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              {customerLinks.length > 1 && (
                <div className="col-12 col-md-1 text-end">
                  <button
                    type="button"
                    style={{...dangerButtonStyle, width: "100%"}}
                    onClick={() =>
                      setFooterDraft((prev) => ({
                        ...prev,
                        customerLinks: customerLinks.filter((_, idx) => idx !== index),
                      }))
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fed7d7";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff5f5";
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          style={secondaryButtonStyle}
          onClick={() =>
            setFooterDraft((prev) => ({
              ...prev,
              customerLinks: [...customerLinks, { label: "Support", url: "/contact" }],
            }))
          }
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f8fafc";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ffffff";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <Plus size={16} /> Add Customer Link
        </button>
      </div>
    </div>

    {/* Save Button */}
    <div className="row mt-3">
      <div className="col-12 d-flex justify-content-end">
        <button
          type="button"
          onClick={async () => {
            setSavingSection("footer");
            try {
              await Promise.all([
                updateSection("footer", footerDraft),
                updateSection("contact", contactDraft),
              ]);
            } finally {
              setSavingSection(null);
            }
          }}
          disabled={savingSection === "footer"}
          style={{
            ...primaryButtonStyle,
            opacity: savingSection === "footer" ? 0.7 : 1,
            cursor: savingSection === "footer" ? "not-allowed" : "pointer",
            transform: savingSection === "footer" ? "scale(0.98)" : "scale(1)",
            maxWidth: "200px",
          }}
          onMouseEnter={(e) => {
            if (savingSection !== "footer") {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(245, 158, 11, 0.35)";
            }
          }}
          onMouseLeave={(e) => {
            if (savingSection !== "footer") {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(245, 158, 11, 0.25)";
            }
          }}
        >
          <Save size={18} />
          {savingSection === "footer" ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  </div>
);



// ========== CONTACT PAGE MANAGEMENT WITH BOOTSTRAP RESPONSIVE GRID ==========
const contactManagement = (
  <div style={{ 
    ...cardStyle, 
    border: "2px solid #f59e0b",
    boxShadow: "0 4px 16px rgba(245, 158, 11, 0.15)"
  }}>
    <div style={{ borderBottom: "2px solid #f1f5f9", paddingBottom: "16px" }}>
      <h3 style={sectionTitleStyle}>📬 Contact Page</h3>
      <p style={sectionDescriptionStyle}>Edit hero content, info cards, and map embed</p>
    </div>

    {/* Hero Section */}
    <div className="container-fluid px-0">
      <div className="row g-3">
        <div className="col-12">
          <label style={{
            ...labelStyle,
            border: "1px solid #f59e0b",
            padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
            borderRadius: "6px",
            display: "inline-block",
            background: "#fffbeb",
          }}>
            Hero Title
          </label>
          <input
            style={{
              ...inputStyle,
              marginTop: "8px",
              border: "2px solid #f59e0b",
            }}
            value={contactDraft.heroTitle || ""}
            onChange={(event) => setContactDraft((prev) => ({ ...prev, heroTitle: event.target.value }))}
            placeholder="e.g., Get In Touch With Us..."
            onFocus={(e) => {
              e.target.style.borderColor = "#d97706";
              e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#f59e0b";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <div className="col-12">
          <label style={{
            ...labelStyle,
            border: "1px solid #f59e0b",
            padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
            borderRadius: "6px",
            display: "inline-block",
            background: "#fffbeb",
          }}>
            Hero Subtitle
          </label>
          <textarea
            style={{
              ...textareaStyle,
              marginTop: "8px",
              border: "2px solid #f59e0b",
            }}
            value={contactDraft.heroSubtitle || ""}
            onChange={(event) => setContactDraft((prev) => ({ ...prev, heroSubtitle: event.target.value }))}
            placeholder="Add a welcoming message for your contact page..."
            onFocus={(e) => {
              e.target.style.borderColor = "#d97706";
              e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#f59e0b";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <div className="col-12">
          <label style={{
            ...labelStyle,
            border: "1px solid #f59e0b",
            padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
            borderRadius: "6px",
            display: "inline-block",
            background: "#fffbeb",
          }}>
            Map Embed URL
          </label>
          <input
            style={{
              ...inputStyle,
              marginTop: "8px",
              border: "2px solid #f59e0b",
            }}
            value={contactDraft.mapEmbedUrl || ""}
            onChange={(event) => setContactDraft((prev) => ({ ...prev, mapEmbedUrl: event.target.value }))}
            placeholder="https://www.google.com/maps/embed?pb=..."
            onFocus={(e) => {
              e.target.style.borderColor = "#d97706";
              e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#f59e0b";
              e.target.style.boxShadow = "none";
            }}
          />
          <p style={{ 
            margin: "8px 0 0 0", 
            fontSize: "clamp(10px, 2vw, 12px)", 
            color: "#64748b",
            fontStyle: "italic" 
          }}>
            💡 Get embed URL from Google Maps → Share → Embed a map
          </p>
        </div>
      </div>
    </div>

    <div style={dividerStyle} />

    {/* Info Cards */}
    <div className="container-fluid px-0">
      <h4 style={{
        margin: "0 0 16px 0",
        fontSize: "clamp(15px, 3vw, 17px)",
        fontWeight: 700,
        color: "#1e293b",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}>
        <span style={{
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          color: "white",
          width: "clamp(24px, 5vw, 28px)",
          height: "clamp(24px, 5vw, 28px)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "clamp(14px, 3vw, 16px)",
        }}>📋</span>
        Contact Info Cards
      </h4>
      <div style={{ display: "grid", gap: "clamp(16px, 3vw, 20px)" }}>
        {contactCards.map((card, index) => (
          <div 
            key={card.id || index}
            style={{
              border: "1.5px solid #e8eaed",
              borderRadius: "14px",
              padding: "clamp(14px, 3vw, 20px)",
              background: "#fafbfc",
              transition: "all 0.2s ease",
            }}
          >
            {/* Header Row */}
            <div className="row align-items-center mb-3">
              <div className="col-6 col-md-8">
                <h4
                  style={{
                    margin: 0,
                    fontSize: "clamp(14px, 3vw, 17px)",
                    fontWeight: 700,
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      background: "linear-gradient(135deg, #f59e0b, #d97706)",
                      color: "white",
                      width: "clamp(24px, 5vw, 28px)",
                      height: "clamp(24px, 5vw, 28px)",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "clamp(11px, 2.5vw, 13px)",
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </span>
                  <span className="d-none d-sm-inline">Info Card {index + 1}</span>
                  <span className="d-inline d-sm-none">Card {index + 1}</span>
                </h4>
              </div>
              <div className="col-6 col-md-4 text-end">
                {contactCards.length > 1 && (
                  <button
                    type="button"
                    style={{...dangerButtonStyle, maxWidth: "150px"}}
                    onClick={() =>
                      setContactDraft((prev) => ({
                        ...prev,
                        infoCards: contactCards.filter((_, idx) => idx !== index),
                      }))
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fed7d7";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff5f5";
                    }}
                  >
                    <Trash2 size={14} /> <span className="d-none d-sm-inline">Remove</span>
                  </button>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="row g-3">
              <div className="col-12">
                <label style={{
                  ...labelStyle,
                  border: "1px solid #f59e0b",
                  padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                  borderRadius: "6px",
                  display: "inline-block",
                  background: "#fffbeb",
                }}>
                  Card Title
                </label>
                <input
                  style={{
                    ...inputStyle,
                    marginTop: "8px",
                    border: "2px solid #f59e0b",
                  }}
                  value={card.title || ""}
                  onChange={(event) =>
                    setContactDraft((prev) => ({
                      ...prev,
                      infoCards: contactCards.map((item, idx) =>
                        idx === index ? { ...item, title: event.target.value } : item
                      ),
                    }))
                  }
                  placeholder="e.g., Visit Our Store, Call Us..."
                  onFocus={(e) => {
                    e.target.style.borderColor = "#d97706";
                    e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#f59e0b";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div className="col-12">
                <label style={{
                  ...labelStyle,
                  border: "1px solid #f59e0b",
                  padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                  borderRadius: "6px",
                  display: "inline-block",
                  background: "#fffbeb",
                }}>
                  Details (one per line)
                </label>
                <textarea
                  style={{
                    ...textareaStyle,
                    marginTop: "8px",
                    border: "2px solid #f59e0b",
                  }}
                  value={(card.details || []).join("\n")}
                  onChange={(event) =>
                    setContactDraft((prev) => ({
                      ...prev,
                      infoCards: contactCards.map((item, idx) =>
                        idx === index ? { ...item, details: event.target.value.split("\n") } : item
                      ),
                    }))
                  }
                  placeholder="123 Main Street&#10;New York, NY 10001&#10;Mon-Fri: 9AM-6PM"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#d97706";
                    e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#f59e0b";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <p style={{ 
                  margin: "8px 0 0 0", 
                  fontSize: "clamp(10px, 2vw, 12px)", 
                  color: "#64748b",
                  fontStyle: "italic" 
                }}>
                  💡 Each line will be displayed as a separate detail
                </p>
              </div>

              <div className="col-12">
                <label style={{
                  ...labelStyle,
                  border: "1px solid #f59e0b",
                  padding: "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                  borderRadius: "6px",
                  display: "inline-block",
                  background: "#fffbeb",
                }}>
                  Link (Optional)
                </label>
                <input
                  style={{
                    ...inputStyle,
                    marginTop: "8px",
                    border: "2px solid #f59e0b",
                  }}
                  value={card.link || ""}
                  onChange={(event) =>
                    setContactDraft((prev) => ({
                      ...prev,
                      infoCards: contactCards.map((item, idx) =>
                        idx === index ? { ...item, link: event.target.value } : item
                      ),
                    }))
                  }
                  placeholder="mailto:contact@example.com or tel:+1234567890"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#d97706";
                    e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#f59e0b";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Preview Card */}
              {(card.title || card.details?.length > 0) && (
                <div className="col-12">
                  <div
                    style={{
                      marginTop: "8px",
                      border: "2px solid #f59e0b",
                      borderRadius: "12px",
                      background: "#fffbeb",
                      padding: "clamp(12px, 3vw, 16px)",
                    }}
                  >
                    <p style={{ 
                      margin: "0 0 8px 0", 
                      fontSize: "clamp(10px, 2vw, 11px)", 
                      color: "#d97706", 
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      Preview
                    </p>
                    <h5 style={{ 
                      margin: "0 0 8px 0", 
                      fontSize: "clamp(14px, 3vw, 16px)", 
                      fontWeight: 700, 
                      color: "#1e293b" 
                    }}>
                      {card.title || "Card Title"}
                    </h5>
                    {card.details && card.details.length > 0 && (
                      <div style={{ fontSize: "clamp(12px, 2.5vw, 14px)", color: "#64748b", lineHeight: "1.6" }}>
                        {card.details.map((detail, idx) => (
                          <p key={idx} style={{ margin: "4px 0" }}>{detail}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        style={{
          ...secondaryButtonStyle,
          marginTop: "12px",
        }}
        onClick={() =>
          setContactDraft((prev) => ({
            ...prev,
            infoCards: [
              ...contactCards,
              {
                id: `info-${Date.now()}`,
                title: "New Contact",
                details: ["Detail 1"],
                link: "",
              },
            ],
          }))
        }
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#f8fafc";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#ffffff";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <Plus size={18} /> Add Info Card
      </button>
    </div>

    {/* Save Button */}
    <div className="row mt-3">
      <div className="col-12 d-flex justify-content-end">
        <button
          type="button"
          onClick={() => saveSection("contact", contactDraft)}
          disabled={savingSection === "contact"}
          style={{
            ...primaryButtonStyle,
            opacity: savingSection === "contact" ? 0.7 : 1,
            cursor: savingSection === "contact" ? "not-allowed" : "pointer",
            transform: savingSection === "contact" ? "scale(0.98)" : "scale(1)",
            maxWidth: "200px",
          }}
          onMouseEnter={(e) => {
            if (savingSection !== "contact") {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(245, 158, 11, 0.35)";
            }
          }}
          onMouseLeave={(e) => {
            if (savingSection !== "contact") {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(245, 158, 11, 0.25)";
            }
          }}
        >
          <Save size={18} />
          {savingSection === "contact" ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  </div>
);


return (
  <div className="container-fluid" style={{ padding: "clamp(10px, 3vw, 20px) 0" }}>
    <div className="row">
      <div className="col-12">
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(24px, 5vw, 32px)" }}>
          {heroManagement}
          {aboutManagement}
          {categoriesManagement}
          {whyManagement}
          {trendingManagement}
          {testimonialsManagement}
          {footerManagement}
          {contactManagement}
        </div>
      </div>
    </div>
  </div>
);
};

export default ContentManagementSection;
