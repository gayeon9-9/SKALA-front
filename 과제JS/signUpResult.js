/* =====================================================
   회원가입 완료 페이지 JavaScript
===================================================== */

// 주소 뒤에 붙어서 넘어온 회원가입 값을 가져온다.
const params = new URLSearchParams(window.location.search);

console.log(window.location.search);


// 같은 항목에 이름을 다르게 적었을 수도 있어서
// 값이 있는 이름을 찾아서 가져온다.
function getParam(...names) {
    for (const name of names) {
        const value = params.get(name);

        if (value && value.trim() !== "") {
            return value.trim();
        }
    }

    return "";
}


// 화면에 글자를 넣을 때 반복해서 사용한다.
function putText(id, value, emptyText = "-") {
    const element = document.getElementById(id);

    if (!element) {
        return;
    }

    element.textContent = value || emptyText;
}


// 회원번호를 간단하게 만든다.
function makeMemberNumber() {
    const now = new Date();

    const year = String(now.getFullYear()).slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    // 뒤쪽 숫자가 매번 조금씩 다르게 나오도록 했다.
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;

    return `MEM-${year}${month}${day}-${randomNumber}`;
}


// 날짜와 시간을 보기 편한 모양으로 바꾼다.
function makeJoinDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}`;
}


// 이메일 앞부분과 뒷부분을 합친다.
function makeEmail() {
    const emailId = getParam(
        "userEmail",
        "emailId",
        "email"
    );

    const emailDomain = getParam(
        "directEmailDomain",
        "emailDomain",
        "userEmailDomain"
    );

    // 이메일 전체를 입력했다면 그대로 사용한다.
    if (emailId.includes("@")) {
        return emailId;
    }

    if (emailId && emailDomain) {
        return `${emailId}@${emailDomain}`;
    }

    return emailId;
}


// 선택한 지역을 한 줄로 합친다.
function makeRegion() {
    const region = getParam(
        "region",
        "userRegion",
        "city"
    );

    const district = getParam(
        "district",
        "userDistrict",
        "gu"
    );

    const town = getParam(
        "town",
        "userTown",
        "dong"
    );

    return [region, district, town]
        .filter(value => value !== "")
        .join(" ");
}


// 체크박스는 같은 name으로 여러 값이 넘어올 수 있다.
function getInterests() {
    let interests = [];

    const possibleNames = [
        "interest",
        "interests",
        "userInterest"
    ];

    for (const name of possibleNames) {
        interests = params.getAll(name);

        if (interests.length > 0) {
            break;
        }
    }

    const otherInterest = getParam(
        "otherInterest",
        "interestEtc"
    );

    // 기타에 직접 작성한 내용이 있으면 목록에 같이 넣는다.
    if (otherInterest) {
        interests.push(otherInterest);
    }

    // 빈 값이나 중복된 값을 없앤다.
    return [
        ...new Set(
            interests
                .map(value => value.trim())
                .filter(value => value !== "")
        )
    ];
}


// 관심 분야를 화면에 하나씩 보여준다.
function showInterests() {
    const interestList = document.getElementById("interestList");
    const interestCount = document.getElementById("interestCount");

    if (!interestList || !interestCount) {
        return;
    }

    const interests = getInterests();

    interestList.innerHTML = "";

    if (interests.length === 0) {
        const li = document.createElement("li");
        li.textContent = "선택한 관심 분야가 없습니다.";

        interestList.appendChild(li);
    } else {
        interests.forEach(function (interest) {
            const li = document.createElement("li");
            li.textContent = `✓ ${interest}`;

            interestList.appendChild(li);
        });
    }

    interestCount.textContent = `총 ${interests.length}개 선택`;
}


// 약관에 체크했다면 동의 완료로 표시한다.
function getTermsText() {
    const terms = getParam(
        "terms",
        "agree",
        "termsAgree",
        "agreement"
    );

    const agreedValues = [
        "on",
        "true",
        "yes",
        "agree",
        "동의",
        "동의함"
    ];

    if (agreedValues.includes(terms.toLowerCase())) {
        return "✓ 동의 완료";
    }

    return terms ? "✓ 동의 완료" : "동의 정보 없음";
}


// 성별 값을 한글로 바꾼다.
function getGenderText() {
    const gender = getParam(
        "gender",
        "userGender"
    );

    if (gender === "male") {
        return "남성";
    }

    if (gender === "female") {
        return "여성";
    }

    return gender;
}


// 가입경로 직접 입력값이 있으면 그 값을 우선 사용한다.
function getJoinPathText() {
    const directJoinPath = getParam(
        "directJoinPath"
    );

    const joinPath = getParam(
        "joinPath",
        "userJoinPath"
    );

    if (directJoinPath) {
        return directJoinPath;
    }

    return joinPath;
}


// 페이지가 열리면 회원정보를 넣는다.
function showMemberInformation() {
    const userId = getParam(
        "userId",
        "id"
    );

    const userName = getParam(
        "userName",
        "name"
    );

    const userBirth = getParam(
        "userBirth",
        "birth",
        "birthDate"
    );

    const userTel = getParam(
        "userTel",
        "tel",
        "phone"
    );

    const introduction = getParam(
        "intro",
        "introduction",
        "userIntroduction",
        "introduce"
    );

    // 이름이 없을 때는 회원이라고 나온다.
    putText("welcomeName", userName, "회원");

    putText("memberNumber", makeMemberNumber());
    putText("joinDate", makeJoinDate());

    putText("resultId", userId);
    putText("resultName", userName);
    putText("resultEmail", makeEmail());
    putText("resultBirth", userBirth);
    putText("resultTel", userTel);
    putText("resultGender", getGenderText());
    putText("resultRegion", makeRegion());
    putText("resultJoinPath", getJoinPathText());

    putText(
        "resultIntroduction",
        introduction,
        "작성하지 않았습니다."
    );

    putText("resultTerms", getTermsText());

    showInterests();
}


showMemberInformation();