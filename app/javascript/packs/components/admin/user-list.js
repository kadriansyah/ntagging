import { html } from '@polymer/polymer/polymer-element.js';
import { BaseList } from '../base-list.js'

import '../moslemcorner/markazuna-circular-pager.js';
import './user-form.js';

class UserList extends BaseList {
    static get listTemplate() { 
        return html`
            <div class="flex grid-container" width="100%">
                <vaadin-grid theme="row-stripes" aria-label="Users" items="[[data]]">
                    <vaadin-grid-column width="20%" flex-grow="0">
                        <template class="header">Email</template>
                        <template>[[item.email]]</template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="20%" flex-grow="0">
                        <template class="header">Username</template>
                        <template>[[item.username]]</template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="20%" flex-grow="0">
                        <template class="header">First Name</template>
                        <template>[[item.firstname]]</template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="20%" flex-grow="0">
                        <template class="header">Last Name</template>
                        <template>[[item.lastname]]</template>
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
                <markazuna-circular-pager page="[[page]]" count="[[count]]" range="10" url="/admin/users?page=#{page}"></markazuna-circular-pager>
            </div>
        `;
    }

    static get formTemplate() { 
        return html`
            <user-form action-url="[[dataUrl]]" form-authenticity-token="[[formAuthenticityToken]]" id="formData"></user-form>
        `;
    }

    constructor() {
        super();
    }

    ready() {
        super.ready();
    }

    _formTitleNew() {
        return 'Create New User';
    }

    _formTitleEdit() {
        return 'Edit User';
    }

    _formTitleCopy() {
        return 'Copy User';
    }
}
customElements.define('user-list', UserList);