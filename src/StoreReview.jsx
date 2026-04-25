import React, { useState } from 'react';

// 가상 장소 더미 데이터 생성 유틸
const generateFakeInfo = (place) => {
    // 장소 이름에 어울리는 랜덤 이미지
    let imgKeyword = 'building';
    if (place.includes('식당') || place.includes('푸드')) imgKeyword = 'restaurant';
    else if (place.includes('공원') || place.includes('명소')) imgKeyword = 'park';
    else if (place.includes('테마파크')) imgKeyword = 'amusement-park';
    else if (place.includes('숙소') || place.includes('호텔')) imgKeyword = 'hotel';

    return {
        address: `${place}로 123-45`,
        phone: `0507-${Math.floor(Math.random() * 8999 + 1000)}-${Math.floor(Math.random() * 8999 + 1000)}`,
        rating: (3.5 + Math.random() * 1.5).toFixed(1),
        reviewCount: Math.floor(Math.random() * 1000) + 15,
        img: `https://source.unsplash.com/800x600/?${imgKeyword}`,
        // 구글 지도 가짜 이미지
        mapImg: `https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800`
    }
};

// 상단 헤더 액션 버튼 콤포넌트
const ActionButton = ({ icon, label, onClick, primary }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 20,
            border: primary ? '1px solid #1a73e8' : '1px solid #dadce0',
            background: primary ? '#f4f8ff' : '#fff',
            color: primary ? '#1a73e8' : '#3c4043',
            fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: '0.2s', whiteSpace: 'nowrap'
        }}
    >
        {icon} {label}
    </button>
);

export default function StoreReview({ itinerary, onBack }) {
    const allPlaces = itinerary ? itinerary.days.flat().map(e => e.place) : ["센텀벤처타운 빌딩", "부산정보산업진흥원", "유명 테마파크 정복", "현지 전통 시장", "골목길 로컬 식당"];
    const uniquePlaces = [...new Set(allPlaces)];

    const [reviews, setReviews] = useState({});
    const [activePlace, setActivePlace] = useState(null);
    const [placeInfo, setPlaceInfo] = useState(null);
    const [isWriting, setIsWriting] = useState(false);

    const [tempRating, setTempRating] = useState(0);
    const [tempText, setTempText] = useState("");

    const openPlaceDetail = (place) => {
        setActivePlace(place);
        setPlaceInfo(generateFakeInfo(place));
        setIsWriting(false);
        setTempRating(reviews[place]?.rating || 0);
        setTempText(reviews[place]?.text || "");
    };

    const submitReview = () => {
        if (tempRating === 0) return alert("별점을 선택해주세요!");
        setReviews(prev => ({
            ...prev,
            [activePlace]: { rating: tempRating, text: tempText, date: new Date().toLocaleDateString() }
        }));
        setIsWriting(false); // 닫기
    };

    return (
        <div style={{ height: '100vh', background: '#fff', display: 'flex', fontFamily: "'Roboto', 'Noto Sans KR', sans-serif", overflow: 'hidden' }}>

            {/* 좌측 사이드바 구조 */}
            <div style={{ width: 400, background: '#fff', borderRight: '1px solid #ebebeb', display: 'flex', flexDirection: 'column', zIndex: 10, boxShadow: '2px 0 10px rgba(0,0,0,0.02)' }}>
                <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid #ebebeb', background: '#fff' }}>
                    <button onClick={onBack} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#1a73e8', display: 'flex', alignItems: 'center', gap: 5, padding: 0, marginBottom: 20 }}>
                        ← 리뷰 뒤로가기
                    </button>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: '#202124', margin: 0 }}>방문 장소 리뷰 내역</h1>
                    <p style={{ color: '#70757a', fontSize: 13, marginTop: 8, lineHeight: 1.4 }}>가상 여행지에서 방문한 {uniquePlaces.length}곳. 장소를 클릭해 정보를 확인하고 다른 사람들을 위해 리뷰를 기여해 보세요.</p>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {uniquePlaces.map((place, idx) => (
                        <div key={idx} onClick={() => openPlaceDetail(place)} style={{ padding: '16px 24px', borderBottom: '1px solid #f1f3f4', cursor: 'pointer', background: activePlace === place ? '#f8f9fa' : '#fff' }}>
                            <div style={{ fontSize: 15, fontWeight: 500, color: '#202124', marginBottom: 4 }}>{place}</div>
                            {reviews[place] ? (
                                <div>
                                    <div style={{ color: '#fbbc04', fontSize: 14, letterSpacing: 1, marginBottom: 4 }}>
                                        {'★'.repeat(reviews[place].rating)}{'☆'.repeat(5 - reviews[place].rating)}
                                    </div>
                                    <div style={{ fontSize: 13, color: '#5f6368', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>"{reviews[place].text}"</div>
                                </div>
                            ) : (
                                <div style={{ fontSize: 13, color: '#1a73e8', fontWeight: 500 }}>여기를 클릭해 리뷰 참여하기</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 우측 장소 디테일 패널 (구글 로컬 가이드 뷰) */}
            <div style={{ flex: 1, overflowY: 'auto', background: '#fff', position: 'relative' }}>
                {activePlace && placeInfo ? (
                    <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px', animation: 'fadeIn 0.3s ease' }}>

                        {/* 상단 이미지 영억 */}
                        <div style={{ display: 'flex', height: 260, borderRadius: 12, overflow: 'hidden', marginBottom: 25, border: '1px solid #ebebeb' }}>
                            <div style={{ flex: 1, backgroundImage: `url(${placeInfo.img})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', borderRight: '1px solid #fff' }}>
                                <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 10px', fontSize: 12, borderRadius: 4, cursor: 'pointer' }}>사진 더보기</div>
                            </div>
                            <div style={{ flex: 1.2, backgroundImage: `url(${placeInfo.mapImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        </div>

                        {/* 장소 타이틀 영억 */}
                        <h1 style={{ fontSize: 32, fontWeight: 500, margin: '0 0 10px 0', color: '#202124' }}>{activePlace}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: '#70757a', marginBottom: 10 }}>
                            <span style={{ color: '#3c4043', fontWeight: 500, marginRight: 5 }}>{placeInfo.rating}</span>
                            <span style={{ color: '#fbbc04', marginRight: 5, letterSpacing: 1 }}>★★★★☆</span>
                            <span style={{ color: '#1a73e8', cursor: 'pointer' }}>Google 가상 리뷰 {placeInfo.reviewCount}개</span>
                        </div>
                        <div style={{ fontSize: 14, color: '#70757a', marginBottom: 25 }}>부산광역시 등 가상 여행 목적지의 비즈니스 센터</div>

                        {/* 액션 버튼 그룹 */}
                        <div style={{ display: 'flex', gap: 8, marginBottom: 25, overflowX: 'auto', paddingBottom: 5 }}>
                            <ActionButton icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>} label="웹사이트" />
                            <ActionButton icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>} label="경로" />
                            <ActionButton primary={!reviews[activePlace]} onClick={() => setIsWriting(true)} icon={<svg width="18" height="18" fill="currentColor" stroke="none" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>} label="리뷰 남기기" />
                            <ActionButton icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>} label="저장" />
                            <ActionButton icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>} label="공유" />
                            <ActionButton icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>} label="전화 걸기" />
                        </div>

                        {/* 기본 상세 정보 */}
                        <div style={{ borderTop: '1px solid #ebebeb', borderBottom: '1px solid #ebebeb', padding: '24px 0', fontSize: 14, color: '#3c4043', lineHeight: 2.2 }}>
                            <div style={{ display: 'flex', gap: 15 }}><div style={{ width: 20 }}>📍</div> <div><strong style={{ color: '#202124' }}>주소:</strong> {placeInfo.address} 특별시 목적지구 가상동 41</div></div>
                            <div style={{ display: 'flex', gap: 15 }}><div style={{ width: 20 }}>📞</div> <div><strong style={{ color: '#202124' }}>전화번호:</strong> {placeInfo.phone}</div></div>
                            <div style={{ display: 'flex', gap: 15 }}><div style={{ width: 20 }}>🕒</div> <div><strong style={{ color: '#202124' }}>영업시간:</strong> 영업 중 · 월 오전 9:00에 영업 시작 <span style={{ color: '#1a73e8', cursor: 'pointer' }}>▼</span></div></div>
                        </div>

                        {/* 수정 제안 푸터 */}
                        <div style={{ padding: '16px 0', fontSize: 13, color: '#1a73e8', cursor: 'pointer', display: 'flex', gap: 10 }}>
                            <span>수정 제안하기</span> · <span>이 비즈니스의 소유주인가요?</span>
                        </div>

                        {/* 내 리뷰 (작성 완료 상태) */}
                        {!isWriting && reviews[activePlace] && (
                            <div style={{ marginTop: 20, padding: 25, background: '#f8f9fa', borderRadius: 12, border: '1px solid #dadce0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#333', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>ME</div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#202124', fontSize: 15 }}>내 리뷰</div>
                                            <div style={{ color: '#70757a', fontSize: 13 }}>Google 지역 가이드 · 리뷰 142개</div>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsWriting(true)} style={{ background: 'none', border: 'none', color: '#1a73e8', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>수정</button>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                    <div style={{ color: '#fbbc04', fontSize: 16, letterSpacing: 1 }}>{'★'.repeat(reviews[activePlace].rating)}{'☆'.repeat(5 - reviews[activePlace].rating)}</div>
                                    <div style={{ color: '#70757a', fontSize: 13 }}>{reviews[activePlace].date}</div>
                                </div>
                                <div style={{ color: '#202124', fontSize: 14, lineHeight: 1.6 }}>
                                    {reviews[activePlace].text}
                                </div>
                            </div>
                        )}

                        {/* 리뷰 작성 에디터 */}
                        {isWriting && (
                            <div style={{ marginTop: 30, padding: 30, borderRadius: 16, border: '1px solid #1a73e8', background: '#fff', boxShadow: '0 4px 15px rgba(26,115,232,0.1)' }}>
                                <h3 style={{ margin: '0 0 20px 0', fontSize: 18, fontWeight: 500, color: '#202124', display: 'flex', gap: 10, alignItems: 'center' }}>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#333', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: 12 }}>ME</div>
                                    {activePlace} 평가하기
                                </h3>

                                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <div
                                            key={star}
                                            onClick={() => setTempRating(star)}
                                            style={{ color: tempRating >= star ? '#fbbc04' : '#dadce0', fontSize: 36, cursor: 'pointer', transition: '0.15s' }}
                                        >★</div>
                                    ))}
                                </div>

                                <textarea
                                    value={tempText}
                                    onChange={e => setTempText(e.target.value)}
                                    placeholder="이 장소에 대한 경험을 자세히 공유해 주세요..."
                                    style={{ width: '100%', height: 120, padding: 16, borderRadius: 8, border: '1px solid #dadce0', boxSizing: 'border-box', fontSize: 14, fontFamily: 'inherit', resize: 'vertical', outline: 'none', marginBottom: 20 }}
                                />

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                                    <button onClick={() => setIsWriting(false)} style={{ padding: '10px 24px', borderRadius: 20, background: '#fff', border: '1px solid #dadce0', fontWeight: 500, color: '#1a73e8', cursor: 'pointer' }}>취소</button>
                                    <button onClick={submitReview} style={{ padding: '10px 24px', borderRadius: 20, background: '#1a73e8', border: 'none', fontWeight: 500, color: '#fff', cursor: 'pointer' }}>게시</button>
                                </div>
                            </div>
                        )}

                    </div>
                ) : (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#70757a' }}>
                        <svg width="60" height="60" fill="none" stroke="#dadce0" strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom: 20 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        <div style={{ fontSize: 18, fontWeight: 500, color: '#3c4043', marginBottom: 8 }}>장소를 선택하세요</div>
                        <div style={{ fontSize: 14 }}>장소를 선택하면 구글 로컬 가이드 상세 정보가 나타납니다.</div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </div>
    );
}
