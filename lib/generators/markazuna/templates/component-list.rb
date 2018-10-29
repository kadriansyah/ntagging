import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-list/iron-list.js';
import '@polymer/iron-scroll-threshold/iron-scroll-threshold.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-fab/paper-fab.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-column.js';

import './moslemcorner/markazuna-circular-pager.js';
import './moslemcorner/moslemcorner-shared-styles.js';
import './<%= singular_name %>-form.js';

class <%= singular_name.capitalize %>List extends PolymerElement {
    static get template() {
        return html`
            <style include="shared-styles">
                :host {
                    display: block;
                }
                vaadin-grid {
                    --card-margin: 5px 24px 24px 24px;
                    height: 800px;
                }
                iron-icon {
                    padding-left: 10px;
                    padding-right: 10px;
                }
                iron-icon:hover {
                    cursor: pointer;
                }
                paper-fab {
                    --paper-fab-background: var(--paper-indigo-500);
                    position: absolute;
                    right: 30px;
                    bottom: 30px;
                }
                #form {
                    width: 50%;
                }
                paper-progress {
                    width: 100%;
                    height: 2px;
                }
                .grid-header {
                    text-align: center;
                }
                markazuna-circular-pager {
                    padding: 10px 10px 10px 10px;
                }
                .flex {
                    display: flex;
                    justify-content: center;
                }
                .grid-container {
                    margin: 5px 5px 5px 5px;
                }
            </style>

            <iron-ajax
                id="dataAjax"
                url="[[dataUrl]]"
                handle-as="json"
                on-response="_onResponse"
                on-error="_onError">
            </iron-ajax>

            <iron-ajax
                id="deleteAjax"
                handle-as="json"
                on-response='_onDeleteResponse'
                on-error='_onDeleteError'>
            </iron-ajax>

            <paper-progress id="progress" hidden indeterminate></paper-progress>
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
            <paper-fab icon="icons:add" on-tap="_new"></paper-fab>
            <paper-dialog class="card" id="form" modal>
                <<%= singular_name %>-form action-url="[[dataUrl]]" form-authenticity-token="[[formAuthenticityToken]]" id="<%= singular_name %>Form"></<%= singular_name %>-form>
            </paper-dialog>
            <paper-dialog class="card" id="confirmation" modal>
                <div class="title"><iron-icon icon="icons:delete"></iron-icon>Delete Data?</div>
                <div class="buttons">
                    <paper-button dialog-dismiss>Cancel</paper-button>
                    <paper-button on-tap="_delete" dialog-confirm autofocus>Ok</paper-button>
                </div>
            </paper-dialog>
        `;
    }

    static get properties() {
        return {
            formAuthenticityToken: String,
            dataUrl: {
                type: String,
                value: ''
            },
            page: {
                type: Number,
                value: 1
            },
            count: {
                type: Number,
                value: 1
            },
            data: {
                type: Array,
                value: function() {
                    return [];
                }
            },
            _id: {
                type: String,
                value: ''
            }
        };
    }

    constructor() {
        super();
    }

    ready() {
        super.ready();
        this.addEventListener('saveSuccess', this._onSaveSuccess);
        this.addEventListener('editSuccess', this._onEditSuccess);
        this.addEventListener('cancel', this._onCancel);
        this.addEventListener('pageClick', this._onPageClick);

        this.$.dataAjax.url = this.dataUrl + '?page=' + this.page.toString();
        this.$.dataAjax.generateRequest();
        this.$.progress.hidden = false;
    }

    _onResponse(data) {
        var response = data.detail.response;
        this.count = response.count;
        this.splice('data', 0, this.data.length); // clear data
        response.results.forEach(function(item) {
            this.push('data', item);
        }, this);
        this.$.progress.hidden = true;
    }

    _onError() {
        this.$.progress.hidden = true;
        this._error = 'Something wrong... Please try again.';
        this.$.error.open();
    }

    _onDeleteResponse(data) {
        var response = data.detail.response;
        if (response.status == '200') {
            if (response.count < this.count) {
                this.page = this.page - 1;
            }
            this._reload();
        }
        else {
            this.$.progress.hidden = true;
            this._error = 'Something wrong... Please try again.';
            this.$.error.open();
        }
    }

    _onDeleteError() {
        this.$.progress.hidden = true;
        this._error = 'Something wrong... Please try again.';
        this.$.error.open();
    }

    _new() {
        this.$.<%= singular_name %>Form.icon = 'icons:add';
        this.$.<%= singular_name %>Form.title = 'Create New <%= singular_name.capitalize %>';
        this.$.form.open();
    }

    _edit(e) {
        this.$.<%= singular_name %>Form.icon = 'icons:create';
        this.$.<%= singular_name %>Form.title = 'Edit <%= singular_name.capitalize %>';
        this.$.<%= singular_name %>Form.edit(e.target.id);
        this.$.progress.hidden = false;
    }

    _onEditSuccess() {
        this.$.progress.hidden = true;
        this.$.form.open();
    }

    _copy(e) {
        this.$.<%= singular_name %>Form.icon = 'icons:content-copy';
        this.$.<%= singular_name %>Form.title = 'Copy <%= singular_name.capitalize %>';
        this.$.<%= singular_name %>Form.copy(e.target.id);
        this.$.progress.hidden = false;
    }

    _confirmation(e) {
        this._id = e.target.id;
        this.$.confirmation.open();
    }

    _delete() {
        this.$.deleteAjax.url = this.dataUrl +'/'+ this._id + '/delete';
        this.$.deleteAjax.generateRequest();
    }

    _onSaveSuccess() {
        this.$.form.close();
        this._reload();        
    }
    
    _onCancel() {
        this.$.form.close();
    }

    _reload() {
        this.$.dataAjax.url = this.dataUrl + '?page=' + this.page.toString();
        this.$.dataAjax.generateRequest();
        this.$.progress.hidden = false;
    }

    _onPageClick(e) {
        this.page = e.detail.page;
        this.$.dataAjax.url = this.dataUrl + '?page=' + e.detail.page.toString();
        this.$.dataAjax.generateRequest();
        this.$.progress.hidden = false;
    }
}
customElements.define('<%= singular_name %>-list', <%= singular_name.capitalize %>List);