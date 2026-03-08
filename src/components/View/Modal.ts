import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Modal extends Component<{}> {
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container)
        this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container)

        this.closeButton.addEventListener('click', () => this.close());

        // закрытие по клику
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) this.close();
        });
    }

    // метод принимает готовый HTMLElement с контентом
    open(content?: HTMLElement) {
        if (content)
        this.contentElement.replaceChildren(content);
    
    this.container.classList.add('modal_active');
    document.body.style.overflow = "hidden";
    }

    close() {
        this.container.classList.remove('modal_active');
        document.body.style.overflow = "auto";
        this.events.emit('modal:close');
    }
    render(): HTMLElement {
        return this.container
    }
}