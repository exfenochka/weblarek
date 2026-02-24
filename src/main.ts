import './scss/styles.scss';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { ApiService } from './components/Models/ApiService';
import { apiProducts } from './utils/data';

import { Catalog } from './components/Models/Catalog';
import { Basket } from './components/Models/Basket';
import { Order } from './components/Models/Order';

// ========== ТЕСТИРОВАНИЕ КЛАССА CATALOG ==========

const productsModel = new Catalog();

productsModel.setItems(apiProducts.items);
console.log('Каталог товаров: ', productsModel.getItems());

const existingId = apiProducts.items[0]?.id;
if (existingId) {
    console.log('Поиск по id', productsModel.getItemById(existingId));
}
console.log('Поиск по несуществующему id:', productsModel.getItemById('несуществующий id'));

productsModel.setItem(apiProducts.items[2]);
console.log('Товар для подробного отображения:', productsModel.getItem());

// ========== ТЕСТИРОВАНИЕ КЛАССА BASKET ==========

const basketModel = new Basket();

basketModel.addItems(apiProducts.items[0]);
basketModel.addItems(apiProducts.items[1]);
basketModel.addItems(apiProducts.items[2]);
console.log('После добавления 3 товаров:', basketModel.getItems());
console.log('Количество:', basketModel.getCount());
console.log('Общая стоимость:', basketModel.getTotalPrice());
console.log('hasItem (существующий):', basketModel.hasItem(apiProducts.items[0].id));
console.log('hasItem (несуществующий):', basketModel.hasItem('несуществующий id'));

const itemIdToDelete = apiProducts.items[1].id;
basketModel.deleteItemById(itemIdToDelete);
console.log('После удаления товара по ID:', basketModel.getItems());

basketModel.clearItems();
console.log('После очистки:', basketModel.getItems());

console.log('Тест товара без цены:');
const productWithoutPrice = { ...apiProducts.items[0], price: null };
basketModel.addItems(productWithoutPrice);

// ========== ТЕСТИРОВАНИЕ КЛАССА ORDER ==========

const orderModel = new Order();

orderModel.setDataBuyer({ payment: 'cash' });
console.log('Данные о покупателе (частичные, только payment): ', orderModel.getDataBuyer());
console.log('Валидация (должна показать ошибки):', orderModel.validateInfoBuyer());

orderModel.clearInfoBuyer();
console.log('Данные после очистки: ', orderModel.getDataBuyer());

orderModel.setDataBuyer({
    payment: 'cash',
    address: 'Pushkina st.',
    email: 'ivanov@example.com',
    phone: '+71234567890'
});
console.log('Данные о покупателе: ', orderModel.getDataBuyer());
console.log('Валидация полных данных (без ошибок):', orderModel.validateInfoBuyer());
console.log('Валидация только email и phone:', orderModel.validateInfoBuyer(['email', 'phone']));

orderModel.setDataBuyer({ payment: 'card' });
console.log('Смена способа оплаты на card:', orderModel.getDataBuyer());

// ========== ТЕСТИРОВАНИЕ API ==========

const api = new Api(API_URL);
const apiService = new ApiService(api);

async function testApiService() {
    try {
    const products = await apiService.getProducts();
    console.log('Товары с сервера:', products);

    productsModel.setItems(products);
    console.log('Товары в модели после сохранения:', productsModel.getItems());
    
    if (products.length >= 2) {
        const orderResponse = await apiService.postOrder({
            payment: 'card',
            email: 'test@test.ru',
            phone: '+7147758890',
            address: 'Pushkina st.',
            total: products.slice(0, 2).reduce((sum, item) => sum + (item.price || 0), 0),
            items: products.slice(0, 2).map(item => item.id)
        })
        console.log('Ответ на заказ:', orderResponse);
    }
    
    }catch (error) {
        console.error('Ошибка:', error instanceof Error ? error.message : error);
    }
}

testApiService();