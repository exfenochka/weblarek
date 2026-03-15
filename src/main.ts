import "./scss/styles.scss";

import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { ApiService } from './components/Models/ApiService';
import { Catalog } from './components/Models/Catalog';
import { Basket } from './components/Models/Basket';
import { Order } from './components/Models/Order';

import { Gallery } from './components/View/Gallery';
import { Header } from './components/View/Header';
import { Modal } from './components/View/Modal';
import { BasketView } from './components/View/BasketView';
import { Success } from './components/View/Success';
import { CardCatalog } from './components/View/Cards/CardCatalog';
import { CardPreview } from './components/View/Cards/CardPreview';
import { CardBasket } from './components/View/Cards/CardBasket';

import { ContactsForm} from "./components/Forms/FormContacts";
import { OrderForm } from './components/Forms/FormOrder';

import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IOrderRequest, IBuyer, ValidationErrors } from './types';

const events = new EventEmitter();

const catalog = new Catalog(events);
const basket = new Basket(events);
const order = new Order(events);

const api = new Api(API_URL);
const apiService = new ApiService(api);

const headerContainer = ensureElement<HTMLElement>('.header');
const header = new Header(headerContainer, events);

const galleryContainer = ensureElement<HTMLElement>('.gallery');
const gallery = new Gallery(galleryContainer, events);

const modalContainer = ensureElement<HTMLElement>('#modal-container');
const modal = new Modal(events, modalContainer);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const formOrderElement = cloneTemplate<HTMLElement>('#order');
const formOrder = new OrderForm(events, formOrderElement);

const formContactsElement = cloneTemplate<HTMLElement>('#contacts');
const formContacts = new ContactsForm(events, formContactsElement);

const previewContainer = cloneTemplate(cardPreviewTemplate);
const cardPreview = new CardPreview(previewContainer, events);

const basketContainer = cloneTemplate(basketTemplate);
const basketView = new BasketView(basketContainer, events);

const successContainer = cloneTemplate(successTemplate);
const successView = new Success(successContainer, events);

async function loadProducts() {
  try {
    const products = await apiService.getProducts();
    console.log('Загружены товары:', products);
    catalog.setItems(products);
  } catch (err) {
    console.error('Ошибка при получении товаров:', err);
  }
}

// рендер
events.on('catalog:changed', () => {
  const products = catalog.getItems();

  const cards = products.map(product => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), events);
    card.title = product.title;
    card.price = product.price;
    card.category = product.category;
    card.image = { src: CDN_URL + product.image, alt: product.title };

    const cardElement = card.render();
    cardElement.dataset.id = product.id;
    return cardElement;
  });

  gallery.catalog = cards;
});

// открытие
events.on('card:preview', ({ id }: { id: string }) => {
  const product = catalog.getItemById(id);
  if (!product) return;

  cardPreview.title = product.title;
  cardPreview.price = product.price;
  cardPreview.category = product.category;
  cardPreview.description = product.description;
  cardPreview.image = { src: CDN_URL + product.image, alt: product.title };

  const inBasket = basket.hasItem(product.id);
  cardPreview.actionLabel = inBasket ? 'Удалить из корзины' : 'Купить';

  previewContainer.dataset.id = product.id;

  modal.content = previewContainer;
  modal.open();
});

// удаление и добавление
events.on('card:add', ({ id }: { id: string }) => {
  console.log('card:add получен, id =', id);
  const product = catalog.getItemById(id);
  if (!product) return;

  if (basket.hasItem(product.id)) {
    basket.deleteItemById(product.id);
  } else {
    basket.addItem(product);
  }

  header.counter = basket.getCount();
  modal.close();
});

// изменения в корзине
events.on('basket:changed', () => {
  header.counter = basket.getCount();

  const currentProduct = catalog.getPreviewItem();
  if (currentProduct) {
    events.emit('cart:item-changed', {
      id: currentProduct.id,
      inCart: basket.hasItem(currentProduct.id),
    });
  }
});

events.on('basket:cleared', () => {
  header.counter = 0;
  events.emit('basket:changed');
});

// открытие корзины
events.on('basket:open', () => {
  const items = basket.getItems();

  const basketCards = items.map((product, index) => {
    const cardElement = cloneTemplate(cardBasketTemplate);
    cardElement.dataset.id = product.id;

    const cardBasket = new CardBasket(cardElement, events);
    cardBasket.index = index + 1;
    cardBasket.title = product.title;
    cardBasket.price = product.price;

    return cardBasket.render();
  });

  basketView.items = basketCards;
  basketView.total = basket.getTotalPrice();

  if (items.length === 0) {
    basketView.disableOrderButton();
  } else {
    basketView.enableOrderButton();
  }

  modal.content = basketContainer;
  modal.open();
});

//  удаление 
events.on('basket:remove', ({ id }: { id: string }) => {
  basket.deleteItemById(id);
});

// открытие формы (первый шаг)
events.on('order:open', () => {
  const buyer = order.getDataBuyer();
  formOrder.payment = buyer.payment;
  formOrder.address = buyer.address;

  const errors = order.validateInfoBuyer(['payment', 'address']);
  events.emit('order:validated', { errors });

  modal.content = formOrder.render();
  modal.open();
});

// второй шаг формы заказа)
events.on('order:next', () => {
  const buyer = order.getDataBuyer();
  formContacts.email = buyer.email;
  formContacts.phone = buyer.phone;

  const errors = order.validateInfoBuyer(['email', 'phone']);
  events.emit('order:validated', { errors });

  modal.content = formContacts.render();
  modal.open();
});

//form:changed - изменение в форме заказа
events.on('form:changed', (data: { field: keyof IBuyer; value: string }) => {
  if (data.field && data.value !== undefined) {
    order.setDataBuyer({ [data.field]: data.value });
  }
});

events.on('order:validated', ({ errors }: { errors: ValidationErrors }) => {
  // форма заказа (первый шаг)
  const orderErrors = order.validateInfoBuyer(['payment', 'address']);
  const hasOrderErrors = !!(orderErrors.payment || orderErrors.address);
  const orderErrorText = [orderErrors.payment, orderErrors.address].filter(Boolean).join(', ');

  if (hasOrderErrors) {
    formOrder.disableSubmit();
    formOrder.showErrors(orderErrorText);
  } else {
    formOrder.enableSubmit();
    formOrder.clearErrors();
  }

  const contactsErrors = order.validateInfoBuyer(['email', 'phone']);
  const hasContactsErrors = !!(contactsErrors.email || contactsErrors.phone);
  const contactsErrorText = [contactsErrors.email, contactsErrors.phone].filter(Boolean).join(', ');

  if (hasContactsErrors) {
    formContacts.disableSubmit();
    formContacts.showErrors(contactsErrorText);
  } else {
    formContacts.enableSubmit();
    formContacts.clearErrors();
  }
});

// отправка заказа и отображение экрана успеха contacts:submit
events.on('contacts:submit', async () => {
  const errors = order.validateInfoBuyer(['email', 'phone']);
  if (Object.keys(errors).length > 0) return;

  const buyer = order.getDataBuyer();
  const items = basket.getItems().map(item => item.id);
  const total = basket.getTotalPrice();

  if (items.length === 0) return;

  const orderData: IOrderRequest = {
    payment: buyer.payment,
    address: buyer.address,
    email: buyer.email,
    phone: buyer.phone,
    items,
    total,
  };

  try {
    const result = await apiService.postOrder(orderData);

    // const successElement = cloneTemplate(successTemplate);
    // const success = new Success(successElement, events);
    successView.message = result.total;

    modal.content = successContainer;
    modal.open();

    basket.clearItems();
    order.clearInfoBuyer();
  } catch (error) {
    console.error('Ошибка оформления заказа:', error);
  }
});

// закрытие модального окна экрана успеха
events.on('success:close', () => {
  modal.close();
});

loadProducts();