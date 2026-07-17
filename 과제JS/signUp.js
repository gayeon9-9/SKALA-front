document.addEventListener("DOMContentLoaded", function () {
    // 자주 사용하는 HTML 요소 가져오는 부분 정리
    const form = document.getElementById("signupForm");
    const userId = document.getElementById("userId");
    const checkIdButton = document.getElementById("checkIdButton");
    const idCheckMessage = document.getElementById("idCheckMessage");
    const userPw = document.getElementById("userPw");
    const userPwCheck = document.getElementById("userPwCheck");
    const passwordCheckMessage = document.getElementById("passwordCheckMessage");
    const togglePasswordButton = document.getElementById("togglePasswordButton");
    const strengthBar = document.getElementById("passwordStrengthBar");
    const strengthText = document.getElementById("passwordStrengthText");
    const passwordLengthMessage = document.getElementById("passwordLengthMessage");
    const emailId = document.getElementById("emailId");
    const emailDomain = document.getElementById("emailDomain");
    const directEmailDomain = document.getElementById("directEmailDomain");
    const userEmail = document.getElementById("userEmail");
    const emailPreview = document.getElementById("emailPreview");
    const userName = document.getElementById("userName");
    const userBirth = document.getElementById("userBirth");
    const userTel = document.getElementById("userTel");
    const region = document.getElementById("region");
    const districtArea = document.getElementById("districtArea");
    const townArea = document.getElementById("townArea");
    const otherInterestCheck = document.getElementById("otherInterestCheck");
    const otherInterest = document.getElementById("otherInterest");
    const joinPath = document.getElementById("joinPath");
    const directJoinPath = document.getElementById("directJoinPath");
    const intro = document.getElementById("intro");
    const introCount = document.getElementById("introCount");
    const agree = document.getElementById("agree");
    const progressText = document.getElementById("progressText");
    const progressBar = document.getElementById("progressBar");

    // 중복 확인 테스트용 아이디 : 이미 사용 중 아이디로 뜨게 설정
    const usedIds = ["admin", "skala", "test1234"];
    let isIdChecked = false;

    function getLocalDateString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    // 생년월일은 오늘 이후 날짜 선택 불가하게 설정
    userBirth.max = getLocalDateString(new Date());

    function setMessage(element, text, className = "") {
        element.textContent = text;
        element.className = `validation-message ${className}`.trim();
    }

    // 아이디 형식과 중복 여부 확인
    checkIdButton.addEventListener("click", function () {
        const value = userId.value.trim();

        if (!value) {
            alert("아이디를 먼저 입력해 주세요.");
            userId.focus();
            return;
        }

        if (!userId.checkValidity()) {
            userId.reportValidity();
            return;
        }

        if (usedIds.includes(value.toLowerCase())) {
            isIdChecked = false;
            setMessage(idCheckMessage, "이미 사용 중인 아이디입니다.", "error-message");
        } else {
            isIdChecked = true;
            setMessage(idCheckMessage, "사용 가능한 아이디입니다.", "success-message");
        }

        updateProgress();
    });

    userId.addEventListener("input", function () {
        isIdChecked = false;
        setMessage(idCheckMessage, "아이디를 입력한 후 중복 확인해 주세요.");
        updateProgress();
    });

    // 비밀번호와 비밀번호 확인이 같은지 검사하는 부분
    function checkPasswordMatch() {
        userPwCheck.setCustomValidity("");

        if (!userPwCheck.value) {
            setMessage(passwordCheckMessage, "");
            return false;
        }

        if (userPw.value !== userPwCheck.value) {
            userPwCheck.setCustomValidity("비밀번호가 일치하지 않습니다.");
            setMessage(passwordCheckMessage, "비밀번호가 일치하지 않습니다.", "error-message");
            return false;
        }

        setMessage(passwordCheckMessage, "비밀번호가 일치합니다.", "success-message");
        return userPw.value.length >= 8;
    }

    // 입력한 문자 종류에 따라 비밀번호 안전도 표시
    function updatePasswordStrength() {
        const password = userPw.value;
        let score = 0;

        if (password.length >= 8) score++;
        if (/[A-Za-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        strengthBar.className = "password-strength-bar";

        if (!password) {
            strengthBar.style.width = "0%";
            strengthText.textContent = "안전도: 입력 전";
            return;
        }

        const states = [
            { width: "25%", className: "strength-weak", text: "안전도: 약함" },
            { width: "50%", className: "strength-normal", text: "안전도: 보통" },
            { width: "75%", className: "strength-good", text: "안전도: 양호" },
            { width: "100%", className: "strength-strong", text: "안전도: 강함" }
        ];
        const state = states[Math.max(score - 1, 0)];

        strengthBar.style.width = state.width;
        strengthBar.classList.add(state.className);
        strengthText.textContent = state.text;
    }

    // 비밀번호가 짧으면 빨간 안내 문구 표시
    function checkPasswordLength(showMessage) {
        const password = userPw.value;

        if (password === "") {
            userPw.setCustomValidity("");
            setMessage(passwordLengthMessage, "");
            return false;
        }

        if (password.length < 8) {
            userPw.setCustomValidity("비밀번호는 8자 이상 입력해 주세요.");

            if (showMessage) {
                setMessage(
                    passwordLengthMessage,
                    "비밀번호는 8자 이상 입력해 주세요.",
                    "error-message"
                );
            }

            return false;
        }

        userPw.setCustomValidity("");
        setMessage(passwordLengthMessage, "8자 이상 입력되었습니다.", "success-message");
        return true;
    }

    userPw.addEventListener("input", function () {
        checkPasswordLength(false);
        updatePasswordStrength();
        checkPasswordMatch();
        updateProgress();
    });

    // 다른 칸으로 이동할 때 안내 문구와 브라우저 경고 표시
    userPw.addEventListener("blur", function () {
        const isValid = checkPasswordLength(true);

        if (this.value !== "" && !isValid) {
            this.reportValidity();
        }
    });

    userPwCheck.addEventListener("input", function () {
        checkPasswordMatch();
        updateProgress();
    });

    // 비밀번호 보기/숨기기
    togglePasswordButton.addEventListener("click", function () {
        const showPassword = userPw.type === "password";
        userPw.type = showPassword ? "text" : "password";
        userPwCheck.type = showPassword ? "text" : "password";
        this.textContent = showPassword ? "숨기기" : "보기";
    });

    // 전화번호 하이픈 자동 입력
    userTel.addEventListener("input", function () {
        const numbers = this.value.replace(/[^0-9]/g, "").slice(0, 11);

        if (numbers.length <= 3) {
            this.value = numbers;
        } else if (numbers.length <= 7) {
            this.value = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        } else {
            this.value = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
        }
    });

    // 이메일 아이디와 도메인을 합쳐서 전송할 값 만들기
    function updateEmail() {
        const id = emailId.value.trim();
        const domain = emailDomain.value === "direct"
            ? directEmailDomain.value.trim()
            : emailDomain.value;

        userEmail.value = id && domain ? `${id}@${domain}` : "";
        emailPreview.textContent = userEmail.value
            ? `완성 이메일: ${userEmail.value}`
            : "완성 이메일: -";

        updateProgress();
    }

    // 직접 입력을 선택하면 도메인 입력창 표시
    emailDomain.addEventListener("change", function () {
        const isDirect = this.value === "direct";

        this.hidden = isDirect;
        this.required = !isDirect;
        directEmailDomain.hidden = !isDirect;
        directEmailDomain.required = isDirect;

        if (isDirect) {
            directEmailDomain.focus();
        } else {
            directEmailDomain.value = "";
        }

        updateEmail();
    });

    emailId.addEventListener("input", updateEmail);
    directEmailDomain.addEventListener("input", updateEmail);

    // 직접 입력값이 비어 있으면 다시 도메인 목록으로 변경
    directEmailDomain.addEventListener("blur", function () {
        if (this.value.trim() !== "") {
            return;
        }

        this.hidden = true;
        this.required = false;
        emailDomain.hidden = false;
        emailDomain.required = true;
        emailDomain.value = "";
        updateEmail();
    });

    // 시·도별 시·군·구 목록
    const districtData = {
        "서울특별시": ["종로구", "중구", "용산구", "성동구", "광진구", "동대문구", "중랑구", "성북구", "강북구", "도봉구", "노원구", "은평구", "서대문구", "마포구", "양천구", "강서구", "구로구", "금천구", "영등포구", "동작구", "관악구", "서초구", "강남구", "송파구", "강동구"],
        "부산광역시": ["중구", "서구", "동구", "영도구", "부산진구", "동래구", "남구", "북구", "해운대구", "사하구", "금정구", "강서구", "연제구", "수영구", "사상구", "기장군"],
        "대구광역시": ["중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군", "군위군"],
        "인천광역시": ["중구", "동구", "미추홀구", "연수구", "남동구", "부평구", "계양구", "서구", "강화군", "옹진군"],
        "광주광역시": ["동구", "서구", "남구", "북구", "광산구"],
        "대전광역시": ["동구", "중구", "서구", "유성구", "대덕구"],
        "울산광역시": ["중구", "남구", "동구", "북구", "울주군"],
        "세종특별자치시": ["세종특별자치시"],
        "경기도": ["수원시", "성남시", "의정부시", "안양시", "부천시", "광명시", "평택시", "동두천시", "안산시", "고양시", "과천시", "구리시", "남양주시", "오산시", "시흥시", "군포시", "의왕시", "하남시", "용인시", "파주시", "이천시", "안성시", "김포시", "화성시", "광주시", "양주시", "포천시", "여주시", "연천군", "가평군", "양평군"],
        "강원특별자치도": ["춘천시", "원주시", "강릉시", "동해시", "태백시", "속초시", "삼척시", "홍천군", "횡성군", "영월군", "평창군", "정선군", "철원군", "화천군", "양구군", "인제군", "고성군", "양양군"],
        "충청북도": ["청주시", "충주시", "제천시", "보은군", "옥천군", "영동군", "증평군", "진천군", "괴산군", "음성군", "단양군"],
        "충청남도": ["천안시", "공주시", "보령시", "아산시", "서산시", "논산시", "계룡시", "당진시", "금산군", "부여군", "서천군", "청양군", "홍성군", "예산군", "태안군"],
        "전북특별자치도": ["전주시", "군산시", "익산시", "정읍시", "남원시", "김제시", "완주군", "진안군", "무주군", "장수군", "임실군", "순창군", "고창군", "부안군"],
        "전라남도": ["목포시", "여수시", "순천시", "나주시", "광양시", "담양군", "곡성군", "구례군", "고흥군", "보성군", "화순군", "장흥군", "강진군", "해남군", "영암군", "무안군", "함평군", "영광군", "장성군", "완도군", "진도군", "신안군"],
        "경상북도": ["포항시", "경주시", "김천시", "안동시", "구미시", "영주시", "영천시", "상주시", "문경시", "경산시", "의성군", "청송군", "영양군", "영덕군", "청도군", "고령군", "성주군", "칠곡군", "예천군", "봉화군", "울진군", "울릉군"],
        "경상남도": ["창원시", "진주시", "통영시", "사천시", "김해시", "밀양시", "거제시", "양산시", "의령군", "함안군", "창녕군", "고성군", "남해군", "하동군", "산청군", "함양군", "거창군", "합천군"],
        "제주특별자치도": ["제주시", "서귀포시"]
    };

    // 시·도를 고르면 시·군·구 선택창 만들기
    region.addEventListener("change", function () {
        districtArea.innerHTML = "";
        townArea.innerHTML = "";

        if (!this.value) {
            return;
        }

        const row = document.createElement("div");
        row.className = "dynamic-address-row";

        const label = document.createElement("label");
        label.htmlFor = "district";
        label.textContent = "시·군·구";

        const select = document.createElement("select");
        select.id = "district";
        select.name = "district";

        const firstOption = document.createElement("option");
        firstOption.value = "";
        firstOption.textContent = "시·군·구 선택";
        select.appendChild(firstOption);

        districtData[this.value].forEach(function (district) {
            const option = document.createElement("option");
            option.value = district;
            option.textContent = district;
            select.appendChild(option);
        });

        row.append(label, select);
        districtArea.appendChild(row);

        select.addEventListener("change", function () {
            createTownInput(this.value);
        });
    });

    // 시·군·구를 고르면 읍·면·동 입력창 만들기
    function createTownInput(selectedDistrict) {
        townArea.innerHTML = "";

        if (!selectedDistrict) {
            return;
        }

        const row = document.createElement("div");
        row.className = "dynamic-address-row";

        const label = document.createElement("label");
        label.htmlFor = "town";
        label.textContent = "읍·면·동";

        const input = document.createElement("input");
        input.type = "text";
        input.id = "town";
        input.name = "town";
        input.placeholder = "읍·면·동을 입력해 주세요.";

        row.append(label, input);
        townArea.appendChild(row);
    }

    // 관심 분야에서 그 외를 선택하면 직접 입력창 표시
    otherInterestCheck.addEventListener("change", function () {
        otherInterest.hidden = !this.checked;
        otherInterest.required = this.checked;

        if (this.checked) {
            otherInterest.focus();
        } else {
            otherInterest.value = "";
        }
    });

    // 가입 경로 직접 입력 처리
    joinPath.addEventListener("change", function () {
        const isDirect = this.value === "direct";
        directJoinPath.hidden = !isDirect;
        directJoinPath.required = isDirect;

        if (isDirect) {
            directJoinPath.focus();
        } else {
            directJoinPath.value = "";
        }
    });

    // 자기소개 글자 수 표시
    intro.addEventListener("input", function () {
        introCount.textContent = this.value.length;
    });

    // 필수 정보 입력 개수에 따라 진행률 변경
    function updateProgress() {
        const checks = [
            userId.validity.valid && userId.value.trim() !== "",
            userPw.value.length >= 8,
            checkPasswordMatch(),
            userEmail.validity.valid && userEmail.value !== "",
            userName.value.trim() !== "",
            agree.checked
        ];
        const completed = checks.filter(Boolean).length;

        progressText.textContent = `${completed} / ${checks.length}`;
        progressBar.style.width = `${(completed / checks.length) * 100}%`;
    }

    [userName].forEach(function (input) {
        input.addEventListener("input", updateProgress);
    });
    agree.addEventListener("change", updateProgress);

    // 제출 전에 비밀번호가 일치하는지 마지막으로 확인
    form.addEventListener("submit", function (event) {
        if (!checkPasswordMatch()) {
            event.preventDefault();
            userPwCheck.reportValidity();
            userPwCheck.focus();
            return;
        }

        if (!confirm("입력한 정보로 회원가입하시겠습니까?")) {
            event.preventDefault();
        }
    });

    // 다시 작성 버튼을 누르면 추가 기능도 처음 상태로 초기화
    form.addEventListener("reset", function () {
        setTimeout(function () {
            isIdChecked = false;
            setMessage(idCheckMessage, "영문과 숫자만 사용할 수 있습니다.");
            setMessage(passwordCheckMessage, "");
            userPw.type = "password";
            userPwCheck.type = "password";
            userPw.setCustomValidity("");
            setMessage(passwordLengthMessage, "");
            togglePasswordButton.textContent = "보기";
            strengthBar.style.width = "0%";
            strengthBar.className = "password-strength-bar";
            strengthText.textContent = "안전도: 입력 전";
            otherInterest.hidden = true;
            otherInterest.required = false;
            directEmailDomain.hidden = true;
            directEmailDomain.required = false;
            emailDomain.hidden = false;
            emailDomain.required = true;
            userEmail.value = "";
            emailPreview.textContent = "완성 이메일: -";
            directJoinPath.hidden = true;
            directJoinPath.required = false;
            districtArea.innerHTML = "";
            townArea.innerHTML = "";
            introCount.textContent = "0";
            updateProgress();
        }, 0);
    });

    updateProgress();
});
