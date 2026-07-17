document.addEventListener('DOMContentLoaded', () => {
    // 1. 테마 토글 (다크모드 / 라이트모드) 기능 기존 유지
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark');
        themeToggleBtn.textContent = '☀️ 라이트모드';
    }

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark');
        if (body.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.textContent = '☀️ 라이트모드';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggleBtn.textContent = '🌙 다크모드';
        }
    });

    // 2. [수정 완료] 카드 내부 상세기록 버튼 활성화 처리 (이벤트 전파 차단)
    const cardMoveButtons = document.querySelectorAll('.card-move-btn');
    cardMoveButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // 버튼 클릭 시 3D 카드 플립(hover 상태 전환 등) 효과가 꼬이지 않고 앵커 이동만 실행하도록 제어
            e.stopPropagation(); 
        });
    });

    // 3. [완성도 강추 기능] 스크롤 위치에 따라 상단 6개 고정 탭 메뉴 하이라이트 효과 활성화
    const sections = document.querySelectorAll('.country-album');
    const tabItems = document.querySelectorAll('.nav-tabs .tab-item');

    function activateCurrentTab() {
        let currentSectionId = "";
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // 상단 고정 네비바 크기를 감안하여 현재 스크롤 위치 추적 (마진 버퍼 적용)
            if (window.scrollY >= sectionTop - 250) {
                currentSectionId = section.getAttribute('id');
            }
        });

        tabItems.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('href') === `#${currentSectionId}`) {
                tab.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', activateCurrentTab);
});