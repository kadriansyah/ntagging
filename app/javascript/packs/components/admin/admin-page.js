import { html } from '@polymer/polymer/polymer-element.js';
import { BasePage } from '../base-page.js'

class AdminPage extends BasePage {
    static get listTemplate() { 
        return html`<div>Admin Page</div>`;
    }
}
customElements.define('admin-page', AdminPage);