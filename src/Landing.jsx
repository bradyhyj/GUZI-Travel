import { useState, useEffect } from "react";
import { TRAVEL_DATA } from "./data";

const Icon = ({ name, size = 16, color = "currentColor" }) => {
  const icons = {
    hotel: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10" />,
    flight: <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />,
    search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
    chevronDown: <polyline points="6 9 12 15 18 9" />,
    chevronLeft: <polyline points="15 18 9 12 15 6" />,
    chevronRight: <polyline points="9 18 15 12 9 6" />,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    minus: <line x1="5" y1="12" x2="19" y2="12" />,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>
  };
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>;
};

const CITY_CODES = {
  "도쿄": "HND", "오사카": "KIX", "후쿠오카": "FUK", "삿포로": "CTS", "뉴욕": "JFK", "로스엔젤레스": "LAX", "런던": "LHR", "파리": "CDG", "로마": "FCO", "대만": "TPE", "상하이": "PVG"
};

export default function Landing({ onSearch, reservations = [], onBoarding, onCancelBooking, initialDates, budget, onBudgetChange }) {
  const [activeTab, setActiveTab] = useState('항공권');
  const [cityInput, setCityInput] = useState("도쿄");
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isCalOpen, setIsCalOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [startDate, setStartDate] = useState(initialDates?.startDate || new Date(2026, 4, 10));
  const [endDate, setEndDate] = useState(initialDates?.endDate || new Date(2026, 4, 15));
  const [adultCount, setAdultCount] = useState(1);

  const [budgetInput, setBudgetInput] = useState(budget || 500000);

  // Sync internal input state if global budget changes
  useEffect(() => {
    setBudgetInput(budget || 500000);
  }, [budget]);

  const [showTicket, setShowTicket] = useState(false);

  const totalBudgetNum = budget || 500000;
  const spentSoFar = reservations.reduce((sum, res) => sum + res.price, 0);
  const remainingBudget = totalBudgetNum - spentSoFar;

  const flight = reservations.find(r => r.type === 'flight');
  const hotel = reservations.find(r => r.type === 'hotel');

  let isMatched = false;
  let isDateMatched = false;
  let isCityMatched = false;

  if (flight && hotel) {
    isDateMatched = flight.startDate?.getTime() === hotel.startDate?.getTime() && flight.endDate?.getTime() === hotel.endDate?.getTime();
    isCityMatched = flight.city === hotel.city;
    isMatched = isDateMatched && isCityMatched;
  }

  const hasFlight = flight !== undefined;
  const hasHotel = hotel !== undefined;
  const hasBoth = hasFlight && hasHotel;

  const cityList = Object.keys(TRAVEL_DATA).filter(city => city !== "부산");

  const renderCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= lastDate; i++) days.push(new Date(year, month, i));
    return days;
  };

  const handleDateClick = (date) => {
    if (!startDate || (startDate && endDate)) { setStartDate(date); setEndDate(null); }
    else { if (date < startDate) { setStartDate(date); setEndDate(null); } else { setEndDate(date); setIsCalOpen(false); } }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f7fa", fontFamily: 'sans-serif' }}>
      <header style={headerContainer}><span style={logoStyle}>GUZI.com</span></header>
      <section style={heroContainer}>
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h1 style={heroTitle}>설렘이 필요할 때, 거지여행</h1>
          <p style={heroSubTitle}>부산에서 떠나는 전 세계 여행</p>
        </div>
        <div style={{ maxWidth: 1050, width: '100%', margin: "0 auto", position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            <button onClick={() => setActiveTab('항공권')} style={tabButtonStyle(activeTab === '항공권')}>항공권</button>
            <button onClick={() => setActiveTab('숙소')} style={tabButtonStyle(activeTab === '숙소')}>숙소</button>
          </div>
          <div style={searchCard}>
            <div style={inputGrid}>
              <div style={inputBox}><div style={label}>출발지</div><div style={mainValue}>부산 (PUS)</div></div>
              <div style={{ ...inputBox, position: 'relative', cursor: 'pointer' }} onClick={() => setIsCityOpen(!isCityOpen)}>
                <div style={label}>도착지</div><div style={{ display: 'flex', justifyContent: 'space-between' }}>{cityInput}<Icon name="chevronDown" color="#3264ff" /></div>
                {isCityOpen && <div style={dropdownMenu}>{cityList.map(c => <div key={c} style={dropdownItem} onClick={(e) => { e.stopPropagation(); setCityInput(c); setIsCityOpen(false) }}>{c}</div>)}</div>}
              </div>
              <div style={{ ...inputBox, flex: 1.4, position: 'relative', cursor: 'pointer' }} onClick={() => setIsCalOpen(!isCalOpen)}>
                <div style={label}>일정</div><div style={{ display: 'flex', gap: 8 }}><Icon name="calendar" color="#3264ff" />{startDate.getMonth() + 1}.{startDate.getDate()} — {endDate ? `${endDate.getMonth() + 1}.${endDate.getDate()}` : "선택중"}</div>
                {isCalOpen && <div style={calendarPopup} onClick={e => e.stopPropagation()}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))} style={{ border: 0, background: 0 }}><Icon name="chevronLeft" /></button>
                    <b>{viewDate.getFullYear()}년 {viewDate.getMonth() + 1}월</b>
                    <button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))} style={{ border: 0, background: 0 }}><Icon name="chevronRight" /></button>
                  </div>
                  <div style={calendarGrid}>
                    {['일', '월', '화', '수', '목', '금', '토'].map(d => <div key={d} style={{ fontSize: 11, color: '#999' }}>{d}</div>)}
                    {renderCalendar().map((d, i) => <div key={i} onClick={() => d && handleDateClick(d)} style={{ height: 35, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, cursor: d ? 'pointer' : 'default', backgroundColor: d && (d.getTime() === startDate?.getTime() || d.getTime() === endDate?.getTime()) ? '#3264ff' : (startDate && endDate && d > startDate && d < endDate ? '#f0f4ff' : 'transparent'), color: d && (d.getTime() === startDate?.getTime() || d.getTime() === endDate?.getTime()) ? '#fff' : '#222' }}>{d ? d.getDate() : ""}</div>)}
                  </div>
                </div>}
              </div>
              <div style={{ ...inputBox, borderRight: 0, padding: "18px 24px" }}><div style={label}>인원</div><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><button onClick={() => adultCount > 1 && setAdultCount(adultCount - 1)} style={countBtn}><Icon name="minus" /></button><b>{adultCount}명</b><button onClick={() => setAdultCount(adultCount + 1)} style={countBtn}><Icon name="plus" /></button></div></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 25 }}><button onClick={() => onSearch(activeTab === '항공권' ? 'flight' : 'hotel', cityInput, adultCount, startDate, endDate)} style={searchBtn}>검색하기</button></div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1050, margin: '60px auto', padding: '0 20px', paddingBottom: 100 }}>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>{reservations.length > 0 ? "내 예약 내역" : "가상 여행 준비"}</h2>
        </div>

        <div style={{ marginBottom: reservations.length > 0 ? 10 : 30, padding: '30px 40px', background: '#fff', borderRadius: 16, border: '1px solid #1e6efa', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 5px 15px rgba(0,0,0,0.03)' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 5, color: '#111' }}>가상 예약 예산 설정</div>
            <div style={{ fontSize: 14, color: '#666' }}>여행 계획을 짤 때 사용할 비용을 입력해주세요.</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12, opacity: reservations.length > 0 ? 0.5 : 1, pointerEvents: reservations.length > 0 ? 'none' : 'auto' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {[500000, 1000000, 1500000].map(amt => (
                <button
                  key={amt}
                  onClick={() => { setBudgetInput(amt); onBudgetChange(amt); }}
                  style={{ padding: '6px 14px', borderRadius: 20, border: budget === amt ? '1px solid #3264ff' : '1px solid #ddd', background: budget === amt ? '#f0f4ff' : '#fff', color: budget === amt ? '#3264ff' : '#666', fontWeight: 700, cursor: 'pointer', transition: '0.2s', fontSize: 13 }}
                >
                  {amt / 10000}만원
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f5f7fa', border: '2px solid transparent', padding: '12px 20px', borderRadius: 12, transition: '0.2s', width: 180 }} onFocus={(e) => e.currentTarget.style.borderColor = '#3264ff'} onBlur={(e) => e.currentTarget.style.borderColor = 'transparent'}>
                <input
                  type="text"
                  style={{ background: 'transparent', border: 'none', fontSize: 20, fontWeight: 900, color: '#111', outline: 'none', width: '100%', textAlign: 'right' }}
                  value={budgetInput ? budgetInput.toLocaleString() : ""}
                  onChange={e => {
                    const val = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                    setBudgetInput(val);
                  }}
                  placeholder="직접 입력"
                />
                <span style={{ fontWeight: 800, color: '#111', marginLeft: 5 }}>원</span>
              </div>
              <button
                onClick={() => onBudgetChange(budgetInput)}
                style={{ padding: '0 20px', backgroundColor: '#3264ff', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', transition: '0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e40af'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3264ff'}
              >
                설정
              </button>
            </div>
          </div>
        </div>

        {reservations.length > 0 && (
          <div style={{ marginBottom: 30, padding: '18px 30px', background: '#f8fafc', borderRadius: 16, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 15, color: '#555', fontWeight: 700 }}>
              미리 쓴 항공/숙소 금액: <span style={{ color: '#111', fontWeight: 800, marginLeft: 5 }}>₩{spentSoFar.toLocaleString()}</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
              AI 플래너 실사용 잔액:
              <span style={{ color: remainingBudget >= 0 ? '#10b981' : '#ef4444', fontSize: 18 }}>₩{remainingBudget.toLocaleString()}</span>
            </div>
          </div>
        )}

        {reservations.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 16, padding: '50px 20px', textAlign: 'center', border: '2px dashed #ddd' }}>
            <h3 style={{ margin: 0, color: '#555' }}>상단 검색창에서 항공권과 숙소를 준비해주세요.</h3>
            <p style={{ color: '#999', marginTop: 10, fontSize: 14 }}>가상 여행 기분을 100% 내기 위해 항공권과 숙소 두 가지가 모두 예약되어야 모의 여행 리모컨이 켜집니다.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {reservations.map(res => (
              <div key={res.id} style={{ background: '#fff', borderRadius: 16, padding: 25, border: '1px solid #eee', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 15 }}>
                  <div style={{ width: 45, height: 45, borderRadius: 8, backgroundColor: res.color }} />
                  <div>
                    <div style={{ fontSize: 13, color: '#3264ff', fontWeight: 800, marginBottom: 4 }}>{res.type === 'flight' ? '항공권 예약' : '숙소 예약'}</div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{res.title}</div>
                  </div>
                </div>
                <div style={{ fontSize: 14, color: '#666', borderBottom: '1px solid #f0f0f0', paddingBottom: 15, marginBottom: 15 }}>
                  {res.subtitle}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 13, color: '#999' }}>예약자: {res.userName}</div>
                  <div style={{ fontWeight: 800 }}>₩{res.price.toLocaleString()}</div>
                </div>
                <button
                  onClick={() => onCancelBooking && onCancelBooking(res.id)}
                  style={{ width: '100%', marginTop: 15, padding: '10px 0', border: '1px solid #ff4d4f', background: '#fff0f0', color: '#ff4d4f', borderRadius: 8, fontWeight: 700, cursor: 'pointer', transition: '0.2s' }}
                >
                  예약 취소
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
          {hasBoth && !isMatched && (
            <div style={{ color: '#ef4444', fontWeight: 800, marginBottom: 20, textAlign: 'center', background: '#fef2f2', padding: '12px 20px', borderRadius: 10 }}>
              ⚠️ 항공권과 숙소의 일정이 다릅니다.<br />
              {!isCityMatched && "도착지(도시)를 동일하게 맞춰주세요. "}
              {!isDateMatched && "여행 기간(날짜)을 동일하게 맞춰주세요."}
            </div>
          )}
          <button
            disabled={!isMatched}
            style={{
              padding: '20px 60px',
              borderRadius: 16,
              background: isMatched ? '#3264ff' : '#ddd',
              color: '#fff',
              border: 0,
              fontWeight: 900,
              fontSize: 22,
              cursor: isMatched ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              boxShadow: isMatched ? '0 15px 30px rgba(50, 100, 255, 0.3)' : 'none',
              transform: isMatched ? 'scale(1.05)' : 'scale(1)'
            }}
            onClick={() => setShowTicket(true)}
          >
            {isMatched ? '가상 여행 시작하기' : '가상 여행 준비 중...'}
          </button>
        </div>
      </section>

      {showTicket && (() => {
        const flight = reservations.find(r => r.type === 'flight');
        if (!flight) return null;
        const city = flight.city;
        const airlineName = flight.title.split(' ')[0];

        return (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(5px)' }}>
            <div style={{ background: '#fff', width: 340, borderRadius: 24, overflow: 'hidden', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', animation: 'slideUp 0.4s ease-out' }}>

              <div style={{ background: '#3264ff', padding: '30px 25px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
                  <div style={{ color: '#fff' }}>
                    <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 5, letterSpacing: 1 }}>{airlineName}</div>
                    <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>BOARDING PASS</div>
                  </div>
                  <div style={{ color: '#fff', opacity: 0.8 }}>✈️</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: 1 }}>PUS</div>
                    <div style={{ fontSize: 15, opacity: 0.9, fontWeight: 600 }}>부산</div>
                  </div>
                  <div style={{ flex: 1, margin: '0 15px', height: 2, background: 'rgba(255,255,255,0.3)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: '#3264ff', padding: '0 5px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: 1 }}>{CITY_CODES[city] || "ARR"}</div>
                    <div style={{ fontSize: 15, opacity: 0.9, fontWeight: 600 }}>{city}</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: -15, padding: '0 20px', position: 'relative', background: '#fff', zIndex: 2 }}>
                <div style={{ width: 30, height: 30, background: '#1a1a1a', borderRadius: '50%', position: 'absolute', left: -15 }}></div>
                <div style={{ flex: 1, borderTop: '3px dashed #ddd', margin: '0 10px' }}></div>
                <div style={{ width: 30, height: 30, background: '#1a1a1a', borderRadius: '50%', position: 'absolute', right: -15 }}></div>
              </div>

              <div style={{ padding: 25, background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 25 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#999', fontWeight: 700 }}>탑승객 (PASSENGER)</div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{flight.userName}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: '#999', fontWeight: 700 }}>날짜 (DATE)</div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{flight.date}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#999', fontWeight: 700 }}>항공편 (FLIGHT)</div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>V-{Math.floor(Math.random() * 900) + 100}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#999', fontWeight: 700 }}>게이트 (GATE)</div>
                    <div style={{ fontWeight: 800, fontSize: 15, textAlign: 'center' }}>{Math.floor(Math.random() * 30) + 1}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: '#999', fontWeight: 700 }}>좌석 (SEAT)</div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{flight.subtitle.includes('좌석:') ? flight.subtitle.split('좌석: ')[1] : '선택안함'}</div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #eee', paddingTop: 20, textAlign: 'center' }}>
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VirtualTicket_${flight.id}`} alt="QR Code" style={{ width: 140, height: 140 }} />
                  <div style={{ fontSize: 13, color: '#888', marginTop: 15, fontWeight: 600 }}>가상 여행 출발! QR을 스캔하세요</div>
                </div>
              </div>

              <div style={{ display: 'flex', borderTop: '1px solid #ddd' }}>
                <button
                  onClick={() => setShowTicket(false)}
                  style={{ flex: 1, background: '#f8f9fa', border: 'none', padding: '18px', fontSize: 16, fontWeight: 800, color: '#666', cursor: 'pointer' }}
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    setShowTicket(false);
                    if (onBoarding) onBoarding({ budgetInput, startDate, endDate });
                  }}
                  style={{ flex: 1, background: '#3264ff', border: 'none', padding: '18px', fontSize: 16, fontWeight: 800, color: '#fff', cursor: 'pointer' }}
                >
                  탑승하기
                </button>
              </div>
            </div>
            <style>{`
              @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
            `}</style>
          </div>
        );
      })()}
    </div>
  );
}

// 스타일 긴급 수술
const heroContainer = { padding: "120px 20px 160px", background: 'linear-gradient(180deg, #4a6cf7 0%, #1a3a9f 100%)', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const heroTitle = { fontSize: 48, fontWeight: 900, color: "#fff", margin: "0 0 10px 0" };
const heroSubTitle = { fontSize: 18, color: "rgba(255,255,255,0.9)", margin: "0 0 50px 0" };
const headerContainer = { height: 72, background: "#fff", display: "flex", alignItems: "center", padding: "0 60px", borderBottom: "1px solid #f0f0f0" };
const logoStyle = { fontSize: 28, fontWeight: 900, color: "#3264ff" };
const tabButtonStyle = (active) => ({ padding: "16px 32px", border: "none", borderRadius: "12px 12px 0 0", cursor: "pointer", fontWeight: 700, background: active ? "#fff" : "rgba(255,255,255,0.2)", color: active ? "#3264ff" : "#fff", marginBottom: '-1px', zIndex: 1 });
const searchCard = { background: "#fff", borderRadius: "0 16px 16px 16px", padding: "35px", boxShadow: "0 20px 40px rgba(0,0,0,0.15)", width: '100%', maxWidth: '1050px', boxSizing: 'border-box' };
const inputGrid = { display: 'flex', border: '1px solid #e0e0e0', borderRadius: 12, backgroundColor: '#fff' };
const inputBox = { flex: 1, padding: "18px 24px", borderRight: '1px solid #eee' };
const label = { fontSize: 12, color: '#999', fontWeight: 600, marginBottom: 8 };
const mainValue = { fontSize: 18, fontWeight: 700 };
const dropdownMenu = { position: 'absolute', top: '100%', left: 0, width: '100%', background: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, maxHeight: 200, overflowY: 'auto', border: '1px solid #eee' };
const dropdownItem = { padding: '12px 20px', borderBottom: '1px solid #f9f9f9' };
const calendarPopup = { position: 'absolute', top: '105%', left: 0, width: 300, background: '#fff', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: 110, padding: 20, border: '1px solid #eee' };
const calendarGrid = { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, textAlign: 'center' };
const countBtn = { width: 24, height: 24, borderRadius: '50%', border: '1px solid #3264ff', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const searchBtn = { background: "#3264ff", color: "#fff", border: "none", padding: "15px 60px", borderRadius: 12, fontWeight: 800, fontSize: 18, cursor: "pointer" };