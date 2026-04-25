import React, { useState } from 'react';

// Custom modern SVG icons
const Icons = {
  insta: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="url(#instaGradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line><defs><linearGradient id="instaGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse"><stop stopColor="#f09433"/><stop offset="0.25" stopColor="#e6683c"/><stop offset="0.5" stopColor="#dc2743"/><stop offset="0.75" stopColor="#cc2366"/><stop offset="1" stopColor="#bc1888"/></linearGradient></defs></svg>,
  sparkles: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>
};

export default function TripReview({ onSelectReview, onBack }) {
    const [hovered, setHovered] = useState(null);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            fontFamily: "'Inter', 'Pretendard', sans-serif",
            position: 'relative',
            overflow: 'hidden'
        }}>
            
            {/* Background decorative blobs */}
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', filter: 'blur(40px)', zIndex: 0 }} />
            <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', filter: 'blur(40px)', zIndex: 0 }} />

            <div style={{ maxWidth: 850, width: '100%', zIndex: 1, position: 'relative' }}>
                <button 
                    onClick={onBack} 
                    style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 20, cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#4b5563', padding: '10px 20px', marginBottom: 40, backdropFilter: 'blur(10px)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.7)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    플래너로 돌아가기
                </button>
                
                <div style={{ textAlign: 'center', marginBottom: 60, animation: 'fadeInDown 0.6s ease-out' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '8px 16px', borderRadius: 20, fontSize: 14, fontWeight: 800, marginBottom: 20, letterSpacing: 1 }}>
                        {Icons.sparkles} VIRTUAL TRIP COMPLETED
                    </div>
                    <h1 style={{ fontSize: 42, fontWeight: 900, color: '#0f172a', margin: '0 0 15px 0', letterSpacing: '-0.5px' }}>
                        가상 여행의 여운을 기록하세요
                    </h1>
                    <p style={{ fontSize: 18, color: '#475569', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
                        현실로 돌아가기 전, 완벽했던 당신만의 랜선 여정을<br/>
                        세상에 공유하거나 솔직한 리뷰를 남겨 평가해주세요.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
                    {/* 인스타 올리기 */}
                    <div 
                        onClick={() => onSelectReview('insta')} 
                        onMouseEnter={() => setHovered('insta')}
                        onMouseLeave={() => setHovered(null)}
                        style={{ 
                            background: 'rgba(255, 255, 255, 0.7)', 
                            borderRadius: 30, 
                            padding: '50px 40px', 
                            textAlign: 'center', 
                            cursor: 'pointer', 
                            boxShadow: hovered === 'insta' ? '0 30px 60px rgba(0,0,0,0.08)' : '0 10px 30px rgba(0,0,0,0.03)', 
                            transform: hovered === 'insta' ? 'translateY(-10px)' : 'translateY(0)',
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
                            border: '1px solid rgba(255,255,255,1)',
                            backdropFilter: 'blur(20px)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ width: 80, height: 80, borderRadius: 24, background: 'linear-gradient(135deg, rgba(236,72,153,0.1), rgba(245,158,11,0.1))', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 25px', transition: '0.3s transform', transform: hovered === 'insta' ? 'scale(1.1) rotate(-5deg)' : 'scale(1)' }}>
                            {Icons.insta}
                        </div>
                        <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12, color: '#0f172a' }}>인스타그램에 공유</h2>
                        <p style={{ color: '#475569', lineHeight: 1.6, fontSize: 16 }}>
                            요즘 감성 낭낭하게<br/>가상 랜선 여행 피드 올리기
                        </p>

                        <div style={{ marginTop: 30, color: '#ec4899', fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, opacity: hovered === 'insta' ? 1 : 0, transition: '0.3s', transform: hovered === 'insta' ? 'translateY(0)' : 'translateY(10px)' }}>
                            피드 작성하기 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                        </div>
                    </div>

                    {/* 가게 리뷰 쓰기 */}
                    <div 
                        onClick={() => onSelectReview('store')} 
                        onMouseEnter={() => setHovered('store')}
                        onMouseLeave={() => setHovered(null)}
                        style={{ 
                            background: 'rgba(255, 255, 255, 0.7)', 
                            borderRadius: 30, 
                            padding: '50px 40px', 
                            textAlign: 'center', 
                            cursor: 'pointer', 
                            boxShadow: hovered === 'store' ? '0 30px 60px rgba(0,0,0,0.08)' : '0 10px 30px rgba(0,0,0,0.03)', 
                            transform: hovered === 'store' ? 'translateY(-10px)' : 'translateY(0)',
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
                            border: '1px solid rgba(255,255,255,1)',
                            backdropFilter: 'blur(20px)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ width: 80, height: 80, borderRadius: 24, background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(59,130,246,0.1))', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 25px', transition: '0.3s transform', transform: hovered === 'store' ? 'scale(1.1) rotate(5deg)' : 'scale(1)' }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="url(#starGradient)" stroke="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon><defs><linearGradient id="starGradient" x1="2" y1="2" x2="22" y2="22"><stop stopColor="#fcd34d"/><stop offset="1" stopColor="#f59e0b"/></linearGradient></defs></svg>
                        </div>
                        <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12, color: '#0f172a' }}>방문한 장소 리뷰 쓰기</h2>
                        <p style={{ color: '#475569', lineHeight: 1.6, fontSize: 16 }}>
                            가상으로 방문했던 식당과<br/>명소에 솔직한 별점 남기기
                        </p>
                        
                        <div style={{ marginTop: 30, color: '#f59e0b', fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, opacity: hovered === 'store' ? 1 : 0, transition: '0.3s', transform: hovered === 'store' ? 'translateY(0)' : 'translateY(10px)' }}>
                            평점 남기기 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: 60, display: 'flex', justifyContent: 'center', animation: 'fadeInDown 0.6s ease-out 0.2s both' }}>
                    <button 
                        onClick={onHome} 
                        style={{ background: '#0f172a', color: '#fff', padding: '18px 36px', borderRadius: 30, fontSize: 16, fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 10px 25px rgba(15, 23, 42, 0.3)', transition: 'all 0.2s ease-out' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(15, 23, 42, 0.4)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(15, 23, 42, 0.3)'; }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        가상 여행 최종 종료 및 메인으로
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
