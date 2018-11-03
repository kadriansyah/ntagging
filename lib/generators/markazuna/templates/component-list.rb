import { html } from '@polymer/polymer/polymer-element.js';
import { BaseList } from './base-list.js'

import './markazuna/markazuna-circular-pager.js';
import './<%= singular_name %>-form.js';

class <%= singular_name.capitalize %>List extends BaseList {
    static get listTemplate() {
        return html`
            <div class="flex grid-container" width="100%">
                <vaadin-grid theme="row-stripes" aria-label="Users" items="[[data]]">
                    <%
                    @fields.each_with_index do |field, index|
                        if index > 0
                    %>
                    <vaadin-grid-column width="20%" flex-grow="0">
                        <template class="header"><%= field.capitalize %></template>
                        <template>[[item.<%= field %>]]</template>
                    </vaadin-grid-column>
                    <%
                        end
                    end
                    %>
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
                <markazuna-circular-pager page="[[page]]" count="[[count]]" range="10" url="<%= @url %>?page=#{page}"></markazuna-circular-pager>
            </div>
        `;
    }

    static get formTemplate() { 
        return html`
            <<%= singular_name %>-form action-url="[[dataUrl]]" form-authenticity-token="[[formAuthenticityToken]]" id="formData"></<%= singular_name %>-form>
        `;
    }

    constructor() {
        super();
    }

    ready() {
        super.ready();
    }

    _formTitleNew() {
        return 'Create New #{<%= singular_name.capitalize %>}';
    }

    _formTitleEdit() {
        return 'Edit #{<%= singular_name.capitalize %>';
    }

    _formTitleCopy() {
        return 'Copy #{<%= singular_name.capitalize %>';
    }
}
customElements.define('<%= singular_name %>-list', <%= singular_name.capitalize %>List);