import { Card } from "./Card";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export class CardPreview extends Card<IProduct> {
  private descriptionElement: HTMLElement;
  private buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      container
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      container
    );
  }

  // установка данных
  setData(product: IProduct & { inCart?: boolean }, index?: number) {
    super.setData(product, index);
    this.descriptionElement.textContent = product.description;

    this.updateButton(product);

    this.events.on("basket:changed", ({ items }: { items: IProduct[] }) => { //
      product.inCart = items.some((i) => i.id === product.id);
      this.updateButton(product);
    });

    this.buttonElement.onclick = () => {
      if (!product.price) return;

      this.events.emit("product:toggle", { id: product.id });
      this.events.emit("modal:close");
    };
  }

  private updateButton(product: IProduct & { inCart?: boolean }) {
    if (!product.price) {
      this.buttonElement.textContent = "Недоступно";
      this.buttonElement.disabled = true;
    } else if (product.inCart) {
      this.buttonElement.textContent = product.inCart
        ? "Удалить из корзины"
        : "Купить";
      this.buttonElement.disabled = false;
    } else {
      this.buttonElement.textContent = "Купить";
      this.buttonElement.disabled = false;
    }
  }
}