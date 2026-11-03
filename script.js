document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('add-button');
    const movieInput = document.getElementById('movie-input');
    const basket = document.getElementById('basket');
    const dropZones = document.querySelectorAll('.drop-zone');

    // 1. 시작하자마자 저장된 데이터 불러오기
    loadMovies();

    // 영화 추가 버튼 클릭 이벤트
    addButton.addEventListener('click', () => {
        const title = movieInput.value.trim();
        if (title) {
            createMovieElement(title, 'basket');
            movieInput.value = '';
            saveMovies();
        }
    });

    // 엔터키 지원
    movieInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addButton.click();
    });

    // 영화 요소 생성 함수
    function createMovieElement(title, parentId) {
        const movie = document.createElement('div');
        movie.className = 'movie';
        movie.draggable = true;
        movie.innerText = title;

        // 드래그 시작할 때
        movie.addEventListener('dragstart', () => {
            movie.classList.add('dragging');
        });

        // 드래그 끝날 때
        movie.addEventListener('dragend', () => {
            movie.classList.remove('dragging');
            saveMovies(); // 바뀐 위치 저장
        });

        // 저장된 위치 혹은 바구니에 넣기
        const parent = document.getElementById(parentId) || basket;
        parent.appendChild(movie);
    }

    // 드롭 영역 설정
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault(); // 드롭 허용
        });

        zone.addEventListener('drop', e => {
            e.preventDefault();
            const draggingMovie = document.querySelector('.dragging');
            if (draggingMovie) {
                zone.appendChild(draggingMovie);
                saveMovies(); // 드롭 직후 저장
            }
        });
    });

    // 데이터 저장 함수
    function saveMovies() {
        const movies = [];
        document.querySelectorAll('.movie').forEach(movie => {
            movies.push({
                title: movie.innerText,
                parentId: movie.parentElement.id
            });
        });
        localStorage.setItem('movieTierData', JSON.stringify(movies));
    }

    // 데이터 로드 함수
    function loadMovies() {
        const data = localStorage.getItem('movieTierData');
        if (data) {
            const parsedData = JSON.parse(data);
            parsedData.forEach(item => {
                createMovieElement(item.title, item.parentId);
            });
        }
    }
});