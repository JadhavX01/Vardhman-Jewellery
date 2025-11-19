import { motion } from "motion/react";
import { Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import { useContent } from "../context/ContentContext";
import { defaultContent } from "../data/defaultContent";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const { content } = useContent();

  const footerContent = content.footer || defaultContent.footer;
  const newsletter = footerContent.newsletter || defaultContent.footer.newsletter;
  const benefits = footerContent.newsletterBenefits || defaultContent.footer.newsletterBenefits;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <section
      style={{
        position: "relative",
        padding: "60px 20px",
        background: "#000000",
        borderBottom: "1px solid rgba(212, 175, 55, 0.2)",
        width: "100%",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 10,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(212, 175, 55, 0.1)",
              border: "1px solid rgba(212, 175, 55, 0.2)",
              padding: "8px 16px",
              borderRadius: "20px",
              marginBottom: "24px",
            }}
          >
            <Sparkles className="w-4 h-4" style={{ color: "#D4AF37" }} />
            <span
              style={{
                fontSize: "12px",
                color: "#D4AF37",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontWeight: "600",
              }}
            >
              Exclusive Offers
            </span>
          </div>

          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontFamily: "var(--font-cursive)",
              fontWeight: "600",
              background: "linear-gradient(135deg, #D4AF37 0%, #EFE1C6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "16px",
            }}
          >
            {newsletter.title || "Join Our VIP Club"}
          </h2>

          <p
            style={{
              color: "#a0a0a0",
              fontSize: "16px",
              marginBottom: "32px",
              maxWidth: "600px",
              margin: "0 auto 32px",
            }}
          >
            {newsletter.description ||
              "Subscribe to receive exclusive offers, early access to new collections, and insider jewelry tips."}
          </p>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: window.innerWidth < 640 ? "column" : "row",
              gap: "12px",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <div style={{ position: "relative", flex: 1 }}>
              <Mail
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: "#D4AF37", zIndex: 10 }}
              />
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px 14px 48px",
                  background: "#000000",
                  border: "1px solid rgba(212, 175, 55, 0.2)",
                  borderRadius: "8px",
                  fontSize: "15px",
                  color: "#f5f5f5",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#D4AF37";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(212, 175, 55, 0.1), 0 0 20px rgba(212, 175, 55, 0.3)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(212, 175, 55, 0.2)";
                  e.target.style.boxShadow = "none";
                }}
                required
              />
            </div>
            <button
              type="submit"
              style={{
                padding: "14px 32px",
                background: "linear-gradient(135deg, #D4AF37 0%, #c19820 100%)",
                color: "#0a0a0a",
                border: "none",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "14px",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(212, 175, 55, 0.3)",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
              }}
              className="btn-primary"
            >
              Subscribe
            </button>
          </form>

          <p
            style={{
              fontSize: "12px",
              color: "#666",
              marginTop: "16px",
            }}
          >
            By subscribing, you agree to our Privacy Policy and consent to receive updates
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "24px",
              marginTop: "40px",
            }}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{
                  textAlign: "center",
                  padding: "20px",
                  background: "#000000",
                  border: "1px solid rgba(212, 175, 55, 0.2)",
                  borderRadius: "12px",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>{benefit.icon || "✨"}</div>
                <h3
                  style={{
                    color: "#f5f5f5",
                    marginBottom: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  {benefit.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#a0a0a0" }}>{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
