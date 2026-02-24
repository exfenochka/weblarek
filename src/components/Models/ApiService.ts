import { IApi, IProduct, IOrderResponse, IOrderRequest, IOrderResult } from "../../types";

export class ApiService {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    // метод получения массива товаров с сервера
    async getProducts(): Promise<IProduct[]> {
        const response = await this.api.get<IOrderResponse>("/product/");
        return response.items;
    }
    
    // метод  отправки данных заказа на сервер
    async postOrder(orderData: IOrderRequest): Promise<IOrderResult> {
        const response = await this.api.post<IOrderResult>("/order/", orderData);
        return response;
    }
}