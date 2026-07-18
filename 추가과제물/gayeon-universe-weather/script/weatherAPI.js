// Open-Meteo 서버에서 실시간 날씨 데이터를 가져오는 모듈
export async function getLiveWeather(lat, lon) {
    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}` +
        `&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("날씨 서버 응답이 올바르지 않습니다.");
        }

        const data = await response.json();

        // 화면에서 필요한 온도와 습도만 객체로 만들어 반환
        return {
            temp: data.current.temperature_2m,
            humidity: data.current.relative_humidity_2m
        };
    } catch (error) {
        console.error("날씨 API 오류:", error);
        return null;
    }
}
