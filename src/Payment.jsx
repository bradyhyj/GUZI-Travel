import React, { useState } from "react";

export default function Payment({ type, item, onBack, city, budget, reservations = [], onPaymentComplete }) {
  const isFlight = type === 'flight';

  // 1. 입력 필드 상태 관리
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [passportName, setPassportName] = useState(""); // 항공권 전용
  const [paymentMethod, setPaymentMethod] = useState("card"); // 결제 수단

  // 결제 수단 목록
  const paymentMethods = [
    { id: "card", label: "신용/체크카드" },
    { id: "naver", label: "네이버페이" },
    { id: "kakao", label: "카카오페이" },
    { id: "toss", label: "토스페이" }
  ];

  // 전화번호 포맷 로직
  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length <= 3) {
      setUserPhone(val);
    } else if (val.length <= 7) {
      setUserPhone(`${val.slice(0, 3)}-${val.slice(3)}`);
    } else {
      let clamped = val.slice(0, 11);
      setUserPhone(`${clamped.slice(0, 3)}-${clamped.slice(3, 7)}-${clamped.slice(7)}`);
    }
  };

  // 계산 로직
  const basePrice = parseInt(item?.price?.replace(/,/g, '') || 0);
  const flightCount = item?.seats?.length || 1;
  const hotelAddPrice = item?.addPrice || 0;
  
  const seatAddPrice = isFlight ? (item?.seats?.reduce((acc, seat) => {
    let extra = 0;
    if (seat.startsWith('1') || seat.startsWith('2')) extra += 200000;
    if (seat.endsWith('A') || seat.endsWith('F')) extra += 30000;
    return acc + extra;
  }, 0) || 0) : 0;

  const totalAmount = isFlight 
    ? (basePrice * flightCount + seatAddPrice) 
    : (basePrice + hotelAddPrice);

  let totalBudgetNum = 100000;
  if (budget) {
      const bStr = String(budget);
      if (bStr.includes("만")) {
          totalBudgetNum = parseInt(bStr.replace(/[^0-9]/g, '')) * 10000;
      } else if (parseInt(bStr.replace(/[^0-9]/g, ''))) {
          totalBudgetNum = parseInt(bStr.replace(/[^0-9]/g, ''));
      }
  }

  const spentSoFar = reservations.reduce((sum, res) => sum + res.price, 0);
  const isOverBudget = totalAmount > (totalBudgetNum - spentSoFar);

  // 2. 유효성 검사 로직
  const isValidPhone = /^\d{2,3}-\d{3,4}-\d{4}$/.test(userPhone);

  const isFormValid = isFlight 
    ? (userName.trim() !== "" && isValidPhone && passportName.trim() !== "" && paymentMethod !== "" && !isOverBudget)
    : (userName.trim() !== "" && isValidPhone && paymentMethod !== "" && !isOverBudget);

  const handlePayment = () => {
    if (!isFormValid || isOverBudget) return;
    alert(`${item.name || item.airline} 결제가 완료되었습니다! (결제금액: ₩${totalAmount.toLocaleString()})`);
    
    // 예약 내역에 추가할 데이터
    const bookingInfo = {
      id: Date.now(),
      type,
      city,
      title: isFlight ? `${item.airline} (부산 ↔ ${city})` : item.name,
      subtitle: isFlight 
        ? `${item.depTime} 출발 | 좌석: ${item.seats ? item.seats.join(', ') : '선택안함'}` 
        : `${item.location} | 객실: ${item.roomName || '스탠다드'}`,
      price: totalAmount,
      date: new Date().toLocaleDateString(),
      userName,
      color: item.logo || item.imgColor
    };
    onPaymentComplete(bookingInfo);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fb", fontFamily: 'sans-serif' }}>
      <div style={topBar}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 20 }}>
          <button onClick={onBack} style={backBtn}>뒤로가기</button>
          <b style={{ fontSize: 18 }}>예약 및 결제</b>
        </div>
      </div>

      <main style={{ maxWidth: 1000, margin: "30px auto", display: 'grid', gridTemplateColumns: '1fr 350px', gap: 30, padding: '0 20px' }}>
        <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          <div style={cardStyle}>
            <h3>{isFlight ? "선택한 항공권" : "선택한 숙소"}</h3>
            <div style={{ display: 'flex', gap: 20 }}>
              <div style={{ width: 80, height: 60, backgroundColor: item.logo || item.imgColor, borderRadius: 8 }} />
              <div>
                <b style={{ fontSize: 17 }}>{isFlight ? `${item.airline} (부산 ↔ ${city})` : item.name}</b>
                <div style={{ fontSize: 14, color: '#666', marginTop: 5 }}>
                  {isFlight 
                    ? `${item.depTime} 출발 | 좌석: ${item.seats ? item.seats.join(', ') : '선택안함'}` 
                    : `${item.location} | 객실: ${item.roomName || '스탠다드'}`}
                </div>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <h3>예약자 정보</h3>
            {/* 3. value와 onChange 연결 */}
            <div style={{marginBottom: 15}}>
              <label style={labelStyle}>이름</label>
              <input 
                style={inputStyle} 
                placeholder="실명을 입력하세요" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div style={{marginBottom: 15}}>
              <label style={labelStyle}>연락처</label>
              <input 
                style={inputStyle} 
                placeholder="010-0000-0000" 
                value={userPhone}
                onChange={handlePhoneChange}
                maxLength={13}
              />
            </div>
            
            {isFlight && (
              <div>
                <label style={labelStyle}>영문 성명 (여권 동일)</label>
                <input 
                  style={inputStyle} 
                  placeholder="GILDONG HONG" 
                  value={passportName}
                  onChange={(e) => setPassportName(e.target.value)}
                />
              </div>
            )}
          </div>

          <div style={cardStyle}>
            <h3>결제 수단</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {paymentMethods.map((pm) => (
                <div 
                  key={pm.id} 
                  onClick={() => setPaymentMethod(pm.id)}
                  style={{
                    padding: '15px', border: paymentMethod === pm.id ? '2px solid #3264ff' : '1px solid #ddd',
                    borderRadius: '8px', cursor: 'pointer', textAlign: 'center', fontWeight: paymentMethod === pm.id ? 700 : 400,
                    backgroundColor: paymentMethod === pm.id ? '#f0f4ff' : '#fff'
                  }}
                >
                  {pm.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside>
          <div style={cardStyle}>
            <h3>결제 요약</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15, marginBottom: 10 }}>
              <div style={summaryRow}>
                <span style={{ color: '#666' }}>상품 기본 금액</span>
                <span>₩{basePrice.toLocaleString()}</span>
              </div>
              
              {isFlight ? (
                <>
                  <div style={summaryRow}>
                    <span style={{ color: '#666' }}>인원 수</span>
                    <span>x {flightCount}명</span>
                  </div>
                  {seatAddPrice > 0 && (
                    <div style={summaryRow}>
                      <span style={{ color: '#666' }}>좌석 구분 추가 요금</span>
                      <span>+ ₩{seatAddPrice.toLocaleString()}</span>
                    </div>
                  )}
                </>
              ) : (
                <div style={summaryRow}>
                  <span style={{ color: '#666' }}>객실 옵션 ({item.roomName || '스탠다드'})</span>
                  <span>+ ₩{hotelAddPrice.toLocaleString()}</span>
                </div>
              )}
            </div>
            
            <div style={{ fontSize: 22, fontWeight: 800, borderTop: '2px solid #333', paddingTop: 20, marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>현재 상품 금액</span>
              <span style={{ color: '#ff3d00' }}>₩{totalAmount.toLocaleString()}</span>
            </div>

            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #ddd' }}>
              <div style={summaryRow}>
                <span style={{ color: '#666' }}>설정한 예산</span>
                <span>₩{totalBudgetNum.toLocaleString()}</span>
              </div>
              <div style={{...summaryRow, marginTop: 10}}>
                <span style={{ color: '#666' }}>이전 예약 금액</span>
                <span>- ₩{spentSoFar.toLocaleString()}</span>
              </div>
              <div style={{...summaryRow, marginTop: 15, fontSize: 18, fontWeight: 800}}>
                <span>결제 후 남은 잔액</span>
                <span style={{ color: isOverBudget ? '#ff3d00' : '#10b981' }}>
                  ₩{(totalBudgetNum - spentSoFar - totalAmount).toLocaleString()}
                </span>
              </div>
              
              {isOverBudget && (
                <div style={{ marginTop: 20, fontSize: 13, color: '#ff3d00', fontWeight: 700, background: '#fff0ec', padding: '12px 15px', borderRadius: 8, textAlign: 'center', lineHeight: 1.5 }}>
                  앗! 잔액을 초과하여 결제할 수 없습니다. <br/>랜딩 페이지에서 예산을 높이거나 더 싼 상품을 고르세요.
                </div>
              )}
            </div>

            {/* 4. 조건에 따른 버튼 활성화/비활성화 */}
            <button 
              onClick={handlePayment} 
              disabled={!isFormValid} // 유효하지 않으면 버튼 비활성화
              style={{
                ...payBtnStyle,
                backgroundColor: isFormValid ? '#3264ff' : '#ccc', // 비활성화 시 회색
                cursor: isFormValid ? 'pointer' : 'not-allowed'
              }}
            >
              결제하기
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}

const cardStyle = { background: '#fff', padding: 30, borderRadius: 16, border: '1px solid #eee' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #ddd', boxSizing: 'border-box' };
const labelStyle = { fontSize: 13, color: '#666', fontWeight: 700, marginBottom: 8, display: 'block' };
const payBtnStyle = { width: '100%', padding: 18, color: '#fff', border: 0, borderRadius: 12, fontSize: 18, fontWeight: 800, marginTop: 20, transition: '0.3s' };
const topBar = { background: '#fff', padding: '15px 40px', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 10 };
const backBtn = { background: 0, border: 0, cursor: 'pointer', fontWeight: 700, color: '#666' };
const summaryRow = { display: 'flex', justifyContent: 'space-between', fontSize: 15 };