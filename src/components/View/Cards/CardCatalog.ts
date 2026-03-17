import { Card } from "./Card";
import { ensureElement } from '../../../utils/utils';
import { categoryMap } from '../../../utils/constants';

interface ICardCatalogActions {
	onClick: () => void;
}
  
export class CardCatalog extends Card {
  	protected categoryElement: HTMLElement;
  	protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, actions: ICardCatalogActions) {
		super(container);

		this.categoryElement = ensureElement<HTMLElement>(
			'.card__category',
			this.container
		);

		this.imageElement = ensureElement<HTMLImageElement>(
			'.card__image',
			this.container
		);

		if(actions?.onClick) {
			container.addEventListener('click', actions.onClick);
		}
  	}

  	set image({ src, alt }: { src: string; alt?: string }) {
    	this.imageElement.src = src;
    	if (alt) this.imageElement.alt = alt;
  	}

  set category(value: string) {
		this.categoryElement.textContent = value;

		Object.values(categoryMap).forEach(mod =>
			this.categoryElement.classList.remove(mod)
		);

		this.categoryElement.classList.add('card__category');

		const modifier = categoryMap[value as keyof typeof categoryMap];

		if (modifier) {
			this.categoryElement.classList.add(modifier);
		}
	}
}