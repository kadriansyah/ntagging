import { html } from '@polymer/polymer/polymer-element.js';
import { BasePage } from '../base-page.js'
import './<%= singular_name %>-list.js';

class <%= plural_name.capitalize %>Page extends BasePage {
    static get listTemplate() { 
        return html`<<%= singular_name %>-list data-url="<%= @url %>" form-authenticity-token="[[formAuthenticityToken]]"></<%= singular_name %>-list>`;
    }

    constructor() {
        super();
    }

    ready() {
        super.ready();
        this.title = '<%= plural_name.capitalize %>';
    }

    _openUrl(e) {
        var path = this.$.location.path.split('/');
        path[path.length - 1] = e.target.id;

        this.$.location.path = path.join('/');
        window.location.reload(true);
    }
}
customElements.define('<%= plural_name %>-page', <%= plural_name.capitalize %>Page);