import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IGallery {
    catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
    protected catalogElement: HTMLElement;
    
    constructor (catalogElement: HTMLElement, protected events: IEvents) {
        super(catalogElement);

        this.catalogElement = catalogElement;
        this.events = events;
    }

    set catalog(cards: HTMLElement[]) {
        this.catalogElement.replaceChildren(...cards)
    }
}