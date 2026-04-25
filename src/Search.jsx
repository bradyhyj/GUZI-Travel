import React, { useState } from "react";

const Icon = ({ name }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {name==='back' ? <polyline points="15 18 9 12 15 6"/> : <circle cx="12" cy="12" r="10"/>}
  </svg>
);

export default function Search({ onBack, destination, data, onSelect, personCount = 1 }) {
  const [selectedFlight, setSelectedFlight] = useState(null); // 어떤 항공권을 눌렀는지
  const [seats, setSeats] = useState([]); // 어떤 좌석들을 눌렀는지

  // 좌석 데이터 (1~8열, A~F석)
  const rows = [1, 2, 3, 4, 5, 6, 7, 8];
  const cols = ['A', 'B', 'C', 'D', 'E', 'F'];

  // 좌석 선택 화면 (컴포넌트 내부의 서브 뷰)
  if (selectedFlight) {
    const currentSeatAddPrice = seats.reduce((acc, s) => {
      let extra = 0;
      if (s.startsWith('1') || s.startsWith('2')) extra += 200000;
      if (s.endsWith('A') || s.endsWith('F')) extra += 30000;
      return acc + extra;
    }, 0);

    return (
      <div style={{ padding: '40px 20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 20 }}>좌석 선택: {selectedFlight.airline}</h2>
        <div style={{ background: '#f0f0f0', borderRadius: '40px 40px 10px 10px', padding: '40px 20px', border: '2px solid #ddd' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
            {rows.map(r => cols.map(c => {
              const id = `${r}${c}`;
              return (
                <div 
                  key={id} 
                  onClick={() => {
                    if (seats.includes(id)) {
                      setSeats(seats.filter(s => s !== id));
                    } else if (seats.length < personCount) {
                      setSeats([...seats, id]);
                    } else {
                      alert(`최대 ${personCount}개의 좌석만 선택할 수 있습니다.`);
                    }
                  }}
                  style={{
                    height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', borderRadius: '4px', cursor: 'pointer',
                    backgroundColor: seats.includes(id) ? '#3264ff' : '#fff', color: seats.includes(id) ? '#fff' : '#333', border: '1px solid #3264ff'
                  }}
                >
                  {id}
                </div>
              );
            }))}
          </div>
        </div>
        
        <div style={{ marginTop: 20, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', background: '#fff', padding: 20, borderRadius: 12, border: '1px solid #eee' }}>
          <div style={{ fontSize: 13, color: '#666', marginBottom: 8, display: 'flex', gap: 10 }}>
            <span style={{ background: '#f0f4ff', color: '#3264ff', padding: '3px 8px', borderRadius: 4 }}>1~2열: 비즈니스 (+₩200,000)</span>
            <span style={{ background: '#f5f5f5', color: '#555', padding: '3px 8px', borderRadius: 4 }}>A, F열: 창가석 (+₩30,000)</span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>
            좌석 추가 요금: <span style={{ color: '#3264ff' }}>+ ₩{currentSeatAddPrice.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
          <button onClick={() => setSelectedFlight(null)} style={btnSec}>이전</button>
          <button disabled={seats.length !== personCount} onClick={() => onSelect({ ...selectedFlight, seats })} style={btnPri}>
            {seats.length === personCount ? `${seats.join(', ')} 결제하러 가기` : `${personCount}개의 좌석을 골라주세요 (${seats.length}/${personCount})`}
          </button>
        </div>
      </div>
    );
  }

  // 기본 리스트 화면
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f7fa", fontFamily: 'sans-serif' }}>
      <div style={topSummaryBar}>
        <button onClick={onBack} style={backBtn}><Icon name="back"/> 이전</button>
        <div style={{ textAlign: 'center' }}><b>부산 (PUS) ↔ {destination}</b></div>
        <div style={{ width: 80 }} /> 
      </div>
      <main style={{ maxWidth: 1000, margin: "30px auto", padding: "0 20px" }}>
        {data.map(f => (
          <div key={f.id} style={flightCard}>
            <div style={{ width: 100 }}><b>{f.airline}</b></div>
            <div style={{ flex: 1, textAlign: 'center' }}><b>{f.depTime} → {f.arrTime}</b></div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#3264ff' }}>₩{f.price}</div>
              <button onClick={() => setSelectedFlight(f)} style={selectBtn}>선택</button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

const topSummaryBar = { background: "#fff", borderBottom: "1px solid #eee", padding: "15px 40px", display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
const backBtn = { background: 0, border: 0, cursor: 'pointer', fontWeight: 700, color: '#666' };
const flightCard = { background: '#fff', borderRadius: 12, padding: 25, display: 'flex', alignItems: 'center', gap: 40, marginBottom: 15, border: '1px solid #eee' };
const selectBtn = { background: '#3264ff', color: '#fff', border: 0, padding: '10px 25px', borderRadius: 8, fontWeight: 700, marginTop: 10, cursor: 'pointer' };
const btnPri = { flex: 2, padding: '15px', background: '#3264ff', color: '#fff', border: 0, borderRadius: 8, fontWeight: 700, cursor: 'pointer' };
const btnSec = { flex: 1, padding: '15px', background: '#fff', border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer' };