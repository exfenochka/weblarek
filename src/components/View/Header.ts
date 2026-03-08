import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter, IEvents } from "../base/Events";

interface IHeader {
  counter: number;
}

export class Header extends Component<IHeader> {
  protected counterElement: HTMLElement;
  protected basketButton: HTMLButtonElement;
  protected events: EventEmitter;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);

    this.events = events;

    this.counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      container
    );
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      container
    );

    // подписка на клик по кнопке корзины
    this.basketButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}