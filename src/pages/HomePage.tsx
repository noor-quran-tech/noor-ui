import React from "react";

// Interfaces for Type Safety
interface Teacher {
  id: number;
  name: string;
  rating: number;
  specialization: string;
  price: number;
  image?: string;
}

const teachers: Teacher[] = [
  {
    id: 1,
    name: "Dr. Ahmed Ali",
    rating: 4.9,
    specialization: "Tajweed & Ijazah",
    price: 15,
  },
  {
    id: 2,
    name: "Sarah Mansour",
    rating: 4.8,
    specialization: "Arabic for Non-Natives",
    price: 12,
  },
];

const HomePage: React.FC = () => {
  return (
    <div
      className="main-content"
      style={{
        backgroundColor: "var(--neutral-50)",
        color: "var(--neutral-900)",
        fontFamily: "sans-serif",
      }}
    >
      {/* 2. Hero Section */}
      <section
        style={{
          padding: "120px 10% 80px",
          textAlign: "center",
          background: "linear-gradient(135deg, var(--teal-50) 0%, #fff 100%)",
        }}
      >
        <h1
          style={{
            color: "var(--teal-900)",
            fontSize: "3rem",
            marginBottom: "20px",
            lineHeight: "1.2",
          }}
        >
          Learn the Quran from the best teachers in the world [cite: 36]
        </h1>
        <p
          style={{
            color: "var(--neutral-600)",
            fontSize: "1.2rem",
            maxWidth: "750px",
            margin: "0 auto 40px",
          }}
        >
          An authentic educational experience combining Islamic tradition and
          modern technology to connect students with specialized teachers
          worldwide[cite: 18, 19].
        </p>
        <button
          style={{
            backgroundColor: "var(--teal-500)",
            color: "white",
            padding: "18px 45px",
            fontSize: "1.1rem",
            borderRadius: "50px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(1, 154, 152, 0.3)",
            fontWeight: "bold",
          }}
        >
          Start Your Journey Now [cite: 38]
        </button>
      </section>

      {/* 3. Statistics Section [cite: 40] */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          padding: "60px 10%",
          backgroundColor: "var(--teal-900)",
          color: "white",
          textAlign: "center",
        }}
      >
        <div>
          <h2
            style={{
              color: "var(--gold-300)",
              fontSize: "2.5rem",
              margin: "0 0 10px",
            }}
          >
            500+
          </h2>
          <p style={{ opacity: 0.9 }}>Certified Teachers [cite: 41]</p>
        </div>
        <div>
          <h2
            style={{
              color: "var(--gold-300)",
              fontSize: "2.5rem",
              margin: "0 0 10px",
            }}
          >
            50,000+
          </h2>
          <p style={{ opacity: 0.9 }}>Global Students [cite: 41]</p>
        </div>
        <div>
          <h2
            style={{
              color: "var(--gold-300)",
              fontSize: "2.5rem",
              margin: "0 0 10px",
            }}
          >
            80+
          </h2>
          <p style={{ opacity: 0.9 }}>Nationalities [cite: 41]</p>
        </div>
      </section>

      {/* 4. How It Works Section [cite: 42] */}
      <section style={{ padding: "100px 10%", textAlign: "center" }}>
        <h2
          style={{
            color: "var(--teal-800)",
            marginBottom: "60px",
            fontSize: "2rem",
          }}
        >
          How the Platform Works
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "30px",
          }}
        >
          {[
            {
              step: "1",
              title: "Register",
              text: "Register your free account [cite: 43]",
            },
            {
              step: "2",
              title: "Browse",
              text: "Browse teacher profiles [cite: 44]",
            },
            {
              step: "3",
              title: "Trial",
              text: "Book a free trial session [cite: 45]",
            },
            {
              step: "4",
              title: "Learn",
              text: "Start your learning journey [cite: 45]",
            },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                padding: "30px",
                background: "white",
                borderRadius: "20px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: "var(--gold-100)",
                  color: "var(--gold-700)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                }}
              >
                {item.step}
              </div>
              <h4 style={{ color: "var(--teal-700)", marginBottom: "10px" }}>
                {item.title}
              </h4>
              <p
                style={{
                  color: "var(--neutral-500)",
                  fontSize: "0.95rem",
                  lineHeight: "1.5",
                }}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Featured Teachers Section [cite: 46] */}
      <section
        style={{ padding: "100px 10%", backgroundColor: "var(--neutral-100)" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "50px",
          }}
        >
          <h2 style={{ color: "var(--teal-800)", margin: 0 }}>
            Featured Teachers
          </h2>
          <button
            style={{
              color: "var(--teal-600)",
              fontWeight: "bold",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            View All →
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "30px",
          }}
        >
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                transition: "transform 0.2s",
              }}
            >
              <div
                style={{
                  height: "220px",
                  backgroundColor: "var(--neutral-200)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    backgroundColor: "rgba(255,255,255,0.9)",
                    padding: "5px 10px",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    color: "var(--gold-600)",
                  }}
                >
                  ★ {teacher.rating} [cite: 47]
                </div>
              </div>
              <div style={{ padding: "25px" }}>
                <h3 style={{ margin: "0 0 10px", color: "var(--teal-900)" }}>
                  {teacher.name} [cite: 60]
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--neutral-500)",
                    marginBottom: "20px",
                  }}
                >
                  {teacher.specialization} [cite: 60]
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "15px",
                    borderTop: "1px solid var(--neutral-100)",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        color: "var(--teal-600)",
                      }}
                    >
                      ${teacher.price}
                    </span>
                    <span
                      style={{
                        color: "var(--neutral-400)",
                        fontSize: "0.8rem",
                      }}
                    >
                      {" "}
                      / hour [cite: 60]
                    </span>
                  </div>
                  <button
                    style={{
                      backgroundColor: "var(--teal-500)",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "10px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Book Now [cite: 47]
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Footer Section [cite: 50] */}
      <footer
        style={{
          padding: "80px 10% 30px",
          backgroundColor: "var(--neutral-900)",
          color: "var(--neutral-400)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gap: "60px",
            marginBottom: "60px",
          }}
        >
          <div>
            <h3 style={{ color: "white", marginBottom: "20px" }}>
              Noor Platform [cite: 4]
            </h3>
            <p style={{ lineHeight: "1.6", fontSize: "0.95rem" }}>
              The first global reference for teaching the Holy Quran and Arabic
              to non-Arabic speakers, bridging the gap between authentic
              heritage and modern technology[cite: 17, 18].
            </p>
          </div>
          <div>
            <h4 style={{ color: "var(--gold-200)", marginBottom: "20px" }}>
              Quick Links [cite: 51]
            </h4>
            <ul style={{ listStyle: "none", padding: 0, lineHeight: "2" }}>
              <li>Curricula</li>
              <li>Teacher Recruitment</li>
              <li>Privacy Policy</li>
              <li>Terms of Use</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: "var(--gold-200)", marginBottom: "20px" }}>
              Support [cite: 51]
            </h4>
            <p style={{ marginBottom: "10px" }}>support@noorplatform.com</p>
            <div
              style={{
                display: "flex",
                gap: "15px",
                marginTop: "20px",
                fontSize: "1.5rem",
              }}
            >
              <span>𝕏</span> <span>𝑓</span> <span>📷</span>
            </div>
          </div>
        </div>
        <div
          style={{
            textAlign: "center",
            paddingTop: "30px",
            borderTop: "1px solid var(--neutral-800)",
            fontSize: "0.85rem",
          }}
        >
          © 2025 Noor Platform. All rights reserved[cite: 7].
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
