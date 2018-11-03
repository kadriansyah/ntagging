import { html } from '@polymer/polymer/polymer-element.js';
import { BasePage } from '../base-page.js'
import './question-list.js';

class QuestionsPage extends BasePage {
    static get listTemplate() { 
        return html`<question-list data-url="/admin/questions" form-authenticity-token="[[formAuthenticityToken]]"></question-list>`;
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