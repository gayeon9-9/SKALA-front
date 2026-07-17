document.addEventListener("DOMContentLoaded", () => {
    
    /* -------------------------------------------
       1. 다크모드 토글 기능
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
                localStorage.setItem("theme", "dark");
            } else {
                themeToggleBtn.textContent = "🌙 다크모드";
                localStorage.setItem("theme", "light");
            }
        });
    }

    /* -------------------------------------------
       2. 여정 카드 개별 클릭 시 뒤집기 (Flip) 구현
       ------------------------------------------- */
    const cards = document.querySelectorAll(".card");
    
    cards.forEach(card => {
        card.addEventListener("click", (e) => {
            // 카드 앞면의 '상세 기록 이동' 링크(a 태그) 클릭 시에는 뒤집히지 않고 링크 이동하도록 예외 처리
            if (e.target.classList.contains("card-move-btn")) {
                return; 
            }
            // 뒤집기 상태 토글
            card.classList.toggle("is-flipped");
        });
    });

    cards.forEach(card => {
    card.addEventListener("keydown", (e) => {
        // 카드에 포커스된 상태에서 Enter나 Space를 누르면 클릭과 동일하게 동작
        if (e.key === "Enter" || e.key === " ") {
            if (e.target.classList.contains("card-move-btn")) {
                return;
            }
            e.preventDefault(); // Space 누를 때 페이지가 스크롤되는 것 방지
            card.classList.toggle("is-flipped");
        }
    });
});

    /* -------------------------------------------
       3. 하단 상세 이미지 크게 보기 모달 인터랙션
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
                modalImg.src = img.src; 
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