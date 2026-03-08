import { Form, IFormData } from "./Form";
import { ensureElement } from "../../utils/utils";

export interface IOrderFormData extends IFormData {
  address: string;
  paymentMethod: "online" | "cash" | "";
}

export class OrderForm extends Form<IOrderFormData> {
  protected onlineButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;
  protected selectedPayment: "online" | "cash" | "" = "";

  constructor(container: HTMLFormElement) {
    super(container);

    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      container
    )!;
    this.onlineButton = ensureElement<HTMLButtonElement>(
      '.button[name="card"]',
      container
    )!;
    this.cashButton = ensureElement<HTMLButtonElement>(
      '.button[name="cash"]',
      container
    )!;

    this.onlineButton.addEventListener("click", () => {
      this.selectPaymentMethod("online");
      this.validate();
    });

    this.cashButton.addEventListener("click", () => {
      this.selectPaymentMethod("cash");
      this.validate();
    });

    this.addressInput.addEventListener("input", () => this.validate());
  }

  selectPaymentMethod(method: "online" | "cash"): void {
    this.selectedPayment = method; // сохраняем в внутреннем свойстве
    if (method === "online") {
      this.onlineButton.classList.add("button_alt-active");
      this.cashButton.classList.remove("button_alt-active");
    } else {
      this.cashButton.classList.add("button_alt-active");
      this.onlineButton.classList.remove("button_alt-active");
    }
  }

  validate(): boolean {
    const addressValid = this.getFieldValue("address").trim().length > 0;
    const paymentValid = this.selectedPayment !== "";

    const errors: string[] = [];
    if (!addressValid) errors.push("Введите адрес доставки");
    if (!paymentValid) errors.push("Выберите способ оплаты");

    if (errors.length > 0) {
      this.setError(errors.join(". "));
    } else {
      this.clearError();
    }

    this.valid = addressValid && paymentValid;
    return this.isValid;
  }

  getFieldValue(name: keyof IOrderFormData): string {
    if (name === "paymentMethod") return this.selectedPayment;
    return super.getFieldValue(name);
  }

  setFieldValue(name: keyof IOrderFormData, value: string): void {
    if (name === "paymentMethod") {
      this.selectedPayment = value as "online" | "cash";
    } else {
      super.setFieldValue(name, value);
    }
  }
} 