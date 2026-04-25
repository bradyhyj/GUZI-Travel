export const TRAVEL_DATA = {
  "부산": { flights: [], hotels: [] }, 
  "도쿄": { flights: [], hotels: [] },
  "오사카": { flights: [], hotels: [] },
  "후쿠오카": { flights: [], hotels: [] },
  "삿포로": { flights: [], hotels: [] },
  "뉴욕": { flights: [], hotels: [] },
  "로스엔젤레스": { flights: [], hotels: [] },
  "런던": { flights: [], hotels: [] },
  "파리": { flights: [], hotels: [] },
  "로마": { flights: [], hotels: [] },
  "대만": { flights: [], hotels: [] },
  "상하이": { flights: [], hotels: [] }
};

// 가상 여행 테마에 맞는 숙소 및 실제 지역별 운항 항공사 키워드
const airlineMap = {
  "도쿄": ["대한항공", "아시아나항공", "진에어", "일본항공", "ANA", "에어부산"],
  "오사카": ["대한항공", "제주항공", "피치항공", "진에어", "에어부산", "아시아나항공"],
  "후쿠오카": ["대한항공", "에어부산", "진에어", "제주항공", "아시아나항공", "일본항공"],
  "삿포로": ["대한항공", "진에어", "제주항공", "아시아나항공", "에어부산", "ANA"],
  "뉴욕": ["대한항공", "아시아나항공", "델타항공", "유나이티드항공", "아메리칸항공"],
  "로스엔젤레스": ["대한항공", "아시아나항공", "델타항공", "유나이티드항공", "아메리칸항공"],
  "런던": ["대한항공", "아시아나항공", "영국항공", "루프트한자", "핀에어"],
  "파리": ["대한항공", "아시아나항공", "에어프랑스", "루프트한자", "KLM 네덜란드"],
  "로마": ["대한항공", "아시아나항공", "알리탈리아", "루프트한자", "에어프랑스"],
  "대만": ["대한항공", "아시아나항공", "에바항공", "중화항공", "에어부산", "진에어"],
  "상하이": ["대한항공", "아시아나항공", "중국동방항공", "중국남방항공", "에어부산"]
};

const hotelPrefixes = ["내 방 침대위", "따뜻한 전기장판", "모니터 앞", "노이즈캔슬링 🎧", "4K 유튜브뷰", "VR 고글 속", "안락한 거실", "배달음식과 함께하는"];
const hotelSuffixes = ["스위트룸", "올인클루시브 리조트", "최고급 호캉스", "프라이빗 펜션", "게스트하우스", "글램핑장", "5성급 호텔", "럭셔리 빌라"];
const themeTags = ["상상여행", "랜선뷰맛집", "와이파이빵빵", "1초컷체크인", "누워서세계속으로", "VR강추", "이불밖은위험해", "가성비갑"];

Object.keys(TRAVEL_DATA).forEach(city => {
  if(city === "부산") return;

  // 도시에 취항하는 현실적인 항공사 목록 추출 및 셔플
  const cityAirlines = airlineMap[city] || ["대한항공", "아시아나항공"];
  const shuffledAirlines = [...cityAirlines].sort(() => 0.5 - Math.random());
  
  const shuffledPrefixes = [...hotelPrefixes].sort(() => 0.5 - Math.random());
  const shuffledSuffixes = [...hotelSuffixes].sort(() => 0.5 - Math.random());

  for (let i = 0; i < 4; i++) {
    const flightAirline = shuffledAirlines[i % shuffledAirlines.length];
    const isPremiumA = flightAirline.includes('대한') || flightAirline.includes('아시아나') || flightAirline.includes('프랑스') || flightAirline.includes('영국') || flightAirline.includes('델타');
    const flightPriceBase = isPremiumA 
      ? (Math.floor(Math.random() * 20) + 15) * 10000 // 15 ~ 35만원
      : (Math.floor(Math.random() * 10) + 5) * 10000; // 5 ~ 15만원

    TRAVEL_DATA[city].flights.push({
      id: `f-${city}-${i}`, 
      airline: flightAirline,
      logo: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      depTime: `${String(Math.floor(Math.random()*12) + 8).padStart(2,'0')}:00`, 
      arrTime: `${String(Math.floor(Math.random()*12) + 14).padStart(2,'0')}:00`,
      price: flightPriceBase.toLocaleString()
    });

    const isPremiumH = shuffledSuffixes[i].includes('올인클루시브') || shuffledSuffixes[i].includes('5성급') || shuffledSuffixes[i].includes('스위트룸');
    const hotelStars = isPremiumH ? 5 : 4;
    const hotelPriceBase = isPremiumH 
      ? (Math.floor(Math.random() * 15) + 10) * 10000 // 10 ~ 25만원
      : (Math.floor(Math.random() * 6) + 3) * 10000; // 3 ~ 9만원

    const shuffledTags = [...themeTags].sort(() => 0.5 - Math.random());
    
    TRAVEL_DATA[city].hotels.push({
      id: `h-${city}-${i}`, 
      name: `[가상] ${shuffledPrefixes[i]} ${city} ${shuffledSuffixes[i]}`,
      location: `우리집 ${city}구역`, 
      rating: (Math.random() * 0.5 + 4.5).toFixed(1), // 재미를 위해 항상 높은 평점
      reviews: Math.floor(Math.random() * 9000) + 1000, 
      stars: hotelStars,
      price: hotelPriceBase.toLocaleString(),
      imgColor: `#${Math.floor(Math.random()*16777215).toString(16)}`, 
      tags: shuffledTags.slice(0, 2)
    });
  }
});