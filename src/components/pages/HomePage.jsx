import { useEffect, useMemo, useState, useRef } from "react";
import {
  ArrowRight,
  Loader2,
  TrendingUp,
  Star,
  Award,
  Sparkles,
  ShieldCheck,
  Users,
  Heart,
  Gem,
} from "lucide-react";
import { Link } from "react-router-dom";
import { FeaturedCategories } from "../FeaturedCategories";
import { Newsletter } from "../Newsletter";
import { getAllProducts } from "../../services/productService";
import { useContent } from "../../context/ContentContext";
import { defaultContent } from "../../data/defaultContent";

const iconMap = {
  award: Award,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  users: Users,
  heart: Heart,
  gem: Gem,
};

const resolveIconComponent = (name) => {
  if (!name) return null;
  const key = name.toLowerCase();
  return iconMap[key] || null;
};

// Counter Animation Component
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            setIsVisible(true);
            hasAnimated.current = true;
          }
        });
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const endValue = parseInt(end.toString().replace(/[^0-9]/g, "")) || 0;
    const incrementTime = duration / endValue;
    let current = 0;

    const timer = setInterval(() => {
      current += 1;
      setCount(current);
      if (current >= endValue) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return (
    <span ref={counterRef}>
      {count}
      {suffix}
    </span>
  );
};

export default function HomePage({
  onAddToCart: _onAddToCart,
  onQuickView: _onQuickView,
  onToggleWishlist: _onToggleWishlist,
  isInWishlist: _isInWishlist,
  productRefreshCounter,
}) {
  const { content, resolveMediaUrl } = useContent();
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = useMemo(() => {
    const slides = content.hero?.slides;
    if (Array.isArray(slides) && slides.length > 0) {
      return slides;
    }
    return defaultContent.hero.slides;
  }, [content.hero]);

  const categoryImageMap = useMemo(() => {
    const items = content.categories?.items?.length
      ? content.categories.items
      : defaultContent.categories.items;
    const map = new Map();
    items.forEach((item) => {
      if (!item?.name) return;
      map.set(item.name.toLowerCase(), item.imageUrl);
    });
    return map;
  }, [content.categories]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        setLoadingTrending(true);
        const products = await getAllProducts({ limit: 20 });
        const trending = products
          .filter((product) => product.DiscountPrice || Math.random() > 0.5)
          .slice(0, 6);
        setTrendingProducts(trending);
      } catch (error) {
        console.error("Error loading trending products:", error);
        setTrendingProducts([]);
      } finally {
        setLoadingTrending(false);
      }
    };

    loadTrending();
  }, [productRefreshCounter]);

  const getCategoryImage = (product) => {
    const categoryName =
      product.SubCategory?.toLowerCase() ||
      product.Category?.toLowerCase() ||
      product.Description?.toLowerCase() ||
      "";

    for (const [name, image] of categoryImageMap.entries()) {
      if (categoryName.includes(name)) {
        return resolveMediaUrl(image);
      }
    }

    return resolveMediaUrl(defaultContent.categories.items[0].imageUrl);
  };

  const resolvedWhyChoose = useMemo(() => {
    const data = content.whyChoose || {};
    const items = Array.isArray(data.items) && data.items.length > 0
      ? data.items
      : defaultContent.whyChoose.items;

    return {
      title: data.title || defaultContent.whyChoose.title,
      subtitle: data.subtitle || defaultContent.whyChoose.subtitle,
      items,
    };
  }, [content.whyChoose]);

  const trendingCards = useMemo(() => {
    const configuredItems = content.trending?.items;
    if (Array.isArray(configuredItems) && configuredItems.length > 0) {
      return configuredItems.map((item, idx) => ({
        ...item,
        id: item.id || `configured-trend-${idx}`,
        mediaUrl: resolveMediaUrl(item.mediaUrl) || resolveMediaUrl(defaultContent.trending.items[idx % defaultContent.trending.items.length].mediaUrl),
      }));
    }

    if (trendingProducts.length > 0) {
      return trendingProducts.map((product) => ({
        id: product.LotNo || product.ItemNo,
        title: product.Description || product.SubCategory || "Trending Item",
        description: product.SubCategory || "Premium Collection",
        mediaUrl: getCategoryImage(product),
        badge: `₹${(product.DiscountPrice || product.DisplayPrice || product.OAmt || 0).toLocaleString("en-IN")}`,
      }));
    }

    return defaultContent.trending.items.map((item, idx) => ({
      ...item,
      id: item.id || `default-trend-${idx}`,
      mediaUrl: resolveMediaUrl(item.mediaUrl),
    }));
  }, [content.trending, trendingProducts, resolveMediaUrl, getCategoryImage]);

  const aboutContent = useMemo(() => {
    const about = content.about || {};
    return {
      title: about.title || defaultContent.about.title,
      subtitle: about.subtitle || defaultContent.about.subtitle,
      description: about.description || defaultContent.about.description,
      richText: about.richText?.length ? about.richText : defaultContent.about.richText,
      stats: about.stats?.length ? about.stats : defaultContent.about.stats,
      media: about.media || defaultContent.about.media,
    };
  }, [content.about]);

  const testimonials = useMemo(() => {
    const items = content.testimonials?.items;
    if (Array.isArray(items) && items.length > 0) {
      return items.map((item, idx) => ({
        ...item,
        id: item.id || `testimonial-${idx}`,
        rating: item.rating || 5,
        photoUrl: resolveMediaUrl(item.photoUrl),
      }));
    }
    return defaultContent.testimonials.items.map((item, idx) => ({
      ...item,
      id: item.id || `default-testimonial-${idx}`,
      photoUrl: resolveMediaUrl(item.photoUrl),
    }));
  }, [content.testimonials, resolveMediaUrl]);

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#f5f5f5" }}>
      {/* Hero Section - Fade in */}
      <section
        data-aos="fade-in"
        data-aos-duration="800"
        style={{
          width: "100%",
          background: "#000",
          paddingTop: "100px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "600px",
            overflow: "hidden",
          }}
        >
          {heroSlides.map((rawSlide, index) => {
            const fallback = defaultContent.hero.slides[index] || defaultContent.hero.slides[0];
            const slide = { ...fallback, ...rawSlide };
            const mediaUrl = resolveMediaUrl(slide.mediaUrl || fallback.mediaUrl);
            const isVideo = (slide.mediaType || fallback.mediaType) === "video" || mediaUrl?.endsWith(".mp4");

            const primaryButton = slide.primaryButton || fallback.primaryButton;
            const secondaryButton = slide.secondaryButton || fallback.secondaryButton;

            return (
              <div
                key={slide.id || index}
                className={`carousel-slide ${index === currentSlide ? "active" : "inactive"}`}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: index === currentSlide ? 1 : 0,
                  transition: "opacity 0.6s ease-in-out",
                }}
              >
                {isVideo ? (
                  <video
                    src={mediaUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <img
                    src={mediaUrl}
                    alt={slide.headline}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    padding: "40px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                      fontFamily: "var(--font-cursive)",
                      fontWeight: 700,
                      background: "linear-gradient(135deg, #D4AF37 0%, #EFE1C6 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      marginBottom: "16px",
                    }}
                  >
                    {slide.headline}
                  </h1>
                  {slide.subheadline && (
                    <h2
                      style={{
                        fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                        color: "#D4AF37",
                        fontWeight: 600,
                        marginBottom: "16px",
                      }}
                    >
                      {slide.subheadline}
                    </h2>
                  )}
                  {slide.description && (
                    <p
                      style={{
                        fontSize: "clamp(1rem, 2vw, 1.25rem)",
                        color: "#f5f5f5",
                        maxWidth: "700px",
                        marginBottom: "32px",
                      }}
                    >
                      {slide.description}
                    </p>
                  )}
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    {primaryButton?.text && (
                      <Link to={primaryButton.link || "/collections"}>
                        <button className="btn-primary">
                          {primaryButton.text}
                          <ArrowRight size={18} style={{ marginLeft: "8px" }} />
                        </button>
                      </Link>
                    )}
                    {secondaryButton?.text && (
                      <Link to={secondaryButton.link || "/contact"}>
                        <button className="btn-secondary">{secondaryButton.text}</button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <button
            onClick={() =>
              setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
            }
            style={{
              position: "absolute",
              left: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#D4AF37",
              fontSize: "48px",
              zIndex: 10,
              padding: "10px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#EFE1C6";
              e.currentTarget.style.transform = "translateY(-50%) scale(1.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#D4AF37";
              e.currentTarget.style.transform = "translateY(-50%) scale(1)";
            }}
          >
            ←
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
            style={{
              position: "absolute",
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#D4AF37",
              fontSize: "48px",
              zIndex: 10,
              padding: "10px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#EFE1C6";
              e.currentTarget.style.transform = "translateY(-50%) scale(1.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#D4AF37";
              e.currentTarget.style.transform = "translateY(-50%) scale(1)";
            }}
          >
            →
          </button>

          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "12px",
              zIndex: 10,
            }}
          >
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                style={{
                  width: index === currentSlide ? "32px" : "12px",
                  height: "12px",
                  borderRadius: index === currentSlide ? "6px" : "50%",
                  background: index === currentSlide ? "#D4AF37" : "rgba(212, 175, 55, 0.3)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <div data-aos="fade-up" data-aos-delay="100">
        <FeaturedCategories />
      </div>

      {/* Why Choose Section */}
      <section
        data-aos="fade-up"
        style={{
          background: "#000",
          padding: "80px 20px",
          borderTop: "1px solid rgba(212, 175, 55, 0.2)",
          borderBottom: "1px solid rgba(212, 175, 55, 0.2)",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <h2
            data-aos="fade-down"
            data-aos-delay="100"
            style={{
              fontFamily: "var(--font-cursive)",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              background: "linear-gradient(135deg, #D4AF37 0%, #EFE1C6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            {resolvedWhyChoose.title}
          </h2>
          {resolvedWhyChoose.subtitle && (
            <p
              data-aos="fade-up"
              data-aos-delay="150"
              style={{
                color: "#a0a0a0",
                textAlign: "center",
                marginBottom: "40px",
                fontSize: "16px",
              }}
            >
              {resolvedWhyChoose.subtitle}
            </p>
          )}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "30px",
            }}
          >
            {resolvedWhyChoose.items.map((item, idx) => {
              const Icon = item.iconUrl
                ? null
                : resolveIconComponent(item.icon) || resolveIconComponent(item.iconName);
              const iconColor = item.iconColor || "#D4AF37";

              return (
                <div 
                  key={item.id || idx} 
                  className="card" 
                  style={{ textAlign: "center" }}
                  data-aos="zoom-in"
                  data-aos-delay={idx * 100}
                >
                  <div
                    style={{
                      color: iconColor,
                      marginBottom: "20px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {item.iconUrl ? (
                      <img
                        src={resolveMediaUrl(item.iconUrl)}
                        alt={item.title}
                        style={{ width: "48px", height: "48px", objectFit: "contain" }}
                      />
                    ) : Icon ? (
                      <Icon size={40} />
                    ) : (
                      <Award size={40} />
                    )}
                  </div>
                  <h3
                    style={{
                      fontSize: "1.5rem",
                      color: "#f5f5f5",
                      marginBottom: "12px",
                      fontWeight: 700,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ color: "#a0a0a0", fontSize: "14px", lineHeight: "1.6" }}>
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section
        data-aos="fade-up"
        style={{
          background: "#000",
          padding: "80px 20px",
          borderBottom: "1px solid rgba(212, 175, 55, 0.2)",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div 
            data-aos="fade-right"
            style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }}
          >
            <TrendingUp size={32} color="#D4AF37" />
            <h2 className="cursive-heading" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
              {content.trending?.title || defaultContent.trending.title}
            </h2>
          </div>

          {content.trending?.subtitle && (
            <p 
              data-aos="fade-up"
              data-aos-delay="100"
              style={{ color: "#a0a0a0", marginBottom: "36px" }}
            >
              {content.trending.subtitle}
            </p>
          )}

          {loadingTrending && (!content.trending?.items || content.trending.items.length === 0) ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <Loader2
                className="spinner"
                style={{ width: "48px", height: "48px", margin: "0 auto 16px", color: "#D4AF37" }}
              />
              <p style={{ color: "#a0a0a0" }}>Loading trending products...</p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "30px",
              }}
            >
              {trendingCards.map((card, idx) => (
                <div 
                  key={card.id} 
                  className="card" 
                  style={{ padding: 0, overflow: "hidden" }}
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                >
                  <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
                    <img
                      src={card.mediaUrl}
                      alt={card.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    {card.badge && (
                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          background: "rgba(212, 175, 55, 0.9)",
                          color: "#000",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        {card.badge}
                      </div>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
                        padding: "20px",
                      }}
                    >
                      <h3 style={{ color: "#D4AF37", fontSize: "1.5rem", marginBottom: "8px", fontWeight: 700 }}>
                        {card.title}
                      </h3>
                      {card.description && (
                        <p style={{ color: "#f5f5f5", fontSize: "14px", marginBottom: "8px" }}>
                          {card.description}
                        </p>
                      )}
                      {card.link && (
                        <Link to={card.link} style={{ color: "#D4AF37", fontWeight: 600, fontSize: "14px" }}>
                          View collection
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section
        data-aos="fade-up"
        style={{
          background: "#000",
          padding: "80px 20px",
          borderBottom: "1px solid rgba(212, 175, 55, 0.2)",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <h2 
            className="cursive-heading" 
            data-aos="fade-down"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", textAlign: "center", marginBottom: "60px" }}
          >
            {aboutContent.title}
          </h2>

          <div
            className="about-video-section"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "60px",
              alignItems: "center",
            }}
          >
            <div
              className="video-container"
              data-aos="fade-right"
              data-aos-delay="200"
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                border: "2px solid rgba(212, 175, 55, 0.3)",
                boxShadow: "0 12px 40px rgba(212, 175, 55, 0.3)",
              }}
            >
              {aboutContent.media?.type === "video" ? (
                <video
                  src={resolveMediaUrl(aboutContent.media.url)}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <img
                  src={resolveMediaUrl(aboutContent.media?.url)}
                  alt={aboutContent.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </div>

            <div data-aos="fade-left" data-aos-delay="300">
              <h3
                style={{
                  fontFamily: "var(--font-cursive)",
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  color: "#D4AF37",
                  marginBottom: "20px",
                  fontWeight: 700,
                }}
              >
                {aboutContent.subtitle}
              </h3>
              <p style={{ color: "#f5f5f5", fontSize: "16px", lineHeight: 1.8, marginBottom: "20px" }}>
                {aboutContent.description}
              </p>
              {aboutContent.richText?.map((paragraph, idx) => (
                <p key={idx} style={{ color: "#a0a0a0", fontSize: "15px", lineHeight: 1.8, marginBottom: "16px" }}>
                  {paragraph}
                </p>
              ))}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: "20px",
                }}
              >
                {aboutContent.stats?.map((stat, idx) => (
                  <div 
                    key={stat.label || idx} 
                    className="card" 
                    style={{ textAlign: "center", padding: "20px" }}
                    data-aos="flip-left"
                    data-aos-delay={idx * 100}
                  >
                    <div style={{ fontSize: "2.5rem", color: "#D4AF37", fontWeight: 700, marginBottom: "8px" }}>
                      <AnimatedCounter 
                        end={stat.value} 
                        duration={2500}
                        suffix={stat.value.includes('+') ? '+' : ''}
                      />
                    </div>
                    <div style={{ color: "#a0a0a0", fontSize: "14px" }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        data-aos="fade-up"
        style={{
          background: "#000",
          padding: "80px 20px",
          borderBottom: "1px solid rgba(212, 175, 55, 0.2)",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <h2 
            className="cursive-heading" 
            data-aos="fade-down"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", textAlign: "center", marginBottom: "20px" }}
          >
            {content.testimonials?.title || defaultContent.testimonials.title}
          </h2>
          {(content.testimonials?.subtitle || defaultContent.testimonials.subtitle) && (
            <p 
              data-aos="fade-up"
              data-aos-delay="100"
              style={{ color: "#a0a0a0", textAlign: "center", marginBottom: "60px" }}
            >
              {content.testimonials?.subtitle || defaultContent.testimonials.subtitle}
            </p>
          )}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "30px",
            }}
          >
            {testimonials.map((testimonial, idx) => (
              <div 
                key={testimonial.id} 
                className="card" 
                style={{ position: "relative", paddingTop: testimonial.photoUrl ? "60px" : "24px" }}
                data-aos="fade-up"
                data-aos-delay={idx * 150}
              >
                {testimonial.photoUrl && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-40px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "3px solid #D4AF37",
                    }}
                  >
                    <img
                      src={testimonial.photoUrl}
                      alt={testimonial.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                )}
                <div style={{ display: "flex", gap: "4px", marginBottom: "16px", color: "#D4AF37" }}>
                  {Array.from({ length: testimonial.rating || 5 }).map((_, index) => (
                    <Star key={index} size={18} fill="#D4AF37" />
                  ))}
                </div>
                <p
                  style={{
                    color: "#f5f5f5",
                    fontSize: "15px",
                    lineHeight: 1.8,
                    marginBottom: "16px",
                    fontStyle: "italic",
                  }}
                >
                  "{testimonial.review}"
                </p>
                <p style={{ color: "#D4AF37", fontWeight: 700, fontSize: "14px" }}>
                  {testimonial.name}
                </p>
                {testimonial.role && (
                  <p style={{ color: "#a0a0a0", fontSize: "13px" }}>{testimonial.role}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <div data-aos="fade-up" data-aos-delay="100">
        <Newsletter />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-video-section {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </div>
  );
}
