import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import { BasePage } from '../base-page.js'

class QuestionsPage extends BasePage {
    static get listTemplate() { 
        return html`<div>Questions Page</div>`;
    }

    constructor() {
        super();
    }

    ready() {
        super.ready();
        this.title = 'Questions';
        this.$.main_menu.selected = '0';
    }

    _openUrl(e) {
        var path = this.$.location.path.split('/');
        path[path.length - 1] = e.target.id;

        this.$.location.path = path.join('/');
        window.location.reload(true);
    }
}
customElements.define('questions-page', QuestionsPage);