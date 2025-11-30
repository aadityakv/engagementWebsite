import React, { useState } from 'react';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbweGV9TvDeWSlpYVHpUgbpkCJVjszrlefUiDuDxmoduYLtqNW35FhKYthdWhpcsGpv3Tw/exec';

const WeddingWebsite = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', attendance: '', guests: '1', dietary: '', message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMenuOpen(false);
    }
  };

  const c = {
    deepPurple: '#6B2D5C',
    gold: '#C9A227',
    cream: '#FDF8F3',
    charcoal: '#2D2D2D',
    turquoise: '#2A9D8F',
    bayBlue: '#1E3A5F'
  };

  // Indian border pattern SVG
  const IndianBorder = () => (
    <svg width="60" height="100%" style={{ position: 'absolute', right: 0, top: 0, height: '100%' }}>
      <defs>
        <pattern id="borderPattern" x="0" y="0" width="60" height="80" patternUnits="userSpaceOnUse">
          {/* Gold background strip */}
          <rect x="20" y="0" width="40" height="80" fill={c.gold} opacity="0.9"/>
          {/* Decorative diamonds */}
          <polygon points="40,0 50,10 40,20 30,10" fill={c.deepPurple} opacity="0.8"/>
          <polygon points="40,20 50,30 40,40 30,30" fill={c.deepPurple} opacity="0.6"/>
          <polygon points="40,40 50,50 40,60 30,50" fill={c.deepPurple} opacity="0.8"/>
          <polygon points="40,60 50,70 40,80 30,70" fill={c.deepPurple} opacity="0.6"/>
          {/* Small accent dots */}
          <circle cx="40" cy="10" r="3" fill="#FFF" opacity="0.5"/>
          <circle cx="40" cy="50" r="3" fill="#FFF" opacity="0.5"/>
          {/* Inner line */}
          <rect x="15" y="0" width="3" height="80" fill={c.gold} opacity="0.7"/>
          <rect x="8" y="0" width="1" height="80" fill={c.gold} opacity="0.4"/>
        </pattern>
      </defs>
      <rect width="60" height="100%" fill="url(#borderPattern)"/>
    </svg>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    setFormSubmitted(false);

    const submissionData = {
      ...formData,
      timestamp: new Date().toLocaleString()
    };

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(submissionData)
      });

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        throw new Error('Unexpected response from server. Please ensure the Apps Script deployment allows access.');
      }

      if (result.status !== 'success') {
        throw new Error(result.message || 'Submission failed.');
      }

      setFormSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        attendance: '',
        guests: '1',
        dietary: '',
        message: ''
      });

      setTimeout(() => setFormSubmitted(false), 5000);
    } catch (error) {
      console.error('Error:', error);
      setFormError(error.message || 'There was an error submitting your RSVP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div style={{
      fontFamily: 'Georgia, serif',
      background: `linear-gradient(180deg, ${c.deepPurple} 0%, #8B4A7A 40%, #A67B9E 70%, #C4A5C0 100%)`,
      minHeight: '100vh',
      color: c.charcoal,
      position: 'relative'
    }}>
      {/* Continuous borders running through entire page */}
      <div className="border-left" style={{ position: 'fixed', left: 0, top: 0, height: '100%', transform: 'scaleX(-1)', zIndex: 998, pointerEvents: 'none' }}>
        <IndianBorder />
      </div>
      <div className="border-right" style={{ position: 'fixed', right: 0, top: 0, height: '100%', zIndex: 998, pointerEvents: 'none' }}>
        <IndianBorder />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@400;500;600&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .menu-btn {
          width: 44px; height: 44px; background: rgba(255,255,255,0.95); border: none; border-radius: 8px;
          cursor: pointer; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 5px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1); transition: all 0.3s; z-index: 1000;
        }
        .menu-btn:hover { transform: scale(1.05); }
        .menu-btn span { width: 20px; height: 2px; background: #2D2D2D; transition: all 0.3s; }
        
        .btn-outline {
          padding: 14px 48px; border: 2px solid rgba(255,255,255,0.8); background: transparent;
          color: white; font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 500;
          letter-spacing: 3px; cursor: pointer; transition: all 0.3s; text-transform: uppercase;
        }
        .btn-outline:hover { background: rgba(255,255,255,0.15); border-color: white; }
        
        .btn-solid {
          padding: 14px 48px; border: none; background: linear-gradient(135deg, #2A9D8F, #1E3A5F);
          color: white; font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 500;
          letter-spacing: 2px; cursor: pointer; transition: all 0.3s; border-radius: 8px; width: 100%;
        }
        .btn-solid:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(42,157,143,0.3); }
        .btn-solid:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .view-details { 
          color: rgba(255,255,255,0.9); font-family: 'Montserrat', sans-serif; font-size: 13px;
          letter-spacing: 2px; cursor: pointer; transition: all 0.3s; background: none; border: none;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
        }
        .view-details:hover { color: white; }
        .view-details svg { animation: bounce 2s infinite; }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        
        .card {
          background: white; border-radius: 16px; padding: 24px;
          box-shadow: 0 4px 24px rgba(107,45,92,0.08); transition: all 0.3s;
        }
        .card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(107,45,92,0.12); }
        
        .timeline-item:first-child .timeline-line {
          position: absolute;
          left: 30px;
          top: 60px;
          width: 2px;
          height: calc(200% + 64px);
          background: linear-gradient(to bottom, #C9A227, #2A9D8F);
          z-index: 0;
        }
        
        input, textarea, select {
          width: 100%; padding: 14px 16px; border-radius: 10px; border: 1px solid #E8D5F2;
          font-family: 'Montserrat', sans-serif; font-size: 14px; transition: all 0.3s;
        }
        select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 16px;
          padding-right: 40px;
          text-align: left;
        }
        input:focus, textarea:focus, select:focus {
          outline: none; border-color: #2A9D8F; box-shadow: 0 0 0 3px rgba(42,157,143,0.1);
        }
        
        .menu-overlay {
          position: fixed; inset: 0; background: rgba(107,45,92,0.98); z-index: 999;
          display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 32px;
        }
        .menu-item {
          color: white; font-family: 'Cormorant Garamond', Georgia; font-size: 32px; font-weight: 400;
          background: none; border: none; cursor: pointer; opacity: 0.8; transition: all 0.3s;
          letter-spacing: 2px;
        }
        .menu-item:hover { opacity: 1; transform: scale(1.05); }

        .gradient-text {
          background: linear-gradient(135deg, #6B2D5C, #1E3A5F, #2A9D8F);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .flip-card {
          perspective: 1000px;
          width: 100%;
          max-width: 700px;
          margin: 0 auto;
        }

        .flip-card-inner {
          position: relative;
          width: 100%;
          transition: transform 0.8s, min-height 0.8s;
          transform-style: preserve-3d;
        }

        .flip-card-inner.flipped {
          transform: rotateY(180deg);
          min-height: 400px;
        }

        @media (hover: hover) and (pointer: fine) {
          .flip-card:hover .flip-card-inner {
            transform: rotateY(180deg);
            min-height: 400px;
          }
        }

        .flip-card-front, .flip-card-back {
          width: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 16px;
        }

        .flip-card-back {
          position: absolute;
          top: 0;
          left: 0;
          transform: rotateY(180deg);
          background: linear-gradient(135deg, #6B2D5C, #2A9D8F);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 60px 40px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
          border: 3px solid #C9A227;
          min-height: 400px;
        }

        @media (max-width: 768px) {
          .border-left, .border-right {
            display: none;
          }
          .flip-card {
            max-width: 100%;
            margin-bottom: 32px !important;
          }
          .flip-card-back {
            padding: 40px 20px;
            min-height: 400px;
          }
          .menu-btn {
            left: 20px !important;
          }
        }
      `}</style>

      {/* Menu Button - Fixed */}
      <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}
        style={{ position: 'fixed', top: '20px', left: '90px', zIndex: 1001 }}>
        <span style={{ transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }}></span>
        <span style={{ opacity: menuOpen ? 0 : 1 }}></span>
        <span style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }}></span>
      </button>

      {/* Full Screen Menu */}
      {menuOpen && (
        <div className="menu-overlay">
          <button className="menu-item" onClick={() => scrollToSection('home-section')}>Home</button>
          <button className="menu-item" onClick={() => scrollToSection('details-section')}>Details</button>
          <button className="menu-item" onClick={() => scrollToSection('schedule-section')}>Schedule</button>
          <button className="menu-item" onClick={() => scrollToSection('rsvp-section')}>RSVP</button>
        </div>
      )}

      {/* HOME - Hero Section */}
      <section id="home-section" style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '80px 24px',
        position: 'relative'
      }}>
        {/* Content Container */}
        <div style={{ maxWidth: '900px', width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Names */}
          <h1 style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: 'clamp(56px, 10vw, 96px)',
            color: 'white',
            marginBottom: '24px',
            textShadow: '0 2px 20px rgba(0,0,0,0.2)'
          }}>
            Sneha & Aaditya
          </h1>

          {/* Date */}
          <div style={{ marginBottom: '48px' }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia",
              fontStyle: 'italic',
              fontSize: '24px',
              color: 'rgba(255,255,255,0.9)',
              marginBottom: '8px'
            }}>
              Saturday
            </p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', Georgia",
              fontSize: 'clamp(32px, 5vw, 42px)',
              color: c.gold,
              fontWeight: 400,
              letterSpacing: '3px'
            }}>
              March 21, 2026
            </h2>
          </div>

          {/* Photo - Flip Card */}
          <div
            className="flip-card"
            style={{ marginBottom: '48px', cursor: 'pointer' }}
            onClick={(e) => {
              // Only handle click on touch devices (not on hover-capable devices)
              if (window.matchMedia('(hover: none)').matches) {
                setCardFlipped(!cardFlipped);
              }
            }}
          >
            <div className={`flip-card-inner ${cardFlipped ? 'flipped' : ''}`}>
              {/* Front */}
              <div className="flip-card-front">
                <img
                  src="/savethedate.png"
                  alt="Save the Date for Sneha and Aaditya's celebration"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                    border: `3px solid ${c.gold}`,
                    display: 'block'
                  }}
                />
              </div>
              {/* Back */}
              <div className="flip-card-back">
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '48px',
                    marginBottom: '24px'
                  }}>✨</div>
                  <h3 style={{
                    fontFamily: "'Great Vibes', cursive",
                    fontSize: '42px',
                    color: 'white',
                    marginBottom: '20px'
                  }}>
                    You're Invited!
                  </h3>
                  <p style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '16px',
                    color: 'rgba(255,255,255,0.9)',
                    lineHeight: 1.8,
                    marginBottom: '16px'
                  }}>
                    Join us for an evening of love, laughter, and celebration
                  </p>
                  <div style={{
                    width: '80px',
                    height: '2px',
                    background: c.gold,
                    margin: '20px auto'
                  }}/>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', Georgia",
                    fontSize: '20px',
                    color: c.gold,
                    fontWeight: 600
                  }}>
                    Sugar Land, Texas
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tagline */}
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '15px',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.8,
            letterSpacing: '0.5px',
            marginBottom: '48px',
            maxWidth: '600px',
            margin: '0 auto 48px',
            padding: '0 20px'
          }}>
            We are so excited to celebrate this milestone with all of you. Please visit our website for finalized details closer to the date!
          </p>

          {/* RSVP Button */}
          <button className="btn-outline" onClick={() => scrollToSection('rsvp-section')}>
            RSVP
          </button>

          {/* Scroll Indicator */}
          <div style={{ marginTop: '80px', display: 'flex', justifyContent: 'center' }}>
            <button className="view-details" onClick={() => scrollToSection('details-section')}>
              Scroll to Explore
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Decorative gold accent at bottom */}
        <div style={{
          position: 'absolute',
          bottom: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120px',
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${c.gold}, transparent)`,
          zIndex: 1
        }}/>
      </section>

      {/* DETAILS */}
      <section id="details-section" style={{
        padding: '80px 24px 80px 24px',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 600, marginBottom: '16px', fontFamily: "'Cormorant Garamond', Georgia", color: 'white' }}>Event Details</h2>
            <div style={{ width: '80px', height: '2px', background: `linear-gradient(90deg, ${c.gold}, ${c.turquoise})`, margin: '0 auto' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            {[
              { icon: '📍', title: 'Venue', main: 'Sugar Land, TX', sub: 'Full address coming soon' },
              { icon: '👗', title: 'Dress Code', main: 'Festive Indian / Cocktail', sub: 'Traditional or elegant attire welcome' },
              { icon: '🏨', title: 'Accommodations', main: 'Coming Soon', sub: 'Hotel block info to follow' }
            ].map((card, i) => (
              <div key={i} className="card">
                <div style={{
                  width: '50px', height: '50px', borderRadius: '12px',
                  background: `linear-gradient(135deg, #F5EBE6, ${c.cream})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px'
                }}>{card.icon}</div>
                <h3 style={{ fontSize: '20px', color: c.deepPurple, marginBottom: '12px', fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia" }}>{card.title}</h3>
                <p style={{ fontFamily: "'Montserrat', sans-serif", color: c.turquoise, fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>{card.main}</p>
                <p style={{ fontFamily: "'Montserrat', sans-serif", color: c.charcoal, opacity: 0.7, fontSize: '13px' }}>{card.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCHEDULE - Under Construction */}
      <section id="schedule-section" style={{
        padding: '80px 24px 80px 24px',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: '28px', color: c.gold, marginBottom: '8px' }}>Saturday</p>
            <h2 style={{ fontSize: '36px', fontWeight: 600, marginBottom: '16px', fontFamily: "'Cormorant Garamond', Georgia", color: 'white' }}>March 21, 2026</h2>
            <p style={{ fontFamily: "'Montserrat', sans-serif", color: 'rgba(255,255,255,0.9)', letterSpacing: '3px', fontSize: '12px', textTransform: 'uppercase' }}>Schedule of Events</p>
          </div>

          {/* Under Construction Card */}
          <div className="card" style={{ textAlign: 'center', padding: '48px 32px' }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '24px'
            }}>🚧</div>
            <h3 style={{
              fontSize: '24px',
              color: c.deepPurple,
              marginBottom: '16px',
              fontWeight: 600,
              fontFamily: "'Cormorant Garamond', Georgia"
            }}>Coming Soon</h3>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              color: c.charcoal,
              opacity: 0.75,
              fontSize: '14px',
              lineHeight: 1.8
            }}>
              We're still finalizing the schedule of events.<br />
              Please check back closer to the date for the full itinerary!
            </p>
          </div>
        </div>
      </section>

      {/* SAVED SCHEDULE CODE - To restore: delete the "Under Construction" section above and uncomment this block
      <section id="schedule-section" style={{
        padding: '80px 24px 80px 24px',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: '28px', color: c.gold, marginBottom: '8px' }}>Saturday</p>
            <h2 style={{ fontSize: '36px', fontWeight: 600, marginBottom: '16px', fontFamily: "'Cormorant Garamond', Georgia", color: 'white' }}>March 21, 2026</h2>
            <p style={{ fontFamily: "'Montserrat', sans-serif", color: 'rgba(255,255,255,0.9)', letterSpacing: '3px', fontSize: '12px', textTransform: 'uppercase' }}>Schedule of Events</p>
          </div>

          <div>
            {[
              { time: '4:00 PM', title: 'Arrival & Welcome', desc: 'Light refreshments as we gather together', icon: '🌸' },
              { time: '5:00 PM', title: 'Ceremony & Rituals', desc: 'Traditional Bengali & Tamil ceremonies', icon: '🪔' },
              { time: '7:00 PM', title: 'Cocktail Hour', desc: 'Celebrate with drinks, appetizers & music', icon: '🥂' }
            ].map((item, i) => (
              <div key={i} className="timeline-item" style={{ display: 'flex', gap: '20px', marginBottom: i < 2 ? '32px' : '0', alignItems: 'center', position: 'relative' }}>
                {i === 0 && <div className="timeline-line"></div>}
                <div style={{
                  width: '60px', height: '60px', borderRadius: '50%',
                  background: `linear-gradient(135deg, ${c.turquoise}, ${c.bayBlue})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0,
                  boxShadow: '0 4px 16px rgba(42,157,143,0.3)',
                  position: 'relative',
                  zIndex: 1
                }}>{item.icon}</div>
                <div className="card" style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: c.turquoise, fontWeight: 600, marginBottom: '6px', letterSpacing: '1px' }}>{item.time}</p>
                  <h3 style={{ fontSize: '22px', color: c.deepPurple, marginBottom: '8px', fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia" }}>{item.title}</h3>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", color: c.charcoal, opacity: 0.75, fontSize: '14px', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* RSVP */}
      <section id="rsvp-section" style={{
        padding: '80px 24px 80px 24px',
        position: 'relative'
      }}>
          <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: 600, marginBottom: '12px', fontFamily: "'Cormorant Garamond', Georgia", color: 'white' }}>RSVP</h2>
              <p style={{ fontFamily: "'Montserrat', sans-serif", color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Please let us know if you can celebrate with us</p>
            </div>

            <form onSubmit={handleSubmit} className="card" style={{ padding: '36px' }}>
              {[
                { label: 'Full Name(s)', type: 'text', key: 'name', placeholder: 'Enter your name', required: true },
                { label: 'Email Address', type: 'email', key: 'email', placeholder: 'your@email.com', required: true },
                { label: 'Phone Number', type: 'tel', key: 'phone', placeholder: '(123) 456-7890' }
              ].map(field => (
                <div key={field.key} style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: c.deepPurple, marginBottom: '8px', fontWeight: 500 }}>
                    {field.label} {field.required && '*'}
                  </label>
                  <input type={field.type} required={field.required} placeholder={field.placeholder}
                    value={formData[field.key]} onChange={e => setFormData({...formData, [field.key]: e.target.value})} />
                </div>
              ))}

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: c.deepPurple, marginBottom: '8px', fontWeight: 500 }}>Will you be attending? *</label>
                <select required value={formData.attendance} onChange={e => setFormData({...formData, attendance: e.target.value})}>
                  <option value="">Please select</option>
                  <option value="yes">Yes, I'll be there! 🎉</option>
                  <option value="no">Sorry, I can't make it</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: c.deepPurple, marginBottom: '8px', fontWeight: 500 }}>Number of Guests *</label>
                <input type="number" min="1" max="10" required value={formData.guests} onChange={e => setFormData({...formData, guests: e.target.value})} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: c.deepPurple, marginBottom: '8px', fontWeight: 500 }}>Dietary Restrictions</label>
                <textarea rows={2} placeholder="Any dietary requirements" value={formData.dietary} onChange={e => setFormData({...formData, dietary: e.target.value})} />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: c.deepPurple, marginBottom: '8px', fontWeight: 500 }}>Message or Song Request</label>
                <textarea rows={2} placeholder="Share your wishes!" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
              </div>

              <button type="submit" className="btn-solid" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : formSubmitted ? '✓ Submitted!' : 'Submit RSVP'}
              </button>

              {formSubmitted && (
                <p style={{ textAlign: 'center', marginTop: '16px', color: c.turquoise, fontFamily: "'Montserrat', sans-serif", fontSize: '14px' }}>
                  Thank you! We can't wait to celebrate with you! 🎊
                </p>
              )}

              {formError && (
                <p style={{ textAlign: 'center', marginTop: '16px', color: '#d32f2f', fontFamily: "'Montserrat', sans-serif", fontSize: '14px' }}>
                  {formError}
                </p>
              )}
            </form>

            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <button className="view-details" onClick={() => scrollToSection('home-section')} style={{ color: 'rgba(255,255,255,0.9)' }}>
                ← Back to Top
              </button>
            </div>
          </div>
        </section>
    </div>
  );
};

export default WeddingWebsite;