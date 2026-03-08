import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export class CardBasket {
  private container: HTMLElement;
  private titleElement: HTMLElement;
  private priceElement: HTMLElement;
  private indexElement: HTMLElement;
  private deleteButton: HTMLButtonElement;
  private events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    this.container = container;
    this.events = events;

    this.titleElement = ensureElement<HTMLElement>(".card__title", container);
    this.priceElement = ensureElement<HTMLElement>(".card__price", container);
    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      container
    );
    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container
    );

    this.deleteButton.addEventListener("click", () => {
      const id = this.container.dataset.id;
      if (id) {
        this.events.emit("basket:remove", { id });
      }
    });
  }

  setData(product: IProduct, index: number) {
    this.container.dataset.id = product.id;
    this.titleElement.textContent = product.title;

    const priceRounded = Math.round(product.price ?? 0);
    this.priceElement.textContent =
      priceRounded < 10000
        ? `${priceRounded} синапсов`
        : `${priceRounded.toLocaleString("ru-RU", {
            maximumFractionDigits: 0,
          })} синапсов`;

    this.indexElement.textContent = (index + 1).toString();
  }

  render(): HTMLElement {
    return this.container;
  }
} 