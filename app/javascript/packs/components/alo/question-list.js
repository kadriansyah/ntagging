import { html } from '@polymer/polymer/polymer-element.js';
import { BaseList } from '../base-list.js'

import '../markazuna/markazuna-circular-pager.js';
import './question-form.js';

class QuestionList extends BaseList {
    static get listTemplate() { 
        return html`
            <div class="flex grid-container" width="100%">
                <vaadin-grid theme="row-stripes" aria-label="Questions" items="[[data]]">
                    
                    <vaadin-grid-column width="40%" flex-grow="0">
                        <template class="header">Title</template>
                        <template>[[item.title]]</template>
                    </vaadin-grid-column>
                    
                    <vaadin-grid-column width="40%" flex-grow="0">
                        <template class="header">Question</template>
                        <template>[[item.question_text]]</template>
                    </vaadin-grid-column>
                    
                    <vaadin-grid-column width="20%" flex-grow="0">
                        <template class="header"><div class="grid-header">Actions</div></template>
                        <template>
                            <div class="grid-header">
                                <iron-icon icon="icons:create" on-tap="_edit" id="[[item.id]]"></iron-icon>
                                <iron-icon icon="icons:delete" on-tap="_confirmation" id="[[item.id]]"></iron-icon>
                                <iron-icon icon="icons:content-copy" on-tap="_copy" id="[[item.id]]"></iron-icon>
                            </div>
                        </template>
                    </vaadin-grid-column>
                </vaadin-grid>
            </div>
            <div class="flex" width="100%">
                <markazuna-circular-pager page="[[page]]" count="[[count]]" range="10" url="/admin/questions?page=#{page}"></markazuna-circular-pager>
            </div>
        `;
    }

    static get formTemplate() { 
        return html`
            <question-form action-url="[[dataUrl]]" form-authenticity-token="[[formAuthenticityToken]]" id="formData"></question-form>
        `;
    }

    constructor() {
        super();
    }

    ready() {
        super.ready();
    }

    _formTitleNew() {
        return 'Create New Question';
    }

    _formTitleEdit() {
        return 'Edit Question';
    }

    _formTitleCopy() {
        return 'Copy Question';
    }
}
customElements.define('question-list', QuestionList);