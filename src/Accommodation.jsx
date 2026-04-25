import React, { useState } from "react";

export default function Accommodation({ onBack, destination, data, onSelect }) {
  const [selectedHotel, setSelectedHotel] = useState(null); // 어떤 호텔을 눌렀는지

  const rooms = [
    { id: 1, name: "스탠다드 더블", addPrice: 0, bed: '더블 침대 1개', capacity: 2, features: ['도심 전망', '무료 Wi-Fi', '샤워실'], cancelPolicy: '환불 불가', breakfast: false, left: 3 },
    { id: 2, name: "디럭스 오션뷰", addPrice: 150000, bed: '킹 침대 1개', capacity: 2, features: ['오션뷰', '욕조', '무료 Wi-Fi', '넷플릭스'], cancelPolicy: '무료 취소 (D-1)', breakfast: true, left: 1 },
    { id: 3, name: "프리미어 스위트", addPrice: 600000, bed: '킹 침대 1개 + 싱글 침대 1개', capacity: 3, features: ['파노라마 뷰', '거실 분리', '월풀 욕조', '미니바 무료'], cancelPolicy: '무료 취소', breakfast: true, left: 2 }
  ];

  // 객실 선택 화면
  if (selectedHotel) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f5f7fa", fontFamily: 'sans-serif', paddingBottom: 100 }}>
        <div style={topSummaryBar}>
          <button onClick={() => setSelectedHotel(null)} style={backBtn}>이전으로</button>
          <b>객실 선택</b>
          <div style={{ width: 80 }} />
        </div>
        
        <main style={{ maxWidth: 1000, margin: "30px auto", padding: '0 20px' }}>
          {/* 호텔 요약 헤더 (아고다 스타일) */}
          <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #eee', marginBottom: 40, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <div style={{ height: 260, backgroundColor: selectedHotel.imgColor, position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: 20, left: 30, color: '#fff' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  {selectedHotel.tags?.map(t => <span key={t} style={{ background: 'rgba(0,0,0,0.5)', padding: '5px 12px', borderRadius: 6, fontSize: 13, fontWeight: 700, backdropFilter: 'blur(4px)' }}>#{t}</span>)}
                </div>
                <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{selectedHotel.name}</h1>
              </div>
            </div>
            <div style={{ padding: '25px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#666', marginBottom: 8, fontSize: 15 }}>📍 {selectedHotel.location}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: '#f59e0b', fontSize: 20 }}>{'★'.repeat(selectedHotel.stars || 0)}</span>
                  <span style={{ background: '#3264ff', color: '#fff', padding: '4px 10px', borderRadius: 6, fontWeight: 800, fontSize: 15 }}>{selectedHotel.rating}</span>
                  <span style={{ color: '#555', fontWeight: 700, fontSize: 15 }}>최고! · {selectedHotel.reviews}건의 이용후기</span>
                </div>
              </div>
            </div>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>객실 현황 및 예약</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {rooms.map(r => {
              const basePrice = parseInt(selectedHotel.price.replace(/,/g, '') || 0);
              const totalPrice = basePrice + r.addPrice;
              
              return (
                <div key={r.id} style={{ display: 'flex', background: '#fff', borderRadius: 16, border: r.id === 2 ? '2px solid #3264ff' : '1px solid #ddd', overflow: 'hidden', boxShadow: r.id === 2 ? '0 10px 30px rgba(50,100,255,0.1)' : 'none', position: 'relative' }}>
                  {r.id === 2 && <div style={{ position: 'absolute', top: 0, left: 0, background: '#3264ff', color: '#fff', padding: '5px 15px', fontSize: 12, fontWeight: 800, borderBottomRightRadius: 10 }}>인기 객실</div>}
                  
                  {/* 객실 이미지 영역 */}
                  <div style={{ width: 280, background: `linear-gradient(45deg, #f0f0f0, ${selectedHotel.imgColor}22)`, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '25px 20px', borderRight: '1px solid #eee' }}>
                    <div style={{ fontSize: 22, fontWeight: 900 }}>{r.name}</div>
                    <div style={{ color: '#555', fontSize: 14, marginTop: 10, lineHeight: 1.5 }}>
                      <div>🛏️ {r.bed}</div>
                      <div>👥 최대 {r.capacity}인 탑승가능</div>
                      <div style={{ color: '#dc2626', fontWeight: 800, marginTop: 10 }}>🔥 남은 객실 {r.left}개!</div>
                    </div>
                  </div>
                  
                  {/* 객실 상세 정보 */}
                  <div style={{ flex: 1, padding: 30, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                        {r.features.map(f => (
                          <span key={f} style={{ color: '#555', background: '#f8f9fa', padding: '6px 12px', border: '1px solid #eee', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>✓ {f}</span>
                        ))}
                      </div>
                      
                      <div style={{ display: 'flex', gap: 20, fontSize: 14 }}>
                        <div style={{ color: r.breakfast ? '#059669' : '#999', fontWeight: r.breakfast ? 800 : 400 }}>
                          ☕ {r.breakfast ? '아침 식사 포함' : '조식 불포함'}
                        </div>
                        <div style={{ color: r.cancelPolicy.includes('무료') ? '#059669' : '#dc2626', fontWeight: 800 }}>
                          {r.cancelPolicy.includes('무료') ? '✓' : '✕'} {r.cancelPolicy}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 30, borderTop: '1px dashed #ddd', paddingTop: 20 }}>
                      <div>
                        {r.addPrice > 0 && <div style={{ fontSize: 13, color: '#ff3d00', fontWeight: 800, marginBottom: 5 }}>기본 요금 + ₩{r.addPrice.toLocaleString()} 추가</div>}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                          <span style={{ fontSize: 26, fontWeight: 900, color: '#111' }}>₩{totalPrice.toLocaleString()}</span>
                          <span style={{ fontSize: 14, color: '#888', fontWeight: 500 }}>/ 1박</span>
                        </div>
                        <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>세금 및 기타 요금 포함</div>
                      </div>
                      <button 
                        onClick={() => onSelect({ ...selectedHotel, roomName: r.name, addPrice: r.addPrice })} 
                        style={{ background: '#3264ff', color: '#fff', border: 0, padding: '16px 35px', borderRadius: 10, fontSize: 18, fontWeight: 800, cursor: 'pointer', transition: '0.2s', boxShadow: '0 5px 15px rgba(50,100,255,0.3)' }}
                      >
                        지금 예약하기
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // 기본 리스트 화면 (필터 생략 버전)
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f7fa", fontFamily: 'sans-serif' }}>
      <div style={topSummaryBar}>
        <button onClick={onBack} style={backBtn}>이전</button>
        <b>{destination} 숙소</b>
        <div style={{ width: 80 }} />
      </div>
      <main style={{ maxWidth: 900, margin: "30px auto", padding: '0 20px' }}>
        {data.map(h => (
          <div key={h.id} style={hotelCard}>
            <div style={{ width: 200, backgroundColor: h.imgColor }} />
            <div style={{ flex: 1, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 18 }}>
                    {h.name} <span style={{ color: '#f59e0b', fontSize: 14 }}>{'★'.repeat(h.stars || 0)}</span>
                  </h2>
                  <p style={{ fontSize: 13, color: '#888', margin: '5px 0' }}>{h.location} | 평점 {h.rating} ({h.reviews}개의 리뷰)</p>
                  <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                    {h.tags?.map(t => (
                      <span key={t} style={{ fontSize: 11, padding: '3px 8px', background: '#f0f4ff', color: '#3264ff', borderRadius: 4 }}>#{t}</span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#3264ff' }}>₩{h.price}</div>
                  <button onClick={() => setSelectedHotel(h)} style={selectBtn}>객실 선택</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

const topSummaryBar = { background: "#fff", borderBottom: "1px solid #eee", padding: "15px 40px", display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
const backBtn = { background: 0, border: 0, cursor: 'pointer', fontWeight: 700, color: '#666' };
const hotelCard = { display: 'flex', background: '#fff', borderRadius: 16, overflow: 'hidden', marginBottom: 20, border: '1px solid #eee' };
const selectBtn = { background: "#3264ff", color: "#fff", border: 0, padding: "10px 20px", borderRadius: 8, fontWeight: 700, cursor: "pointer" };