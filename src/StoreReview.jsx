import React, { useState } from 'react';

// 가상 장소 더미 데이터 생성 유틸
const generateFakeInfo = (placeObj) => {
    const placeName = placeObj.place || placeObj;
    
    return {
        address: `${placeName} 인근`,
        desc: placeObj.desc || `${placeName}의 인기 방문지`,
        phone: `+00-1-${Math.floor(Math.random() * 899 + 100)}-${Math.floor(Math.random() * 8999 + 1000)}`,
        rating: (3.8 + Math.random() * 1.1).toFixed(1),
        reviewCount: Math.floor(Math.random() * 1000) + 50,
        img: `https://picsum.photos/seed/${encodeURIComponent(placeName)}/800/600`
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
    const allPlacesData = itinerary ? itinerary.days.flat() : [
        { place: "센텀벤처타운 빌딩", desc: "부산의 벤처 기업들이 모여있는 오피스 타운" }, 
        { place: "유명 테마파크 정복", desc: "다양한 놀이기구와 즐길거리가 가득한 테마파크" }
    ];
    
    // 중복 제거
    const uniquePlacesData = [];
    const seen = new Set();
    allPlacesData.forEach(p => {
        if (!seen.has(p.place)) {
            seen.add(p.place);
            uniquePlacesData.push(p);
        }
    });

    const [reviews, setReviews] = useState({});
    const [activePlace, setActivePlace] = useState(null);
    const [placeInfo, setPlaceInfo] = useState(null);
    const [realImg, setRealImg] = useState("");
    const [isWriting, setIsWriting] = useState(false);

    const [tempRating, setTempRating] = useState(0);
    const [tempText, setTempText] = useState("");

    // 위키백과 API를 이용해 실제 장소 사진 가져오기 시도
    React.useEffect(() => {
        if (!activePlace) return;
        setRealImg(""); // 초기화
        
        fetch(`https://ko.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(activePlace)}&prop=pageimages&format=json&pithumbsize=800&origin=*`)
            .then(res => res.json())
            .then(data => {
                const pages = data.query?.pages;
                if (pages) {
                    const page = Object.values(pages)[0];
                    if (page && page.thumbnail && page.thumbnail.source) {
                        setRealImg(page.thumbnail.source);
                        return null; // 한국어 위키에서 찾음
                    }
                }
                // 없으면 영어 위키백과 시도
                return fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(activePlace)}&prop=pageimages&format=json&pithumbsize=800&origin=*`);
            })
            .then(res => res ? res.json() : null)
            .then(data => {
                if (!data) return;
                const pages = data.query?.pages;
                if (pages) {
                    const page = Object.values(pages)[0];
                    if (page && page.thumbnail && page.thumbnail.source) {
                        setRealImg(page.thumbnail.source);
                    }
                }
            })
            .catch(e => console.log("이미지 로드 실패:", e));
    }, [activePlace]);

    const openPlaceDetail = (placeObj) => {
        setActivePlace(placeObj.place);
        setPlaceInfo(generateFakeInfo(placeObj));
        setIsWriting(false);
        setTempRating(reviews[placeObj.place]?.rating || 0);
        setTempText(reviews[placeObj.place]?.text || "");
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
                    <p style={{ color: '#70757a', fontSize: 13, marginTop: 8, lineHeight: 1.4 }}>가상 여행지에서 방문한 {uniquePlacesData.length}곳. 장소를 클릭해 정보를 확인하고 다른 사람들을 위해 리뷰를 기여해 보세요.</p>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {uniquePlacesData.map((placeObj, idx) => (
                        <div key={idx} onClick={() => openPlaceDetail(placeObj)} style={{ padding: '16px 24px', borderBottom: '1px solid #f1f3f4', cursor: 'pointer', background: activePlace === placeObj.place ? '#f8f9fa' : '#fff' }}>
                            <div style={{ fontSize: 15, fontWeight: 500, color: '#202124', marginBottom: 4 }}>{placeObj.place}</div>
                            {reviews[placeObj.place] ? (
                                <div>
                                    <div style={{ color: '#fbbc04', fontSize: 14, letterSpacing: 1, marginBottom: 4 }}>
                                        {'★'.repeat(reviews[placeObj.place].rating)}{'☆'.repeat(5 - reviews[placeObj.place].rating)}
                                    </div>
                                    <div style={{ fontSize: 13, color: '#5f6368', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>"{reviews[placeObj.place].text}"</div>
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

                        {/* 상단 이미지 영역 */}
                        <div style={{ display: 'flex', height: 260, borderRadius: 12, overflow: 'hidden', marginBottom: 25, border: '1px solid #ebebeb' }}>
                            <div style={{ flex: 1, backgroundImage: `url(${realImg || placeInfo.img})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', borderRight: '1px solid #ebebeb' }}>
                                <div onClick={() => window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(activePlace)}`, '_blank')} style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 10px', fontSize: 12, borderRadius: 4, cursor: 'pointer' }}>사진 더보기</div>
                            </div>
                            <div style={{ flex: 1.2, position: 'relative' }}>
                                <iframe 
                                    width="100%" 
                                    height="100%" 
                                    frameBorder="0"
                                    style={{ border: 0, display: 'block' }} 
                                    loading="lazy" 
                                    allowFullScreen 
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(activePlace)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                                ></iframe>
                            </div>
                        </div>

                        {/* 장소 타이틀 영억 */}
                        <h1 style={{ fontSize: 32, fontWeight: 500, margin: '0 0 10px 0', color: '#202124' }}>{activePlace}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: '#70757a', marginBottom: 10 }}>
                            <span style={{ color: '#3c4043', fontWeight: 500, marginRight: 5 }}>{placeInfo.rating}</span>
                            <span style={{ color: '#fbbc04', marginRight: 5, letterSpacing: 1 }}>★★★★☆</span>
                            <span style={{ color: '#1a73e8', cursor: 'pointer' }}>Google 가상 리뷰 {placeInfo.reviewCount}개</span>
                        </div>
                        <div style={{ fontSize: 14, color: '#70757a', marginBottom: 25 }}>{placeInfo.desc}</div>

                        {/* 액션 버튼 그룹 */}
                        <div style={{ display: 'flex', gap: 8, marginBottom: 25, overflowX: 'auto', paddingBottom: 5 }}>
                            <ActionButton onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(activePlace)}`, '_blank')} icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>} label="구글 검색" />
                            <ActionButton onClick={() => window.open(`https://maps.google.com/maps?q=${encodeURIComponent(activePlace)}`, '_blank')} icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>} label="경로" />
                            <ActionButton primary={!reviews[activePlace]} onClick={() => setIsWriting(true)} icon={<svg width="18" height="18" fill="currentColor" stroke="none" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>} label="리뷰 남기기" />
                            <ActionButton onClick={() => window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(activePlace)}`, '_blank')} icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>} label="사진 보기" />
                            <ActionButton onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(activePlace)}`, '_blank')} icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>} label="영상 보기" />
                        </div>

                        {/* 기본 상세 정보 */}
                        <div style={{ borderTop: '1px solid #ebebeb', borderBottom: '1px solid #ebebeb', padding: '24px 0', fontSize: 14, color: '#3c4043', lineHeight: 2.2 }}>
                            <div style={{ display: 'flex', gap: 15 }}><div style={{ width: 20 }}>📍</div> <div><strong style={{ color: '#202124' }}>주소:</strong> {placeInfo.address}</div></div>
                            <div style={{ display: 'flex', gap: 15 }}><div style={{ width: 20 }}>📞</div> <div><strong style={{ color: '#202124' }}>전화번호:</strong> {placeInfo.phone}</div></div>
                            <div style={{ display: 'flex', gap: 15 }}><div style={{ width: 20 }}>🕒</div> <div><strong style={{ color: '#202124' }}>영업시간:</strong> 영업 중 · 오전 9:00 시작 <span style={{ color: '#1a73e8', cursor: 'pointer' }}>▼</span></div></div>
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
