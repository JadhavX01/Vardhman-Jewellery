import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  User,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import "./ContactPage.css";
import { useContent } from "../../context/ContentContext";
import { defaultContent } from "../../data/defaultContent";

const iconLookup = {
  phone: Phone,
  email: Mail,
  address: MapPin,
  hours: Clock,
};

const ContactPage = () => {
  const { content } = useContent();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactContent = content.contact || defaultContent.contact;
  const infoCards = contactContent.infoCards?.length
    ? contactContent.infoCards
    : defaultContent.contact.infoCards;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-overlay"></div>
        <div className="contact-hero-content">
          <MessageCircle size={48} className="hero-icon" />
          <h1 className="contact-hero-title">{contactContent.heroTitle}</h1>
          <p className="contact-hero-subtitle">{contactContent.heroSubtitle}</p>
        </div>
      </section>

      <div className="contact-container">
        <section className="contact-info-section">
          <div className="contact-info-grid">
            {infoCards.map((card, index) => {
              const Icon = iconLookup[card.id?.split("-")?.[1]] || iconLookup[card.title?.toLowerCase()] || MessageCircle;
              return (
                <div key={card.id || index} className="contact-info-card">
                  <div className="info-icon">
                    <Icon size={24} />
                  </div>
                  <h3 className="info-title">{card.title}</h3>
                  <div className="info-details">
                    {card.details?.map((detail, idx) => (
                      <p key={idx}>
                        {card.link && idx === 0 ? (
                          <a href={card.link} target="_blank" rel="noopener noreferrer">
                            {detail}
                          </a>
                        ) : (
                          detail
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="contact-main-section">
          <div className="contact-main-grid">
            <div className="contact-form-wrapper">
              <div className="form-header">
                <h2 className="form-title">Send us a Message</h2>
                <p className="form-subtitle">
                  Fill out the form below and we'll get back to you within 24 hours
                </p>
              </div>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">
                      <User size={16} />
                      <span>Full Name *</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      <Phone size={16} />
                      <span>Phone Number *</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <Mail size={16} />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">
                    <MessageCircle size={16} />
                    <span>Subject *</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help you?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    <MessageCircle size={16} />
                    <span>Message *</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Write your message here..."
                    rows={5}
                  ></textarea>
                </div>

                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Send size={16} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>

              <div className="contact-badges">
                <div className="badge">
                  <CheckCircle size={18} />
                  <span>24/7 Customer Support</span>
                </div>
                <div className="badge">
                  <CheckCircle size={18} />
                  <span>Premium Customer Experience</span>
                </div>
              </div>
            </div>

            <div className="contact-map-wrapper">
              <div className="map-header">
                <h3>Visit Our Store</h3>
                <p>Experience our premium collection in person</p>
              </div>
              <div className="map-container">
                {contactContent.mapEmbedUrl ? (
                  <iframe
                    title="Store Location"
                    src={contactContent.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                ) : (
                  <div className="map-placeholder">
                    <MapPin size={48} />
                    <p>Map coming soon</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;



