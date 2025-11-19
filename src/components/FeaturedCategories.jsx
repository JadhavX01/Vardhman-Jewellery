import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import { defaultContent } from "../data/defaultContent";

export function FeaturedCategories() {
  const navigate = useNavigate();
  const { content, resolveMediaUrl } = useContent();

  const categories = (content.categories?.items && content.categories.items.length > 0
    ? content.categories.items
    : defaultContent.categories.items
  ).map((category, idx) => ({
    ...category,
    id: category.id || `category-${idx}`,
    imageUrl: resolveMediaUrl(category.imageUrl || defaultContent.categories.items[idx % defaultContent.categories.items.length].imageUrl),
    description: category.description || category.count || "",
  }));

  const handleCategoryClick = (category) => {
    if (category.link) {
      navigate(category.link);
      return;
    }

    const categoryMap = {
      rings: "/collections?category=ring",
      necklaces: "/collections?category=necklace",
      bracelets: "/collections?category=bracelet",
      earrings: "/collections?category=earring",
    };

    const key = category.name?.toLowerCase();
    const path = (key && categoryMap[key]) || "/collections";
    navigate(path);
  };

  return (
    <section
      style={{
        padding: "60px 20px",
        background: "#000",
        borderBottom: "1px solid rgba(212, 175, 55, 0.2)",
        width: "100%",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontFamily: "var(--font-cursive)",
              fontWeight: 600,
              background: "linear-gradient(135deg, #D4AF37 0%, #EFE1C6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: 12,
            }}
          >
            {content.categories?.title || defaultContent.categories.title}
          </h2>
          {(content.categories?.subtitle || defaultContent.categories.subtitle) && (
            <p
              style={{
                color: "#a0a0a0",
                fontSize: 16,
                maxWidth: 600,
                margin: "0 auto",
              }}
            >
              {content.categories?.subtitle || defaultContent.categories.subtitle}
            </p>
          )}
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
          }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 12,
                cursor: "pointer",
                background: "#000000",
                border: "1px solid rgba(212, 175, 55, 0.2)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.5)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(212, 175, 55, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.2)";
                e.currentTarget.style.boxShadow = "none";
              }}
              onClick={() => handleCategoryClick(category)}
            >
              <div
                style={{
                  position: "relative",
                  aspectRatio: "3 / 4",
                  overflow: "hidden",
                  background: "#000000",
                }}
              >
                <ImageWithFallback
                  src={category.imageUrl}
                  alt={category.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.6s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
                  }}
                ></div>

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: 20,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  >
                    <h3
                      style={{
                        fontSize: "1.5rem",
                        fontFamily: "var(--font-serif)",
                        color: "#f5f5f5",
                        marginBottom: 8,
                        fontWeight: 600,
                      }}
                    >
                      {category.name}
                    </h3>
                    {category.description && (
                      <p
                        style={{
                          color: "#D4AF37",
                          fontSize: 13,
                          marginBottom: 12,
                          fontWeight: 600,
                        }}
                      >
                        {category.description}
                      </p>
                    )}
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        color: "#f5f5f5",
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      Shop now <ArrowRight size={16} />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
