import React, { useState, useEffect, useRef } from "react";
import { 
  Award, 
  Gem, 
  ShieldCheck, 
  Heart,
  Sparkles,
  CheckCircle2,
  Play,
  UserCheck,
  Truck,
  Settings,
  PenTool,
} from "lucide-react";
import "./AboutPage.css";

// Import local video and images
import heroVideo from "../../images/HeroSectionVideo.mp4";
import bengaliBride from "../../images/imgi_82_gold-50k-1l-hr.jpg";
import gujaratiBride from "../../images/imgi_146_dailywear-25k-50k.jpg";
import upBride from "../../images/imgi_160_rivaah-bangles.jpg";
import punjabiBride from "../../images/imgi_161_rivaah-diamond-jewellery.jpg";

// Counter Animation Component
const AnimatedCounter = ({ end, duration = 4500, suffix = "" }) => {
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
      { threshold: 0.3 }
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

    // Parse the numeric value from strings like "30+", "10K+", "500+"
    let endValue = end;
    if (typeof end === 'string') {
      // Remove +, K and convert
      endValue = end.replace(/\+/g, '').replace(/K/g, '');
      endValue = parseInt(endValue) || 0;
      // If it had K, multiply by 1000
      if (end.includes('K')) {
        endValue = endValue * 1000;
      }
    } else {
      endValue = parseInt(end) || 0;
    }

    const incrementTime = duration / endValue;
    let current = 0;

    const timer = setInterval(() => {
      current += Math.ceil(endValue / 100); // Increment faster for smoother animation
      if (current >= endValue) {
        setCount(endValue);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  const formatCount = (num) => {
    // Format back to K if original had K
    if (typeof end === 'string' && end.includes('K')) {
      return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'K';
    }
    return num;
  };

  return (
    <span ref={counterRef}>
      {formatCount(count)}
      {suffix}
    </span>
  );
};

const AboutPage = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Stats data
  const stats = [
    { value: "30+", label: "Years Experience" },
    { value: "10K+", label: "Happy Customers" },
    { value: "500+", label: "Unique Designs" },
  ];

  // Client-supplied main features
  const features = [
    {
      icon: <Gem size={32} />,
      title: "Certified Quality",
      description: "All our jewellery comes with certification of authenticity, ensuring purity and value.",
    },
    {
      icon: <PenTool size={32} />,
      title: "Custom Designs",
      description: "Get your dream jewellery personalized with our custom design services.",
    },
    {
      icon: <Settings size={32} />,
      title: "24/7 Customer Support",
      description: "Our dedicated team is always here to assist you with all your queries and concerns.",
    },
    {
      icon: <Truck size={32} />,
      title: "Free Insured Shipping",
      description: "Enjoy free, fully insured shipping for a worry-free shopping experience.",
    },
  ];

  // Values
  const values = [
    {
      title: "Quality First",
      description: "Every piece undergoes rigorous quality checks before reaching you",
      icon: <CheckCircle2 size={24} />,
    },
    {
      title: "Traditional Excellence",
      description: "Preserving centuries-old jewelry-making traditions",
      icon: <Sparkles size={24} />,
    },
    {
      title: "Customer Satisfaction",
      description: "Your happiness is our biggest achievement",
      icon: <Heart size={24} />,
    },
  ];

  return (
    <div className="about-page" style={{ overflowY: "auto" }}>
      {/* 4-Image Grid Hero Section */}
      <section 
        className="about-hero"
        data-aos="fade-in"
        data-aos-duration="1000"
      >
        {/* 4-Image Background Grid */}
        <div className="hero-image-grid">
          {[bengaliBride, gujaratiBride, upBride, punjabiBride].map((img, idx) => (
            <div
              key={idx}
              className="hero-image-item"
              style={{ backgroundImage: `url(${img})` }}
              data-aos="zoom-in"
              data-aos-delay={idx * 100}
              data-aos-duration="1200"
            />
          ))}
        </div>
        {/* Dark Overlay */}
        <div className="about-hero-overlay"></div>
        {/* Hero Content */}
        <div 
          className="about-hero-content"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <h1 
            className="about-hero-title"
            data-aos="fade-down"
            data-aos-delay="400"
          >
            About Vardhman Jewels
          </h1>
          <p 
            className="about-hero-subtitle"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            Crafting Timeless Beauty Since 1995
          </p>
        </div>
      </section>

      <div className="about-container">
        {/* Story Section */}
        <section 
          className="about-story"
          data-aos="fade-up"
        >
          <div className="story-grid">
            <div 
              className="story-content"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              <span 
                className="story-badge"
                data-aos="fade-down"
                data-aos-delay="100"
              >
                Our Story
              </span>
              <h2 
                className="story-title"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                Three Decades of Excellence
              </h2>
              <p 
                className="story-text"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                Vardhman Jewels began its journey in 1995 with a simple vision: to bring 
                the finest quality jewelry to every Indian household. What started as a 
                small family business has now grown into one of the most trusted names 
                in the jewelry industry.
              </p>
              <p 
                className="story-text"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                Our commitment to authenticity, craftsmanship, and customer satisfaction 
                has remained unwavering. Today, we continue to blend traditional artistry 
                with modern designs, creating pieces that celebrate life's precious moments.
              </p>
              
              {/* ANIMATED STATS COUNTER */}
              <div 
                className="story-stats"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="stat-item"
                    data-aos="flip-left"
                    data-aos-delay={600 + (index * 100)}
                  >
                    <h3 className="stat-number">
                      <AnimatedCounter 
                        end={stat.value}
                        duration={4500}
                        suffix={stat.value.includes('+') ? '+' : ''}
                      />
                    </h3>
                    <p className="stat-label">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Video Section - LOCAL VIDEO */}
            <div 
              className="story-video"
              data-aos="fade-left"
              data-aos-delay="300"
            >
              {!isVideoPlaying ? (
                <div className="video-placeholder">
                  <img src={bengaliBride} alt="Vardhman Jewels" />
                  <button 
                    className="video-play-btn"
                    onClick={() => setIsVideoPlaying(true)}
                    data-aos="zoom-in"
                    data-aos-delay="500"
                  >
                    <Play size={40} />
                  </button>
                  <div className="video-overlay">
                    <span>Watch Our Story</span>
                  </div>
                </div>
              ) : (
                <div className="video-container">
                  <video
                    width="100%"
                    height="100%"
                    controls
                    autoPlay
                    style={{ borderRadius: '16px', objectFit: 'cover' }}
                  >
                    <source src={heroVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section 
          className="about-features"
          data-aos="fade-up"
        >
          <div 
            className="features-header"
            data-aos="fade-down"
            data-aos-delay="100"
          >
            <span 
              className="features-badge"
              data-aos="fade-up"
              data-aos-delay="150"
            >
              Why Choose Us
            </span>
            <h2 
              className="features-title"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              What Makes Us Special
            </h2>
            <p 
              className="features-subtitle"
              data-aos="fade-up"
              data-aos-delay="250"
            >
              Experience the difference with Vardhman Jewels
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card"
                data-aos="zoom-in"
                data-aos-delay={index * 100}
              >
                <div 
                  className="feature-icon"
                  data-aos="flip-left"
                  data-aos-delay={index * 100 + 100}
                >
                  {feature.icon}
                </div>
                <h3 
                  className="feature-title"
                  data-aos="fade-up"
                  data-aos-delay={index * 100 + 150}
                >
                  {feature.title}
                </h3>
                <p 
                  className="feature-description"
                  data-aos="fade-up"
                  data-aos-delay={index * 100 + 200}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section 
          className="about-values"
          data-aos="fade-up"
        >
          <div 
            className="values-header"
            data-aos="fade-down"
            data-aos-delay="100"
          >
            <span 
              className="values-badge"
              data-aos="fade-up"
              data-aos-delay="150"
            >
              Our Values
            </span>
            <h2 
              className="values-title"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              What We Stand For
            </h2>
          </div>
          <div className="values-grid">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="value-card"
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <div 
                  className="value-icon-wrapper"
                  data-aos="zoom-in"
                  data-aos-delay={index * 150 + 100}
                >
                  <div className="value-icon">{value.icon}</div>
                </div>
                <h3 
                  className="value-title"
                  data-aos="fade-up"
                  data-aos-delay={index * 150 + 150}
                >
                  {value.title}
                </h3>
                <p 
                  className="value-description"
                  data-aos="fade-up"
                  data-aos-delay={index * 150 + 200}
                >
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery and CTA sections (leave as in your current code or adapt as needed) */}

      </div>
    </div>
  );
};

export default AboutPage;
