import React, { useState } from 'react';

const WeddingWebsite = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', attendance: '', guests: '1', dietary: '', message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  const scrollToSection = (section) => {
    setActiveTab(section);
    setMenuOpen(false);
  };

  return (
    <div style={{ fontFamily: 'Georgia, serif', background: c.cream, minHeight: '100vh', color: c.charcoal }}>
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
        .btn-solid:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(42,157,143,0.3); }
        
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
        
        .timeline-item { position: relative; }
        .timeline-item::before {
          content: ''; position: absolute; left: 29px; top: 64px; width: 2px; height: calc(100% - 30px);
          background: linear-gradient(to bottom, #C9A227, #2A9D8F);
        }
        .timeline-item:last-child::before { display: none; }
        
        input, textarea, select {
          width: 100%; padding: 14px 16px; border-radius: 10px; border: 1px solid #E8D5F2;
          font-family: 'Montserrat', sans-serif; font-size: 14px; transition: all 0.3s;
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
      `}</style>

      {/* Menu Button - Fixed */}
      <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} 
        style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 1001 }}>
        <span style={{ transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }}></span>
        <span style={{ opacity: menuOpen ? 0 : 1 }}></span>
        <span style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }}></span>
      </button>

      {/* Full Screen Menu */}
      {menuOpen && (
        <div className="menu-overlay">
          <button className="menu-item" onClick={() => scrollToSection('home')}>Home</button>
          <button className="menu-item" onClick={() => scrollToSection('schedule')}>Schedule</button>
          <button className="menu-item" onClick={() => scrollToSection('details')}>Details</button>
          <button className="menu-item" onClick={() => scrollToSection('rsvp')}>RSVP</button>
        </div>
      )}

      {/* HOME - Split Screen Hero */}
      {activeTab === 'home' && (
        <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {/* Left - Photo Side */}
          <div style={{ 
            flex: '1 1 50%', minHeight: '100vh', minWidth: '300px',
            background: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1519741497674-611481863552?w=800') center/cover`,
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '48px',
            position: 'relative'
          }}>
            <h1 style={{ 
              fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(48px, 8vw, 72px)', 
              color: 'white', marginBottom: '16px', textShadow: '2px 4px 12px rgba(0,0,0,0.3)'
            }}>
              Sneha & Aaditya
            </h1>
            <p style={{ 
              fontFamily: "'Montserrat', sans-serif", fontSize: '14px', color: 'rgba(255,255,255,0.9)',
              maxWidth: '400px', lineHeight: 1.7, letterSpacing: '0.5px'
            }}>
              We can't wait to share our special day with you. Join us as we celebrate our love and begin our journey together.
            </p>
          </div>

          {/* Right - Purple Panel with Indian Border */}
          <div style={{ 
            flex: '1 1 50%', minHeight: '100vh', minWidth: '300px',
            background: c.deepPurple, position: 'relative', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            padding: '48px'
          }}>
            <IndianBorder />
            
            <div style={{ textAlign: 'center', zIndex: 1, paddingRight: '40px' }}>
              <p style={{ 
                fontFamily: "'Cormorant Garamond', Georgia", fontStyle: 'italic',
                fontSize: '28px', color: 'rgba(255,255,255,0.9)', marginBottom: '8px'
              }}>
                Saturday
              </p>
              <h2 style={{ 
                fontFamily: "'Cormorant Garamond', Georgia", fontSize: 'clamp(36px, 5vw, 48px)',
                color: 'white', fontWeight: 400, marginBottom: '48px', letterSpacing: '2px'
              }}>
                March 21, 2026
              </h2>
              
              <button className="btn-outline" onClick={() => setActiveTab('rsvp')}>
                RSVP
              </button>
              
              <div style={{ marginTop: '64px' }}>
                <button className="view-details" onClick={() => setActiveTab('details')}>
                  View Details
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Decorative gold accent */}
            <div style={{
              position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-70%)',
              width: '100px', height: '2px', background: `linear-gradient(90deg, transparent, ${c.gold}, transparent)`
            }}/>
          </div>
        </section>
      )}

      {/* SCHEDULE */}
      {activeTab === 'schedule' && (
        <section style={{ minHeight: '100vh', padding: '80px 24px', background: `linear-gradient(180deg, ${c.cream} 0%, #F5EBE6 100%)` }}>
          <div style={{ maxWidth: '560px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: '28px', color: c.gold, marginBottom: '8px' }}>Saturday</p>
              <h2 className="gradient-text" style={{ fontSize: '36px', fontWeight: 600, marginBottom: '16px', fontFamily: "'Cormorant Garamond', Georgia" }}>March 21, 2026</h2>
              <p style={{ fontFamily: "'Montserrat', sans-serif", color: c.deepPurple, letterSpacing: '3px', fontSize: '12px', textTransform: 'uppercase' }}>Schedule of Events</p>
            </div>

            {[
              { time: '4:00 PM', title: 'Arrival & Welcome', desc: 'Light refreshments as we gather together', icon: '🌸' },
              { time: '5:00 PM', title: 'Ceremony & Rituals', desc: 'Traditional Bengali & Tamil ceremonies', icon: '🪔' },
              { time: '7:00 PM', title: 'Cocktail Hour', desc: 'Celebrate with drinks, appetizers & music', icon: '🥂' }
            ].map((item, i) => (
              <div key={i} className="timeline-item" style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '50%',
                  background: `linear-gradient(135deg, ${c.turquoise}, ${c.bayBlue})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0,
                  boxShadow: '0 4px 16px rgba(42,157,143,0.3)'
                }}>{item.icon}</div>
                <div className="card" style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: c.turquoise, fontWeight: 600, marginBottom: '6px', letterSpacing: '1px' }}>{item.time}</p>
                  <h3 style={{ fontSize: '22px', color: c.deepPurple, marginBottom: '8px', fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia" }}>{item.title}</h3>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", color: c.charcoal, opacity: 0.75, fontSize: '14px', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}

            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <button className="btn-outline" onClick={() => setActiveTab('home')} 
                style={{ borderColor: c.deepPurple, color: c.deepPurple }}>
                ← Back Home
              </button>
            </div>
          </div>
        </section>
      )}

      {/* DETAILS */}
      {activeTab === 'details' && (
        <section style={{ minHeight: '100vh', padding: '80px 24px', background: c.cream }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <h2 className="gradient-text" style={{ fontSize: '36px', fontWeight: 600, marginBottom: '16px', fontFamily: "'Cormorant Garamond', Georgia" }}>Event Details</h2>
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

            <div style={{ textAlign: 'center', marginTop: '56px' }}>
              <button className="btn-outline" onClick={() => setActiveTab('home')} 
                style={{ borderColor: c.deepPurple, color: c.deepPurple }}>
                ← Back Home
              </button>
            </div>
          </div>
        </section>
      )}

      {/* RSVP */}
      {activeTab === 'rsvp' && (
        <section style={{ minHeight: '100vh', padding: '80px 24px', background: `linear-gradient(180deg, #F5EBE6 0%, ${c.cream} 100%)` }}>
          <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 className="gradient-text" style={{ fontSize: '36px', fontWeight: 600, marginBottom: '12px', fontFamily: "'Cormorant Garamond', Georgia" }}>RSVP</h2>
              <p style={{ fontFamily: "'Montserrat', sans-serif", color: c.deepPurple, fontSize: '14px', opacity: 0.8 }}>Please let us know if you can celebrate with us</p>
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

              <button type="submit" className="btn-solid">{formSubmitted ? '✓ Submitted!' : 'Submit RSVP'}</button>
              
              {formSubmitted && (
                <p style={{ textAlign: 'center', marginTop: '16px', color: c.turquoise, fontFamily: "'Montserrat', sans-serif", fontSize: '14px' }}>
                  Thank you! We can't wait to celebrate with you! 🎊
                </p>
              )}
            </form>

            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <button className="view-details" onClick={() => setActiveTab('home')} style={{ color: c.deepPurple }}>
                ← Back Home
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default WeddingWebsite;