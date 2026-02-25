//КОРЗИНА
import { IProduct } from '../../types';

export class Basket {
    private items: IProduct[] = [];

    // возвращает массив товаров в корзине
    getItems(): IProduct[] {
        return this.items;
    }

    // добавляет товар в корзину
    addItem(item: IProduct): void {
        this.items.push(item);
    }

    // удаляет товар из корзины по объекту
    deleteItemById(id: string): void {
        this.items = this.items.filter(product => product.id !== id);
    }

    // очищает корзину
    clearItems(): void {
        this.items = [];
    }

    // возвращает суммарную стоимость товаров
    getTotalPrice(): number {
        return this.items.reduce((sum, p) => sum + (typeof p.price === 'number' ? p.price : 0), 0);
    }

    // возвращает количество товаров в корзине
    getCount(): number {
        return this.items.length;
    }

    // проверяет наличие товара в корзине
    hasItem(id: string): boolean {
        return this.items.some(product => product.id === id);
    }
}
