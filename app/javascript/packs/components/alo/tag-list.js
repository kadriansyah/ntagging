import { html } from '@polymer/polymer/polymer-element.js';
import { BaseList } from '../base-list.js'

import '../markazuna/markazuna-circular-pager.js';
import './tag-form.js';

class TagList extends BaseList {
    static get listTemplate() { 
        return html`
            <div class="flex grid-container" width="100%">
                <vaadin-grid theme="row-stripes" aria-label="Tags" items="[[data]]">
                
                    <vaadin-grid-column width="40%" flex-grow="0">
                        <template class="header">Name</template>
                        <template>[[item.name]]</template>
                    </vaadin-grid-column>
                    
                    <vaadin-grid-column width="20%" flex-grow="0">
                        <template class="header">Value</template>
                        <template>[[item.value]]</template>
                    </vaadin-grid-column>

                    <vaadin-grid-column width="20%" flex-grow="0">
                        <template class="header">CSS</template>
                        <template>[[item.css]]</template>
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
                <markazuna-circular-pager page="[[page]]" count="[[count]]" range="10" url="/admin/tags?page=#{page}"></markazuna-circular-pager>
            </div>
        `;
    }

    static get formTemplate() { 
        return html`
            <tag-form action-url="[[dataUrl]]" form-authenticity-token="[[formAuthenticityToken]]" id="formData"></tag-form>
        `;
    }

    constructor() {
        super();
    }

    ready() {
        super.ready();
    }

    _formTitleNew() {
        return 'Create New Tag';
    }

    _formTitleEdit() {
        return 'Edit Tag';
    }

    _formTitleCopy() {
        return 'Copy Tag';
    }
}
customElements.define('tag-list', TagList);