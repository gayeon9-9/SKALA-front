// 날씨 데이터를 담당하는 모듈에서 함수를 가져오기
import { getLiveWeather } from "./weatherAPI.js";

const citySelect = document.querySelector("#city-select");
const weatherBox = document.querySelector("#weather-box");

// 사용자가 도시를 바꿀 때마다 실행
citySelect.addEventListener("change", async function (event) {
    const selectedValue = event.target.value;

    if (selectedValue === "none") {
        weatherBox.innerHTML =
            "<p>도시를 선택하면 위치와 실시간 날씨가 표시됩니다.</p>";
        return;
    }

    // option의 value에 저장된 위도와 경도를 분리
    const coords = selectedValue.split(",");
    const lat = coords[0];
    const lon = coords[1];
    const cityName = citySelect.options[citySelect.selectedIndex].text;

    // 데이터를 받아오는 동안 도시와 좌표, 로딩 문구 표시
    weatherBox.innerHTML = `
        <div style="border: 1px dashed #3498db; padding: 10px; margin-top: 10px;">
            <h4>📍 ${cityName}</h4>
            <p>• 위도(Latitude): ${lat}</p>
            <p>• 경도(Longitude): ${lon}</p>
            <p>실시간 날씨 로딩 중... ⏳</p>
        </div>
    `;

    // weatherAPI.js에서 실시간 날씨를 받아오기
    const weatherInfo = await getLiveWeather(lat, lon);

    if (weatherInfo) {
        weatherBox.innerHTML = `
            <div style="background-color: #e8f8f5; border-left: 5px solid #16a085; padding: 15px; margin-top: 10px;">
                <h4>🌍 ${cityName} 실시간 날씨</h4>
                <p>📍 위도: ${lat} / 경도: ${lon}</p>
                <p>🌡️ 현재 기온: <strong>${weatherInfo.temp}°C</strong></p>
                <p>💧 현재 습도: <strong>${weatherInfo.humidity}%</strong></p>
            </div>
        `;
    } else {
        weatherBox.innerHTML = `
            <div style="border: 1px solid #c0392b; padding: 10px; margin-top: 10px;">
                <p>⚠️ 날씨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
            </div>
        `;
    }
});
