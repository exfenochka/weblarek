import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IGallery {
    catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
    protected catalogElement: HTMLElement;
    private events: IEvents;
    
    constructor (catalogElement: HTMLElement, events: IEvents) {
        super(catalogElement);
        this.catalogElement = catalogElement;
        this.events = events;
    }

    setCatalog(cards: HTMLElement[]) {
        this.catalogElement.replaceChildren(...cards)
    }
   render(data?: Partial<IGallery> | undefined): HTMLElement {
    if (data?.catalog) {
        this.setCatalog(data.catalog);
    }
    return this.catalogElement
   }
}