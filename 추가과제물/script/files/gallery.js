document.addEventListener("DOMContentLoaded", () => {

    /* -------------------------------------------
       1. 다크모드 토글 기능
       ------------------------------------------- */
    const themeToggleBtn = document.getElementById("theme-toggle");
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        if (themeToggleBtn) themeToggleBtn.textContent = "☀️ 라이트모드";
    }

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
       2. 여정 카드 뒤집기 (Flip) — 클릭 + 키보드
       ------------------------------------------- */
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        // 마우스 클릭으로 뒤집기
        card.addEventListener("click", (e) => {
            // 버튼 클릭 시 스크롤 이동만 동작하고 뒤집기 방지
            if (e.target.classList.contains("card-move-btn")) {
                return;
            }
            card.classList.toggle("is-flipped");
        });

        // 키보드(Tab으로 카드에 포커스 후 Enter/Space)로 뒤집기
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                if (e.target.classList.contains("card-move-btn")) {
                    return;
                }
                e.preventDefault(); // Space 입력 시 페이지 스크롤 방지
                card.classList.toggle("is-flipped");
            }
        });
    });

    /* -------------------------------------------
       3. 라이트박스 이미지 확대 모달
       ------------------------------------------- */
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const closeBtn = document.querySelector(".modal-close");
    const galleryImages = document.querySelectorAll(".gallery img");

    galleryImages.forEach(img => {
        img.addEventListener("click", () => {
            if(modal && modalImg) {
                modal.classList.add("active");
                modalImg.src = img.src;
                document.body.style.overflow = "hidden";
            }
        });
    });

    function closeModal() {
        if(modal) {
            modal.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal || e.target === closeBtn) {
                closeModal();
            }
        });
    }
});
