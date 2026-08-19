import React, { useEffect, useState, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "./App.css";

const IMAGES = [
  {
    src: "/images/cups/mango.png",
    bg: "#DE8009", // Haute Mango Orange
    ghostText: "MANGO CREAM",
    title: "L'AMBRE MANGO CRÈME",
    description: "An indulgent masterpiece of dense velvet Alphonso pulp, spun thick and layered delicately with hand-carved fresh fruit gems.",
  },
  {
    src: "/images/cups/avocado.png",
    bg: "#3E532B", // Deep Luxury Avocado Jade Green
    ghostText: "AVOCADO VELVET",
    title: "AVOCADO ÉMULSION",
    description: "Ultra-creamy, rich Haas avocados whipped into a luxurious savory-sweet texture, offering a deeply rich culinary profile.",
  },
  {
    src: "/images/cups/watermelon.png",
    bg: "#A22637", // Vibrant Editorial Watermelon Ruby Red
    ghostText: "RUBY WATERMELON",
    title: "NÉCTAR DE WATERMELON",
    description: "A striking, intense reduction of sweet mountain watermelons, cold-pressed and served with crisp structural clarity.",
  },
];

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [entranceComplete, setEntranceComplete] = useState(false);
  const autoplayTimer = useRef(null);

  useEffect(() => {
    IMAGES.forEach((item) => {
      const img = new Image();
      img.src = item.src;
    });
    
    const timer = setTimeout(() => {
      setEntranceComplete(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const resize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const navigate = (direction) => {
    if (isAnimating) return;
    setIsAnimating(true);

    setActiveIndex((current) => {
      if (direction === "next") {
        return (current + 1) % IMAGES.length;
      }
      return (current + IMAGES.length - 1) % IMAGES.length;
    });

    setTimeout(() => {
      setIsAnimating(false);
    }, 850);
  };

  useEffect(() => {
    autoplayTimer.current = setInterval(() => {
      if (!isAnimating) {
        navigate("next");
      }
    }, 4500);

    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    };
  }, [activeIndex, isAnimating]);

  const handleManualNavigation = (direction) => {
    if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    navigate(direction);
  };

  const center = activeIndex;
  const left = (activeIndex + 2) % 3;
  const right = (activeIndex + 1) % 3;

  const getRole = (index) => {
    if (index === center) return "center";
    if (index === left) return "left";
    if (index === right) return "right";
    return "";
  };

  const getItemStyle = (role) => {
    const base = {
      position: "absolute",
      width: isMobile ? "200px" : "310px", 
      height: isMobile ? "380px" : "580px",
      transition: "all 850ms cubic-bezier(0.25, 1, 0.3, 1)",
      willChange: "transform, filter, opacity, left, bottom",
      bottom: "0",
    };

    if (role === "center") {
      return {
        ...base,
        left: "50%",
        transform: `translateX(-50%) translateY(${isMobile ? "10%" : "6%"}) scale(${isMobile ? 1.25 : 1.45})`,
        filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.3)) blur(0px)",
        opacity: 1,
        zIndex: 20,
      };
    }

    if (role === "left") {
      return {
        ...base,
        left: isMobile ? "6%" : "18%",
        transform: "translateX(-50%) translateY(12%) scale(0.55)",
        filter: "blur(6px)",
        opacity: 0.15,
        zIndex: 10,
      };
    }

    if (role === "right") {
      return {
        ...base,
        left: isMobile ? "94%" : "84%",
        transform: "translateX(-50%) translateY(12%) scale(0.55)",
        filter: "blur(6px)",
        opacity: 0.15,
        zIndex: 10,
      };
    }

    return {
      ...base,
      left: "50%",
      transform: "translateX(-50%) translateY(-60px) scale(0.3)",
      filter: "blur(12px)",
      opacity: 0,
      zIndex: 5,
    };
  };

  const current = IMAGES[activeIndex];

  return (
    <main
      className={`mara-luxury-container ${entranceComplete ? "is-revealed" : ""}`}
      style={{
        backgroundColor: current.bg,
      }}
    >
      <div className="mara-cinematic-shutter" />

      <section className="mara-hero-stage">
        <div className="mara-luxury-grain" />

        <header className="mara-brand-hud">
          <div className="hud-location">AL KARAMA, DUBAI</div>
          <div className="hud-logo">MARA—MARI</div>
          <div className="hud-boutique">THE ARTISANAL REPERTOIRE</div>
        </header>

        <div className="mara-center-stage">
          <div className="mara-ghost-serif">{current.ghostText}</div>

          <div className="mara-carousel-viewport">
            {IMAGES.map((image, index) => {
              const role = getRole(index);
              return (
                <div
                  key={image.src}
                  className="mara-carousel-item"
                  style={getItemStyle(role)}
                >
                  <img
                    src={image.src}
                    alt={image.name}
                    draggable={false}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <footer className="mara-interface-panel">
          <div className="mara-editorial-block">
            <h1 className="mara-product-title">{current.title}</h1>
            <p className="mara-product-description">{current.description}</p>

            <div className="mara-editorial-nav">
              <button
                type="button"
                onClick={() => handleManualNavigation("prev")}
                disabled={isAnimating}
                aria-label="Previous Vintage"
              >
                <ArrowLeft size={18} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => handleManualNavigation("next")}
                disabled={isAnimating}
                aria-label="Next Vintage"
              >
                <ArrowRight size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <a href="#menu" className="mara-luxury-cta">
            <span className="cta-label">EXPLORE THE ENTIRE MENU</span>
            <div className="cta-lux-circle">
              <ArrowRight size={20} strokeWidth={1.25} />
            </div>
          </a>
        </footer>
      </section>
    </main>
  );
}
