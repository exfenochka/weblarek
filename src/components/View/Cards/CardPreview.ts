import { Card } from "./Card";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export class CardPreview extends Card {
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container, events);

    this.descriptionElement = ensureElement<HTMLElement>(
       '.card__text',
       this.container
    );

    this.categoryElement = ensureElement<HTMLElement>(
		'.card__category',
		this.container
	);

	this.imageElement = ensureElement<HTMLImageElement>(
		'.card__image',
		this.container
	);

    this.buttonElement = ensureElement<HTMLButtonElement>(
		'.card__button',
		this.container
	);

    this.buttonElement.addEventListener('click', () => {
		this.events.emit('card:add', { id: this.container.dataset.id });
	});

    this.events.on(
	'cart:item-changed',
	({ id, inCart }: { id: string; inCart: boolean }) => {
		if (this.container.dataset.id !== id) return;
		this.actionLabel = inCart ? 'Удалить из корзины' : 'Купить';
	});
  }

  set category(value: string) {
	this.categoryElement.textContent = value;
	}

  set image({ src, alt }: { src: string; alt?: string }) {
	this.imageElement.src = src;
	if (alt) this.imageElement.alt = alt;
	}

  set description(value: string) {
	this.descriptionElement.textContent = value;
	}

  set price(value: number | null) {
		super.price = value;

		if (value === null) {
			this.buttonElement.disabled = true;
			this.buttonElement.textContent = 'Недоступно';
		} else {
			this.buttonElement.disabled = false;
			this.buttonElement.textContent = 'Купить';
		}
	}

  set actionLabel(value: string) {
		this.buttonElement.textContent = value;
	}
}