// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand(); // Раскрываем на весь экран

// Элементы DOM
const contentDiv = document.getElementById('content');
const tabButtons = document.querySelectorAll('.tab-bar button');

// Загрузка данных (можно заменить на fetch к вашему API)
const lessons = [
    { id: 1, title: "Введение в курс", completed: false },
    { id: 2, title: "Основные концепции", completed: false }
];

// Роутинг
function loadPage(page) {
    switch(page) {
        case 'home':
            contentDiv.innerHTML = `
                <h2>Добро пожаловать!</h2>
                <p>Этот курс поможет вам освоить новые навыки.</p>
                <div class="stats">
                    <p>Прогресс: <span id="progress">0%</span></p>
                </div>
            `;
            break;
        case 'lessons':
            contentDiv.innerHTML = `
                <h2>Уроки</h2>
                <div id="lessons-list"></div>
            `;
            const lessonsList = document.getElementById('lessons-list');
            lessons.forEach(lesson => {
                lessonsList.innerHTML += `
                    <div class="lesson-card" onclick="openLesson(${lesson.id})">
                        <h3>${lesson.title}</h3>
                        <p>Статус: ${lesson.completed ? '✅ Пройден' : '❌ Не начат'}</p>
                    </div>
                `;
            });
            break;
        case 'profile':
            const user = tg.initDataUnsafe.user;
            contentDiv.innerHTML = `
                <h2>Профиль</h2>
                <p>Имя: ${user?.first_name || 'Гость'}</p>
                <p>Прогресс: 25%</p>
            `;
            break;
    }
}

// Обработчики событий
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        loadPage(btn.dataset.page);
    });
});

// Функция открытия урока
window.openLesson = (id) => {
    tg.showPopup({
        title: 'Урок ' + id,
        message: 'Содержание урока загружается...',
        buttons: [{ id: 'close', type: 'close' }]
    });
};

// Загружаем главную страницу при старте
loadPage('home');
    contentDiv.innerHTML += `
    <div class="quiz">
        <h3>Тест</h3>
        <p>Вопрос 1: Какой язык используется для стилей?</p>
        <button onclick="checkAnswer(1, 'CSS')">CSS</button>
        <button onclick="checkAnswer(1, 'HTML')">HTML</button>
    </div>
`;
function completeLesson(lessonId) {
    tg.sendData(JSON.stringify({
        action: "lesson_completed",
        id: lessonId
    }));
    tg.close();
}
const user = tg.initDataUnsafe.user;
if (user) {
    console.log(`Пользователь: ${user.first_name} ${user.last_name}`);
}