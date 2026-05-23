import { QuestStep } from './types';

export const questData: QuestStep[] = [
  {
    id: 1,
    dialog: "Привет, юный программист! Я Боб, твой главный прораб по коду. Сегодня мы строим не просто сарай, а настоящий веб-небоскреб! Готов применить все знания PHP и SQL?",
    question: "С чего начинается строительство любого серьезного проекта, где нужно хранить профили пользователей?",
    type: "multiple_choice",
    options: ["С рисования логотипа", "С создания Базы Данных (БД)", "С написания HTML-тега <h1>", "С покупки домена"],
    correctAnswer: "С создания Базы Данных (БД)",
    explanation: "Верно! База данных — это фундамент. Без нее нам негде будет хранить информацию о пользователях и контенте сайта."
  },
  {
    id: 2,
    dialog: "Отлично, фундамент заложен. Нам нужна таблица для хранения пользователей. Как назовем ее и какие основные столбцы нам понадобятся для регистрации?",
    question: "Выберите оптимальный набор столбцы для простейшей таблицы users:",
    type: "multiple_choice",
    options: [
      "id, first_name, last_name, fav_color",
      "id, login, password_hash, email",
      "username, pass, age",
      "user1, user2, user3"
    ],
    correctAnswer: "id, login, password_hash, email",
    explanation: "Точно! Нам нужен уникальный ID, логин, email, и самое главное — хеш пароля, а не сам пароль в открытом виде!"
  },
  {
    id: 3,
    dialog: "Стоп-стоп-стоп! Я услышал слово 'пароль'. Мы же не собираемся хранить пароли в открытом виде? Это как оставить ключи от сейфа на столе!",
    question: "Какую функцию в PHP мы должны использовать для безопасного шифрования (хеширования) пароля при регистрации?",
    type: "multiple_choice",
    options: ["md5()", "password_hash()", "crypt()", "base64_encode()"],
    correctAnswer: "password_hash()",
    explanation: "Абсолютно! Функция password_hash() создает надежный односторонний хеш, который современно и безопасно защитит данные пользователей."
  },
  {
    id: 4,
    dialog: "Блеск! База данных готова принимать жильцов. Теперь нужно написать запрос, чтобы добавить нового пользователя в базу при регистрации.",
    question: "Какой SQL-запрос мы используем для добавления новой записи (нового пользователя)?",
    type: "code_snippet",
    options: [
      "ADD INTO users (login, pass) VALUES ('user1', '123')",
      "INSERT INTO users (login, email, password_hash) VALUES (?, ?, ?)",
      "UPDATE users SET login='user1'",
      "CREATE USER login='user1'"
    ],
    correctAnswer: "INSERT INTO users (login, email, password_hash) VALUES (?, ?, ?)",
    explanation: "Именно так! Рекомендуется использовать INSERT INTO и подготовленные выражения (prepared statements) с '?' для защиты от SQL-инъекций."
  },
  {
    id: 5,
    dialog: "Новый пользователь зарегистрировался. Теперь он хочет войти. Нам нужно проверить, есть ли такой юзер в базе.",
    question: "Какой оператор SQL извлекает данные из таблицы?",
    type: "multiple_choice",
    options: ["GET", "PULL", "SELECT", "FETCH"],
    correctAnswer: "SELECT",
    explanation: "Правильно. SELECT используется для выборки данных. Например: SELECT * FROM users WHERE login = 'admin'."
  },
  {
    id: 6,
    dialog: "Пользователь найден! Но как проверить, правильный ли пароль он ввел? Помнишь, в базе у нас лежит только хеш!",
    question: "Какая функция PHP используется для сверки введенного пароля с сохраненным хешем?",
    type: "multiple_choice",
    options: ["password_verify()", "hash_equals()", "password_check()", "== (обычное сравнение)"],
    correctAnswer: "password_verify()",
    explanation: "Супер! Функция password_verify() берет обычный текст и хеш, и безопасно проверяет, совпадают ли они."
  },
  {
    id: 7,
    dialog: "Как только пользователь вошел, веб-сервер должен как-то 'запомнить' его, чтобы на других страницах не просить пароль снова.",
    question: "Какой механизм PHP используется для сохранения состояния пользователя между страницами?",
    type: "multiple_choice",
    options: ["Суперглобальный массив $_GET", "Суперглобальный массив $_SESSION", "HTML5 LocalStorage", "Cookies напрямую"],
    correctAnswer: "Суперглобальный массив $_SESSION",
    explanation: "Верно! Сессии ($_SESSION) надежно хранят данные пользователя (например, его ID) на сервере."
  },
  {
    id: 8,
    dialog: "Мы строим сайт турагентства! Значит, нам нужна еще одна таблица — для туров. ",
    question: "Какой SQL-запрос создаст таблицу `tours` с колонками id, title, price?",
    type: "code_snippet",
    options: [
      "CREATE TABLE tours (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), price DECIMAL(10,2))",
      "NEW TABLE tours (id, title, price)",
      "MAKE TABLE tours [id, title, price]",
      "INSERT TABLE tours (id INT, title VARCHAR, price INT)"
    ],
    correctAnswer: "CREATE TABLE tours (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), price DECIMAL(10,2))",
    explanation: "Молодец! CREATE TABLE — это правильная команда DDL (Data Definition Language) для создания структуры нашей таблицы."
  },
  {
    id: 9,
    dialog: "Хорошо, туры в базе есть. Как вывести их всех на страницу с помощью PHP?",
    question: "Как выглядит правильный цикл в PHP для прохождения по результатам выборки из БД (например, PDO)?",
    type: "multiple_choice",
    options: [
      "while ($row = $stmt->fetch()) { ... }",
      "for ($i=0; $i<all; $i++)",
      "loop ($stmt as $row)",
      "if ($stmt->fetch() == true)"
    ],
    correctAnswer: "while ($row = $stmt->fetch()) { ... }",
    explanation: "Именно так! Цикл while обрабатывает каждую строку данных, пока метод fetch() возвращает данные."
  },
  {
    id: 10,
    dialog: "Мы почти у цели! Но администратору нужно добавлять или редактировать туры. Как называется этот процесс?",
    question: "Как в программировании называется набор базовых операций: Создание, Чтение, Обновление, Удаление?",
    type: "multiple_choice",
    options: ["MVC (Model-View-Controller)", "CRUD (Create, Read, Update, Delete)", "SOLID", "API (Application Programming Interface)"],
    correctAnswer: "CRUD (Create, Read, Update, Delete)",
    explanation: "Верно! CRUD — это основа любой административной панели веб-сайта."
  },
  {
    id: 11,
    dialog: "Когда пользователь отправляет форму регистрации (логин и пароль), каким методом мы должны передавать данные?",
    question: "Какой HTTP-метод безопаснее использовать для отправки паролей?",
    type: "multiple_choice",
    options: ["GET", "POST", "PUT", "SEND"],
    correctAnswer: "POST",
    explanation: "Точно! POST скрывает данные в теле запроса, тогда как GET передает их в URL, что небезопасно для паролей."
  },
  {
    id: 12,
    dialog: "Форма отправлена через POST. Где в PHP лежат эти данные?",
    question: "Через какой суперглобальный массив мы получаем доступ к данным из формы POST?",
    type: "multiple_choice",
    options: ["$_GET", "$_REQUEST", "$_FORM", "$_POST"],
    correctAnswer: "$_POST",
    explanation: "$_POST содержит все данные, отправленные методом POST."
  },
  {
    id: 13,
    dialog: "Наш код подключения к базе данных нужен почти на всех страницах. Как нам не дублировать код?",
    question: "Какая функция в PHP вставляет содержимое одного файла в другой, и останавливает работу скрипта, если файл не найден?",
    type: "multiple_choice",
    options: ["include()", "require()", "import()", "load()"],
    correctAnswer: "require()",
    explanation: "Верно! require() обязана найти файл (например, db.php). Если его нет — выдаст фатальную ошибку, и база не сломается тихо."
  },
  {
    id: 14,
    dialog: "Хочу вывести список доступных стран для туров.",
    question: "Как правильно создать массив в PHP?",
    type: "code_snippet",
    options: [
      "$countries = ['Турция', 'Египет', 'Мальдивы'];",
      "$countries = new Array('Турция', 'Египет');",
      "array countries = {'Турция', 'Египет'};",
      "$countries = 'Турция', 'Египет';"
    ],
    correctAnswer: "$countries = ['Турция', 'Египет', 'Мальдивы'];",
    explanation: "В современных версиях PHP можно использовать короткий синтаксис [ ] для создания массивов."
  },
  {
    id: 15,
    dialog: "Как удобнее всего перебрать этот массив стран, чтобы вывести select option'ы?",
    question: "Какой цикл специально создан для работы с массивами?",
    type: "multiple_choice",
    options: ["for", "while", "do...while", "foreach"],
    correctAnswer: "foreach",
    explanation: "Именно! foreach берет каждый элемент массива по очереди, что идеально подходит для вывода списков."
  },
  {
    id: 16,
    dialog: "Цены на туры изменились! Нужно обновить данные в таблице tours.",
    question: "Какой SQL-запрос мы используем для обновления данных?",
    type: "code_snippet",
    options: [
      "CHANGE tours SET price = 500 WHERE id = 1",
      "UPDATE tours SET price = 500 WHERE id = 1",
      "MODIFY tours price = 500 WHERE id = 1",
      "SET tours.price = 500"
    ],
    correctAnswer: "UPDATE tours SET price = 500 WHERE id = 1",
    explanation: "UPDATE обновляет существующие записи. Не забудьте WHERE, иначе обновите цены у всех туров!"
  },
  {
    id: 17,
    dialog: "Тур в Египет закончился. Надо бы его убрать из базы.",
    question: "Каким SQL-запросом удаляем запись?",
    type: "code_snippet",
    options: [
      "DELETE FROM tours WHERE id = 3",
      "REMOVE tours WHERE id = 3",
      "DROP ROW FROM tours WHERE id = 3",
      "TRUNCATE tours WHERE id = 3"
    ],
    correctAnswer: "DELETE FROM tours WHERE id = 3",
    explanation: "DELETE FROM используется для удаления строк. TRUNCATE очистит всю таблицу, будьте осторожны!"
  },
  {
    id: 18,
    dialog: "Наш сайт в интернете! Но злые хакеры пытаются взломать форму логина, отправляя странный текст a' OR 1=1 --",
    question: "Как называется этот вид атаки?",
    type: "multiple_choice",
    options: ["XSS (Кросс-сайтовый скриптинг)", "SQL-инъекция", "DDoS", "Phishing"],
    correctAnswer: "SQL-инъекция",
    explanation: "Это классическая SQL-инъекция. Использование Prepared Statements в PDO надежно защищает от нее."
  },
  {
    id: 19,
    dialog: "Другой хакер написал в чате нашего форума скрипт <script>alert('ВЗЛОМ!')</script>. Теперь он выскакивает у всех!",
    question: "Какую функцию PHP нужно использовать перед выводом пользовательского текста на страницу?",
    type: "multiple_choice",
    options: ["strip_tags()", "htmlspecialchars()", "urlencode()", "base64_encode()"],
    correctAnswer: "htmlspecialchars()",
    explanation: "htmlspecialchars() превращает специальные символы в безопасный HTML-код, предотвращая XSS-атаки."
  },
  {
    id: 20,
    dialog: "Осталась последняя деталь в авторизации. Как перенаправить пользователя на главную страницу после входа?",
    question: "Какую функцию мы используем для HTTP-редиректа в PHP?",
    type: "multiple_choice",
    options: ["redirect('index.php')", "header('Location: index.php')", "window.location='index.php'", "goto index.php"],
    correctAnswer: "header('Location: index.php')",
    explanation: "header() отправляет сырой HTTP-заголовок браузеру для перенаправления."
  },
  {
    id: 21,
    dialog: "ТРЕВОГА! В код проникли баги (ошибки)! Если мы не отловим их сейчас, наша база данных рухнет! Вызываю подкрепление!",
    question: "Отлови все 15 багов, кликая по ним, пока они не испортили наш бэкенд!",
    type: "mini_game",
    miniGameType: "bug_catcher",
    explanation: "Фуух! Баги уничтожены, система стабильна! Отличная реакция, переходим к следующему уровню."
  },
  {
    id: 22,
    dialog: "Продолжаем работу. Для форума мы должны ограничить длину сообщения в 255 символов.",
    question: "Какая функция в PHP возвращает длину строки?",
    type: "multiple_choice",
    options: ["str_length()", "len()", "strlen()", "count()"],
    correctAnswer: "strlen()",
    explanation: "strlen() возвращает количество байт в строке."
  },
  {
    id: 23,
    dialog: "Мы хотим запретить определенное слово в сообщениях.",
    question: "Какая функция ищет подстроку в строке?",
    type: "multiple_choice",
    options: ["strpos()", "search()", "find()", "index()"],
    correctAnswer: "strpos()",
    explanation: "strpos() возвращает позицию первого вхождения подстроки."
  },
  {
    id: 24,
    dialog: "Что если мы хотим генерировать случайный номер заказа?",
    question: "Какая функция PHP генерирует случайное целое число?",
    type: "multiple_choice",
    options: ["random()", "rand()", "random_int()", "Обе rand() и random_int()"],
    correctAnswer: "Обе rand() и random_int()",
    explanation: "Обе создают числа, но random_int() считается криптографически безопасным."
  },
  {
    id: 25,
    dialog: "Надо сохранить дату регистрации пользователя.",
    question: "Как получить текущую дату в формате 'Год-Месяц-День' (например, '2023-10-25')?",
    type: "code_snippet",
    options: [
      "date('Y-m-d')",
      "time('Y-M-D')",
      "get_date()",
      "new Date()"
    ],
    correctAnswer: "date('Y-m-d')",
    explanation: "Функция date() форматирует локальное время/дату по заданному шаблону."
  },
  {
    id: 26,
    dialog: "Ой, у меня вылезает ошибка 'Cannot send session cookie - headers already sent'.",
    question: "Где нужно вызывать session_start() в коде PHP?",
    type: "multiple_choice",
    options: ["В самом начале файла, до вывода любого HTML", "В любом месте, главное до использования $_SESSION", "В конце файла", "Только внутри тега <body>"],
    correctAnswer: "В самом начале файла, до вывода любого HTML",
    explanation: "Сессии используют куки в HTTP-заголовках, которые должны отправляться до HTML!"
  },
  {
    id: 27,
    dialog: "Пользователь нажал кнопку 'Выйти' (Logout). Что делать с сессией?",
    question: "Как полностью уничтожить текущую сессию?",
    type: "multiple_choice",
    options: ["session_delete()", "session_destroy()", "unset($_SESSION)", "$_SESSION = false"],
    correctAnswer: "session_destroy()",
    explanation: "session_destroy() удаляет файлы сессии на сервере."
  },
  {
    id: 28,
    dialog: "Мы хотим запомнить выбор 'темной темы' даже если клиент не авторизован.",
    question: "Что используется для сохранения данных на стороне клиента?",
    type: "multiple_choice",
    options: ["Сессии ($_SESSION)", "Куки (Cookies) или LocalStorage", "Файл на сервере (.txt)", "Базу данных"],
    correctAnswer: "Куки (Cookies) или LocalStorage",
    explanation: "Куки остаются в браузере и используются для хранения настроек между визитами сайтов."
  },
  {
    id: 29,
    dialog: "Как получить доступ к куке с именем 'theme' в PHP?",
    question: "В каком массиве PHP хранятся куки?",
    type: "multiple_choice",
    options: ["$_COOKIE", "$_GET", "$_SESSION", "$_BROWSER"],
    correctAnswer: "$_COOKIE",
    explanation: "Куки доступны в глобальном массиве $_COOKIE."
  },
  {
    id: 30,
    dialog: "В базе форума есть таблица posts с полем user_id. А нам надо вывести на экран Имя автора (оно в таблице users)!",
    question: "Какой SQL-оператор объединяет данные из двух таблиц?",
    type: "multiple_choice",
    options: ["UNION", "MERGE", "JOIN", "COMBINE"],
    correctAnswer: "JOIN",
    explanation: "JOIN (например, INNER JOIN или LEFT JOIN) связывает таблицы по общему ключу."
  },
  {
    id: 31,
    dialog: "Пользователь хочет видеть самые дорогие (или свежие) туры первыми.",
    question: "Как отсортировать результаты SELECT по цене по убыванию?",
    type: "multiple_choice",
    options: ["SORT BY price DESC", "ORDER BY price DESC", "GROUP BY price DOWN", "ARRANGE BY price"],
    correctAnswer: "ORDER BY price DESC",
    explanation: "ORDER BY сортирует вывод."
  },
  {
    id: 32,
    dialog: "У нас 1000 туров, а мы хотим показать только 10 на странице.",
    question: "Какое ключевое слово SQL ограничивает количество возвращаемых строк?",
    type: "multiple_choice",
    options: ["LIMIT", "MAX", "TOP", "REDUCE"],
    correctAnswer: "LIMIT",
    explanation: "LIMIT 10 вернет только 10 первых записей, что важно для пагинации."
  },
  {
    id: 33,
    dialog: "А сколько всего зарегистрировано пользователей?",
    question: "Какая SQL-функция подсчитывает количество строк?",
    type: "code_snippet",
    options: [
      "SELECT SUM(id) FROM users",
      "SELECT COUNT(*) FROM users",
      "SELECT TOTAL() FROM users",
      "SELECT ROWS FROM users"
    ],
    correctAnswer: "SELECT COUNT(*) FROM users",
    explanation: "COUNT(*) просто считает количество строк в таблице, удовлетворяющих запросу."
  },
  {
    id: 34,
    dialog: "Мы хотим узнать количество туров, сгруппировав их по странам.",
    question: "Что используется вместе с агрегатными функциями для группировки?",
    type: "multiple_choice",
    options: ["GROUP BY", "SORT BY", "ORDER BY", "COLLECT BY"],
    correctAnswer: "GROUP BY",
    explanation: "GROUP BY группирует строки с одинаковыми значениями в сводные строки."
  },
  {
    id: 35,
    dialog: "Клиент ищет тур, название которого содержит слово 'Beach'.",
    question: "Как выглядит условие поиска по подстроке в SQL?",
    type: "code_snippet",
    options: [
      "WHERE title = '%Beach%'",
      "WHERE title LIKE '%Beach%'",
      "WHERE title IN ('Beach')",
      "WHERE title MATCH 'Beach'"
    ],
    correctAnswer: "WHERE title LIKE '%Beach%'",
    explanation: "Оператор LIKE вместе с символом % позволяет искать по маске строки."
  },
  {
    id: 36,
    dialog: "Мы пишем сайт: БД, интерфейс и логику. Чтобы не получить 'спагетти-код', мы должны их разделить.",
    question: "Какой архитектурный шаблон разделяет модель данных, отображение и контроллер?",
    type: "multiple_choice",
    options: ["MVP", "SPA", "MVC (Model-View-Controller)", "OOP"],
    correctAnswer: "MVC (Model-View-Controller)",
    explanation: "MVC — это классический паттерн разработки. Model отвечает за БД, View за интерфейс, Controller за логику."
  },
  {
    id: 37,
    dialog: "Код написан, давай оставим сообщение для других программистов.",
    question: "Какие символы создают однострочный комментарий в PHP?",
    type: "multiple_choice",
    options: ["//", "<!--", "#", "И //, и # работают в PHP"],
    correctAnswer: "И //, и # работают в PHP",
    explanation: "В PHP используются стандартные комментарии: // и # для одной строки, и /* */ для многострочных."
  },
  {
    id: 38,
    dialog: "В таблицах нам нужно уникально различать каждую запись (каждого юзера).",
    question: "Для чего используется Primary Key (Первичный ключ), например столбец `id`?",
    type: "multiple_choice",
    options: ["Для однозначной идентификации записи", "Для шифрования паролей", "Чтобы интернет работал быстрее", "Для создания копий БД"],
    correctAnswer: "Для однозначной идентификации записи",
    explanation: "В каждой таблице обязательно должен быть первичный ключ (обычно id с AUTO_INCREMENT)."
  },
  {
    id: 39,
    dialog: "Перед запуском мы должны обеспечить ссылочную целостность данных между таблицами (tours и countries).",
    question: "Как называется ключ, ссылающийся на первичный ключ другой таблицы?",
    type: "multiple_choice",
    options: ["Secret Key", "Foreign Key (Внешний ключ)", "Local Key", "Master Key"],
    correctAnswer: "Foreign Key (Внешний ключ)",
    explanation: "Внешний ключ защищает от удаления связанных данных: нельзя удалить страну, если в ней еще есть туры."
  },
  {
    id: 40,
    dialog: "СУПЕРКОДИНГ! Архитектура готова, базы синхронизированы. Чтобы окончательно запустить проект, собери пазл из SQL-кода!",
    question: "Собери правильный SQL-запрос для выборки активных туров: SELECT * FROM tours WHERE status = 'active' ORDER BY price DESC",
    type: "mini_game",
    miniGameType: "query_builder",
    gameData: {
       pieces: ["SELECT", "*", "FROM", "tours", "WHERE", "status='active'", "ORDER BY", "price DESC"]
    },
    explanation: "КОМПИЛЯЦИЯ УСПЕШНА! Твой код идеален, базы данных связаны. Запускаем проект!"
  }
];
