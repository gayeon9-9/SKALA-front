/* =====================================================
   회원가입 페이지 JavaScript
===================================================== */

document.addEventListener("DOMContentLoaded", function () {
    /* -------------------------------------------------
       HTML 요소 가져오기
    ------------------------------------------------- */

    const signupForm = document.getElementById("signupForm");

    const userIdInput = document.getElementById("userId");
    const checkIdButton = document.getElementById("checkIdButton");
    const idCheckMessage = document.getElementById("idCheckMessage");

    const userPwInput = document.getElementById("userPw");
    const userPwCheckInput = document.getElementById("userPwCheck");
    const togglePasswordButton = document.getElementById(
        "togglePasswordButton"
    );

    const passwordCheckMessage = document.getElementById(
        "passwordCheckMessage"
    );

    const passwordStrengthBar = document.getElementById(
        "passwordStrengthBar"
    );

    const passwordStrengthText = document.getElementById(
        "passwordStrengthText"
    );

    const userEmailInput = document.getElementById("userEmail");
    const emailDomainSelect = document.getElementById("emailDomain");

    const directEmailDomainInput = document.getElementById(
        "directEmailDomain"
    );

    const userNameInput = document.getElementById("userName");
    const userBirthInput = document.getElementById("userBirth");
    const userTelInput = document.getElementById("userTel");

    const regionSelect = document.getElementById("region");
    const districtArea = document.getElementById("districtArea");
    const townArea = document.getElementById("townArea");

    const otherInterestCheck = document.getElementById(
        "otherInterestCheck"
    );

    const otherInterestInput = document.getElementById(
        "otherInterest"
    );

    const joinPathSelect = document.getElementById("joinPath");

    const directJoinPathInput = document.getElementById(
        "directJoinPath"
    );

    const introInput = document.getElementById("intro");
    const introCount = document.getElementById("introCount");

    const agreeCheckbox = document.getElementById("agree");

    const progressText = document.getElementById("progressText");
    const progressBar = document.getElementById("progressBar");

    const clearInputButtons = document.querySelectorAll(
        ".clear-input-button"
    );

    const usedIds = [
        "admin",
        "skala",
        "gayeon",
        "test1234"
    ];

    let isIdChecked = false;


    /* =================================================
       1. 생년월일 미래 날짜 차단
    ================================================= */

    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    userBirthInput.max = todayString;


    /* =================================================
       2. 아이디 중복 확인
    ================================================= */

    checkIdButton.addEventListener("click", function () {
        const userId = userIdInput.value.trim();

        if (userId === "") {
            alert("아이디를 먼저 입력해 주세요.");
            userIdInput.focus();
            return;
        }

        if (!userIdInput.checkValidity()) {
            alert(
                "아이디는 영문과 숫자만 사용하여 4~12자로 입력해 주세요."
            );

            userIdInput.focus();
            return;
        }

        if (usedIds.includes(userId.toLowerCase())) {
            alert("이미 사용 중인 아이디입니다.");

            idCheckMessage.textContent =
                "❌ 이미 사용 중인 아이디입니다.";

            idCheckMessage.className =
                "validation-message error-message";

            isIdChecked = false;
        } else {
            alert("사용 가능한 아이디입니다.");

            idCheckMessage.textContent =
                "✅ 사용 가능한 아이디입니다.";

            idCheckMessage.className =
                "validation-message success-message";

            isIdChecked = true;
        }

        updateProgress();
    });

    /* 아이디가 변경되면 다시 중복확인 */
    userIdInput.addEventListener("input", function () {
        isIdChecked = false;

        idCheckMessage.textContent = "";
        idCheckMessage.className = "validation-message";

        updateProgress();
    });


    /* =================================================
       3. 비밀번호 확인
    ================================================= */

    function checkPassword() {
        const password = userPwInput.value;
        const passwordCheck = userPwCheckInput.value;

        userPwInput.setCustomValidity("");
        userPwCheckInput.setCustomValidity("");

        passwordCheckMessage.className = "validation-message";

        if (password === "" && passwordCheck === "") {
            passwordCheckMessage.textContent = "";
            return false;
        }

        if (password.length < 8) {
            passwordCheckMessage.textContent =
                "❌ 비밀번호는 8자 이상 입력해야 합니다.";

            passwordCheckMessage.classList.add("error-message");

            userPwInput.setCustomValidity(
                "비밀번호는 8자 이상 입력해 주세요."
            );

            return false;
        }

        if (passwordCheck === "") {
            passwordCheckMessage.textContent =
                "비밀번호를 한 번 더 입력해 주세요.";

            passwordCheckMessage.classList.add("guide-message");

            return false;
        }

        if (passwordCheck.length < 8) {
            passwordCheckMessage.textContent =
                "❌ 비밀번호 확인도 8자 이상 입력해야 합니다.";

            passwordCheckMessage.classList.add("error-message");

            userPwCheckInput.setCustomValidity(
                "비밀번호 확인은 8자 이상 입력해 주세요."
            );

            return false;
        }

        if (password !== passwordCheck) {
            passwordCheckMessage.textContent =
                "❌ 비밀번호가 일치하지 않습니다.";

            passwordCheckMessage.classList.add("error-message");

            userPwCheckInput.setCustomValidity(
                "비밀번호가 일치하지 않습니다."
            );

            return false;
        }

        passwordCheckMessage.textContent =
            "✅ 비밀번호가 일치합니다.";

        passwordCheckMessage.classList.add("success-message");

        return true;
    }

    userPwInput.addEventListener("input", function () {
        checkPassword();
        updatePasswordStrength();
        updateProgress();
    });

    userPwCheckInput.addEventListener("input", function () {
        checkPassword();
        updateProgress();
    });


    /* =================================================
       4. 비밀번호 보기/숨기기
    ================================================= */

    togglePasswordButton.addEventListener("click", function () {
        const isPasswordVisible =
            userPwInput.type === "text";

        if (isPasswordVisible) {
            userPwInput.type = "password";
            userPwCheckInput.type = "password";

            this.textContent = "보기";
        } else {
            userPwInput.type = "text";
            userPwCheckInput.type = "text";

            this.textContent = "숨기기";
        }
    });


    /* =================================================
       5. 비밀번호 안전도
    ================================================= */

    function updatePasswordStrength() {
        const password = userPwInput.value;

        let score = 0;

        if (password.length >= 8) {
            score += 1;
        }

        if (/[A-Za-z]/.test(password)) {
            score += 1;
        }

        if (/[0-9]/.test(password)) {
            score += 1;
        }

        if (/[^A-Za-z0-9]/.test(password)) {
            score += 1;
        }

        passwordStrengthBar.className =
            "password-strength-bar";

        if (password === "") {
            passwordStrengthBar.style.width = "0%";
            passwordStrengthText.textContent =
                "비밀번호 안전도: 입력 전";

            return;
        }

        if (score <= 1) {
            passwordStrengthBar.style.width = "25%";
            passwordStrengthBar.classList.add("strength-weak");

            passwordStrengthText.textContent =
                "비밀번호 안전도: 약함";

            return;
        }

        if (score === 2) {
            passwordStrengthBar.style.width = "50%";
            passwordStrengthBar.classList.add("strength-normal");

            passwordStrengthText.textContent =
                "비밀번호 안전도: 보통";

            return;
        }

        if (score === 3) {
            passwordStrengthBar.style.width = "75%";
            passwordStrengthBar.classList.add("strength-good");

            passwordStrengthText.textContent =
                "비밀번호 안전도: 양호";

            return;
        }

        passwordStrengthBar.style.width = "100%";
        passwordStrengthBar.classList.add("strength-strong");

        passwordStrengthText.textContent =
            "비밀번호 안전도: 강함";
    }


    /* =================================================
       6. 전화번호 자동 하이픈
    ================================================= */

    userTelInput.addEventListener("input", function () {
        const number = this.value
            .replace(/[^0-9]/g, "")
            .slice(0, 11);

        if (number.length === 0) {
            this.value = "";
        } else if (number.length < 3) {
            this.value = number;
        } else if (number.length === 3) {
            this.value = number + "-";
        } else if (number.length < 7) {
            this.value =
                number.slice(0, 3) +
                "-" +
                number.slice(3);
        } else if (number.length === 7) {
            this.value =
                number.slice(0, 3) +
                "-" +
                number.slice(3, 7) +
                "-";
        } else {
            this.value =
                number.slice(0, 3) +
                "-" +
                number.slice(3, 7) +
                "-" +
                number.slice(7, 11);
        }

        this.setSelectionRange(
            this.value.length,
            this.value.length
        );
    });


    /* =================================================
       7. 이메일 도메인 직접 입력
    ================================================= */

    emailDomainSelect.addEventListener("change", function () {
        if (this.value === "direct") {
            this.hidden = true;
            this.required = false;

            directEmailDomainInput.hidden = false;
            directEmailDomainInput.required = true;
            directEmailDomainInput.value = "";

            directEmailDomainInput.focus();
        } else {
            directEmailDomainInput.hidden = true;
            directEmailDomainInput.required = false;
            directEmailDomainInput.value = "";
        }

        updateProgress();
    });

    directEmailDomainInput.addEventListener("input", updateProgress);

    directEmailDomainInput.addEventListener("blur", function () {
        if (this.value.trim() !== "") {
            return;
        }

        this.hidden = true;
        this.required = false;

        emailDomainSelect.hidden = false;
        emailDomainSelect.required = true;
        emailDomainSelect.value = "";

        updateProgress();
    });

    userEmailInput.addEventListener("input", updateProgress);


    /* =================================================
       8. 가입경로 직접 입력
    ================================================= */

    joinPathSelect.addEventListener("change", function () {
        if (this.value === "direct") {
            this.hidden = true;

            directJoinPathInput.hidden = false;
            directJoinPathInput.value = "";

            directJoinPathInput.focus();
        } else {
            directJoinPathInput.hidden = true;
            directJoinPathInput.value = "";
        }
    });

    directJoinPathInput.addEventListener("blur", function () {
        if (this.value.trim() !== "") {
            return;
        }

        this.hidden = true;

        joinPathSelect.hidden = false;
        joinPathSelect.value = "";
    });


    /* =================================================
       9. 관심 분야 '그 외'
    ================================================= */

    otherInterestCheck.addEventListener("change", function () {
        if (this.checked) {
            otherInterestInput.hidden = false;
            otherInterestInput.focus();
        } else {
            otherInterestInput.hidden = true;
            otherInterestInput.value = "";
        }
    });


    /* =================================================
       10. 자기소개 글자 수
    ================================================= */

    introInput.addEventListener("input", function () {
        introCount.textContent = this.value.length;
    });


    /* =================================================
       11. 입력값 지우기 버튼
    ================================================= */

    clearInputButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const targetId = this.dataset.target;
            const targetInput = document.getElementById(targetId);

            targetInput.value = "";
            targetInput.focus();

            targetInput.dispatchEvent(
                new Event("input", {
                    bubbles: true
                })
            );
        });
    });


    /* =================================================
       12. 시·도별 시·군·구
    ================================================= */

    const districtData = {
        seoul: [
            "종로구", "중구", "용산구", "성동구", "광진구",
            "동대문구", "중랑구", "성북구", "강북구", "도봉구",
            "노원구", "은평구", "서대문구", "마포구", "양천구",
            "강서구", "구로구", "금천구", "영등포구", "동작구",
            "관악구", "서초구", "강남구", "송파구", "강동구"
        ],

        busan: [
            "중구", "서구", "동구", "영도구", "부산진구",
            "동래구", "남구", "북구", "해운대구", "사하구",
            "금정구", "강서구", "연제구", "수영구", "사상구",
            "기장군"
        ],

        daegu: [
            "중구", "동구", "서구", "남구", "북구",
            "수성구", "달서구", "달성군", "군위군"
        ],

        incheon: [
            "중구", "동구", "미추홀구", "연수구", "남동구",
            "부평구", "계양구", "서구", "강화군", "옹진군"
        ],

        gwangju: [
            "동구", "서구", "남구", "북구", "광산구"
        ],

        daejeon: [
            "동구", "중구", "서구", "유성구", "대덕구"
        ],

        ulsan: [
            "중구", "남구", "동구", "북구", "울주군"
        ],

        sejong: [
            "세종특별자치시"
        ],

        gyeonggi: [
            "수원시", "성남시", "의정부시", "안양시", "부천시",
            "광명시", "평택시", "동두천시", "안산시", "고양시",
            "과천시", "구리시", "남양주시", "오산시", "시흥시",
            "군포시", "의왕시", "하남시", "용인시", "파주시",
            "이천시", "안성시", "김포시", "화성시", "광주시",
            "양주시", "포천시", "여주시", "연천군", "가평군",
            "양평군"
        ],

        gangwon: [
            "춘천시", "원주시", "강릉시", "동해시", "태백시",
            "속초시", "삼척시", "홍천군", "횡성군", "영월군",
            "평창군", "정선군", "철원군", "화천군", "양구군",
            "인제군", "고성군", "양양군"
        ],

        chungbuk: [
            "청주시", "충주시", "제천시", "보은군", "옥천군",
            "영동군", "증평군", "진천군", "괴산군", "음성군",
            "단양군"
        ],

        chungnam: [
            "천안시", "공주시", "보령시", "아산시", "서산시",
            "논산시", "계룡시", "당진시", "금산군", "부여군",
            "서천군", "청양군", "홍성군", "예산군", "태안군"
        ],

        jeonbuk: [
            "전주시", "군산시", "익산시", "정읍시", "남원시",
            "김제시", "완주군", "진안군", "무주군", "장수군",
            "임실군", "순창군", "고창군", "부안군"
        ],

        jeonnam: [
            "목포시", "여수시", "순천시", "나주시", "광양시",
            "담양군", "곡성군", "구례군", "고흥군", "보성군",
            "화순군", "장흥군", "강진군", "해남군", "영암군",
            "무안군", "함평군", "영광군", "장성군", "완도군",
            "진도군", "신안군"
        ],

        gyeongbuk: [
            "포항시", "경주시", "김천시", "안동시", "구미시",
            "영주시", "영천시", "상주시", "문경시", "경산시",
            "의성군", "청송군", "영양군", "영덕군", "청도군",
            "고령군", "성주군", "칠곡군", "예천군", "봉화군",
            "울진군", "울릉군"
        ],

        gyeongnam: [
            "창원시", "진주시", "통영시", "사천시", "김해시",
            "밀양시", "거제시", "양산시", "의령군", "함안군",
            "창녕군", "고성군", "남해군", "하동군", "산청군",
            "함양군", "거창군", "합천군"
        ],

        jeju: [
            "제주시", "서귀포시"
        ]
    };


    /* =================================================
       13. 지역 선택창 생성
    ================================================= */

    regionSelect.addEventListener("change", function () {
        const selectedRegion = this.value;

        districtArea.innerHTML = "";
        townArea.innerHTML = "";

        if (selectedRegion === "") {
            return;
        }

        const row = document.createElement("p");
        row.className = "dynamic-address-row";

        const label = document.createElement("label");
        label.htmlFor = "district";
        label.textContent = "시·군·구 :";

        const districtSelect = document.createElement("select");
        districtSelect.id = "district";
        districtSelect.name = "district";

        const firstOption = document.createElement("option");
        firstOption.value = "";
        firstOption.textContent = "== 시·군·구 선택 ==";

        districtSelect.appendChild(firstOption);

        districtData[selectedRegion].forEach(function (district) {
            const option = document.createElement("option");

            option.value = district;
            option.textContent = district;

            districtSelect.appendChild(option);
        });

        row.appendChild(label);
        row.appendChild(districtSelect);

        districtArea.appendChild(row);

        districtSelect.addEventListener("change", function () {
            createTownInput(this.value);
        });
    });

    function createTownInput(selectedDistrict) {
        townArea.innerHTML = "";

        if (selectedDistrict === "") {
            return;
        }

        const row = document.createElement("p");
        row.className = "dynamic-address-row";

        const label = document.createElement("label");
        label.htmlFor = "town";
        label.textContent = "읍·면·동 :";

        const townInput = document.createElement("input");
        townInput.type = "text";
        townInput.id = "town";
        townInput.name = "town";
        townInput.placeholder = "읍·면·동을 입력해 주세요.";

        row.appendChild(label);
        row.appendChild(townInput);

        townArea.appendChild(row);
    }


    /* =================================================
       14. 필수정보 진행률
    ================================================= */

    function isEmailComplete() {
        const emailIdComplete =
            userEmailInput.value.trim() !== "";

        let domainComplete = false;

        if (emailDomainSelect.hidden) {
            domainComplete =
                directEmailDomainInput.value.trim() !== "";
        } else {
            domainComplete =
                emailDomainSelect.value !== "";
        }

        return emailIdComplete && domainComplete;
    }

    function updateProgress() {
        const requiredChecks = [
            isIdChecked,
            userPwInput.value.length >= 8,
            checkPassword(),
            isEmailComplete(),
            userNameInput.value.trim() !== "",
            agreeCheckbox.checked
        ];

        const completedCount = requiredChecks.filter(
            function (item) {
                return item;
            }
        ).length;

        const totalCount = requiredChecks.length;

        progressText.textContent =
            completedCount + " / " + totalCount;

        const progressPercent =
            (completedCount / totalCount) * 100;

        progressBar.style.width =
            progressPercent + "%";
    }

    userNameInput.addEventListener("input", updateProgress);
    agreeCheckbox.addEventListener("change", updateProgress);


    /* =================================================
       15. 제출 전 최종 확인
    ================================================= */

    signupForm.addEventListener("submit", function (event) {
        const passwordIsValid = checkPassword();

        if (!isIdChecked) {
            event.preventDefault();

            alert("아이디 중복 확인을 먼저 진행해 주세요.");

            userIdInput.focus();
            return;
        }

        if (!passwordIsValid) {
            event.preventDefault();

            userPwCheckInput.focus();
            signupForm.reportValidity();

            return;
        }

        if (!signupForm.checkValidity()) {
            event.preventDefault();
            signupForm.reportValidity();

            return;
        }

        const isConfirmed = confirm(
            "입력한 정보로 회원가입하시겠습니까?"
        );

        if (!isConfirmed) {
            event.preventDefault();
        }
    });


    /* =================================================
       16. 다시 작성 버튼
    ================================================= */

    signupForm.addEventListener("reset", function () {
        setTimeout(function () {
            isIdChecked = false;

            idCheckMessage.textContent = "";
            idCheckMessage.className = "validation-message";

            passwordCheckMessage.textContent = "";
            passwordCheckMessage.className = "validation-message";

            userPwInput.type = "password";
            userPwCheckInput.type = "password";
            togglePasswordButton.textContent = "보기";

            userPwInput.setCustomValidity("");
            userPwCheckInput.setCustomValidity("");

            passwordStrengthBar.style.width = "0%";
            passwordStrengthBar.className =
                "password-strength-bar";

            passwordStrengthText.textContent =
                "비밀번호 안전도: 입력 전";

            emailDomainSelect.hidden = false;
            emailDomainSelect.required = true;

            directEmailDomainInput.hidden = true;
            directEmailDomainInput.required = false;
            directEmailDomainInput.value = "";

            joinPathSelect.hidden = false;

            directJoinPathInput.hidden = true;
            directJoinPathInput.value = "";

            otherInterestCheck.checked = false;
            otherInterestInput.hidden = true;
            otherInterestInput.value = "";

            districtArea.innerHTML = "";
            townArea.innerHTML = "";

            introCount.textContent = "0";

            progressText.textContent = "0 / 6";
            progressBar.style.width = "0%";
        }, 0);
    });


    /* 처음 페이지가 열렸을 때 진행률 초기화 */
    updateProgress();
});