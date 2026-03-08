import { Form, IFormData } from "./Form";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export interface IContactsFormData extends IFormData {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;
  protected submitButton: HTMLButtonElement;

  constructor(container: HTMLFormElement, private events: IEvents) {
    super(container);

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      container
    )!;
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      container
    )!;
    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      container
    )!;

    const emitFieldChanged = () => {
      this.events.emit("buyer:fieldChanged", {
        formData: {
          email: this.emailInput.value,
          phone: this.phoneInput.value,
        },
      });
    };

    this.emailInput.addEventListener("input", emitFieldChanged);
    this.phoneInput.addEventListener("input", emitFieldChanged);

    this.submitButton.disabled = true;
  }

    // обновляет состояние формы и отображает ошибки
    public setValidationErrors(errors: Record<string, string>) {
        if (errors.email)  {this.setError(errors.email);
        } else if (errors.phone) {this.setError(errors.phone);
        } else { this.clearError();
    }

        const hasErrors = Boolean(errors.email || errors.phone);
        this.valid = !hasErrors;
        this.submitButton.disabled = hasErrors;
      }

 public onSubmit() {
    this.container.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData: IContactsFormData = {
        email: this.emailInput.value,
        phone: this.phoneInput.value,
      };

      this.events.emit("contacts:submit", { formData });
    });
  }
}