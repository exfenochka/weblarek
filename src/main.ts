import "./scss/styles.scss";

import { Catalog } from "./components/Models/Catalog";
import { Basket } from "./components/Models/Basket";
import { Order } from "./components/Models/Order";

import { Api } from "./components/base/Api";
import { ApiService } from "./components/Models/ApiService";
import { API_URL } from "./utils/constants";

import { EventEmitter } from "./components/base/Events";
import { ensureElement } from "./utils/utils";
import { IProduct, IGalleryCardClick } from "./types";

import { CardBasket } from "./components/View/Cards/CardBasket";
import { CardCatalog } from "./components/View/Cards/CardCatalog";
import { CardPreview } from "./components/View/Cards/CardPreview";
import { ContactsForm, IContactsFormData } from "./components/Forms/FormContacts";
import { OrderForm, IOrderFormData } from "./components/Forms/FormOrder";
import { BasketView } from "./components/View/BasketView";
import { Gallery } from "./components/View/Gallery";
import { Header } from "./components/View/Header";
import { Modal } from "./components/View/Modal";
import { Success } from "./components/View/Success";

// инициализация событий
const events = new EventEmitter();

// API
const api = new Api(API_URL);
const apiService = new ApiService(api);

// модели
const catalog = new Catalog(events);
const basket = new Basket(events);
const buyer = new Order(events);

const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"), events);
const modal = new Modal(events, ensureElement<HTMLElement>("#modal-container"));
const header = new Header(ensureElement<HTMLElement>(".header"), events);

const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const basketContent = basketTemplate.content.firstElementChild!.cloneNode(
  true
) as HTMLElement;
const basketview = new BasketView(basketContent, events);
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");

// загрузка товаров
async function loadProducts() {
  try {
    const products = await apiService.getProducts();
    catalog.setItems(products);
  } catch (err) {
    console.error("Ошибка при получении товаров:", err);
  }
}

// рендер
events.on("catalog:changed", () => {
  const itemsCards = catalog.getItems().map((item, index) => {
    const cardElement =
      cardCatalogTemplate.content.firstElementChild!.cloneNode(
        true
      ) as HTMLElement;
    const card = new CardCatalog(cardElement, events);
    card.setData(item, index);
    return card.render();
  });

  gallery.render({ catalog: itemsCards });
});

events.on("gallery:card-click", ({ product, imageSrc }: IGalleryCardClick) => {
  const template = ensureElement<HTMLTemplateElement>("#card-preview");
  const content = template.content.firstElementChild!.cloneNode(
    true
  ) as HTMLElement;
  const cardPreview = new CardPreview(content, events);

  const inCart = basket.hasItem(product.id);
  cardPreview.setData({ ...product, image: imageSrc, inCart });

  modal.open(content);
});

// добавление/удаление товара из корзины
events.on("product:toggle", ({ id }: { id: string }) => {
  if (basket.hasItem(id)) basket.deleteItemById(id);
  else {
    const product = catalog.getItems().find((p) => p.id === id);
    if (product) basket.addItem(product);
  }
});

// обновление корзины
events.on("basket:changed", ({ items }: { items?: IProduct[] } = {}) => {
  const basketItems = items || basket.getItems();
  const basketItemsHtml = basketItems.map((item, index) => {
    const template = ensureElement<HTMLTemplateElement>("#card-basket");
    const node = template.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement;
    const card = new CardBasket(node, events);
    card.setData(item, index);
    return card.render();
  });

  basketview.update(basketItemsHtml, basket.getTotalPrice());
  header.counter = basket.getCount();
});

// открытие корзины
events.on("basket:open", () => {
  const basketButton =
    basketContent.querySelector<HTMLButtonElement>(".basket__button")!;
    basketButton.onclick = () => events.emit("order:open");

  modal.open(basketContent);
});

// удаление товара из корзины
events.on("basket:remove", ({ id }: { id: string }) => {
  basket.deleteItemById(id);
  events.emit("basket:changed", { items: basket.getItems() });
});

// форма заказа
events.on("order:open", () => {
  const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
  const orderContent = orderTemplate.content.firstElementChild!.cloneNode(
    true
  ) as HTMLFormElement;
  const orderForm = new OrderForm(orderContent);

  orderForm.onSubmit((formData: IOrderFormData) => {
    modal.close();
    events.emit("order:completed", { orderData: formData });
    events.emit("contacts:open");
  });

  modal.open(orderContent);
});

// форма контактов
events.on("contacts:open", () => {
  const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
  const contactsContent = contactsTemplate.content.firstElementChild!.cloneNode(
    true
  ) as HTMLFormElement;
  const contactsForm = new ContactsForm(contactsContent, events);

  contactsForm.onSubmit();

  events.on(
    "order:validated",
    ({ errors }: { errors: Record<string, string> }) => {
      contactsForm.setValidationErrors(errors);
    }
  );
  modal.open(contactsContent);
});

// валидация
events.on(
  "buyer:fieldChanged",
  ({ formData }: { formData: { email: string; phone: string } }) => {
    buyer.setDataBuyer(formData);
  }
);

// сабмит формы
events.on(
  "contacts:submit",
  ({ formData }: { formData: IContactsFormData }) => {
    const errors: Record<string, string> = {};

    if (!formData.email.includes("@")) errors.email = "Неверный email";
    if (!formData.phone.match(/^\+?\d{10,15}$/))
      errors.phone = "Неверный телефон";

    events.emit("order:validated", { errors });

    if (Object.keys(errors).length === 0) {
      const total = basket.getTotalPrice();
      const successTemplate = ensureElement<HTMLTemplateElement>("#success");
      const successContent =
        successTemplate.content.firstElementChild!.cloneNode(
          true
        ) as HTMLElement;
      const success = new Success(successContent, events);

      success.message = `Списано ${total} синапсов`;

      basket.clearItems();
      events.emit("basket:changed", { items: basket.getItems() });

      success.onClose(() => {
        modal.close();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      modal.open(success.render());
    }
  }
);

loadProducts();