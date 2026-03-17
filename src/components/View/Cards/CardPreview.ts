import { Card } from "./Card";
import { ensureElement } from "../../../utils/utils";

interface ICardPreviewActions {
	onAction: () => void;
}

export class CardPreview extends Card {
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, actions: ICardPreviewActions) {
    super(container);

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

	if(actions?.onAction) {
		this.buttonElement.addEventListener('click', actions.onAction);
		}
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