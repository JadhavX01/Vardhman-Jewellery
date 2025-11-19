import heroVideo from "../images/HeroSectionVideo.mp4";
import heroSlide1 from "../images/Home1.jpg";
import heroSlide2 from "../images/Home2.jpg";
import heroSlide3 from "../images/Home3.jpg";
import fallbackProduct1 from "../images/imgi_61_office-wear.jpg";
import fallbackProduct2 from "../images/imgi_62_modern-wear.jpg";
import fallbackProduct3 from "../images/imgi_170_punjabi-bride.jpg";
import aboutImage1 from "../images/imgi_82_gold-50k-1l-hr.jpg";
import aboutImage2 from "../images/imgi_146_dailywear-25k-50k.jpg";
import aboutImage3 from "../images/imgi_160_rivaah-bangles.jpg";
import aboutImage4 from "../images/imgi_161_rivaah-diamond-jewellery.jpg";
import categoryRing from "../images/ring2.jpg";
import categoryNecklace from "../images/imgi_155_navraani-hr.jpg";
import categoryBracelet from "../images/imgi_240_bracelets-cat.jpg";
import categoryEarring from "../images/imgi_241_bangles-cat.jpg";
import testimonial1 from "../images/imgi_258_karwachauth.jpg";
import testimonial2 from "../images/imgi_173_up-bride.jpg";
import testimonial3 from "../images/imgi_168_marathi-bride.jpg";
import footerLogo from "../images/hero1.jpg";

export const defaultContent = {
  hero: {
    slides: [
      {
        id: "slide-1",
        headline: "Timeless Elegance",
        subheadline: "Bridal Collection",
        description: "Discover the brilliance of exquisite jewelry, crafted to perfection.",
        mediaType: "image",
        mediaUrl: heroSlide1,
        primaryButton: {
          text: "Explore Collection",
          link: "/collections",
        },
        secondaryButton: {
          text: "Contact Us",
          link: "/contact",
        },
      },
      {
        id: "slide-2",
        headline: "Pure Gold Brilliance",
        subheadline: "Traditional Designs",
        description: "Artisans shape the finest gold into timeless treasures.",
        mediaType: "image",
        mediaUrl: heroSlide2,
        primaryButton: {
          text: "Browse Designs",
          link: "/collections",
        },
        secondaryButton: {
          text: "Book an Appointment",
          link: "/contact",
        },
      },
      {
        id: "slide-3",
        headline: "Your Story, Your Style",
        subheadline: "Custom Jewelry",
        description: "Create personalized pieces with our master jewelers.",
        mediaType: "image",
        mediaUrl: heroSlide3,
        primaryButton: {
          text: "Start Custom Design",
          link: "/contact",
        },
        secondaryButton: {
          text: "Explore Trends",
          link: "/collections",
        },
      },
    ],
  },
  about: {
    title: "About Vardhman Jewels",
    subtitle: "Our Legacy of Excellence",
    description:
      "Celebrating tradition, luxury, and innovation since 1995. Each piece is expertly crafted and chosen to inspire confidence, beauty, and lasting memories.",
    richText: [
      "With over three decades of excellence, Vardhman Jewels has been a trusted name in fine jewelry.",
      "Our master craftsmen combine traditional techniques with modern design, creating pieces that are both timeless and contemporary.",
    ],
    media: {
      type: "video",
      url: heroVideo,
      fallbackImage: aboutImage1,
    },
    mosaic: [aboutImage1, aboutImage2, aboutImage3, aboutImage4],
    stats: [
      { label: "Years of Excellence", value: "30+" },
      { label: "Happy Customers", value: "10K+" },
      { label: "Unique Designs", value: "500+" },
    ],
  },
  categories: {
    title: "Shop by Category",
    subtitle: "Explore our curated collections of exquisite jewelry pieces",
    items: [
      {
        id: "rings",
        name: "Rings",
        description: "120+ Designs",
        imageUrl: categoryRing,
        link: "/collections?category=ring",
      },
      {
        id: "necklaces",
        name: "Necklaces",
        description: "85+ Designs",
        imageUrl: categoryNecklace,
        link: "/collections?category=necklace",
      },
      {
        id: "bracelets",
        name: "Bracelets",
        description: "65+ Designs",
        imageUrl: categoryBracelet,
        link: "/collections?category=bracelet",
      },
      {
        id: "earrings",
        name: "Earrings",
        description: "95+ Designs",
        imageUrl: categoryEarring,
        link: "/collections?category=earring",
      },
    ],
  },
  whyChoose: {
    title: "Why Choose Vardhman Jewels",
    subtitle: "Experience the difference with Vardhman Jewels",
    items: [
      {
        id: "quality",
        title: "Certified Quality",
        description: "All our jewelry is BIS hallmarked and certified.",
        icon: "award",
      },
      {
        id: "craftsmanship",
        title: "Expert Craftsmanship",
        description: "Handcrafted by master artisans with decades of experience.",
        icon: "sparkles",
      },
      {
        id: "warranty",
        title: "Lifetime Warranty",
        description: "We stand behind the quality of every piece we create.",
        icon: "shield-check",
      },
      {
        id: "customers",
        title: "Trusted by Thousands",
        description: "Over 10,000+ happy customers across India.",
        icon: "users",
      },
    ],
  },
  trending: {
    title: "Trending Now",
    subtitle: "Curated pieces our customers love right now",
    items: [
      {
        id: "trend-1",
        title: "Office Wear Collection",
        description: "Professional elegance for every occasion",
        mediaUrl: fallbackProduct1,
        badge: "🔥 45+ Sales",
        link: "/collections",
      },
      {
        id: "trend-2",
        title: "Modern Designs",
        description: "Contemporary jewelry for the modern woman",
        mediaUrl: fallbackProduct2,
        badge: "🔥 38+ Sales",
        link: "/collections",
      },
      {
        id: "trend-3",
        title: "Bridal Collection",
        description: "Timeless pieces for your special day",
        mediaUrl: fallbackProduct3,
        badge: "🔥 52+ Sales",
        link: "/collections",
      },
    ],
  },
  testimonials: {
    title: "What Our Customers Say",
    subtitle: "Stories from the people who wear our creations",
    items: [
      {
        id: "testimonial-1",
        name: "Priya Sharma",
        role: "Mumbai, India",
        review: "Absolutely stunning jewelry! The quality is exceptional and the service was outstanding.",
        rating: 5,
        photoUrl: testimonial1,
      },
      {
        id: "testimonial-2",
        name: "Rajesh Kumar",
        role: "Delhi, India",
        review: "Bought a gold necklace for my wife. She loves it! Highly recommend Vardhman Jewels.",
        rating: 5,
        photoUrl: testimonial2,
      },
      {
        id: "testimonial-3",
        name: "Anita Patel",
        role: "Ahmedabad, India",
        review: "The craftsmanship is incredible. Every piece tells a story of elegance and luxury.",
        rating: 5,
        photoUrl: testimonial3,
      },
    ],
  },
  footer: {
    logoUrl: footerLogo,
    brandName: "Vardhman Jewels",
    description: "Timeless elegance and exceptional craftsmanship in every piece.",
    quickLinks: [
      { label: "Collections", url: "/collections" },
      { label: "Rings", url: "/collections?category=ring" },
      { label: "Necklaces", url: "/collections?category=necklace" },
      { label: "Bracelets", url: "/collections?category=bracelet" },
      { label: "Earrings", url: "/collections?category=earring" },
    ],
    customerLinks: [
      { label: "Contact Us", url: "/contact" },
      { label: "Shipping & Returns", url: "#" },
      { label: "Size Guide", url: "#" },
      { label: "Care Instructions", url: "#" },
      { label: "FAQ", url: "#" },
    ],
    contact: {
      phone: "+91 98765 43210",
      secondaryPhone: "+91 98765 43211",
      email: "info@vardhmanjewels.com",
      addressLine1: "123, Jewelry Market, Main Road",
      addressLine2: "Mumbai, Maharashtra 400001",
      hours: "Mon - Sat: 10:00 AM - 8:00 PM",
    },
    socials: [
      { platform: "Facebook", url: "https://facebook.com" },
      { platform: "Instagram", url: "https://instagram.com" },
      { platform: "Twitter", url: "https://twitter.com" },
    ],
    newsletter: {
      title: "Stay Connected",
      description: "Subscribe to receive exclusive updates and offers.",
    },
    newsletterBenefits: [
      { icon: "🎁", title: "Exclusive Deals", description: "Members-only discounts" },
      { icon: "✨", title: "Early Access", description: "Shop new arrivals first" },
      { icon: "💎", title: "VIP Service", description: "Priority customer support" },
    ],
    copyright: "© 2025 Vardhman Jewels. All rights reserved. Crafted with excellence.",
  },
  contact: {
    heroTitle: "Get in Touch",
    heroSubtitle: "We'd love to hear from you. Let's create something beautiful together.",
    infoCards: [
      {
        id: "contact-phone",
        title: "Phone",
        details: ["+91 98765 43210", "+91 98765 43211"],
        link: "tel:+919876543210",
      },
      {
        id: "contact-email",
        title: "Email",
        details: ["info@vardhmanjewels.com", "support@vardhmanjewels.com"],
        link: "mailto:info@vardhmanjewels.com",
      },
      {
        id: "contact-address",
        title: "Address",
        details: ["123, Jewelry Market, Main Road", "Mumbai, Maharashtra 400001"],
        link: "https://maps.google.com",
      },
      {
        id: "contact-hours",
        title: "Business Hours",
        details: ["Mon - Sat: 10:00 AM - 8:00 PM", "Sunday: 11:00 AM - 6:00 PM"],
        link: null,
      },
    ],
    mapEmbedUrl: "",
  },
};

