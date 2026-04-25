// 출발지: 부산
export const BUSAN = [129.0756, 35.1795];

// 💡 10이면 현실 시간 1시간 = 앱에서 10초 대기
// (테스트하실 때는 1로 낮춰서 빠르게 확인하고, 시연할 때 없애거나 늘리세요!)
export const TIME_COMPRESSION = 10;

export const CITIES = {
  // ----------------------------------------------------
  // ✈️ [정방향] 동쪽 / 북동쪽 / 남동쪽으로 가는 항로
  // (숫자를 키우면 비행기가 시계방향(오른쪽)으로 돕니다)
  // ----------------------------------------------------

  // 🇯🇵 일본
  TOKYO: { name: '🇯🇵 도쿄 (Tokyo)', lng: 139.6917, lat: 35.6895, rotation: 50, isFlipped: false, hours: 2 },
  OSAKA: { name: '🇯🇵 오사카 (Osaka)', lng: 135.5023, lat: 34.6937, rotation: 70, isFlipped: false, hours: 1.5 },
  FUKUOKA: { name: '🇯🇵 후쿠오카 (Fukuoka)', lng: 130.4017, lat: 33.5904, rotation: 30, isFlipped: false, hours: 0.8 }, // 상당히 남쪽이라 각도가 큽니다
  SAPPORO: { name: '🇯🇵 삿포로 (Sapporo)', lng: 141.3545, lat: 43.0621, rotation: 18, isFlipped: false, hours: 2.5 }, // 북쪽이라 각도가 작습니다

  // 🇺🇸 미국 (태평양 횡단)
  NEWYORK: { name: '🇺🇸 뉴욕 (New York)', lng: -74.0060, lat: 40.7128, rotation: 63, isFlipped: false, hours: 14 },
  LOSANGELES: { name: '🇺🇸 로스앤젤레스 (LA)', lng: -118.2437, lat: 34.0522, rotation: 64, isFlipped: false, hours: 11 },
  SANFRANCISCO: { name: '🇺🇸 샌프란시스코 (SF)', lng: -122.4194, lat: 37.7749, rotation: 58, isFlipped: false, hours: 10.5 },


  // ----------------------------------------------------
  // 🛩️ [반전] 서쪽 / 북서쪽 / 남서쪽으로 가는 항로 (isFlipped: true)
  // (반전된 상태이므로 숫자를 바꾸면 도는 느낌이 다를 수 있습니다)
  // ----------------------------------------------------

  // 🇬🇧 / 🇫🇷 / 🇮🇹 유럽 (북서쪽 횡단)
  LONDON: { name: '🇬🇧 런던 (London)', lng: -0.1276, lat: 51.5072, rotation: -25, isFlipped: true, hours: 12 },
  PARIS: { name: '🇫🇷 파리 (Paris)', lng: 2.3522, lat: 48.8566, rotation: -30, isFlipped: true, hours: 12 },
  ROME: { name: '🇮🇹 로마 (Rome)', lng: 12.4964, lat: 41.9028, rotation: -45, isFlipped: true, hours: 13 },

  // 🇹🇼 대만 / 🇨🇳 중국 (남서쪽)
  TAIPEI: { name: '🇹🇼 타이베이 (Taipei)', lng: 121.5654, lat: 25.0330, rotation: -90, isFlipped: true, hours: 2.5 },
  SHANGHAI: { name: '🇨🇳 상하이 (Shanghai)', lng: 121.4737, lat: 31.2304, rotation: -75, isFlipped: true, hours: 1.5 },
};