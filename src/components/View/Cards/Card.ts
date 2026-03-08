import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";
import { categoryMap, CDN_URL } from "../../../utils/constants";
import { IEvents } from "../../base/Events";

// базовый класс товара
export class Card<T extends IProduct> {
  protected container: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected index?: number;
  protected productId?: string;
  protected events: IEvents;
  protected _CDN_URL = CDN_URL;

  constructor(container: HTMLElement, events: IEvents) {
    this.container = container;
    this.events = events;

    // находим нужные элементы в DOM
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      container
    );
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      container
    );
    this.titleElement = ensureElement<HTMLElement>(".card__title", container);
    this.priceElement = ensureElement<HTMLElement>(".card__price", container);

    this.imageElement.addEventListener("error", () => {
      console.log("Ошибка загрузки изображения:", this.imageElement.src);
    });
  }

  set image(src: string) {
    const finalSrc = src.startsWith("http")
      ? src
      : `${this._CDN_URL}/${src.replace(/\.[^/.]+$/, ".png")}`;

    this.setImage(
      this.imageElement,
      finalSrc,
      this.titleElement.textContent || ""
    );
  }

  // вспомогательный метод для установки картинки и alt
  protected setImage(imgElement: HTMLImageElement, src: string, alt: string) {
    imgElement.src = src;
    imgElement.alt = alt;
  }

  // метод для установки данных карточки
  setData(product: T, index?: number) {
    this.titleElement.textContent = product.title;
    this.priceElement.textContent = product.price
      ? `${product.price} синапсов`
      : "Бесценно";

    this.image = product.image;
    this.index = index;
    this.productId = product.id;

    const cssClass = categoryMap[product.category];
    if (cssClass) {
      this.categoryElement.className = `card__category ${cssClass}`;
    }
    this.categoryElement.textContent = product.category;
  }

  render(): HTMLElement {
    return this.container;
  }
}