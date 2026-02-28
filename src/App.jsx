import { useEffect,useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import SecretGate from "./SecretGate";


function App() {
  const [step, setStep] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [direction, setDirection] = useState(0);
  const images = Array.from({ length: 55 }, (_, i) => `/fotos/${i + 1}.jpeg`);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showFinalEffect, setShowFinalEffect] = useState(false);

  const goToStep = (nextStep) => {
    setIsTransitioning(true);

    setTimeout(() => {
      setStep(nextStep);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 500);
  };

  const nextImage = () => {
    setDirection(1);
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setDirection(-1);
    setSelectedIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };
  const goToImage = (index) => {
    setDirection(index > selectedIndex ? 1 : -1);
    setSelectedIndex(index);
  };

  return (
    <SecretGate>
      <div style={styles.container}>
        <FloatingHearts />
        {showFinalEffect && <HeartExplosion />}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                position: "fixed",
                inset: 0,
                background: "black",
                zIndex: 999
              }}
            />
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <ScreenWrapper key="intro">
              <IntroScreen onNext={() => goToStep(1)} />
            </ScreenWrapper>
          )}

          {step === 1 && (
            <ScreenWrapper key="timeline">
              <Timeline onNext={() => goToStep(2)} />
            </ScreenWrapper>
          )}
          
          {step === 2 && (
            <ScreenWrapper key="gallery">
              <GalleryMosaic onImageClick={(index) => setSelectedIndex(index)} />
              <button style={styles.button} onClick={() => goToStep(3)}>
                Continuar
              </button>
            </ScreenWrapper>
          )}
          <AnimatePresence>
            {selectedIndex !== null && (
              <ImageModal
                images={images}
                currentIndex={selectedIndex}
                direction={direction}
                onClose={() => setSelectedIndex(null)}
                onNext={nextImage}
                onPrev={prevImage}
                goToImage={goToImage}
              />
            )}
          </AnimatePresence>
          {step === 3 && (
            <ScreenWrapper key="letter">
              <LoveLetter onNext={() => {
                goToStep(4);
                setTimeout(() => {
                  setShowFinalEffect(true);
                  const audio = document.getElementById("bgMusic");
                  if (audio) audio.volume = 1; // sube volumen
                }, 800);
              }} />
            </ScreenWrapper>
          )}

          {step === 4 && (
            <ScreenWrapper key="final">
              <FinalSurprise />
            </ScreenWrapper>
          )}
        </AnimatePresence>
      </div>
    </SecretGate>

  );
}

function ScreenWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(8px)", scale: 0.98 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      exit={{ opacity: 0, filter: "blur(8px)", scale: 1.02 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  );
}

function IntroScreen({ onNext }) {
  return (
    <div style={styles.screen}>
      <h1 style={styles.title}>Accediendo al sistema...</h1>
      <p>Usuario detectado: AmorDeMiVida ❤️</p>
      <button style={styles.button} onClick={onNext}>
        Ingresar
      </button>
    </div>
  );
}

function Timeline({ onNext }) {
  const startDate = new Date("2025-03-08T00:00:00");
  const [isReady, setIsReady] = useState(false);

  const [timeData, setTimeData] = useState({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
});
  const [showCounter, setShowCounter] = useState(false);
  const [dots, setDots] = useState("");

  // Animación de puntos ...
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(dotInterval);
  }, []);

  // Delay antes de mostrar contador
  useEffect(() => {
    const delay = setTimeout(() => {
      setShowCounter(true);

      // 👇 damos un pequeño tiempo para que termine la animación
      setTimeout(() => {
        setIsReady(true);
      }, 800);

    }, 3000);

    return () => clearTimeout(delay);
  }, []);

  // Contador real
useEffect(() => {
  if (!showCounter) return;

  const calculateTime = () => {
    const now = new Date();
    const difference = now - startDate;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (difference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    setTimeData({ days, hours, minutes, seconds });
  };

  // 👇 Ejecutamos inmediatamente
  calculateTime();

  const interval = setInterval(calculateTime, 1000);

  return () => clearInterval(interval);
}, [showCounter]);

  return (
    <div style={styles.screen}>
      <h2 style={styles.title}>Nuestra Historia ❤️</h2>

      <p>Desde el 08 de Marzo del 2025...</p>

      {!showCounter && (
        <p style={{ marginTop: "20px", fontSize: "18px" }}>
          Calculando tiempo juntos{dots}
        </p>
      )}

      {showCounter && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          style={{ marginTop: "20px" }}
        >
          <h3 style={{ fontWeight: "normal" }}>
            Hemos estado juntos por:
          </h3>

          <p style={{ fontSize: "20px", marginTop: "10px" }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              style={styles.counterContainer}
            >
              <TimeBox label="DÍAS" value={timeData.days} />
              <TimeBox label="HORAS" value={timeData.hours} />
              <TimeBox label="MIN" value={timeData.minutes} />
              <TimeBox label="SEG" value={timeData.seconds} />
            </motion.div>
          </p>
        </motion.div>
      )}

      {isReady && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={styles.button}
          onClick={onNext}
        >
          Continuar
        </motion.button>
      )}
    </div>
  );
}

function TimeBox({ label, value }) {
  return (
    <div style={styles.timeBox}>
      <motion.div
        key={value}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={styles.timeNumber}
      >
        {String(value).padStart(2, "0")}
      </motion.div>
      <div style={styles.timeLabel}>{label}</div>
    </div>
  );
}

function LoveLetter({ onNext }) {
  const paragraphs = [
    "Desde que llegaste a mi vida, todo cambió.",
    "Aprendí que el amor no es perfecto… pero contigo se siente perfecto.",
    "Gracias por cada risa, cada abrazo y cada momento juntos.",
    "Si tuviera que elegir mil veces… mil veces volvería a elegirte.",
    "Feliz cumpleaños, mi amor ❤️"
  ];

  const [displayedText, setDisplayedText] = useState("");
  const [paragraphIndex, setParagraphIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (paragraphIndex >= paragraphs.length) {
      setIsFinished(true);
      return;
    }

    if (charIndex < paragraphs[paragraphIndex].length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + paragraphs[paragraphIndex][charIndex]);
        setCharIndex(prev => prev + 1);
      }, 35);

      return () => clearTimeout(timeout);
    } else {
      const pause = setTimeout(() => {
        setDisplayedText(prev => prev + "\n\n");
        setParagraphIndex(prev => prev + 1);
        setCharIndex(0);
      }, 800); // 👈 pausa entre párrafos

      return () => clearTimeout(pause);
    }
  }, [charIndex, paragraphIndex]);

  return (
    <div style={styles.screen}>
      <h2 style={styles.title}>Una carta para ti 💌</h2>

      <p style={styles.letterText}>
        {displayedText}
        {!isFinished && <span style={styles.cursor}>|</span>}
      </p>

      {isFinished && (
        <button style={styles.button} onClick={onNext}>
          Continuar
        </button>
      )}
    </div>
  );
}

function GalleryMosaic({ onImageClick }) {
  const images = Array.from({ length: 55 }, (_, i) => `/fotos/${i + 1}.jpeg`);

  return (
    <div style={styles.screen}>
      <h2 style={styles.title}>Nuestros 55 Momentos 💕</h2>

      <div style={styles.mosaicGrid}>
        {images.map((src, index) => (
          <motion.img
            key={index}
            src={src}
            style={styles.mosaicImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.03 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => onImageClick(index)}
          />
        ))}
      </div>
    </div>
  );
}

function ImageModal({
  images,
  currentIndex,
  direction,
  onClose,
  onNext,
  onPrev,
  goToImage
}) {

  // 🎹 Soporte teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev]);

  // 🚀 Preload siguiente y anterior
  useEffect(() => {
    const nextIndex = (currentIndex + 1) % images.length;
    const prevIndex =
      currentIndex === 0 ? images.length - 1 : currentIndex - 1;

    new Image().src = images[nextIndex];
    new Image().src = images[prevIndex];
  }, [currentIndex, images]);

  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      onNext();
    }, 4000); // cambia cada 4s

    return () => clearInterval(interval);
  }, [isPlaying, onNext]);

  return (
    <motion.div
      style={styles.modalOverlay}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Contenedor interno para evitar cerrar al hacer click en imagen */}
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "900px",
        height: "90dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >

        {/* Botón cerrar */}
        <button style={styles.closeBtn} onClick={onClose}>
          ✖
        </button>

        {/* Botón anterior */}
        <button style={styles.navLeft} onClick={onPrev}>
          ‹
        </button>

        {/* Imagen animada */}
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            style={styles.modalImage}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, info) => {
              if (info.offset.x < -100) onNext();
              if (info.offset.x > 100) onPrev();
            }}
            initial={{
              x: direction > 0 ? 120 : -120,
              opacity: 0,
              scale: 0.96
            }}
            animate={{
              x: 0,
              opacity: 1,
              scale: 1
            }}
            exit={{
              x: direction > 0 ? -120 : 120,
              opacity: 0,
              scale: 0.96
            }}
            transition={{
              duration: 0.45,
              ease: "easeInOut"
            }}
          />
           <button
            style={styles.playBtn}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
        </AnimatePresence>
            
        <div style={styles.thumbnailBar}>
          <div style={styles.thumbnailWrapper}>
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() => goToImage(index)}
                style={{
                  ...styles.thumbnail,
                  border:
                    index === currentIndex
                      ? "2px solid white"
                      : "2px solid transparent",
                  opacity: index === currentIndex ? 1 : 0.6
                }}
              />
            ))}
          </div>

         
        </div>
        {/* Botón siguiente */}
        <button style={styles.navRight} onClick={onNext}>
          ›
        </button>

        {/* Contador */}
        <div style={styles.counter}>
          {currentIndex + 1} / {images.length}
        </div>

        <button
          style={styles.playBtn}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        {/* Dots */}
        <div style={styles.dots}>
          {images.map((_, index) => (
            <span
              key={index}
              style={{
                ...styles.dot,
                opacity: index === currentIndex ? 1 : 0.4,
                transform:
                  index === currentIndex ? "scale(1.2)" : "scale(1)"
              }}
              onClick={() => goToImage(index)}
            />
          ))}
        </div>

      </div>
    </motion.div>
  );
}

function FloatingHearts() {
  const hearts = Array.from({ length: 15 });

  return (
    <div style={styles.heartsContainer}>
      {hearts.map((_, index) => (
        <span
          key={index}
          style={{
            ...styles.heart,
            left: `${Math.random() * 100}%`,
            animationDuration: `${5 + Math.random() * 5}s`,
            fontSize: `${15 + Math.random() * 20}px`
          }}
        >
          ❤️
        </span>
      ))}
    </div>
  );
}

function HeartExplosion() {
  const hearts = Array.from({ length: 25 });

  return (
    <>
      {hearts.map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 1,
            scale: 0,
            x: 0,
            y: 0
          }}
          animate={{
            scale: 1.5,
            x: (Math.random() - 0.5) * 800,
            y: (Math.random() - 0.5) * 800,
            opacity: 0
          }}
          transition={{ duration: 1.5 }}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            fontSize: "24px",
            pointerEvents: "none",
            zIndex: 1000
          }}
        >
          ❤️
        </motion.div>
      ))}
    </>
  );
}

function FinalSurprise() {
  const [explode, setExplode] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExplode(true);
    }, 2200); // después del mensaje

    return () => clearTimeout(timer);
  }, []);

  return (
    <ScreenWrapper>
      <div style={{
          textAlign: "center",
          transition: "0.8s",
          background: accepted
            ? "radial-gradient(circle, rgba(255,182,193,0.3) 0%, transparent 70%)"
            : "transparent"
        }}>
        
        {/* 1️⃣ Nombre */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          style={{
            fontSize: "56px",
            marginBottom: "10px",
            color: "#ff4d6d"
          }}
        >
          Leidy Diana 💕
        </motion.h1>

        {/* 2️⃣ Mensaje */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          style={{
            fontSize: "32px",
            marginBottom: "20px",
            background: "linear-gradient(45deg, #ff4d6d, #ff8fa3)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          Eres lo mejor que me ha pasado 💖
        </motion.h2>

        {/* 3️⃣ Explosión */}
        {explode && <HeartExplosion />}

        {/* 4️⃣ Botón final */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.8 }}
          onClick={() => {
            setAccepted(true);

            const audio = document.getElementById("bgMusic");
            if (audio) {
              audio.volume = 1;
              audio.play();
            }
          }}
          style={{
            marginTop: "30px",
            padding: "12px 24px",
            fontSize: "18px",
            borderRadius: "25px",
            border: "none",
            background: "#ff4d6d",
            color: "white",
            cursor: "pointer"
          }}
        >
          💌 Aceptas seguir escribiendo nuestra historia?
        </motion.button>
        {accepted && <HeartExplosion />} 
        {accepted && (
          <motion.h2
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            style={{
              marginTop: "30px",
              fontSize: "36px",
              color: "#ff4d6d"
            }}
          >
            Siempre tú y yo 💞
          </motion.h2>
        )}
      </div>
    </ScreenWrapper>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    background: "linear-gradient(135deg, #1a002b, #3b0066, #ff0080)",
    color: "white",
    fontFamily: "sans-serif",
    margin: 0,
    padding: 0
  },
  screen: {
    width: "100%",
    maxWidth: "1000px",
    margin: "0 auto", // 👈 esto es clave
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // 👈 centra todo horizontalmente
    position: "relative",
    zIndex: 1,
  },
  title: {
    marginBottom: "20px"
  },
  button: {
    marginTop: "20px",
    padding: "12px 25px",
    borderRadius: "30px",
    border: "none",
    background: "white",
    color: "#ff0080",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px"
  },
  counterContainer: {
  display: "flex",
  gap: "15px",
  justifyContent: "center",
  marginTop: "20px",
  flexWrap: "wrap"
  },

  timeBox: {
    background: "rgba(255,255,255,0.1)",
    padding: "15px 20px",
    borderRadius: "15px",
    backdropFilter: "blur(10px)",
    minWidth: "80px"
  },

  timeNumber: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#ff4da6",
    textShadow: `
      0 0 5px rgba(255, 77, 166, 0.6),
      0 0 10px rgba(255, 77, 166, 0.4),
      0 0 20px rgba(255, 77, 166, 0.2)
    `
  },

  timeLabel: {
    fontSize: "12px",
    marginTop: "5px",
    opacity: 0.8
  },
  letterText: {
    whiteSpace: "pre-line",
    marginTop: "20px",
    fontSize: "18px",
    lineHeight: "1.6"
  },

  cursor: {
    display: "inline-block",
    marginLeft: "3px",
    animation: "blink 1s infinite"
  },
  heartsContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    pointerEvents: "none",
    zIndex: 0
  },

  heart: {
    position: "absolute",
    bottom: "-50px",
    animationName: "floatUp",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    opacity: 0.6
  },
  mosaicGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: "12px",
    marginTop: "20px"
  },

  mosaicImage: {
    width: "100%",
    height: "120px",
    objectFit: "cover",
    borderRadius: "12px",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.85)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "15px",
    zIndex: 1000
  },
  modalImage: {
    maxWidth: "100%",
    maxHeight: "70dvh",
    objectFit: "contain",
    borderRadius: "20px",
  },
  closeBtn: {
    position: "absolute",
    top: "15px",
    right: "15px",
    fontSize: "22px",
    background: "rgba(0,0,0,0.5)",
    outline: "none",
    border: "none",
    color: "white",
    borderRadius: "50%",
    width: "35px",
    height: "35px",
    cursor: "pointer"
  },

  navLeft: {
    position: "absolute",
    left: "10px",
    fontSize: "32px",
    background: "rgba(0,0,0,0.5)",
    outline: "none",
    border: "none",
    color: "white",
    borderRadius: "50%",

    cursor: "pointer"
  },

  navRight: {
    position: "absolute",
    right: "10px",
    fontSize: "32px",
    background: "rgba(0,0,0,0.5)",
    outline: "none",
    border: "none",
    color: "white",
    borderRadius: "50%",

    cursor: "pointer"
  },

  counter: {
    position: "absolute",
    bottom: "-40px",
    color: "white",
    fontSize: "14px"
  },

  dots: {
    position: "absolute",
    bottom: "-70px",
    display: "flex",
    gap: "8px"
  },

  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "white",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
playBtn: {
  position: "absolute",
  bottom: "100px",
  left: "50%",
  transform: "translateX(-50%)",
  background: "rgba(0,0,0,0.5)",
  outline: "none",
  border: "none",
  color: "white",
  width: "45px",
  height: "45px",
  borderRadius: "50%",
  cursor: "pointer",
  fontSize: "14px",
  backdropFilter: "blur(6px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s ease"
},
  thumbnailBar: {
  position: "absolute",
  bottom: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  background: "rgba(0,0,0,0.6)",
  backdropFilter: "blur(10px)",
  padding: "15px 20px",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
  gap: "20px",
  maxWidth: "90vw"
},

thumbnailContainer: {
  position: "absolute",
  bottom: "-120px",
  display: "flex",
  gap: "10px",
  overflowX: "auto",
  maxWidth: "80vw",
  paddingBottom: "10px"
},
thumbnailWrapper: {
  display: "flex",
  gap: "12px",
  overflowX: "auto",
  scrollbarWidth: "none"
},

thumbnail: {
  width: "70px",
  height: "90px",
  objectFit: "cover",
  borderRadius: "12px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  flexShrink: 0
},
};

export default App;