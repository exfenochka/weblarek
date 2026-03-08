import { Card } from "./Card";
import { IProduct } from "../../../types";
import { IEvents } from "../../base/Events";

export class CardCatalog extends Card<IProduct> {
  private productData!: IProduct;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.container.addEventListener("click", () => {
      if (!this.productData) return;

      this.events.emit("gallery:card-click", {
        product: this.productData,
        imageSrc: this.imageElement.src,
      });
    });
  }

  setData(product: IProduct, index?: number) {
    super.setData(product, index);
    this.productData = product;
  }
}
