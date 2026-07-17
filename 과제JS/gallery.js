document.addEventListener("DOMContentLoaded", () => {
    /* ==========================================
       1. 다크모드 기능

       과제 기준:
       다크모드 버튼을 클릭하면 body에 dark 클래스를
       추가하거나 제거합니다.

       CSS에서는 body.dark에 새로운 디자인을 전부 작성하지 않고
       기존 색상 변수의 값만 바꾸도록 구성했습니다.
       ========================================== */

    const themeToggleButton =
        document.getElementById("theme-toggle");

    const savedTheme =
        localStorage.getItem("theme");


    /**
     * 현재 테마에 따라 버튼 글자와 접근성 속성을 변경하는 함수
     */
    function updateThemeButton() {
        const isDarkMode =
            document.body.classList.contains("dark");

        if (isDarkMode) {
            themeToggleButton.textContent =
                "☀️ 라이트모드";

            themeToggleButton.setAttribute(
                "aria-label",
                "라이트모드로 변경"
            );

            themeToggleButton.setAttribute(
                "aria-pressed",
                "true"
            );
        } else {
            themeToggleButton.textContent =
                "🌙 다크모드";

            themeToggleButton.setAttribute(
                "aria-label",
                "다크모드로 변경"
            );

            themeToggleButton.setAttribute(
                "aria-pressed",
                "false"
            );
        }
    }


    /*
       이전에 사용자가 다크모드를 선택했다면
       페이지를 새로 열어도 다크모드가 유지되도록 설정합니다.
    */
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    }


    if (themeToggleButton) {
        updateThemeButton();

        themeToggleButton.addEventListener(
            "click",
            () => {
                document.body.classList.toggle("dark");

                const isDarkMode =
                    document.body.classList.contains("dark");

                /*
                   선택한 테마를 localStorage에 저장하여
                   새로고침 이후에도 유지되도록 했습니다.
                */
                if (isDarkMode) {
                    localStorage.setItem(
                        "theme",
                        "dark"
                    );
                } else {
                    localStorage.setItem(
                        "theme",
                        "light"
                    );
                }

                updateThemeButton();
            }
        );
    }


    /* ==========================================
       2. 카드 뒤집기 기능

       과제의 필수 항목은 아니지만
       카드의 내용을 앞면과 뒷면으로 나누어
       추가 설명을 확인할 수 있도록 구현했습니다.

       마우스 클릭뿐 아니라 Tab 키로 카드에 이동한 뒤
       Enter 또는 Space 키로도 뒤집을 수 있습니다.
       ========================================== */

    const cards =
        document.querySelectorAll(".card");


    /**
     * 선택한 카드를 뒤집거나 원래 상태로 되돌리는 함수
     */
    function toggleCard(card) {
        card.classList.toggle("is-flipped");

        const isFlipped =
            card.classList.contains("is-flipped");

        card.setAttribute(
            "aria-pressed",
            String(isFlipped)
        );
    }


    cards.forEach((card) => {
        card.addEventListener(
            "click",
            (event) => {
                /*
                   상세 기록 보기 링크를 누른 경우에는
                   카드가 뒤집히지 않고 해당 위치로 이동합니다.
                */
                if (
                    event.target.closest(".card-move-btn")
                ) {
                    return;
                }

                toggleCard(card);
            }
        );


        card.addEventListener(
            "keydown",
            (event) => {
                /*
                   카드 안의 링크에 포커스가 있는 경우에는
                   링크의 기본 키보드 기능이 작동하도록 둡니다.
                */
                if (
                    event.target.closest(".card-move-btn")
                ) {
                    return;
                }

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {
                    /*
                       Space 키를 눌렀을 때
                       페이지가 아래로 움직이는 기본 동작을 막습니다.
                    */
                    event.preventDefault();

                    toggleCard(card);
                }
            }
        );
    });


    /* ==========================================
       3. 이미지 확대 모달

       상세 기록의 이미지를 클릭하면
       이미지를 화면 중앙에 크게 표시합니다.
       ========================================== */

    const modal =
        document.getElementById("image-modal");

    const modalImage =
        document.getElementById("modal-img");

    const closeButton =
        document.querySelector(".modal-close");

    const galleryImages =
        document.querySelectorAll(".gallery img");


    /**
     * 이미지 확대 모달을 여는 함수
     */
    function openModal(image) {
        if (!modal || !modalImage) {
            return;
        }

        modalImage.src = image.src;
        modalImage.alt =
            `${image.alt} 확대 이미지`;

        modal.classList.add("active");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        /*
           모달이 열려 있는 동안
           뒤쪽 페이지가 스크롤되지 않도록 설정합니다.
        */
        document.body.style.overflow =
            "hidden";

        if (closeButton) {
            closeButton.focus();
        }
    }


    /**
     * 이미지 확대 모달을 닫는 함수
     */
    function closeModal() {
        if (!modal || !modalImage) {
            return;
        }

        modal.classList.remove("active");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        modalImage.src = "";

        document.body.style.overflow = "";
    }


    galleryImages.forEach((image) => {
        image.addEventListener(
            "click",
            () => {
                openModal(image);
            }
        );
    });


    if (closeButton) {
        closeButton.addEventListener(
            "click",
            closeModal
        );
    }


    if (modal) {
        modal.addEventListener(
            "click",
            (event) => {
                /*
                   확대 이미지가 아니라
                   모달의 어두운 배경을 클릭했을 때 닫습니다.
                */
                if (event.target === modal) {
                    closeModal();
                }
            }
        );
    }


    /*
       모달이 열린 상태에서 Escape 키를 누르면
       모달을 닫을 수 있도록 했습니다.
    */
    document.addEventListener(
        "keydown",
        (event) => {
            if (
                event.key === "Escape" &&
                modal?.classList.contains("active")
            ) {
                closeModal();
            }
        }
    );
});