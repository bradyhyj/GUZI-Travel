import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
import { BUSAN, CITIES } from './constants/cities';
import Arrival from './Arrival';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

// 💡 1. App.css의 내용을 문자열 상수로 정의합니다.
const appStyles = `
.counter {
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 5px;
  color: var(--accent);
  background: var(--accent-bg);
  border: 2px solid transparent;
  transition: border-color 0.3s;
  margin-bottom: 24px;

  &:hover {
    border-color: var(--accent-border);
  }
  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
}

.hero {
  position: relative;

  .base,
  .framework,
  .vite {
    inset-inline: 0;
    margin: 0 auto;
  }

  .base {
    width: 170px;
    position: relative;
    z-index: 0;
  }

  .framework,
  .vite {
    position: absolute;
  }

  .framework {
    z-index: 1;
    top: 34px;
    height: 28px;
    transform: perspective(2000px) rotateZ(300deg) rotateX(44deg) rotateY(39deg)
      scale(1.4);
  }

  .vite {
    z-index: 0;
    top: 107px;
    height: 26px;
    width: auto;
    transform: perspective(2000px) rotateZ(300deg) rotateX(40deg) rotateY(39deg)
      scale(0.8);
  }
}

#center {
  display: flex;
  flex-direction: column;
  gap: 25px;
  place-content: center;
  place-items: center;
  flex-grow: 1;

  @media (max-width: 1024px) {
    padding: 32px 20px 24px;
    gap: 18px;
  }
}

#next-steps {
  display: flex;
  border-top: 1px solid var(--border);
  text-align: left;

  & > div {
    flex: 1 1 0;
    padding: 32px;
    @media (max-width: 1024px) {
      padding: 24px 20px;
    }
  }

  .icon {
    margin-bottom: 16px;
    width: 22px;
    height: 22px;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
}

#docs {
  border-right: 1px solid var(--border);

  @media (max-width: 1024px) {
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}

#next-steps ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 8px;
  margin: 32px 0 0;

  .logo {
    height: 18px;
  }

  a {
    color: var(--text-h);
    font-size: 16px;
    border-radius: 6px;
    background: var(--social-bg);
    display: flex;
    padding: 6px 12px;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    transition: box-shadow 0.3s;

    &:hover {
      box-shadow: var(--shadow);
    }
    .button-icon {
      height: 18px;
      width: 18px;
    }
  }

  @media (max-width: 1024px) {
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: center;

    li {
      flex: 1 1 calc(50% - 8px);
    }

    a {
      width: 100%;
      justify-content: center;
      box-sizing: border-box;
    }
  }
}

#spacer {
  height: 88px;
  border-top: 1px solid var(--border);
  @media (max-width: 1024px) {
    height: 48px;
  }
}

.ticks {
  position: relative;
  width: 100%;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: -4.5px;
    border: 5px solid transparent;
  }

  &::before {
    left: 0;
    border-left-color: var(--border);
  }
  &::after {
    right: 0;
    border-right-color: var(--border);
  }
}
`;

const Airplane = ({ city, onArrival }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const airplaneMarkerRef = useRef(null);
    const airplaneInstanceRef = useRef(null);
    const animationRef = useRef(null);

    const cityKeyMap = {
        "도쿄": "TOKYO",
        "오사카": "OSAKA",
        "후쿠오카": "FUKUOKA",
        "삿포로": "SAPPORO",
        "뉴욕": "NEWYORK",
        "로스엔젤레스": "LOSANGELES",
        "런던": "LONDON",
        "파리": "PARIS",
        "로마": "ROME",
        "대만": "TAIPEI",
        "상하이": "SHANGHAI"
    };

    const [view, setView] = useState('HOME');
    const [selectedCity, setSelectedCity] = useState(city ? (cityKeyMap[city] || "TOKYO") : 'TOKYO');
    const [remainingTimeStr, setRemainingTimeStr] = useState("");
    const [speed, setSpeed] = useState(1);
    const speedRef = useRef(1);

    useEffect(() => {
        speedRef.current = speed;
    }, [speed]);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (view !== 'HOME' && view !== 'FLYING') return;
        if (map.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/light-v11',
            center: BUSAN,
            zoom: 3,
            projection: 'mercator'
        });

        map.current.on('load', () => {
            const style = document.createElement('style');
            style.innerHTML = `
        .airplane-container { width: 60px; height: 60px; }
        .airplane-icon { 
          width: 100%; height: 100%; 
          background-image: url(/airplane_icon.png); 
          background-size: contain; 
          background-repeat: no-repeat; 
          background-position: center;
          transition: transform 0.1s linear; 
        }
      `;
            document.head.appendChild(style);

            const el = document.createElement('div');
            el.className = 'airplane-container';

            const icon = document.createElement('div');
            icon.className = 'airplane-icon';
            el.appendChild(icon);
            airplaneMarkerRef.current = icon;

            airplaneInstanceRef.current = new mapboxgl.Marker({ element: el, rotationAlignment: 'map' })
                .setLngLat(BUSAN).addTo(map.current);

            map.current.addSource('trace', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [BUSAN] } } });
            map.current.addLayer({ id: 'trace', type: 'line', source: 'trace', paint: { 'line-color': '#FFD700', 'line-width': 4 } });
        });
    }, [view]);

    const startFlight = () => {
        setView('FLYING');
        const target = CITIES[selectedCity];

        const duration = target.hours * 60 * 60 * 1000;
        let lastTime = Date.now();
        let virtualElapsed = 0;

        let destLng = target.lng;
        if (destLng - BUSAN[0] > 180) destLng -= 360;
        else if (destLng - BUSAN[0] < -180) destLng += 360;

        if (target.isFlipped) {
            airplaneMarkerRef.current.style.transform = 'scaleX(-1)';
        } else {
            airplaneMarkerRef.current.style.transform = 'scaleX(1)';
        }

        const animate = () => {
            const now = Date.now();
            const delta = now - lastTime;
            lastTime = now;

            virtualElapsed += delta * speedRef.current;
            const t = Math.min(virtualElapsed / duration, 1);

            const secondsLeft = Math.max(0, Math.ceil((duration - virtualElapsed) / 1000));
            setRemainingTimeStr(formatTime(secondsLeft));

            const curLng = BUSAN[0] + (destLng - BUSAN[0]) * t;
            const curLat = BUSAN[1] + (target.lat - BUSAN[1]) * t;

            airplaneInstanceRef.current.setLngLat([curLng, curLat]);
            // 🚨 누락되었던 각도 회전 로직 복구 완료!
            airplaneInstanceRef.current.setRotation(target.rotation);

            const traceSource = map.current.getSource('trace');
            if (traceSource) {
                traceSource.setData({
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: [BUSAN, [curLng, curLat]]
                    }
                });
            }

            const displayLng = ((curLng + 180) % 360) - 180;
            map.current.jumpTo({ center: [displayLng, curLat], zoom: 4.5 });

            if (t < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                if (onArrival) onArrival();
                else setView('HOME');
            }
        };
        animationRef.current = requestAnimationFrame(animate);
    };

    const skipFlight = () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        if (onArrival) onArrival();
        else setView('HOME');
    };

    return (
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'fixed', top: 0, left: 0, zIndex: 1000, backgroundColor: '#000' }}>
            {/* 💡 2. JSX 내부에 style 태그를 삽입하여 App.css 내용을 적용합니다 */}
            <style dangerouslySetInnerHTML={{ __html: appStyles }} />

            <div style={{
                position: 'absolute', bottom: '50px', left: '50%', transform: 'translateX(-50%)',
                zIndex: 100, display: 'flex', flexDirection: 'column', gap: '15px',
                backgroundColor: 'rgba(15, 18, 25, 0.85)', backdropFilter: 'blur(12px)',
                padding: '24px 40px', borderRadius: '24px', alignItems: 'center',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255,255,255,0.08)',
                width: 'max-content', maxWidth: '90vw'
            }}>
                {view === 'HOME' ? (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <div style={{ color: '#fff', fontSize: '18px', fontWeight: '500' }}>
                                목적지: <span style={{ color: '#3264ff', fontWeight: '900', fontSize: '22px', marginLeft: '5px' }}>{CITIES[selectedCity].name}</span>
                            </div>
                            <div style={{ color: '#888', fontSize: '14px', fontWeight: '600' }}>
                                예상 비행 시간: {CITIES[selectedCity].hours}시간
                            </div>
                        </div>
                        <button onClick={startFlight} style={{
                            padding: '16px 50px', backgroundColor: '#3264ff', color: '#fff',
                            border: 'none', borderRadius: '14px', fontWeight: '800', fontSize: '16px',
                            cursor: 'pointer', transition: 'all 0.3s ease',
                            boxShadow: '0 6px 20px rgba(50, 100, 255, 0.4)'
                        }}
                            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(50, 100, 255, 0.5)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(50, 100, 255, 0.4)'; }}
                        >
                            이륙하기 (비행 시작)
                        </button>
                    </>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ color: '#888', fontSize: '12px', fontWeight: '700', marginBottom: '6px', letterSpacing: '1px' }}>REMAINING TIME</span>
                            <span style={{ color: '#fff', fontWeight: '900', fontSize: '28px', fontFamily: 'monospace', letterSpacing: '2px' }}>{remainingTimeStr}</span>
                        </div>

                        <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.15)' }}></div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ position: 'relative' }}>
                                <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={{
                                    backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', padding: '12px 16px', width: '100%',
                                    border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', cursor: 'pointer',
                                    outline: 'none', fontWeight: '700', fontSize: '14px', appearance: 'none', textAlign: 'center',
                                    transition: 'all 0.2s ease'
                                }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                                >
                                    <option value={1} style={{ color: '#000' }}>1x (현실 속도)</option>
                                    <option value={2} style={{ color: '#000' }}>2x 속도</option>
                                    <option value={10} style={{ color: '#000' }}>10x 속도</option>
                                    <option value={60} style={{ color: '#000' }}>60x (1초=1분)</option>
                                    <option value={3600} style={{ color: '#000' }}>3600x (1초=1시간)</option>
                                </select>
                                <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#888', fontSize: '10px' }}>▼</div>
                            </div>

                            <button onClick={skipFlight} style={{
                                padding: '12px 20px', backgroundColor: 'rgba(255, 77, 79, 0.1)', color: '#ff4d4f',
                                border: '1px solid rgba(255, 77, 79, 0.2)', borderRadius: '12px', fontWeight: '800',
                                cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '13px', letterSpacing: '0.5px'
                            }}
                                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 77, 79, 0.2)'; e.currentTarget.style.borderColor = 'rgba(255, 77, 79, 0.4)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 77, 79, 0.1)'; e.currentTarget.style.borderColor = 'rgba(255, 77, 79, 0.2)'; }}
                            >
                                도착지로 건너뛰기 ⏩
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
        </div>
    );
};

export default Airplane;