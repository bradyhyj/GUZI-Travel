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
        if (typeof initialBudget === 'number') {
            initialMoney = initialBudget;
        } else if (typeof initialBudget === 'string') {
            if (initialBudget.includes("만")) {
                initialMoney = parseInt(initialBudget.replace(/[^0-9]/g, '')) * 10000;
            } else if (parseInt(initialBudget.replace(/[^0-9]/g, ''))) {
                initialMoney = parseInt(initialBudget.replace(/[^0-9]/g, ''));
            }
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

    // Gemini API 호출을 통한 일정 생성
    const generateItineraryWithGemini = async () => {
        setIsGenerating(true);
        setItinerary(null);
        setActiveDay(1);

        const apiKey = process.env.REACT_APP_GCP_API_KEY;
        const model = "gemini-3.1-flash-lite-preview";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const prompt = `당신은 현지 여행 전문가이자 예능 작가 뺨치는 유쾌한 '도파민 여행 플래너'입니다. 사용자가 '${destination}'(으)로 ${days}일간 실제 여행을 떠납니다. 
예산은 총 ${budget}원입니다. 
다음 JSON 형식으로 ${days}일치 일정을 짜주세요. 매일 4개의 일정을 포함해야 합니다.

**중요 사항 (절대 준수):**
1. '방구석', '유튜브' 같은 가상 컨셉은 빼고 사용자가 실제로 그 도시에 방문하는 설정입니다. 
2. 단, 평범하고 지루한 관광 코스는 거부합니다! 일정 중 1~2개는 사람들의 '도파민이 폭발'할 수 있는 극강의 미친 텐션의 이색 기행이나 황당한 익스트림 미션(예: 템스강 다이빙, 에펠탑 앞에서 봉산탈춤 추기, 타임스퀘어 한복판에서 돗자리 깔고 낮잠자기 등)을 반드시 섞어서 일정표를 아주 웃기고 자극적으로 만들어주세요.
3. 예산이 총 ${budget}원 뿐이므로, 지정된 예산을 절대 초과하지 않도록 철저히 계산하세요. 돈이 모자라거나 0원이라면 "무료 야외 수영(템스강 입수)" 같은 비용이 0원인 기상천외한 방법으로 몸으로 때우는 일정을 넣으세요.
4. 매일매일 다른 컨셉의 일정을 짜주되, 설명(desc)에 요즘 유행하는 밈이나 예능 자막 같은 찰진 드립을 팍팍 넣어주세요.
5. 방문하는 장소나 미션이 다른 날과 겹치지 않게 아주 다양하게 구성해주세요.
응답은 반드시 JSON 형식이어야 합니다. Markdown 백틱(\`\`\`)이나 다른 텍스트 없이 JSON만 반환하세요.

형식:
{
    "days": [
        [
            { "time": "09:30", "place": "장소 이름", "type": "attraction", "desc": "설명 (30자 내외)", "cost": 10000 },
            { "time": "12:45", "place": "식당 이름", "type": "restaurant", "desc": "설명", "cost": 20000 },
            { "time": "15:20", "place": "장소 이름", "type": "attraction", "desc": "설명", "cost": 15000 },
            { "time": "19:10", "place": "숙소/야경", "type": "accommodation", "desc": "설명", "cost": 0 }
        ]
        // ... (총 ${days}일치 배열)
    ],
    "totalCost": 총 예상 비용 (숫자, 예산 ${budget}원 이하),
    "placesSummary": "방문할 주요 가상 명소 요약 (예: 모니터 앞 주요 명소 및 현지 배달 식당 등 12곳 탐방)",
    "aiReview": "일정에 대한 유쾌한 한 줄 평 (따옴표 포함)"
}`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        responseMimeType: "application/json",
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.error?.message || "알 수 없는 오류가 발생했습니다.";
                throw new Error(errorMessage);
            }

            const data = await response.json();
            const textResponse = data.candidates[0].content.parts[0].text;
            const parsedItinerary = JSON.parse(textResponse);

            setItinerary(parsedItinerary);
        } catch (error) {
            console.error("Error generating itinerary:", error);
            alert(`일정 생성에 실패했습니다: ${error.message}\n\n(API 키 설정이나 권한, 결제 상태를 확인해주세요.)`);
        } finally {
            setIsGenerating(false);
        }
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
                            <div style={{ width: '100%', padding: '15px 20px', borderRadius: 12, border: '1px solid #ddd', boxSizing: 'border-box', fontSize: 16, fontWeight: 700, color: '#111', background: '#f8fafc' }}>
                                {destination}
                            </div>
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
                                {Icons.money} 플래너용 남은 예산 (항공/숙소 제외)
                            </div>
                            <div style={{ width: '100%', padding: '15px 20px', borderRadius: 12, border: '1px solid #3264ff', boxSizing: 'border-box', fontSize: 18, fontWeight: 900, color: '#3264ff', background: '#f0f4ff', display: 'flex', justifyContent: 'space-between' }}>
                                <span>{Number(budget).toLocaleString()}</span>
                                <span>원</span>
                            </div>
                        </div>

                        <button
                            onClick={generateItineraryWithGemini}
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
                                <div style={{ fontWeight: 900, fontSize: 18, color: '#111' }}>Day {activeDay} 결산 리포트</div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 20 }}>
                                <div style={{ background: '#f8fafc', padding: '18px 15px', borderRadius: 12 }}>
                                    <div style={{ fontSize: 12, color: '#888', fontWeight: 700, marginBottom: 6 }}>Day {activeDay} 누적 지출</div>
                                    <div style={{ fontSize: 20, fontWeight: 900, color: THEME_COLOR }}>
                                        ₩{itinerary.days.slice(0, activeDay).flat().reduce((sum, item) => sum + (item.cost || 0), 0).toLocaleString()}
                                    </div>
                                </div>
                                <div style={{ background: '#f8fafc', padding: '18px 15px', borderRadius: 12 }}>
                                    <div style={{ fontSize: 12, color: '#888', fontWeight: 700, marginBottom: 6 }}>잔여 예산</div>
                                    <div style={{ fontSize: 20, fontWeight: 900, color: (budget - itinerary.days.slice(0, activeDay).flat().reduce((sum, item) => sum + (item.cost || 0), 0)) >= 0 ? '#10b981' : '#ef4444' }}>
                                        ₩{(budget - itinerary.days.slice(0, activeDay).flat().reduce((sum, item) => sum + (item.cost || 0), 0)).toLocaleString()}
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
