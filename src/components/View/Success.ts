import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface ISuccess {
  message: string;
}

export class Success extends Component<ISuccess> {
  private titleElement: HTMLElement;
  private descriptionElement: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>(
      ".order-success__title",
      container
    );
    this.descriptionElement = ensureElement<HTMLElement>(
      ".order-success__description",
      container
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      container
    );
  }

  set message(value: string) {
    this.descriptionElement.textContent = value;
  }

  render(): HTMLElement {
    return this.container;
  }

  onClose(handler: () => void) {
    this.closeButton.addEventListener("click", handler);
  }
}