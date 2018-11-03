import { html } from '@polymer/polymer/polymer-element.js';
import { BasePage } from '../base-page.js'

class GroupsPage extends BasePage {
    static get listTemplate() { 
        return html`<div>Groups Page</div>`;
    }

    constructor() {
        super();
    }

    ready() {
        super.ready();
        this.title = 'Groups';
        this.$.access_menu.selected = '0';
    }

    _openUrl(e) {
        var path = this.$.location.path.split('/');
        path[path.length - 1] = e.target.id;

        this.$.location.path = path.join('/');
        window.location.reload(true);
    }
}
customElements.define('groups-page', GroupsPage);
