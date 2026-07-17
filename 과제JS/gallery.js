document.addEventListener("DOMContentLoaded", () => {
    
    /* -------------------------------------------
       1. 다크모드 토글 기능 (추가됨)
       ------------------------------------------- */
    const themeToggleBtn = document.getElementById("theme-toggle");
    
    // 이전에 사용자가 설정한 다크모드 세팅이 있는지 확인하고 적용
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        if (themeToggleBtn) {
            themeToggleBtn.textContent = "☀️ 라이트모드";
        }
    }

    // 버튼 클릭 시 다크모드 토글 및 텍스트 전환
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark");
            
            if (document.body.classList.contains("dark")) {
                themeToggleBtn.textContent = "☀️ 라이트모드";
                localStorage.setItem("theme", "dark"); // 다크모드 상태 저장
            } else {
                themeToggleBtn.textContent = "🌙 다크모드";
                localStorage.setItem("theme", "light"); // 라이트모드 상태 저장
            }
        });
    }

    /* -------------------------------------------
       2. 하단 상세 이미지 크게 보기 모달 인터랙션
       ------------------------------------------- */
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const closeBtn = document.querySelector(".modal-close");
    const galleryImages = document.querySelectorAll(".gallery img");

    // 상세 이미지 클릭 시 모달 열기
    galleryImages.forEach(img => {
        img.addEventListener("click", () => {
            if(modal && modalImg) {
                modal.classList.add("active");
                modalImg.src = img.src; // 현재 클릭한 썸네일 소스를 모달 큰 이미지에 대입
                document.body.style.overflow = "hidden"; // 모달 오픈 시 본문 스크롤 잠금
            }
        });
    });

    // 닫기 기능 실행 함수
    function closeModal() {
        if(modal) {
            modal.classList.remove("active");
            document.body.style.overflow = "auto"; // 스크롤 잠금 해제
        }
    }

    // 닫기 버튼(X) 클릭 이벤트
    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    // 검은 배경화면 영역 클릭 시에도 모달이 닫히도록 설정
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal || e.target === closeBtn) {
                closeModal();
            }
        });
    }
});