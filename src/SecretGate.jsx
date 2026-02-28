import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function SecretGate({ children }) {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const audioRef = useRef(null);

  const SECRET = "teamo";
  const MAX_ATTEMPTS_FOR_HINT = 3;

  // 🔥 Reproducir música cuando desbloquea
  useEffect(() => {
    if (isUnlocked && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [isUnlocked]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.toLowerCase() === SECRET.toLowerCase()) {
      setIsUnlocked(true);
    } else {
      setError(true);
      setAttempts(prev => prev + 1);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <>
      {/* 🎵 Audio SIEMPRE montado */}
      <audio
        ref={audioRef}
        src="/Rolling_in_the_Deep.mp3"
        preload="auto"
      />

      {isUnlocked ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ position: "fixed", inset: 0, pointerEvents: "none" }}
          >
            <div style={styles.unlockGlow}></div>
          </motion.div>

          {children}
        </>
      ) : (
        <div style={styles.container}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={styles.card}
          >
            <h2>🔐 Solo para ti</h2>
            <p style={{ opacity: 0.7 }}>
              Ingresa la palabra que solo tú sabes
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Escríbela aquí..."
                style={{
                  ...styles.input,
                  border: error ? "1px solid #ff4d4d" : "1px solid #ccc"
                }}
              />

              <button type="submit" style={styles.button}>
                Entrar
              </button>
            </form>

            {error && (
              <p style={{ color: "#ff4d4d", marginTop: "10px" }}>
                Esa no es 😅
              </p>
            )}

            <AnimatePresence>
              {attempts >= MAX_ATTEMPTS_FOR_HINT && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ marginTop: "20px" }}
                >
                  <p style={{ fontSize: "14px", opacity: 0.8 }}>
                    💡 Pista: 2 palabras, 5 letras 💌
                  </p>

                  <img
                    src="/2palabras5letras.jpg"
                    alt="pista"
                    style={{
                      marginTop: "10px",
                      width: "80px",
                      borderRadius: "10px",
                      opacity: 0.8
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    padding: "40px",
    borderRadius: "20px",
    color: "white",
    textAlign: "center",
    width: "320px"
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "15px",
    background: "rgba(255,255,255,0.1)",
    color: "white"
  },
  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    background: "#ff4d6d",
    color: "white",
    cursor: "pointer"
  },
  unlockGlow: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(circle, rgba(255,77,109,0.3), transparent 70%)"
  }
};

export default SecretGate;