import React, { useState } from "react";
import { TRAVEL_DATA } from "./data";
import Landing from "./Landing";
import Search from "./Search";
import Accommodation from "./Accommodation";
import Payment from "./Payment";
import Plan from "./plan";
import TripReview from "./trip_review";
import Insta from "./insta";
import StoreReview from "./StoreReview";
import "./App.css";

export default function App() {
  // 1. 현재 어떤 화면을 보여줄지 결정하는 상태 ('landing', 'flight', 'hotel', 'payment')
  const [view, setView] = useState("landing");
  
  // 2. 선택된 도시 이름
  const [city, setCity] = useState("");
  
  // 3. 결제 페이지로 넘길 데이터 (타입과 선택한 아이템 정보)
  const [paymentData, setPaymentData] = useState(null);
  
  // 4. 탑승/투숙 인원
  const [personCount, setPersonCount] = useState(1);

  // 5. 예약 내역
  const [reservations, setReservations] = useState([]);

  // 6. 플래너용 데이터
  const [budget, setBudget] = useState("50만원");
  const [tripDates, setTripDates] = useState(null);
  const [itinerary, setItinerary] = useState(null);

  // [함수] 결제 완료 시 실행
  const handlePaymentComplete = (bookingInfo) => {
    const newBooking = { ...bookingInfo, startDate: tripDates?.startDate, endDate: tripDates?.endDate };
    setReservations([...reservations, newBooking]);
    setPaymentData(null);
    setView('landing');
  };

  const handleCancelBooking = (id) => {
    setReservations(reservations.filter(r => r.id !== id));
  };

  // [함수] 메인 검색 시 실행 (Landing -> Search/Accommodation)
  const handleSearch = (type, selectedCity, count, sDate, eDate) => {
    if (!TRAVEL_DATA[selectedCity]) {
      alert("도시 정보를 선택해주세요.");
      return;
    }
    setCity(selectedCity);
    setPersonCount(count || 1);
    if(sDate && eDate) setTripDates({ startDate: sDate, endDate: eDate });
    setView(type);
  };

  // [함수] 리스트에서 항목 선택 시 실행 (Search/Accommodation -> Payment)
  const handleSelect = (type, item) => {
    console.log("선택됨:", type, item); // 디버깅용 로그
    setPaymentData({ type, item });
    setView("payment");
  };

  // [함수] 뒤로가기 로직
  const handleBack = () => {
    if (view === "payment") {
      // 결제창에서 뒤로가면 이전에 있던 리스트로 이동
      setView(paymentData.type === 'flight' ? 'flight' : 'hotel');
    } else {
      // 리스트에서 뒤로가면 메인으로 이동
      setView("landing");
    }
  };

  return (
    <>
      {/* 1. 메인 랜드마크 화면 */}
      {view === "landing" && (
        <Landing 
          onSearch={handleSearch} 
          reservations={reservations}
          onCancelBooking={handleCancelBooking}
          initialDates={tripDates}
          onBoarding={(data) => {
            if (data?.budgetInput) setBudget(data.budgetInput);
            if (data?.startDate) {
              setTripDates({ startDate: data.startDate, endDate: data.endDate });
            }
            setView('plan');
          }} 
        />
      )}

      {/* 2. 항공권 검색 결과 화면 */}
      {view === "flight" && (
        <Search 
          destination={city} 
          data={TRAVEL_DATA[city].flights} 
          onBack={handleBack} 
          onSelect={(item) => handleSelect('flight', item)} // 필수!
          personCount={personCount}
        />
      )}

      {/* 3. 숙소 검색 결과 화면 */}
      {view === "hotel" && (
        <Accommodation 
          destination={city} 
          data={TRAVEL_DATA[city].hotels} 
          onBack={handleBack} 
          onSelect={(item) => handleSelect('hotel', item)} // 필수!
        />
      )}

      {/* 4. 통합 결제 화면 */}
      {view === "payment" && paymentData && (
        <Payment 
          type={paymentData.type} 
          item={paymentData.item} 
          onBack={handleBack} 
          city={city} 
          budget={budget}
          reservations={reservations}
          onPaymentComplete={handlePaymentComplete}
        />
      )}

      {/* 5. AI 일정 생성 화면 (이전 ItineraryBuilder) */}
      {view === "plan" && (
        <Plan 
          onBack={handleBack} 
          initialBudget={budget} 
          city={city} 
          tripDates={tripDates} 
          reservations={reservations} 
          onFinishTrip={(planData) => {
            setItinerary(planData);
            setView('trip_review');
          }}
        />
      )}

      {/* 6. 여행 종료 및 리뷰 네비게이션 */}
      {view === "trip_review" && <TripReview onSelectReview={type => setView(type)} onBack={() => setView('plan')} onHome={() => {
        setView('landing');
        setItinerary(null); // 여행 끝내면 상태를 일부 초기화 해주는 것도 자연스러움
      }} />}
      
      {view === "insta" && <Insta city={city} itinerary={itinerary} onBack={() => setView('trip_review')} />}
      
      {view === "store" && <StoreReview itinerary={itinerary} onBack={() => setView('trip_review')} />}
    </>
  );
}