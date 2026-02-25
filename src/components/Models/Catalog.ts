//КАТАЛОГ
import { IProduct } from '../../types';

export class Catalog {
    private items: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

    // загружает каталог
    setItems(items: IProduct[]): void {
        this.items = items;
    }
    
    // возвращает весь массив
    getItems(): IProduct[] {
        return this.items;
    }

    // возвращает товар по id
    getItemById(id: string): IProduct | undefined {
        return this.items.find((item) => item.id === id);
    }

    // сохраняет выбранный товар для подробного отображения
    setPreviewItem(item: IProduct): void {
        this.selectedProduct = item;
    }

    // возвращает выбранный товар для подробного просмотра
    getPreviewItem(): IProduct | null {
        return this.selectedProduct;
    }
}