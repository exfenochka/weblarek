import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class BasketView {
  private listElement: HTMLElement;
  private priceElement: HTMLElement;
  private buttonElement: HTMLButtonElement;
  private events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    this.events = events;

    this.listElement = ensureElement<HTMLElement>(".basket__list", container);
    this.priceElement = ensureElement<HTMLElement>(".basket__price", container);
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".basket__button",
      container
    );

    this.showEmptyState();
  }

  // метод для отображения пустой корзины
  private showEmptyState() {
    this.listElement.innerHTML = `<p class="basket__empty">Корзина пуста</p>`;
    this.priceElement.textContent = "0 синапсов";
    this.buttonElement.disabled = true;
  }

  update(itemsHtml: HTMLElement[], total: number) {
    this.listElement.innerHTML = "";

    if (!itemsHtml || itemsHtml.length === 0) {
      this.showEmptyState();
      return;
    }

    this.buttonElement.disabled = false;
    itemsHtml.forEach((el) => this.listElement.append(el));

    const totalRounded = Math.round(total);
    this.priceElement.textContent =
      totalRounded < 10000
        ? `${totalRounded} синапсов`
        : `${totalRounded.toLocaleString("ru-RU", {
            maximumFractionDigits: 0,
          })} синапсов`;
  }
}