import { html } from '@polymer/polymer/polymer-element.js';
import { BasePage } from '../base-page.js'
import './tag-list.js';

class TagsPage extends BasePage {
    static get listTemplate() { 
        return html`<tag-list data-url="/admin/tags" form-authenticity-token="[[formAuthenticityToken]]"></tag-list>`;
    }

    constructor() {
        super();
    }

    ready() {
        super.ready();
        this.title = 'Tags';
        this.$.main_menu.selected = '1';
    }

    _openUrl(e) {
        var path = this.$.location.path.split('/');
        path[path.length - 1] = e.target.id;

        this.$.location.path = path.join('/');
        window.location.reload(true);
    }
}
customElements.define('tags-page', TagsPage);