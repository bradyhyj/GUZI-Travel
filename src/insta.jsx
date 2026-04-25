import React, { useState, useEffect, useRef } from 'react';

const Icons = {
  heart: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
  heartFilled: <svg width="24" height="24" viewBox="0 0 24 24" fill="#ed4956" stroke="#ed4956" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
  comment: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>,
  share: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
  save: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>,
  bookmark: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path><line x1="12" y1="9" x2="12" y2="15"></line><line x1="9" y1="12" x2="15" y2="12"></line></svg>,
  home: <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997h0a2.997 2.997 0 0 1 2.997 2.997v4.45h5.008a2 2 0 0 0 2-2V9.582a2.001 2.001 0 0 0-.671-1.493l-8-7.11a2.002 2.002 0 0 0-2.664 0l-8 7.11a2.001 2.001 0 0 0-.671 1.493V18a2 2 0 0 0 2 2h5.008v-3.455z"></path></svg>,
  search: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  plusIcon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="5" ry="5"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>,
  reels: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="4" ry="4"></rect><line x1="9" y1="3" x2="9" y2="21"></line><path d="M14 9l5 3-5 3v-6z"></path></svg>,
  dots: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>,
  close: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  music: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>,
  photo: <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
};

const DefaultBasicAvatar = () => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="#cfcfcf">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
);

export default function Insta({ city, itinerary, onBack }) {
    const fileInputRef = useRef(null);
    const [step, setStep] = useState('feed'); // 'feed', 'createPost', 'createStory'
    
    // 업로드할 대상을 모달에 띄우기 위한 상태
    const [tempUploadUrl, setTempUploadUrl] = useState(null);
    
    // 최종 피드 이미지와 스토리 이미지
    const [postImgUrl, setPostImgUrl] = useState('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800'); 
    const [storyImgUrl, setStoryImgUrl] = useState(null);
    const [hasMyStory, setHasMyStory] = useState(false);

    const [content, setContent] = useState('');

    const [likes, setLikes] = useState(128); // 기본
    const [myLike, setMyLike] = useState(false);
    const [dms, setDms] = useState([]);
    
    const [viewingStory, setViewingStory] = useState(null); 
    const [showLikesModal, setShowLikesModal] = useState(false);
    const [showStoryLikesModal, setShowStoryLikesModal] = useState(false);

    const username = "virtual.traveler";

    const removeDm = (id) => setDms(current => current.filter(d => d.id !== id));

    const handleFileChange = (e) => {
        if(e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            setTempUploadUrl(url);
        }
    };

    const confirmUpload = () => {
        if (!tempUploadUrl) return;
        
        if (step === 'createPost') {
            setPostImgUrl(tempUploadUrl);
            startPostSimulation(); // 피드를 올리면 좋아요, DM 폭발 작동
        } else if (step === 'createStory') {
            setStoryImgUrl(tempUploadUrl);
            setHasMyStory(true);
            setViewingStory({ id: 'me', name: '내 스토리', seen: false, isMe: true, img: tempUploadUrl });
        }
        
        setTempUploadUrl(null);
        setStep('feed');
    };

    const cancelUpload = () => {
        setTempUploadUrl(null);
        setStep('feed');
    };

    const startPostSimulation = () => {
        let currentLikes = 128;
        const likeInterval = setInterval(() => {
            currentLikes += Math.floor(Math.random() * 80) + 15;
            if(currentLikes > 18500) clearInterval(likeInterval);
            else setLikes(currentLikes);
        }, 120);

        const mockDms = [
            { id: 1, user: 'wander_lust11', msg: `미친 여행 갔네 존부 ㅠㅠ 사진 대박이다` },
            { id: 2, user: 'ex_lover_12', msg: "잘 지내나보네... 재밌어?" },
            { id: 3, user: 'travelholic_kr', msg: "안녕하세요! '여행에미치다' 채널입니다." },
            { id: 4, user: '엄마❤️❤️', msg: "밥은 잘 챙겨먹고 다니는거지? 늦게 돌아다니지 말고!" },
        ];
        mockDms.forEach((dm, idx) => {
            setTimeout(() => {
                setDms(prev => [...prev, dm]);
                setTimeout(() => setDms(current => current.filter(d => d.id !== dm.id)), 7000);
            }, 3000 + (idx * 5500) + Math.random() * 2000);
        });
    };

    const stories = [
        { id: 1, name: 'sunset_chaser', seen: false, closeFriend: false, img: 'https://images.unsplash.com/photo-1541410965313-d53b3c16ef17?auto=format&fit=crop&q=80&w=800' },
        { id: 2, name: 'cafe.hopper', seen: false, closeFriend: false, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800' },
        { id: 3, name: 'photo_by_j', seen: true, closeFriend: false, img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800' }
    ];

    const mockLikeUsers = [
        { name: '김시영', isLike: true }, 
        { name: 'daily_vibe_', isLike: true }, 
        { name: 'jimin_09', isLike: true },
        { name: '이수아', isLike: false }, 
        { name: '박태환', isLike: false }, 
        { name: '최윤진', isLike: false }
    ];

    const handleMyStoryClick = () => {
        if (hasMyStory) {
            setViewingStory({ id: 'me', name: '내 스토리', seen: false, isMe: true, img: storyImgUrl });
        } else {
            setStep('createStory');
        }
    };

    return (
        <div style={{ height: '100vh', width: '100vw', background: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "'-apple-system', BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", overflow: 'hidden' }}>
            
            {/* 휴대폰 UI 밖의 이전 컨테이너 버튼 */}
            <div style={{ position: 'fixed', top: 30, left: 30, zIndex: 10000 }}>
                <button onClick={onBack} style={{ background: '#111', color: '#fff', padding: '12px 24px', borderRadius: 30, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 15, display: 'flex', gap: 8, alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', transition: '0.2s', letterSpacing: '-0.3px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    리뷰 메뉴로 나가기
                </button>
            </div>

            {/* 가짜 DM 노티피케이션 (스마트폰 컨테이너 기준 정렬을 위해 div 구조 유지) */}
            {step === 'feed' && (
                <div style={{ position: 'fixed', top: 30, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {dms.map(dm => (
                        <div key={dm.id} style={{ background: 'rgba(25,25,25,0.95)', padding: '12px 18px', borderRadius: 20, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: 12, animation: 'slideDownDM 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', width: 340 }}>
                            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#444', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexShrink: 0 }}><DefaultBasicAvatar /></div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: 13, color: '#fff' }}>{dm.user}</div>
                                <div style={{ fontSize: 12, color: '#ccc', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dm.msg}</div>
                            </div>
                            <div onClick={() => removeDm(dm.id)} style={{ padding: 5, cursor: 'pointer', color: '#888' }}>{Icons.close}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* 스마트폰 프레임 뷰 컨테이너 */}
            <div style={{ height: '90vh', maxHeight: 880, minHeight: 600, aspectRatio: '9/19', background: '#fff', position: 'relative', overflow: 'hidden', borderRadius: 40, border: '12px solid #111', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', flexShrink: 0 }}>
                
                {/* 상단 헤더 */}
                <div style={{ height: 60, display: 'flex', alignItems: 'center', padding: '0 16px', position: 'absolute', top: 0, width: '100%', background: '#fff', zIndex: 100, boxSizing: 'border-box' }}>
                    {step === 'feed' ? (
                        <>
                            <div style={{ cursor: 'pointer', color: '#000', marginRight: 20 }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            </div>
                            <div style={{ fontFamily: "'Billabong', cursive, sans-serif", fontSize: 28, fontWeight: 600, fontStyle: 'italic', color: '#000', display: 'flex', alignItems: 'center', gap: 5 }}>
                                Instagram <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 4 }}><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                            <div style={{ marginLeft: 'auto', display: 'flex', gap: 20, color: '#000', alignItems: 'center' }}>
                                {Icons.bookmark}
                                <div style={{ position: 'relative' }}>
                                    {Icons.heart}
                                    {likes > 500 && (
                                        <div style={{ position: 'absolute', top: -3, right: -4, background: '#ed4956', color: '#fff', borderRadius: '50%', width: 14, height: 14, fontSize: 10, fontWeight: 800, border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>4</div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                            <div onClick={cancelUpload} style={{ cursor: 'pointer' }}>{Icons.close}</div>
                            <div style={{ fontWeight: 600, fontSize: 16 }}>{step === 'createPost' ? '새 게시물 만들기' : '스토리에 추가'}</div>
                            <div style={{ width: 28 }}></div> {/* spacing */}
                        </div>
                    )}
                </div>

                {/* --- 게시물/스토리 업로드 화면 --- */}
                {(step === 'createPost' || step === 'createStory') && (
                    <div style={{ paddingTop: 60, height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.3s', boxSizing: 'border-box' }}>
                        {!tempUploadUrl ? (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                                <div style={{ fontSize: 20, fontWeight: 600, color: '#262626', marginBottom: 20 }}>사진을 업로드하세요</div>
                                <button onClick={() => fileInputRef.current?.click()} style={{ background: '#0095f6', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 15 }}>
                                    갤러리에서 선택
                                </button>
                                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                            </div>
                        ) : (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                                <div style={{ width: '100%', aspectRatio: '1/1', backgroundImage: `url(${tempUploadUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', borderBottom: '1px solid #dbdbdb' }} />
                                <div style={{ padding: 16 }}>
                                    {step === 'createPost' && (
                                        <textarea 
                                            value={content}
                                            onChange={e => setContent(e.target.value)}
                                            placeholder="문구를 입력하세요..."
                                            style={{ width: '100%', height: 100, border: 'none', resize: 'none', outline: 'none', fontSize: 15, lineHeight: 1.5, fontFamily: 'inherit' }}
                                        />
                                    )}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
                                        <button onClick={confirmUpload} style={{ background: '#0095f6', color: '#fff', border: 'none', padding: 14, borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
                                            {step === 'createPost' ? '피드에 공유하기' : '스토리에 추가하기'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- 모바일 피드 화면 --- */}
                {step === 'feed' && (
                    <div style={{ paddingTop: 60, overflowY: 'auto', height: '100%', paddingBottom: 60, boxSizing: 'border-box' }}>
                        {/* 스토리 영역 */}
                        <div style={{ padding: '10px 0', borderBottom: '1px solid #dbdbdb', overflowX: 'auto', display: 'flex', gap: 15, paddingLeft: 16, '&::-webkit-scrollbar': { display: 'none' } }}>
                            {/* 내 스토리 고정 렌더단 */}
                            <div onClick={handleMyStoryClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', flexShrink: 0, position: 'relative' }}>
                                <div style={{ width: 68, height: 68, borderRadius: '50%', padding: 2, background: hasMyStory ? 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)' : 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <div style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid #fff', background: '#333', color: '#fff', fontSize: 12, fontWeight: 800, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>ME</div>
                                </div>
                                {!hasMyStory && (
                                    <div style={{ position: 'absolute', bottom: 18, right: 0, background: '#0095f6', color: '#fff', borderRadius: '50%', width: 22, height: 22, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 18, border: '2px solid #fff', fontWeight: 'bold' }}>+</div>
                                )}
                                <div style={{ fontSize: 11, color: '#262626', letterSpacing: -0.3 }}>내 스토리</div>
                            </div>

                            {/* 타인 스토리 */}
                            {stories.map(s => (
                                <div key={s.id} onClick={() => setViewingStory(s)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', flexShrink: 0 }}>
                                    <div style={{ width: 68, height: 68, borderRadius: '50%', padding: 2, background: s.seen ? '#e5e5e5' : s.closeFriend ? '#58c322' : 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <div style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid #fff', background: '#fafafa', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}><DefaultBasicAvatar /></div>
                                    </div>
                                    <div style={{ fontSize: 11, color: s.seen ? '#8e8e8e' : '#262626', letterSpacing: -0.3 }}>{s.name}</div>
                                </div>
                            ))}
                        </div>

                        {/* 피드 렌더링 */}
                        <div style={{ paddingBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', padding: '10px 14px' }}>
                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)', padding: 2, marginRight: 10 }}>
                                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '1px solid #fff', background: '#333', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontSize: 9, fontWeight: 800 }}>ME</div>
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <div style={{ fontSize: 14, display: 'flex', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 600, color: '#262626' }}>{username}</span>
                                        <div style={{ width: 12, height: 12, background: '#0095f6', borderRadius: '50%', marginLeft: 4, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', color: '#fff' }}><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                                    </div>
                                    <div style={{ fontSize: 11, color: '#262626', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                                        {Icons.music} {username} · 오리지널 오디오
                                    </div>
                                </div>
                                <div style={{ color: '#262626', cursor: 'pointer' }}>{Icons.dots}</div>
                            </div>

                            <div style={{ width: '100%', aspectRatio: '4/5', background: '#000', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${postImgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px 6px' }}>
                                <div style={{ display: 'flex', gap: 16 }}>
                                    <div onClick={() => setMyLike(!myLike)} style={{ cursor: 'pointer', transition: '0.1s', transform: myLike ? 'scale(1.1)' : 'scale(1)' }}>{myLike ? Icons.heartFilled : Icons.heart}</div>
                                    <div style={{ cursor: 'pointer', color: '#262626' }}>{Icons.comment}</div>
                                    <div style={{ cursor: 'pointer', color: '#262626' }}>{Icons.share}</div>
                                </div>
                                <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0095f6' }}></div>
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#dbdbdb' }}></div>
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#dbdbdb' }}></div>
                                </div>
                                <div style={{ marginLeft: 'auto', cursor: 'pointer', color: '#262626' }}>{Icons.bookmark}</div>
                            </div>

                            <div style={{ padding: '0 14px' }}>
                                <div onClick={() => setShowLikesModal(true)} style={{ fontWeight: 600, fontSize: 13, color: '#262626', marginBottom: 6, cursor: 'pointer' }}>
                                    좋아요 {likes.toLocaleString()}개
                                </div>
                                <div style={{ fontSize: 13, lineHeight: 1.5, color: '#262626' }}>
                                    <span style={{ fontWeight: 600, marginRight: 8 }}>{username}</span>
                                    {content && content.split('\n').map((line, i) => (
                                        <React.Fragment key={i}>
                                            {line.split(' ').map((word, j) => (
                                                <span key={j} style={{ color: word.startsWith('#') ? '#00376b' : 'inherit' }}>{word} </span>
                                            ))}
                                            <br/>
                                        </React.Fragment>
                                    ))}
                                </div>
                                <div style={{ color: '#8e8e8e', fontSize: 13, marginTop: 6 }}>댓글 421개 모두 보기</div>
                                <div style={{ color: '#8e8e8e', fontSize: 11, marginTop: 4 }}>1시간 전</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 하단 글로벌 네비게이션 */}
                <div style={{ height: 50, borderTop: '1px solid #dbdbdb', display: 'flex', alignItems: 'center', justifyContent: 'space-around', position: 'absolute', bottom: 0, width: '100%', background: '#fff', zIndex: 100 }}>
                    <div onClick={() => setStep('feed')} style={{ cursor: 'pointer', color: step === 'feed' ? '#000' : '#8e8e8e' }}>{Icons.home}</div>
                    <div style={{ cursor: 'pointer', color: '#262626' }}>{Icons.search}</div>
                    {/* 피드 추가 버튼 */}
                    <div onClick={() => setStep('createPost')} style={{ cursor: 'pointer', color: '#262626' }}>{Icons.plusIcon}</div>
                    <div style={{ cursor: 'pointer', color: '#262626' }}>{Icons.reels}</div>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#333', color: '#fff', fontSize: 8, fontWeight: 800, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>ME</div>
                </div>

                {/* 스토리 뷰어 모달 */}
                {viewingStory && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#111', zIndex: 100000, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ flex: 1, position: 'relative', backgroundImage: `url(${viewingStory.img})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', borderRadius: 8, margin: '10px 0' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)' }} />
                            
                            <div style={{ display: 'flex', gap: 4, padding: '15px 10px 0', position: 'relative', zIndex: 10 }}>
                                <div style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden' }}>
                                    <div style={{ width: '100%', height: '100%', background: '#fff', borderRadius: 2, animation: 'storyProgress 4s linear' }} />
                                </div>
                            </div>
                            <div style={{ padding: '15px', position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: viewingStory.isMe ? '#333' : '#fafafa', border: '1px solid rgba(255,255,255,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', color: '#fff', fontSize: 10, fontWeight: 800 }}>
                                        {viewingStory.isMe ? 'ME' : <DefaultBasicAvatar />}
                                    </div>
                                    <div style={{ color: '#fff', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                                        {viewingStory.name} <span style={{ opacity: 0.8, fontWeight: 400 }}>{viewingStory.isMe ? '방금 전' : '2025년 9월 12일'}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 15, color: '#fff' }}>
                                    <div style={{ cursor: 'pointer' }}>{Icons.dots}</div>
                                    <div onClick={() => {
                                        setViewingStory(null);
                                        setShowStoryLikesModal(false);
                                    }} style={{ cursor: 'pointer' }}>{Icons.close}</div>
                                </div>
                            </div>
                            
                            {/* 하단 바 분기: 내 스토리냐 남의 스토리냐 */}
                            {viewingStory.isMe ? (
                                <div style={{ position: 'absolute', bottom: 15, left: 15, right: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div onClick={() => setShowStoryLikesModal(true)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                                        <div style={{ display: 'flex', marginLeft: 10, position: 'relative', width: 44, height: 26 }}>
                                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#fafafa', position: 'absolute', left: 0, zIndex: 3, border: '1px solid #111', overflow: 'hidden' }}><DefaultBasicAvatar/></div>
                                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#eee', position: 'absolute', left: 12, zIndex: 2, border: '1px solid #111', overflow: 'hidden' }}><DefaultBasicAvatar/></div>
                                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#ddd', position: 'absolute', left: 24, zIndex: 1, border: '1px solid #111', overflow: 'hidden' }}><DefaultBasicAvatar/></div>
                                        </div>
                                        <div style={{ color: '#fff', fontSize: 11, marginTop: 4, fontWeight: 600 }}>활동</div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: 20, color: '#fff' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                                            <div style={{fontSize: 10, marginTop: 4, fontWeight: 600}}>하이라이트</div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle><circle cx="5" cy="12" r="2"></circle></svg>
                                            <div style={{fontSize: 10, marginTop: 4, fontWeight: 600}}>더 보기</div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ position: 'absolute', bottom: 15, left: 15, right: 15, display: 'flex', gap: 15, alignItems: 'center' }}>
                                    <div style={{ flex: 1, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.7)', padding: '12px 20px', borderRadius: 30, color: '#fff', fontSize: 14 }}>활동 말을 남겨주세요...</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 15, color: '#fff' }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                    </div>
                                </div>
                            )}

                            {/* 스토리 좋아요 목록 모달 (조회자 및 활동) */}
                            {showStoryLikesModal && (
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#fff', zIndex: 100000, display: 'flex', flexDirection: 'column', animation: 'fadeInUp 0.3s' }}>
                                    <div style={{ height: 50, borderBottom: '1px solid #dbdbdb', display: 'flex', alignItems: 'center', padding: '0 16px', justifyContent: 'center', position: 'relative' }}>
                                        <div style={{ fontWeight: 600, fontSize: 16 }}>조회한 사람</div>
                                        <div onClick={() => setShowStoryLikesModal(false)} style={{ position: 'absolute', right: 16, cursor: 'pointer', color: '#000' }}>{Icons.close}</div>
                                    </div>
                                    <div style={{ flex: 1, overflowY: 'auto', background: '#fff' }}>
                                        <div style={{ padding: '16px', borderBottom: '1px solid #efefef', display: 'flex', alignItems: 'center', gap: 15 }}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                            <div style={{ fontWeight: 600, fontSize: 14 }}>138명이 읽음</div>
                                        </div>
                                        <div style={{ padding: 16 }}>
                                            {mockLikeUsers.map((u, i) => (
                                                <div key={'s'+i} style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                                                    <div style={{ position: 'relative', marginRight: 15 }}>
                                                        <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#fafafa', border: '1px solid #ddd', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}><DefaultBasicAvatar /></div>
                                                        {u.isLike && ( // 스토리에 하트 누른 유저들
                                                            <div style={{ position: 'absolute', bottom: -2, right: -2, background: '#ed4956', borderRadius: '50%', width: 22, height: 22, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid #fff' }}>
                                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                                                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 15, color: '#262626' }}>
                                                        {Icons.dots}
                                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                )}

                {/* (피드) 좋아요 목록 모달 */}
                {showLikesModal && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#fff', zIndex: 100000, display: 'flex', flexDirection: 'column', animation: 'fadeInUp 0.3s' }}>
                        <div style={{ height: 50, borderBottom: '1px solid #dbdbdb', display: 'flex', alignItems: 'center', padding: '0 16px', justifyContent: 'center', position: 'relative' }}>
                            <div style={{ fontWeight: 600, fontSize: 16 }}>좋아요</div>
                            <div onClick={() => setShowLikesModal(false)} style={{ position: 'absolute', right: 16, cursor: 'pointer' }}>{Icons.close}</div>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            <div style={{ padding: '16px', borderBottom: '1px solid #efefef', display: 'flex', alignItems: 'center', gap: 15 }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2" style={{ marginLeft: 'auto' }}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </div>
                            <div style={{ padding: 16 }}>
                                {mockLikeUsers.map((u, i) => (
                                    <div key={'p'+i} style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                                        <div style={{ position: 'relative', marginRight: 15 }}>
                                            <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#fafafa', border: '1px solid #ddd', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}><DefaultBasicAvatar /></div>
                                            <div style={{ position: 'absolute', bottom: -2, right: -2, background: '#ed4956', borderRadius: '50%', width: 22, height: 22, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid #fff' }}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 15, color: '#262626' }}>
                                            {Icons.dots}
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </div>

            <style>{`
                @keyframes slideDownDM { 0% { opacity: 0; transform: translateY(-30px); } 100% { opacity: 1; transform: translateY(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes storyProgress { 0% { width: 0%; } 100% { width: 100%; } }
                ::-webkit-scrollbar { width: 0; background: transparent; display: none; }
            `}</style>
        </div>
    );
}
