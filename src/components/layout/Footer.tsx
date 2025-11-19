import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useContent } from "../../context/ContentContext";
import { defaultContent } from "../../data/defaultContent";

export function Footer() {
  const { content, resolveMediaUrl } = useContent();

  const footerContent = content.footer || defaultContent.footer;
  const quickLinks = footerContent.quickLinks?.length ? footerContent.quickLinks : defaultContent.footer.quickLinks;
  const customerLinks = footerContent.customerLinks?.length ? footerContent.customerLinks : defaultContent.footer.customerLinks;
  const socials = footerContent.socials?.length ? footerContent.socials : defaultContent.footer.socials;
  const newsletter = footerContent.newsletter || defaultContent.footer.newsletter;
  const contact = footerContent.contact || defaultContent.footer.contact;

  const iconMap: Record<string, JSX.Element> = {
    facebook: <Facebook size={20} />,
    instagram: <Instagram size={20} />,
    twitter: <Twitter size={20} />,
  };

  return (
    <footer
      style={{
        background: "#000000",
        borderTop: "1px solid rgba(212, 175, 55, 0.2)",
        padding: "60px 20px 30px",
        marginTop: "80px",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "40px",
            marginBottom: "40px",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              {footerContent.logoUrl ? (
                <img
                  src={resolveMediaUrl(footerContent.logoUrl)}
                  alt={footerContent.brandName || "Vardhman Jewels"}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    boxShadow: "0 4px 15px rgba(212, 175, 55, 0.3)",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    background: "linear-gradient(135deg, #D4AF37 0%, #c19820 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 15px rgba(212, 175, 55, 0.3)",
                  }}
                >
                  <span
                    style={{
                      color: "#000000",
                      fontSize: "24px",
                      fontWeight: "700",
                    }}
                  >
                    {(footerContent.brandName || "V").charAt(0)}
                  </span>
                </div>
              )}
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  background: "linear-gradient(135deg, #D4AF37 0%, #EFE1C6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "1px",
                }}
              >
                {footerContent.brandName || "VARDHMAN JEWELS"}
              </span>
            </div>
            <p
              style={{
                color: "#a0a0a0",
                fontSize: "14px",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {footerContent.description}
            </p>
          </div>

          <div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#D4AF37",
                marginBottom: "20px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Quick Links
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.url}
                    style={{
                      color: "#a0a0a0",
                      textDecoration: "none",
                      fontSize: "14px",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "700",
                background: "linear-gradient(135deg, #D4AF37 0%, #EFE1C6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "20px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Customer Service
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {customerLinks.map((link) => (
                <li key={link.label}>
                  {link.url?.startsWith("http") ? (
                    <a
                      href={link.url}
                      style={{
                        color: "#a0a0a0",
                        textDecoration: "none",
                        fontSize: "14px",
                        transition: "color 0.3s ease",
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.url || "#"}
                      style={{
                        color: "#a0a0a0",
                        textDecoration: "none",
                        fontSize: "14px",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "700",
                background: "linear-gradient(135deg, #D4AF37 0%, #EFE1C6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "20px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {newsletter.title || "Stay Connected"}
            </h3>
            <p
              style={{
                color: "#a0a0a0",
                fontSize: "14px",
                lineHeight: 1.6,
                marginBottom: "20px",
              }}
            >
              {newsletter.description || "Subscribe to receive exclusive updates and offers."}
            </p>
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "24px",
              }}
            >
              <input
                type="email"
                placeholder="Your email"
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  background: "rgba(26, 26, 26, 0.6)",
                  border: "1px solid rgba(212, 175, 55, 0.2)",
                  borderRadius: "8px",
                  color: "#f5f5f5",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              <button
                style={{
                  padding: "12px 20px",
                  background: "linear-gradient(135deg, #D4AF37 0%, #c19820 100%)",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Mail size={18} color="#000000" />
              </button>
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              {socials.map((social) => {
                const platform = social.platform?.toLowerCase();
                const icon = iconMap[platform || ""] || <Instagram size={20} />;
                const href = social.url || "#";
                const isExternal = href.startsWith("http");
                const linkProps = isExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {};

                return (
                  <a
                    key={social.platform || href}
                    href={href}
                    style={{ color: "#a0a0a0", transition: "color 0.3s ease" }}
                    {...linkProps}
                  >
                    {icon}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginTop: "40px",
            color: "#a0a0a0",
            fontSize: "14px",
          }}
        >
          <div>
            <strong style={{ color: "#D4AF37" }}>Address</strong>
            <p style={{ marginTop: "8px", lineHeight: 1.6 }}>
              {contact.addressLine1}
              <br />
              {contact.addressLine2}
            </p>
          </div>
          <div>
            <strong style={{ color: "#D4AF37" }}>Call Us</strong>
            <p style={{ marginTop: "8px", lineHeight: 1.6 }}>
              <a href={`tel:${contact.phone}`} style={{ color: "#a0a0a0" }}>
                {contact.phone}
              </a>
              <br />
              {contact.secondaryPhone && (
                <a href={`tel:${contact.secondaryPhone}`} style={{ color: "#a0a0a0" }}>
                  {contact.secondaryPhone}
                </a>
              )}
            </p>
          </div>
          <div>
            <strong style={{ color: "#D4AF37" }}>Email</strong>
            <p style={{ marginTop: "8px", lineHeight: 1.6 }}>
              <a href={`mailto:${contact.email}`} style={{ color: "#a0a0a0" }}>
                {contact.email}
              </a>
            </p>
          </div>
          <div>
            <strong style={{ color: "#D4AF37" }}>Working Hours</strong>
            <p style={{ marginTop: "8px", lineHeight: 1.6 }}>{contact.hours}</p>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(212, 175, 55, 0.2)",
            paddingTop: "30px",
            textAlign: "center",
            marginTop: "40px",
          }}
        >
          <p
            style={{
              color: "#a0a0a0",
              fontSize: "14px",
              margin: 0,
              letterSpacing: "0.5px",
            }}
          >
            {footerContent.copyright || defaultContent.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
