# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные

#### Интерфейс товара (IProduct)
id: string;            // уникальный идентификатор товара
description: string;   // описание товара
image: string;         // ссылка на изображение товара
title: string;         // название товара
category: string;      // категория товара
price: number | null;  // цена товара

#### Интерфейс покупателя (IBuyer)
payment: TPayment;  // выбранный способ оплаты
email: string;      // еmail покупателя
phone: string;      // телефон покупателя
address: string;    // адрес доставки

#### Тип способа оплаты (TPayment)
export type TPayment = 'card' | 'cash' | '' // тип оплаты 

#### Интерфейс запроса заказа (IOrderRequest)
total: number;      // общая сумма заказа
items: string[];    // массив идентификаторов товаров

#### Интерфейс ответа сервера (IProductsResponse)
items: IProduct[];  // массив товаров с сервера

#### Интерфейс результата заказа (IOrderResult)
id: string;         // идентификатор созданного заказа
total: number;      // итоговая сумма заказа

### Модели данных

#### Класс Catalog - каталог товаров
Поля класса:
'private items: IProduct[]' - массив всех товаров, доступных в каталоге
'private selectedProduct: IProduct | null' - товар, выбранный для подробного отображения

Методы класса: 
'setItems(items: IProduct[])' - cохраняет массив товаров в модель
'getItems()' - возвращает массив всех товаров из каталога
'getItemById(id: string)' - находит и возвращает товар по его идентификатору
'setPreviewItem(item: IProduct)' - сохраняет выбранный товар для подробного отображения
'getPreviewItem()' - возвращает товар, выбранный для подробного отображения

#### Класс Order - покупатель
Поля класса:
'private payment: TPayment' - выбранный способ оплаты
'private address: string' - адрес доставки
'private email: string' - email покупателя
'private phone: string' - телефон покупателя

Методы класса: 
'setDataBuyer(data: Partial<IBuyer>)' - сохраняет данные покупателя, Метод позволяет обновить как одно поле, так и несколько, не затрагивая остальные поля
'getDataBuyer()' - возвращает все текущие данные покупателя
'clearInfoBuyer()' - полностью очищает все данные покупателя, устанавливая пустые значения
'getValueByKey(key: keyof IBuyer)' - внутренний метод для получения значения поля по его ключу
'validateInfoBuyer(fields?: Array<keyof IBuyer>)' - проверяет валидность указанных полей. Поле считается валидным, если оно не пустое

#### Класс Basket - корзина с товарами
Поля класса:
'private items: IProduct[]' - массив товаров, добавленных в корзину

Методы класса: 
'getItems()' - возвращает массив товаров, находящихся в корзине
'addItem(item: IProduct)' - добавляет товар в корзину
'deleteItemById(id: string)' - удаляет указанный товар из корзины
'clearItems()' - полностью очищает корзину, удаляя все товары
'getTotalPrice()' - вычисляет и возвращает суммарную стоимость всех товаров в корзине
'getCount()' - возвращает количество товаров в корзине
'hasItem(id: string)' - проверяет наличие товара в корзине по его идентификатору

### Слой коммуникации

#### Класс ApiService - слой коммуникации с сервером
Конструктор:
constructor(api: IApi)

Поля класса:
'private api: IApi' - экземпляр API для выполнения запросов

Методы класса: 
'getProducts' - получает с сервера массив всех доступных товаров
'postOrder' - отправляет данные заказа на сервер для оформления покупки

### View

#### Класс Component-Базовый компонент

Тип данных:
data: T

Элементы разметки:
'container: HTMLElement;'

Методы класса: 
'setData(data: T): void' - установка и обновление DOM данных.
'setImage(element: HTMLImageElement, src: string, alt?: string)' void;
'getData(): T' - возвращает текущие данные компонента.
'render(): HTMLElement'

#### Класс Header - компонент header сайта, показывает логотип, корзину и счетчик товаров

Тип данных:
counter:number

Элементы разметки:
'basketButton: HTMLButtonElement' - кнопка корзины
'counterElement: HTMLElement' - счетчик с числом товаров

Методы класса: 
'set counter(value: number)' - обновляет число товаров в корзине

#### Класс - Gallery - контейнер с карточками товаров на главной странице.

Тип данных:
catalog:HTMLElement[] - массив карточек товаров.

Элементы разметки:
'catalogElement: HTMLElement' - контейнер для галереи (.gallery)

Методы класса: 
'set catalog(items: HTMElement[])'

#### Класс Modal - модальное окно

Тип данных:
modalClose: HTMLButtonElement;
modalContent: HTMLElement;

Элементы разметки:
'container: HTMLElement'
'modalClose: HTMLButtonElement'
'modalContent: HTMLElement'

Методы класса: 
set content(items: HTMElement)'

#### Класс Success - cообщение об успешном оформлении заказа

Тип данных:
message: string;

Элементы разметки:
'container: HTMLElement'
'titleElement: HTMLElement'
'descriptionElement: HTMLElement'
'closeButton: HTMLButtonElement'

Методы класса: 
'set message(value: string)'-обновляет текст в descriptionElement.
'render(): HTMLElement'- возвращает готовый DOM элемент для вставки в модальное окно.

#### Класс Card<T> - общий фунционал карточки товара

Тип данных:
product: IProduct;
index?: number;

Элементы разметки:
'container: HTMLButtonElement'
'imageElement: HTMLImageElement'
'categoryElement: HTMLElement'
'titleElement: HTMLElement'
'priceElement: HTMLElement'

Методы класса: 
'setData(product: IProduct, index?: number): void' - Устанавливает общие данные: название, категорию, изображение, цену.
'render(): HTMLElement'

#### Класс CardCatalog - карточка товара

Тип данных:
наследует Card<IProduct>

Методы класса: 
'render(): HTMLButtonElement' - возвращает готовую карточку для вставки в галерею.

#### Класс CardPreview - подробная карточка товара

Тип данных:
наследует Card<IProduct>

Элементы разметки:
'descriptionElement: HTMLElement'
'buttonElement: HTMLButtonElement'

Методы класса: 
'render(): HTMLElement' - возвращает готовую карточку для вставки в галерею.

#### Класс CardBasket - подробная карточка товара

Тип данных:
наследует Card<IProduct>
index: number;

Элементы разметки:
'deleteButton: HTMLButtonElement'

Методы класса: 
'setData(product: IProduct, index: number): void' - устанавливает данные товара (название, цену, изображение, категорию)
'render(): HTMLElement' - возвращает готовую карточку для вставки в галерею.

#### Класс BasketView - модальное окно корзины

Тип данных:
items: CardBasket[]; - массив карточек товаров в корзине.
totalPrice: number;

Элементы разметки:
'container: HTMLElement'
'listElement: HTMLElement'
'checkoutButton: HTMLButtonElement'
'priceElement: HTMLElement'

Методы класса: 
'render(): HTMLElement'
'addItem(item: CardBasket): void'
'removeItem(index: number): void'
'updateTotalPrice(): void'
'clear(): void'

#### Класс Form<T> - общий функционал для всех форм (валидация, блокировка кнопки отправки, обработка ошибок)

Тип данных:
fields: Record<sting, HTMLInputElement>; - обьект поля формы
errors: HTMLElement; - контейнер для вывода сообщений об ошибках
isValid: boolean;

Элементы разметки:
'container: HTMLFormElement' — корневой элемент <form>
'submitButton: HTMLButtonElement' — кнопка отправки
'errorContainer: HTMLElement' - элемент для вывода ошибок

Методы класса: 
'setFieldValue(name: string, value: string): void' - установка значения поля
'getFieldValue(name: string): string' - возвращает текущее значение поля
'setError(message: string): void - отображает текст ошибки в контейнер (errors: HTMLElement)
'clearError(): void'
'set valid(value: boolean)'
'onSubmit(handler: (formData: Record<string, string>) => void): void' - назначает обработчик отправки формы(сбор и отправка данных в handler)

#### Класс FormOrder - форма заказ

Тип данных:
address: string;
paymentMethod: 'online' | 'cash';

Элементы разметки:
'container: HTMLFormElement'
'addressInput: HTMLInputElement'
'onlineButton: HTMLButtonElement'
'cashButton: HTMLButtonElement'
'submitButton: HTMLButtonElement'
'errorContainer: HTMLElement'

Методы класса: 
'selectPaymentMethod(method: 'online' | 'cash'): void'
'validate(): boolean' - проверка всех заполненых полей и обновление кнопки отправки.

#### Класс FormContacts - форма контактных данных

Тип данных:
email: string;
phone: string;

Элементы разметки:
'container: HTMLFormElement' - корневая форма.
'emailInput: HTMLInputElement'
'phoneInput: HTMLInputElement'
'submitButton: HTMLButtonElement'
'errorContainer: HTMLElement'

Методы класса: 
'validateEmail(): boolean'
'validatePhone(): boolean'
'validate(): boolean' - обновление состояния valid

### Реализация классов представления событий

Классы CardCatalog, CardPreview, CardBasket
card:click; - событие клика
interface: {product: IProduct, index?: number};

Класс CardPreview
card:add-to-basket; - событие добавления
interface: {product: IProduct};

Класс CardBasket
card:remove-from-basket; -событие удаления
interface: {index: number};

Класс Header
gallery: basket-click; - событие клика на корзину
Окрытие модального окна корзины.

Класс Gallery
gallery:card-click; - событие клика на карточку в галерее
interface: {product: IProduct};

Класс Modal
modal:close;

modal:open;
interface: {content: HTMLElement};

Класс BasketView
basket:add-item; - событие добавление и обновление карточек в корзину
interface: {item: number};

basket:remove-item - событие удаления карточки из корзины
interface: {index: number};

basket:checkout; - событие открытия форм заказа

Класс FormOrder
form:submit; - событие передачи данных OrderForm.
interface: {
address: { adress:string, paymentMethod: 'online' | 'cash};
form:payment-select; - событие формы на тип оплаты.
form:validation; {isValid: boolean}; - обновление состояния валидации форм.
}

Класс FormContacts
form:submit; - событие передачи данных формы СontactsForm.
interface: { email: string; phone: string }
form:validation; { isValid: boolean }

### Presenter - отвечает за логику взаимодействия между Model, View и API

Catalog
catalog:changed - событие
Получает список товаров из модели Catalog, создаёт карточки (CardCatalog), передаёт их в Gallery для отображения каталога.

Gallery
gallery:card-click - событие
Получает выбранный товар, открывает модальное окно с CardPreview, проверяет наличие товара в корзине для отображения состояния кнопки.

CardPreview
product:toggle - событие
Добавляет или удаляет товар из корзины (Basket) в зависимости от текущего состояния, обновляет счётчик товаров в Header.

Basket
basket:changed - событие
Обновляет отображение корзины, пересчитывает общую стоимость и обновляет счётчик в Header.

Header
basket:open - событие
Открывает модальное окно с содержимым корзины (BasketView).

BasketView
basket:remove - событие
Удаляет товар из корзины (Basket), инициирует обновление корзины.
basket:open (кнопка оформления) - событие
Открывает форму оформления заказа (OrderForm).

FormOrder
form:submit - событие
Сохраняет данные адреса и способ оплаты в модель Buyer, закрывает модальное окно, открывает форму контактов (ContactsForm).

FormContacts
contacts:submit - событие
Проверяет валидность email и телефона, при успехе отправляет заказ на сервер через ApiService.postOrder, очищает корзину (Basket), отображает Success.

FormOrder, FormContacts
order:validated - событие
Переключает доступность кнопки отправки в зависимости от валидности данных.

Modal
Управляет открытием/закрытием модальных окон с различным контентом (CardPreview, BasketView, OrderForm, ContactsForm, Success).


#### Последовательность работы приложения:
 
Инициализация данных
Презентер вызывает loadProducts(), получает список товаров с сервера через ApiService и сохраняет их в модель Catalog. После успешного получения данных вызывается событие catalog:changed.

Отображение каталога
Обработчик catalog:changed получает товары из модели Catalog, для каждого создаёт карточку (CardCatalog) и передаёт их в компонент Gallery для рендера.

Просмотр товара
При клике на карточку срабатывает событие gallery:card-click. Презентер получает объект товара, проверяет наличие в корзине, создаёт экземпляр CardPreview с переданными данными и открывает модальное окно.

Добавление/удаление товара в корзину
При клике на кнопку в CardPreview срабатывает событие product:toggle. Презентер проверяет наличие товара в модели Basket: если товар есть — удаляет, если нет — добавляет. После изменения вызывается событие basket:changed.

Обновление корзины
Обработчик basket:changed создаёт карточки товаров в корзине (CardBasket) на основе актуальных данных из модели Basket, обновляет отображение BasketView и счётчик в Header.

Открытие корзины
При клике на иконку корзины в Header срабатывает событие basket:open. Презентер устанавливает обработчик на кнопку оформления заказа и открывает модальное окно с содержимым корзины (BasketView).

Удаление товара из корзины
При клике на кнопку удаления в CardBasket срабатывает событие basket:remove. Презентер удаляет товар из модели Basket и инициирует событие basket:changed для обновления отображения.

Оформление заказа (шаг 1 — адрес и оплата)
При клике на кнопку оформления в BasketView срабатывает событие order:open. Презентер создаёт форму OrderForm, устанавливает обработчик сабмита и открывает модальное окно с формой.

Оформление заказа (шаг 2 — контакты)
После сабмита OrderForm срабатывает событие order:completed, затем contacts:open. Презентер создаёт форму ContactsForm, устанавливает обработчики валидации и сабмита, открывает модальное окно с формой.

Валидация контактов
При изменении полей в ContactsForm срабатывает событие buyer:fieldChanged, обновляющее данные в модели Buyer. При сабмите формы проверяется валидность email и телефона. В случае ошибок генерируется событие order:validated, которое передаёт ошибки в форму для отображения.

Завершение заказа
При успешной валидации контактов срабатывает событие contacts:submit. Презентер собирает все данные заказа (товары из корзины, адрес, способ оплаты, контакты) и отправляет на сервер через ApiService. После успешной отправки корзина очищается, создаётся компонент Success с сообщением о списании синапсов, открывается модальное окно с успешным оформлением.

Закрытие успешного оформления
При клике на кнопку закрытия в Success срабатывает колбэк, который закрывает модальное окно и плавно прокручивает страницу вверх.

Обработка ошибок загрузки
При ошибке загрузки товаров с сервера в loadProducts() ошибка логируется в консоль для отладки.