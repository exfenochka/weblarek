import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IBasket {
	items: HTMLElement[];
	total: number;
}

export class BasketView extends Component<IBasket>{
  private listElement: HTMLElement;
  private priceElement: HTMLElement;
  private buttonElement: HTMLButtonElement;
  private events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.events = events;

    this.listElement = ensureElement<HTMLElement>(
      '.basket__list', 
      this.container
    );

    this.priceElement = ensureElement<HTMLElement>(
      '.basket__price', 
      this.container
    );

    this.buttonElement = ensureElement<HTMLButtonElement>(
      '.basket__button',
      this.container
    );

    this.buttonElement.addEventListener('click', () => {
      this.events.emit('order:open'); 
    })
  }

  set items(elements: HTMLElement[]) {
		this.listElement.replaceChildren(...elements);
	}

	set total(value: number) {
		this.priceElement.textContent = `${value} синапсов`;
	}

  enableOrderButton() {
		this.buttonElement.disabled = false;
	}

	disableOrderButton() {
		this.buttonElement.disabled = true;
	}
}