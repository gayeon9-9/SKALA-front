const params = new URLSearchParams(window.location.search);

// URL에서 name에 해당하는 값 가져오기
function getParam(name) {
    return (params.get(name) || "").trim();
}

// 값이 없으면 항목에 맞는 기본 문구 표시
function putText(id, value, emptyText = "-") {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value || emptyText;
    }
}

// 날짜와 랜덤 숫자를 조합해서 회원번호 만들기
function makeMemberNumber() {
    const now = new Date();
    const year = String(now.getFullYear()).slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;

    return `MEM-${year}${month}${day}-${randomNumber}`;
}

function makeJoinDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}`;
}

// 같은 name으로 넘어온 관심 분야를 모두 가져오기
function getInterestsText() {
    const interests = params
        .getAll("interest")
        .map(value => value.trim())
        .filter(Boolean);
    const otherInterest = getParam("otherInterest");

    if (otherInterest) {
        interests.push(otherInterest);
    }

    return [...new Set(interests)].join(", ");
}

// 가입 경로를 직접 입력한 경우 직접 입력값 사용
function getJoinPathText() {
    const directJoinPath = getParam("directJoinPath");
    const joinPath = getParam("joinPath");

    return directJoinPath || (joinPath === "direct" ? "" : joinPath);
}

// 시·도, 시·군·구, 읍·면·동을 한 줄로 합치기
function getRegionText() {
    return [getParam("region"), getParam("district"), getParam("town")]
        .filter(Boolean)
        .join(" ");
}

// 입력한 회원 정보를 결과 표에 넣기 (비밀번호는 제외함)
function showMemberInformation() {
    const userName = getParam("userName");

    putText("welcomeName", userName, "회원");
    putText("memberNumber", makeMemberNumber());
    putText("joinDate", makeJoinDate());
    putText("resultId", getParam("userId"));
    putText("resultName", userName);
    putText("resultEmail", getParam("userEmail"));
    putText("resultBirth", getParam("userBirth"), "입력하지 않았습니다.");
    putText("resultTel", getParam("userTel"), "입력하지 않았습니다.");
    putText("resultGender", getParam("gender"), "선택 안 함");
    putText("resultRegion", getRegionText(), "선택하지 않았습니다.");
    putText("resultInterests", getInterestsText(), "선택하지 않았습니다.");
    putText("resultJoinPath", getJoinPathText(), "선택하지 않았습니다.");
    putText("resultIntroduction", getParam("intro"), "작성하지 않았습니다.");
    putText("resultTerms", getParam("agree") ? "✓ 동의 완료" : "동의 정보 없음");
}

showMemberInformation();
