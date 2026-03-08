export interface IFormData {
    [key: string]: string;   
}

export class Form<T extends IFormData> {
protected container: HTMLFormElement;
protected fields: Record<keyof T, HTMLInputElement>;
protected submitButton: HTMLButtonElement;
protected errorContainer: HTMLElement;
protected isValid = false;

constructor(container: HTMLFormElement) {
    this.container = container;

    this.fields = Array.from(container.querySelectorAll<HTMLInputElement>('input'))
    .reduce((acc, input) => {
        acc[input.name as keyof T] = input;
        return acc;
    }, {} as Record<keyof T, HTMLInputElement>)

    this.submitButton = container.querySelector<HTMLButtonElement>('button[type="submit"]')!;

    this.errorContainer = container.querySelector<HTMLElement>('.form__errors')!;
    }

    // устанавливаем значение поля по имени
   setFieldValue(name: keyof T, value: string): void {
        const field = this.fields[name];
        if (field) {
            field.value = value;
        }
    }

    // получаем текущее значение поля по имени
    getFieldValue(name: keyof T): string {
        return this.fields[name]?.value ?? ''; 
    }

    setError(message: string): void {
        this.errorContainer.textContent = message; 
    }

    clearError(): void {
        this.errorContainer.textContent = '';
    }
    
    set valid(value: boolean) {
        this.isValid = value;
        if (this.submitButton) {
            this.submitButton.disabled = !value;
}
}

    onSubmit(handler: (formData: T) => void): void {
        this.container.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = {} as T;
            for (const key in this.fields) {
                formData[key as keyof T] = this.fields[key as keyof T].value as T[keyof T];
            }

            handler(formData);
        })
    }
}