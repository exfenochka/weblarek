import { ensureElement } from "../../../utils/utils";
import { Card } from './Card';

interface ICardBasketActions {
  onRemove: () => void;
}

export class CardBasket extends Card {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: ICardBasketActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      '.basket__item-index',
      this.container
    );
    
    this.deleteButton = ensureElement<HTMLButtonElement>(
      '.basket__item-delete',
      this.container
    );

    if(actions?.onRemove) {
     this.deleteButton.addEventListener('click', actions.onRemove);
    }
  }
  
  set index(value: number) {
		this.indexElement.textContent = String(value);
	}
} 