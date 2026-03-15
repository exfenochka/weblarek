import { IBuyer, TPayment, ValidationErrors } from '../../types';
import { IEvents } from "../base/Events";

export class Order {
    private payment: TPayment = '';
    private address: string = '';
    private email: string = '';
    private phone: string = '';

    constructor(protected events: IEvents) {}

    setDataBuyer(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) {
            this.payment = data.payment;
        }
        if (data.address !== undefined) {
            this.address = data.address;
        }
        if (data.email !== undefined) {
            this.email = data.email;
        }
        if (data.phone !== undefined) {
            this.phone = data.phone;
        }
        
        const errors = this.validateInfoBuyer();
        this.events.emit('order:validated', { errors });
    }

    // возвращает все текущие данные покупателя
    getDataBuyer(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            email: this.email,
            phone: this.phone,
        };
    }

    // очищает все данные покупателя
    clearInfoBuyer(): void {
        this.payment = '';
        this.address = '';
        this.email = '';
        this.phone = '';
        
        const errors = this.validateInfoBuyer();
        this.events.emit('order:validated', { errors });
    }

    // приватный метод для получения значения по ключу
    private getValueByKey(key: keyof IBuyer): string | TPayment {
        switch (key) {
            case 'payment': return this.payment;
            case 'address': return this.address;
            case 'email': return this.email;
            case 'phone': return this.phone;
        }
    }

    // валидирует поля; если fields не задан, проверяет все
    validateInfoBuyer(fields?: Array<keyof IBuyer>): ValidationErrors {
        const toCheck = fields && fields.length > 0
            ? fields
            : (['payment', 'address', 'email', 'phone'] as Array<keyof IBuyer>);
        
        const errors: ValidationErrors = {};

        for (const key of toCheck) {
            const value = this.getValueByKey(key);
            
            if (value === undefined || value === null || String(value).trim() === '') {
                switch (key) {
                    case 'payment':
                        errors.payment = 'Выберите способ оплаты';
                        break;
                    case 'address':
                        errors.address = 'Необходимо ввести адрес';
                        break;
                    case 'email':
                        errors.email = 'Введите email';
                        break;
                    case 'phone':
                        errors.phone = 'Введите телефон';
                        break;
                }
            }
        }

        return errors;
    }
}