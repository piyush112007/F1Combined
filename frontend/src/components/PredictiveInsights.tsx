'use client';

import styles from '../app/page.module.css';

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

  return (
    <div className={styles.predictiveGrid}>
      <div style={{ background: '#0d1117', padding: '16px', borderRadius: '6px', border: '1px solid #30363d' }}>
        <h3 style={{ color: '#ff2800', margin: '0 0 12px 0', fontSize: '14px' }}>☁️ Expected Weather</h3>
        <p style={{ color: '#c9d1d9', margin: 0, fontSize: '14px' }}>{weather}</p>
      </div>
      <div style={{ background: '#0d1117', padding: '16px', borderRadius: '6px', border: '1px solid #30363d' }}>
        <h3 style={{ color: '#ff2800', margin: '0 0 12px 0', fontSize: '14px' }}>🏁 Predictive Pit Strategy</h3>
        <p style={{ color: '#c9d1d9', margin: 0, fontSize: '14px' }}>{strategy}</p>
      </div>
      <div style={{ background: '#0d1117', padding: '16px', borderRadius: '6px', border: '1px solid #30363d', gridColumn: 'span 2' }}>
        <h3 style={{ color: '#ff2800', margin: '0 0 12px 0', fontSize: '14px' }}>🛞 Tyre Degradation Expectation</h3>
        <p style={{ color: '#c9d1d9', margin: 0, fontSize: '14px' }}>{degradation}</p>
      </div>
    </div>
  );
}
