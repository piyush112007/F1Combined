'use client';

import styles from '../app/page.module.css';
import { FiCloud, FiSun, FiCloudRain } from 'react-icons/fi';
import { GiCarWheel, GiGears } from 'react-icons/gi';

export default function PredictiveInsights({ circuit, date, weatherData }: { circuit: string, date: string, weatherData?: any }) {
  // Simple Mock Engine based on circuit string hashing to make it deterministic
  const isHighDeg = circuit.includes('Bahrain') || circuit.includes('Silverstone') || circuit.includes('Suzuka');
  const isStreet = circuit.includes('Monaco') || circuit.includes('Baku') || circuit.includes('Singapore');

  const hasRain = weatherData?.text?.toLowerCase().includes('rain') || weatherData?.text?.toLowerCase().includes('shower') || weatherData?.text?.toLowerCase().includes('storm');
  const isHot = weatherData?.tempMax > 30;

  let strategy = "";
  if (hasRain) {
    strategy = "Wet Strategy (Intermediates / Wets). Expect Safety Cars and high unpredictability. Track position is secondary to being on the right tyre at the right time.";
  } else if (isHighDeg || isHot) {
    strategy = "2-Stop Strategy (Medium -> Hard -> Hard). High thermal degradation expected. Undercut is powerful here.";
  } else if (isStreet) {
    strategy = "1-Stop Strategy (Medium -> Hard). Track position is king; overcut preferred if stuck in DRS train.";
  } else {
    strategy = "Flexible 1 or 2 Stop depending on Safety Car windows. Mediums are the preferred starting tyre.";
  }

  let weather = "";
  if (weatherData) {
    weather = `${weatherData.text}. High of ${weatherData.tempMax}°C. ${weatherData.mock ? (weatherData.error ? `(OpenWeather API Error: ${weatherData.error})` : '(Mock Data)') : '(Powered by OpenWeather)'}`;
  } else {
    weather = isStreet && circuit.includes('Singapore')
      ? "Hot & Humid. 20% chance of rain. Track temp ~38°C."
      : isStreet
      ? "Clear Skies. Track temp ~45°C."
      : "Overcast. 40% chance of light showers. Track temp ~28°C.";
  }

  let degradation = "";
  if (hasRain) {
    degradation = "Low thermal degradation due to water cooling, but high risk of aquaplaning. Cross-over point to slicks will be critical.";
  } else if (isHighDeg || isHot) {
    degradation = "High Thermal Degradation on the rear tyres. Management in traction zones is critical, exacerbated by high track temperatures.";
  } else {
    degradation = "Low to Medium Degradation. Graining on the front left could be a limiting factor in the first stint.";
  }

  const getWeatherIcon = () => {
    if (hasRain) return <FiCloudRain size={22} style={{ color: '#00d2ff', flexShrink: 0 }} />;
    if (isHot) return <FiSun size={22} style={{ color: '#ffb300', flexShrink: 0 }} />;
    return <FiCloud size={22} style={{ color: '#8b949e', flexShrink: 0 }} />;
  };

  const highlightInsights = (text: string) => {
    const terms = [
      "Wet Strategy", "Intermediates", "Wets", "Safety Cars",
      "2-Stop Strategy", "Medium", "Hard", "Undercut",
      "1-Stop Strategy", "overcut", "DRS train",
      "High Thermal Degradation", "rear tyres", "low thermal degradation",
      "aquaplaning", "slicks", "traction zones", "track temperatures",
      "Low to Medium Degradation", "Graining", "front left", "stint"
    ];
    
    let parts = [text];
    for (const term of terms) {
      const nextParts: any[] = [];
      for (const part of parts) {
        if (typeof part === 'string') {
          const regex = new RegExp(`(${term})`, 'gi');
          const split = part.split(regex);
          nextParts.push(...split);
        } else {
          nextParts.push(part);
        }
      }
      parts = nextParts;
    }
    
    return parts.map((part, idx) => {
      if (typeof part === 'string') {
        const match = terms.some(t => t.toLowerCase() === part.toLowerCase());
        if (match) {
          let color = '#ff2800'; // Default red
          if (part.toLowerCase().includes('hard') || part.toLowerCase().includes('medium') || part.toLowerCase().includes('wet') || part.toLowerCase().includes('intermediate') || part.toLowerCase().includes('slicks')) {
            color = '#e1b12c'; // Yellow/orange tire highlights
          } else if (part.toLowerCase().includes('safety car')) {
            color = '#f5cd79'; // Amber
          }
          return <strong key={idx} style={{ color, fontWeight: '700' }}>{part}</strong>;
        }
        return part;
      }
      return part;
    });
  };

  const cardStyle = {
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "default",
  };

  const cardHover = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.borderColor = "rgba(255, 40, 0, 0.3)";
    e.currentTarget.style.boxShadow = "0 12px 40px rgba(255, 40, 0, 0.1)";
  };

  const cardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)";
    e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)";
  };

  return (
    <div className={styles.predictiveGrid} style={{ marginTop: '16px' }}>
      <div 
        style={cardStyle}
        onMouseEnter={cardHover}
        onMouseLeave={cardLeave}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          {getWeatherIcon()}
          <h3 style={{ color: '#ffffff', margin: 0, fontSize: '15px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Expected Weather
          </h3>
        </div>
        <p style={{ color: '#c9d1d9', margin: 0, fontSize: '14px', lineHeight: '1.6' }}>{highlightInsights(weather)}</p>
      </div>

      <div 
        style={cardStyle}
        onMouseEnter={cardHover}
        onMouseLeave={cardLeave}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <GiGears size={22} style={{ color: '#ff5e00', flexShrink: 0 }} />
          <h3 style={{ color: '#ffffff', margin: 0, fontSize: '15px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Predictive Pit Strategy
          </h3>
        </div>
        <p style={{ color: '#c9d1d9', margin: 0, fontSize: '14px', lineHeight: '1.6' }}>{highlightInsights(strategy)}</p>
      </div>

      <div 
        style={{ ...cardStyle, gridColumn: 'span 2' }}
        onMouseEnter={cardHover}
        onMouseLeave={cardLeave}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <GiCarWheel size={22} style={{ color: '#e1b12c', flexShrink: 0 }} />
          <h3 style={{ color: '#ffffff', margin: 0, fontSize: '15px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Tyre Degradation Expectation
          </h3>
        </div>
        <p style={{ color: '#c9d1d9', margin: 0, fontSize: '14px', lineHeight: '1.6' }}>{highlightInsights(degradation)}</p>
      </div>
    </div>
  );
}
