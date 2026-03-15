import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModal {
	content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.closeButton = ensureElement<HTMLButtonElement>(
            '.modal__close',
            this.container
        );

        this.contentElement = ensureElement<HTMLElement>(
            '.modal__content', 
            this.container
        );

        this.closeButton.addEventListener('click', () => this.close());
    }

    set content(element: HTMLElement) {
		this.contentElement.replaceChildren(element);
	}

    // метод принимает готовый HTMLElement с контентом
    open(content?: HTMLElement) {
        if (content)
        this.contentElement.replaceChildren(content);
    
    this.container.classList.add('modal_active');
    }

    close() {
        this.container.classList.remove('modal_active');
        document.body.style.overflow = "auto";
    }
}