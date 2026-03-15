import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface IForm {
    valid: boolean;
	errors: string;
}

export class Form extends Component<IForm> {
    protected submitButton: HTMLButtonElement;
    protected errorContainer: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.submitButton = ensureElement<HTMLButtonElement>(
            'button[type="submit"]',
            this.container
        );

        this.errorContainer = ensureElement<HTMLElement>(
            '.form__errors',
            this.container
        );

        this.container.addEventListener('input', () => {
			this.events.emit('form:changed', { field: null, value: null });
		});
    }

	enableSubmit() {
		this.submitButton.disabled = false;
	}

	disableSubmit() {
		this.submitButton.disabled = true;
	}

	showErrors(message: string) {
		this.errorContainer.textContent = message;
	}

	clearErrors() {
		this.errorContainer.textContent = '';
	}
}