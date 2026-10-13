import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiShoppingBag,
  FiBox,
  FiCpu,
  FiDollarSign,
  FiTruck,
  FiShield,
  FiCheck,
  FiStar,
} from 'react-icons/fi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { shouldAnimate } from '../../animations/config';
import { attachMagneticEffect } from '../../animations/magneticHover';
import Button from '../../components/common/Button/Button';
import styles from './LandingPage.module.css';

gsap.registerPlugin(ScrollTrigger);

export const LandingPage = () => {
  const heroRef = useRef(null);
  const mockupRef = useRef(null);
  const primaryCtaRef = useRef(null);

  useEffect(() => {
    if (!shouldAnimate()) return;

    const ctx = gsap.context(() => {
      // 1. Hero Entrance
      const tl = gsap.timeline();
      tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' })
        .from('.hero-title-line', { y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }, '-=0.3')
        .from('.hero-sub', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
        .from('.hero-cta', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
        .from(mockupRef.current, { y: 60, opacity: 0, scale: 0.95, duration: 1, ease: 'power3.out' }, '-=0.4');

      // 2. Parallax Mockup on Mousemove
      const handleMouseMove = (e) => {
        if (!mockupRef.current) return;
        const { clientX, clientY } = e;
        const xOffset = (clientX / window.innerWidth - 0.5) * 16;
        const yOffset = (clientY / window.innerHeight - 0.5) * 16;
        gsap.to(mockupRef.current, {
          rotationY: xOffset,
          rotationX: -yOffset,
          transformPerspective: 1000,
          duration: 0.5,
          ease: 'power1.out',
        });
      };
      window.addEventListener('mousemove', handleMouseMove);

      // 3. Staggered Feature Cards with ScrollTrigger
      gsap.from('.feature-card-item', {
        scrollTrigger: {
          trigger: '.features-grid-trigger',
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power3.out',
      });

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, heroRef);

    // Magnetic effect on primary CTA
    if (primaryCtaRef.current) {
      attachMagneticEffect(primaryCtaRef.current, 0.25);
    }

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef}>
      {/* 1. CINEMATIC HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.auroraOrb1} />
        <div className={styles.auroraOrb2} />

        <div className={`${styles.badgePill} hero-badge`}>
          <span>🇵🇰 Built Specifically for Pakistani E-Commerce</span>
          <span style={{ color: 'var(--color-brand-secondary)' }}>• Vercel / Linear Polish</span>
        </div>

        <h1 className={`${styles.heroHeading} hero-title`}>
          <div className="hero-title-line">Manage Orders, Stock & COD Cash.</div>
          <div className="hero-title-line">
            Ask <span className={styles.gradientWord}>Claude AI Munshi</span> Live.
          </div>
        </h1>

        <p className={`${styles.heroSubtext} hero-sub`}>
          Pakistan ke Instagram, Daraz aur WhatsApp sellers ke liye all-in-one operating system. Trax, TCS aur Leopards COD reconciliation aur Roman Urdu mein hisaab-kitaab.
        </p>

        <div className={`${styles.ctaRow} hero-cta`}>
          <div ref={primaryCtaRef}>
            <Link to="/signup">
              <Button variant="primary" size="lg" iconRight={<FiArrowRight />}>
                Start Free 14-Day Trial
              </Button>
            </Link>
          </div>
          <Link to="/login">
            <Button variant="secondary" size="lg">
              Explore Live Demo ➔
            </Button>
          </Link>
        </div>

        {/* Parallax Live Interactive Dashboard Mockup */}
        <div ref={mockupRef} className={styles.mockupContainer}>
          <div
            style={{
              height: '36px',
              background: 'var(--color-bg-elevated)',
              borderBottom: '1px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              gap: '8px',
            }}
          >
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginLeft: '12px' }}>
              https://karobar.pk/dashboard — Ayesha Closet PK
            </span>
          </div>

          <div style={{ padding: '24px', background: 'var(--color-bg-canvas)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: 'var(--color-bg-surface)', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>AAJ KI SALES</span>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-brand-secondary)', marginTop: '4px' }}>Rs 15,450</div>
                <span style={{ fontSize: '10px', color: 'var(--color-brand-secondary)' }}>+18.5% vs kal</span>
              </div>
              <div style={{ background: 'var(--color-bg-surface)', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>NAYE ORDERS</span>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '4px' }}>6 Orders</div>
                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Karachi, Lahore</span>
              </div>
              <div style={{ background: 'var(--color-bg-surface)', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>PENDING COD CASH</span>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-status-pending)', marginTop: '4px' }}>Rs 22,800</div>
                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>4 parcels with rider</span>
              </div>
              <div style={{ background: 'var(--color-bg-surface)', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>RETURN RATE</span>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-brand-secondary)', marginTop: '4px' }}>4%</div>
                <span style={{ fontSize: '10px', color: 'var(--color-brand-secondary)' }}>96% delivery success</span>
              </div>
            </div>

            <div style={{ background: 'var(--color-bg-surface)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-brand-primary)', marginBottom: '8px' }}>
                ⚡ Claude AI Munshi Live Query:
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', background: 'var(--color-bg-elevated)', padding: '10px 14px', borderRadius: '6px' }}>
                "Bhai aaj kitna munafa hua aur low stock konsa hai?" ➔ <strong>Assalam-o-Alaikum! Aaj total sales Rs 15,450 hain aur Velvet Shawl ke sirf 3 pieces reh gaye hain. Restock order zaroor banayein.</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INFINITE LOGO MARQUEE */}
      <section className={styles.marqueeSection}>
        <div className={styles.marqueeTrack}>
          {[
            '📸 Instagram Sellers',
            '📦 Trax Logistics',
            '🛍️ Daraz Marketplace',
            '🚚 TCS Express',
            '💬 WhatsApp Commerce',
            '🐆 Leopards Courier',
            '⚡ PostEx Cash',
            '👗 Pakistani Apparel Brands',
            '✨ Skincare & Jewelry Sellers',
          ].map((item, idx) => (
            <div key={idx} className={styles.marqueeItem}>
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* 3. CORE FEATURES GRID */}
      <section id="features" className={styles.featuresSection}>
        <div className={styles.sectionHeading}>
          <h2 className={styles.sectionTitle}>Pakistani Sellers Ki Zaroorat Ke Mutabiq</h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '580px', margin: '0 auto' }}>
            Linear aur Stripe jaisa clean dark interface, COD cash reconciliation, aur real-time Pakistani couriers integration.
          </p>
        </div>

        <div className={`${styles.featuresGrid} features-grid-trigger`}>
          <div className={`${styles.featureCard} feature-card-item`}>
            <div className={styles.featureIcon}><FiShoppingBag /></div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>5-Stage COD Pipeline</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
              Pending, Confirmed, Dispatched, Delivered aur Returned ka automatic tracking. Parcel return hone par stock automatically restore ho jata hai.
            </p>
          </div>

          <div className={`${styles.featureCard} feature-card-item`}>
            <div className={styles.featureIcon} style={{ background: 'var(--color-brand-secondary-subtle)', color: 'var(--color-brand-secondary)' }}>
              <FiCpu />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Claude AI Assistant (Munshi)</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
              Urdu aur Roman Urdu mein live hisaab poochein. AI model kabhi ghair-haqeeqi numbers nahi banata—har number Mongoose database se verify hota hai.
            </p>
          </div>

          <div className={`${styles.featureCard} feature-card-item`}>
            <div className={styles.featureIcon} style={{ background: 'var(--color-status-pending-bg)', color: 'var(--color-status-pending)' }}>
              <FiBox />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Variants & Low-Stock Pulse</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
              Size aur color matrix manage karein. Jab bhi stock minimum limit se kam ho, subtle pulse alert aur notification trigger hota hai.
            </p>
          </div>

          <div className={`${styles.featureCard} feature-card-item`}>
            <div className={styles.featureIcon}><FiTruck /></div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Trax, TCS, Leopards & PostEx</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
              Tracking numbers generate karein aur riders ke pas kitna COD cash pending hai uska live status check karein.
            </p>
          </div>

          <div className={`${styles.featureCard} feature-card-item`}>
            <div className={styles.featureIcon}><FiDollarSign /></div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>1-Click WhatsApp Templates</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
              Pre-filled Roman Urdu confirmation aur dispatch links generate karein taake customer parcel lene ke waqt ghar par cash ready rakh sake.
            </p>
          </div>

          <div className={`${styles.featureCard} feature-card-item`}>
            <div className={styles.featureIcon}><FiShield /></div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Gahak Return Risk Detection</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
              Pehle se return karne walay buyers aur loyal repeat customers ki nishandahi karein taake courier losses se bacha ja sake.
            </p>
          </div>
        </div>
      </section>

      {/* 4. PINNED "HOW IT WORKS" STEP SECTION */}
      <section id="how-it-works" className={styles.howSection}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 className={styles.sectionTitle}>Kaise Kaam Karta Hai?</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>Sirf 3 aasan steps mein apna karobar digitalize karein.</p>
        </div>

        <div className={styles.stepsContainer}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-brand-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                1
              </div>
              <div>
                <h4 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '4px' }}>Store & Products Setup</h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                  Apne products, prices aur stock enter karein ya CSV se import karein.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-brand-secondary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                2
              </div>
              <div>
                <h4 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '4px' }}>Orders Dispatch via Couriers</h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                  Instagram ya WhatsApp se aane walay orders ka 1-click WhatsApp message bhejein aur Trax/TCS se dispatch karein.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-status-confirmed)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                3
              </div>
              <div>
                <h4 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '4px' }}>AI Assistant se Hisaab Check Karein</h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                  Kisi bhi waqt mobile par AI Munshi se poochein: "Aaj kitni kamai hui?" aur foran live data payein.
                </p>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--color-bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-brand-secondary)' }} />
              <strong>Live Pakistan Operations</strong>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
              • Karachi Orders Delivery: <strong>94% on time</strong><br />
              • Lahore COD Collection: <strong>Rs 34,500 cleared</strong><br />
              • Trax Tracking Sync: <strong>Active</strong><br />
              • AI Munshi Urdu Latency: <strong>&lt; 150ms</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 5. REVIEWS & TESTIMONIALS */}
      <section id="reviews" style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 className={styles.sectionTitle}>Pakistani Sellers Ka Aitmad</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>Hazaron online dukaandar KarobarAI par trust karte hain.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {[
            {
              name: 'Ayesha Khan',
              store: 'Ayesha Closet (Karachi)',
              text: 'Pehle mujhe WhatsApp par diary mein orders likhne padte thay aur COD cash ka hisaab nahi rehta tha. KarobarAI ne meri life aasan kar di!',
            },
            {
              name: 'Bilal Farooq',
              store: 'Urban Streetwear (Lahore)',
              text: 'Low stock alerts aur AI Munshi bohot zabardast hain. Mujhe bas phone par bolna padta hai aur poora hisaab samnay aa jata hai.',
            },
            {
              name: 'Dr. Sarah Tariq',
              store: 'Organics By Sarah (Islamabad)',
              text: 'Return rate detection ki wajah se mere 30,000+ rupay courier charges mein bach gaye. Must have for every Instagram seller.',
            },
          ].map((rev, i) => (
            <div key={i} style={{ background: 'var(--color-bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--color-border-subtle)' }}>
              <div style={{ display: 'flex', gap: '4px', color: '#F59E0B', marginBottom: '12px' }}>
                <FiStar /><FiStar /><FiStar /><FiStar /><FiStar />
              </div>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
                "{rev.text}"
              </p>
              <div>
                <strong style={{ fontSize: '14px' }}>{rev.name}</strong>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{rev.store}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION FOOTER BANNER */}
      <section style={{ padding: '80px 24px', textAlign: 'center', background: 'linear-gradient(180deg, transparent, rgba(99, 102, 241, 0.08))' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>
          Aaj Hi Apna Online Karobar Barhayein
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '28px', maxWidth: '500px', margin: '0 auto 28px' }}>
          14 din ka free trial shuru karein. Kisi credit card ki zaroorat nahi.
        </p>
        <Link to="/signup">
          <Button variant="primary" size="lg" iconRight={<FiArrowRight />}>
            Create Free Account Now
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
