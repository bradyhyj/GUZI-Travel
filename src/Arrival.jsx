import React from 'react';

const Arrival = ({ city, onReset }) => {
  return (
    <div style={{
      width: '100vw', height: '100vh', backgroundColor: '#000', color: '#FFD700',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', fontFamily: 'monospace'
    }}>
      <h1 style={{ fontSize: '3rem' }}>🎉 WELCOME TO {city.name}!</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '40px', color: '#aaa' }}>
        고생하셨습니다. 당신은 방금 아무것도 하지 않고 시간을 버리는 데 성공했습니다.
      </p>
      
      {/* 여기에 나중에 제미나이가 추천해주는 장소 리스트를 넣으면 됩니다 */}
      <div style={{ border: '1px solid #444', padding: '20px', borderRadius: '10px', marginBottom: '40px' }}>
        <h3>[ 오늘의 쓸모없는 추천 ]</h3>
        <p>현지 편의점에서 가장 싼 생수 사서 성분표 읽기</p>
      </div>

      <button 
        onClick={onReset}
        style={{
          padding: '15px 40px', backgroundColor: '#FFD700', border: 'none',
          borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer'
        }}
      >
        일정 생성하러 가기
      </button>
    </div>
  );
};

export default Arrival;