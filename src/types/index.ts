export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// интерфейс товара
export interface IProduct {
    id: string;            // уникальный идентификатор товара
    description: string;   // описание товара
    image: string;         // ссылка на изображение товара
    title: string;         // название товара
    category: string;      // категория товара
    price: number | null;  // цена товара
}

// типы оплаты
export type TPayment = 'card' | 'cash' | '';

// интерфейс покупателя
export interface IBuyer {
    payment: TPayment;  // выбранный способ оплаты
    email: string;      // еmail покупателя
    phone: string;      // телефон покупателя
    address: string;    // адрес доставки
}

// интерфейс для ответа от сервера со списком товаров
export interface IOrderResponse {
    items: IProduct[];
    total: number;
}

// данные заказа для отправки на сервер
export interface IOrderRequest {
    payment: TPayment;
    address: string;
    email: string;
    total: number;
    phone: string;
    items: string[]; // массив id товаров
}

// ответ от сервера при успешном заказе
export interface IOrderResult {
    id: string;        // id заказа, присвоенный сервером
    total: number;     // итоговая сумма заказа
}