import React, { useState } from 'react';

const Icons = {
    attraction: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
    restaurant: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path></svg>,
    accommodation: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16"></path><path d="M2 8h18a2 2 0 0 1 2 2v10"></path><path d="M2 17h20"></path><path d="M6 8v9"></path></svg>,
    sparkles: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>,
    money: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>,
    location: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>,
    calendar: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    AI: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" ry="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" /></svg>,
    arrowRight: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>,
    back: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
};

export default function Plan({ onBack, initialBudget, city, tripDates, reservations = [], onFinishTrip }) {
    const [destination, setDestination] = useState(city || "파리");

    const sDate = tripDates?.startDate ? new Date(tripDates.startDate) : new Date(2026, 4, 10);
    const eDate = tripDates?.endDate ? new Date(tripDates.endDate) : new Date(sDate.getTime() + 2 * 24 * 60 * 60 * 1000);
    const startObj = new Date(sDate.getFullYear(), sDate.getMonth(), sDate.getDate());
    const endObj = new Date(eDate.getFullYear(), eDate.getMonth(), eDate.getDate());
    const diffTime = Math.abs(endObj - startObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
    const days = diffDays || 3;

    let initialMoney = 100000;
    if (initialBudget) {
        if (initialBudget.includes("만")) {
            initialMoney = parseInt(initialBudget.replace(/[^0-9]/g, '')) * 10000;
        } else if (parseInt(initialBudget.replace(/[^0-9]/g, ''))) {
            initialMoney = parseInt(initialBudget.replace(/[^0-9]/g, ''));
        }
    }

    const spentSoFar = reservations.reduce((sum, res) => sum + res.price, 0);
    const availableBudgetForPlan = initialMoney - spentSoFar; 

    // 예약금을 제외한 실제 사용 가능한 금액을 기본값으로 시작
    const [budget, setBudget] = useState(availableBudgetForPlan);

    const [isGenerating, setIsGenerating] = useState(false);
    const [itinerary, setItinerary] = useState(null);
    const [activeDay, setActiveDay] = useState(1);

    const THEME_COLOR = "#1e6efa";

    // Mock data generator
    const generateMockItinerary = () => {
        setIsGenerating(true);
        setItinerary(null);
        setActiveDay(1);

        setTimeout(() => {
            const mockDays = [];
            let totalCost = 0;
            const dailyBudget = budget / days; // 하루 예산

            const placesVariations = [
                // Type 1: 기본 시내 관광
                [
                    { time: "10:00", place: `${destination} 명소 거리 산책`, type: "attraction", desc: "도심 전체를 4K 화면으로 감상하며 여유롭게 아침을 엽니다." },
                    { time: "13:00", place: "골목길 현지 로컬 식당", type: "restaurant", desc: "구글 맵 평점 4.5 이상의 현지 맛집을 랜선으로 배달음식과 즐겨요." },
                    { time: "15:30", place: `${destination} 시립 미술관`, type: "attraction", desc: "예술과 역사를 느낄 수 있는 조용한 오후 오디오 가이드 투어." },
                    { time: "19:00", place: "안락한 숙소에서 야경 감상", type: "accommodation", desc: "야경 뷰포인트가 완벽한 방구석에서 휴식 및 일정 정리." }
                ],
                // Type 2: 랜드마크 핫플
                [
                    { time: "10:30", place: `${destination} 최고 타워 전망대`, type: "attraction", desc: "도시의 스카이라인을 한눈에 내려다볼 수 있는 랜선 전망대 투어." },
                    { time: "13:30", place: "현지인 추천 유명 카페 & 브런치", type: "restaurant", desc: "인스타그래머블한 디저트와 함께하는 달콤한 휴식." },
                    { time: "16:00", place: "최대 규모 쇼핑몰 아이쇼핑", type: "attraction", desc: "현지 브랜드와 신기한 아이템들을 구경하는 스트리트 뷰." },
                    { time: "19:30", place: "숙소 근처 호프집 (배달 야식)", type: "restaurant", desc: "하루의 피로를 날려버릴 시원한 맥주 한 잔의 여유." }
                ],
                // Type 3: 로컬 & 힐링
                [
                    { time: "09:30", place: "현지 활기찬 전통 시장 탐방", type: "attraction", desc: "시크릿한 골목길에서 펼쳐지는 시장 분위기 넘겨보기." },
                    { time: "12:30", place: "길거리 인기 음식 투어", type: "restaurant", desc: "다양한 길거리 간식으로 배를 채우는 소소한 재미." },
                    { time: "15:00", place: `${destination} 근교 대형 공원 산책`, type: "attraction", desc: "푸른 잔디밭에서 돗자리를 펴고 누워있는 듯한 랜선 힐링." },
                    { time: "18:00", place: "숙소 반신욕 및 룸서비스", type: "accommodation", desc: "호캉스의 꽃, 욕조 반신욕으로 지친 몸을 녹이는 완벽한 저녁." }
                ],
                // Type 4: 액티비티 / 이색 체험
                [
                    { time: "10:00", place: `${destination} 유명 테마파크 정복`, type: "attraction", desc: "짜릿한 롤러코스터 1인칭 POV 영상으로 대리 만족!" },
                    { time: "14:00", place: "테마파크 내 캐릭터 레스토랑", type: "restaurant", desc: "과몰입을 돕는 귀여운 캐릭터 테마의 가상 식사 시간." },
                    { time: "17:30", place: "야간 퍼레이드 및 불꽃놀이", type: "attraction", desc: "화려한 불꽃놀이 명당에서 직관하는 하이라이트 영상." },
                    { time: "20:00", place: "기념품 언박싱 (온라인 쇼핑)", type: "accommodation", desc: "현지 직구로 배송시킨 기념품을 뜯어보는 짜릿함." }
                ]
            ];

            for (let i = 1; i <= days; i++) {
                const variationIndex = (i - 1) % placesVariations.length;
                const v = placesVariations[variationIndex];

                const dailyEvents = [
                    { time: v[0].time, place: v[0].place, type: v[0].type, desc: v[0].desc, cost: Math.round((dailyBudget * 0.15) / 100) * 100 },
                    { time: v[1].time, place: v[1].place, type: v[1].type, desc: v[1].desc, cost: Math.round((dailyBudget * 0.25) / 100) * 100 },
                    { time: v[2].time, place: v[2].place, type: v[2].type, desc: v[2].desc, cost: Math.round((dailyBudget * 0.20) / 100) * 100 },
                    { time: v[3].time, place: v[3].place, type: v[3].type, desc: v[3].desc, cost: Math.round((dailyBudget * 0.35) / 100) * 100 }
                ];

                mockDays.push(dailyEvents);
                dailyEvents.forEach(e => { totalCost += e.cost; });
            }

            setItinerary({
                days: mockDays,
                totalCost: totalCost,
                placesSummary: `모니터 앞 주요 명소 및 현지 배달 식당 등 ${days * 3}곳 탐방`,
                aiReview: `"${destination} 거리의 예술적 향기와 활기를 방 안에서 100% 느낄 수 있었던 최고의 랜선 힐링!"`
            });
            setIsGenerating(false);
        }, 1800); // 1.8초 딜레이 (로딩 연출 효과)
    };

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f0f4f8', fontFamily: 'sans-serif' }}>

            {/* 1. Left Layout: Destination Setting or Map */}
            <div style={{ flex: 1, backgroundColor: '#e5e7eb', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                
                {/* 동적 구글 맵 배경 */}
                <iframe 
                    title="map"
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    style={{ border: 0, position: 'absolute', top: 0, left: 0, zIndex: 0 }}
                    src={`https://maps.google.com/maps?q=${destination}&t=&z=12&ie=UTF8&iwloc=&output=embed`} 
                    allowFullScreen
                ></iframe>

                {/* 폼이 떠 있을 때는 배경을 살짝 어둡게 처리 */}
                {(!itinerary || isGenerating) && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1, backdropFilter: 'blur(3px)' }} />
                )}

                <div style={{ position: 'absolute', top: 30, left: 40, zIndex: 20, display: 'flex', gap: 12 }}>
                    {onBack && (
                        <button onClick={onBack} style={{ background: '#fff', border: '1px solid #eee', color: '#111', padding: '12px 24px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontWeight: 800, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                            {Icons.back} 메인으로
                        </button>
                    )}
                    {itinerary && !isGenerating && (
                        <button 
                            onClick={() => { setItinerary(null); setIsGenerating(false); }} 
                            style={{ background: THEME_COLOR, border: 'none', color: '#fff', padding: '12px 24px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontWeight: 800, boxShadow: '0 4px 15px rgba(30, 110, 250, 0.3)' }}
                        >
                            조건 다시 설정
                        </button>
                    )}
                </div>

                {(!itinerary || isGenerating) && (
                    <div style={{ background: 'rgba(255,255,255,0.95)', padding: '40px 35px', borderRadius: 24, zIndex: 10, width: '100%', maxWidth: 420, boxShadow: '0 20px 50px rgba(0,0,0,0.2)', backdropFilter: 'blur(15px)' }}>
                    <h2 style={{ fontSize: 22, fontWeight: 900, marginTop: 0, marginBottom: 30, color: '#111', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: THEME_COLOR }}>{Icons.sparkles}</span> 여행 일정 Planner
                    </h2>

                    <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#555', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                            {Icons.location} 도착할 가상 여행지
                        </div>
                        <input
                            style={{ width: '100%', padding: '15px 20px', borderRadius: 12, border: '1px solid #ddd', boxSizing: 'border-box', fontSize: 16, fontWeight: 700 }}
                            value={destination}
                            onChange={e => setDestination(e.target.value)}
                            placeholder="예: 파리, 런던, 삿포로"
                        />
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#555', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                            {Icons.calendar} 여행 확정 기간
                        </div>
                        <div style={{ width: '100%', padding: '15px 20px', borderRadius: 12, border: '1px solid #ddd', boxSizing: 'border-box', fontSize: 16, fontWeight: 700, color: '#111', background: '#f8fafc' }}>
                            {`${sDate.getMonth() + 1}.${sDate.getDate()}`} — {`${eDate.getMonth() + 1}.${eDate.getDate()}`} ({days}일간)
                        </div>
                    </div>

                    <div style={{ marginBottom: 35 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#555', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                            {Icons.money} 플래너용 남은 예비비 원 (항공/숙소 제외)
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="number"
                                style={{ width: '100%', padding: '15px 20px', borderRadius: 12, border: '1px solid #3264ff', boxSizing: 'border-box', fontSize: 18, fontWeight: 900, color: '#3264ff', background: '#f0f4ff', paddingRight: 40 }}
                                value={budget}
                                onChange={e => setBudget(Number(e.target.value))}
                            />
                            <div style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: '#3264ff' }}>원</div>
                        </div>
                    </div>

                    <button
                        onClick={generateMockItinerary}
                        disabled={isGenerating}
                        style={{ width: '100%', padding: '18px', background: THEME_COLOR, color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 900, cursor: isGenerating ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, transition: 'all 0.3s', opacity: isGenerating ? 0.7 : 1 }}
                    >
                        {isGenerating ? (
                            <span style={{ animation: 'pulse 1.5s infinite' }}>AI가 완벽한 일정을 짜는 중...</span>
                        ) : (
                            <><span style={{ animation: 'pulse 2s infinite' }}>{Icons.sparkles}</span> Gemini로 일정 짜기</>
                        )}
                    </button>
                    </div>
                )}
            </div>

            {/* 2. Right Layout: Schedule Area */}
            <div style={{ width: 550, height: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                {itinerary && !isGenerating ? (
                    <>
                        {/* Days Tab */}
                        <div style={{ display: 'flex', padding: '25px 30px 15px', background: '#fff', borderBottom: '1px solid #eee', overflowX: 'auto', WebkitOverflowScrolling: 'touch', minHeight: 60, alignItems: 'center' }}>
                            {itinerary.days.map((_, i) => {
                                const d = new Date(startObj);
                                d.setDate(d.getDate() + i);
                                const dateStr = `${d.getMonth() + 1}.${d.getDate()} (Day ${i + 1})`;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setActiveDay(i + 1)}
                                        style={{ padding: '8px 20px', margin: '0 5px', border: 'none', background: activeDay === i + 1 ? THEME_COLOR : 'transparent', color: activeDay === i + 1 ? '#fff' : '#666', borderRadius: 20, fontWeight: 800, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap', transition: '0.2s', alignSelf: 'center' }}
                                    >
                                        {dateStr}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Time List */}
                        <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
                            <div style={{ fontWeight: 900, fontSize: 22, margin: '10px 0 35px 0', color: '#111', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ color: THEME_COLOR }}>Day {activeDay}</span> 주요 스케줄
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 25, position: 'relative' }}>
                                <div style={{ position: 'absolute', top: 15, bottom: 15, left: 24, width: 2, background: '#e2e8f0', zIndex: 0 }} />

                                {itinerary.days[activeDay - 1].map((event, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: 20, position: 'relative', zIndex: 1 }}>
                                        <div style={{ width: 50, fontSize: 14, fontWeight: 800, color: '#888', paddingTop: 8, textAlign: 'right' }}>
                                            {event.time}
                                        </div>
                                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fff', border: `2px solid ${THEME_COLOR}`, display: 'flex', justifyContent: 'center', alignItems: 'center', color: THEME_COLOR, boxShadow: '0 4px 10px rgba(0,0,0,0.05)', flexShrink: 0 }}>
                                            {Icons[event.type]}
                                        </div>
                                        <div style={{ flex: 1, background: '#fff', padding: '22px', borderRadius: 16, boxShadow: '0 6px 15px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
                                                <div style={{ fontWeight: 800, fontSize: 17, color: '#111' }}>{event.place}</div>
                                                <div style={{ fontWeight: 800, fontSize: 14, color: THEME_COLOR }}>{event.cost > 0 ? `₩${event.cost.toLocaleString()}` : '비용 무료'}</div>
                                            </div>
                                            <div style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>
                                                {event.desc}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 항상 보이는 하단 액션 버튼 고정 영역 */}
                        <div style={{ padding: '0 30px 20px', background: '#f8fafc', flexShrink: 0 }}>
                            {activeDay < days ? (
                                <button
                                    onClick={() => setActiveDay(activeDay + 1)}
                                    style={{ width: '100%', padding: '16px', background: '#fff', border: '1px solid #ddd', borderRadius: 12, fontWeight: 700, color: '#555', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}
                                >
                                    다음 날 일정 보기 {Icons.arrowRight}
                                </button>
                            ) : (
                                <button
                                    onClick={() => onFinishTrip && onFinishTrip(itinerary)}
                                    style={{ marginTop: 40, width: '100%', padding: '16px', background: THEME_COLOR, border: 'none', borderRadius: 12, fontWeight: 900, color: '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, boxShadow: '0 10px 20px rgba(30,110,250,0.3)', transition: '0.2s', transform: 'scale(1.02)' }}
                                >
                                    가상 여행 종료 및 리뷰 남기기 {Icons.sparkles}
                                </button>
                            )}
                        </div>

                        {/* Bottom Summary */}
                        <div style={{ background: '#fff', borderTop: '1px solid #eee', padding: 30, boxShadow: '0 -10px 20px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 20, background: '#f0f4ff', color: THEME_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {Icons.AI}
                                </div>
                                <div style={{ fontWeight: 900, fontSize: 18, color: '#111' }}>AI 여행 결산 리포트</div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 20 }}>
                                <div style={{ background: '#f8fafc', padding: '18px 15px', borderRadius: 12 }}>
                                    <div style={{ fontSize: 12, color: '#888', fontWeight: 700, marginBottom: 6 }}>총 예상 지출</div>
                                    <div style={{ fontSize: 20, fontWeight: 900, color: THEME_COLOR }}>₩{itinerary.totalCost.toLocaleString()}</div>
                                </div>
                                <div style={{ background: '#f8fafc', padding: '18px 15px', borderRadius: 12 }}>
                                    <div style={{ fontSize: 12, color: '#888', fontWeight: 700, marginBottom: 6 }}>잔여 예비비</div>
                                    <div style={{ fontSize: 20, fontWeight: 900, color: (budget - itinerary.totalCost) >= 0 ? '#10b981' : '#ef4444' }}>
                                        ₩{(budget - itinerary.totalCost).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            
                            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: 12, marginBottom: 20 }}>
                                <div style={{ fontSize: 12, color: '#888', fontWeight: 700, marginBottom: 6 }}>방문 예정 요약</div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: '#333' }}>{itinerary.placesSummary}</div>
                            </div>

                            <div style={{ background: '#f0f4ff', padding: '20px', borderRadius: 12, border: `1px dashed ${THEME_COLOR}`, color: THEME_COLOR, fontSize: 14, fontWeight: 700, fontStyle: 'italic', lineHeight: 1.6 }}>
                                {itinerary.aiReview}
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', padding: 40, textAlign: 'center' }}>
                        {isGenerating ? (
                            <>
                                <div style={{ color: THEME_COLOR, animation: 'pulse 1.5s infinite', marginBottom: 20 }}>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>
                                </div>
                                <div style={{ fontSize: 18, fontWeight: 800, color: '#111', marginBottom: 10 }}>AI가 최적의 랜선 일정을 계산 중입니다...</div>
                                <div style={{ fontSize: 14, color: '#666' }}>여행지 데이터 및 예상 비용을 시뮬레이션 하고 있습니다.</div>
                            </>
                        ) : (
                            <>
                                <div style={{ width: 80, height: 80, borderRadius: 40, background: '#e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20, color: '#fff' }}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                                </div>
                                <div style={{ fontSize: 18, fontWeight: 800, color: '#333', marginBottom: 10 }}>아직 생성된 일정이 없습니다.</div>
                                <div style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>좌측 메뉴에서 목적지, 기간, 예산을 설정하고<br />AI 플래너에게 비대면 여행 일정을 맡겨보세요!</div>
                            </>
                        )}
                    </div>
                )}
            </div>

            <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
        </div>
    );
}
