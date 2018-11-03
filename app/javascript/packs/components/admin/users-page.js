import { html } from '@polymer/polymer/polymer-element.js';
import { BasePage } from '../base-page.js'
import './user-list.js';

class UsersPage extends BasePage {
    static get listTemplate() { 
        return html`<user-list data-url="/admin/users" form-authenticity-token="[[formAuthenticityToken]]"></user-list>`;
    }

    constructor() {
        super();
    }

    ready() {
        super.ready();
        this.title = 'Users';
        this.$.access_menu.selected = '1';
    }

    _openUrl(e) {
        var path = this.$.location.path.split('/');
        path[path.length - 1] = e.target.id;

        this.$.location.path = path.join('/');
        window.location.reload(true);
    }
}
customElements.define('users-page', UsersPage);