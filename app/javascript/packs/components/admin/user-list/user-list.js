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

import '../../moslemcorner/moslemcorner-shared-styles.js';
import '../user-form/user-form.js';

class UserList extends PolymerElement {
    static get template() {
        return html`
            <style include="shared-styles">
                :host {
                    display: block;
                }
                vaadin-grid {
                    --card-margin: 5px 24px 24px 24px;
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
            <paper-fab icon="icons:add" on-tap="_new"></paper-fab>
            <paper-dialog class="card" id="form" modal>
                <user-form action-url="[[dataUrl]]" form-authenticity-token="[[formAuthenticityToken]]" id="userForm"></user-form>
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
                value: 0
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

        this.$.dataAjax.url = this.dataUrl + '?page=' + this.page.toString();
        this.$.dataAjax.generateRequest();
        this.$.progress.hidden = false;

        // /* network delay simulation */
        // self = this;
        // setTimeout(function() {
        //     self.$.dataAjax.url = self.dataUrl + '?page=' + self.page.toString();
        //     self.$.dataAjax.generateRequest();
        // }, 3000);
    }

    _onResponse(data) {
        var response = data.detail.response;
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
        this.$.userForm.icon = 'icons:add';
        this.$.userForm.title = 'Create New User';
        this.$.form.open();
    }

    _edit(e) {
        this.$.userForm.icon = 'icons:create';
        this.$.userForm.title = 'Edit User';
        this.$.userForm.edit(e.target.id);
        this.$.progress.hidden = false;
    }

    _onEditSuccess() {
        this.$.progress.hidden = true;
        this.$.form.open();
    }

    _copy(e) {
        this.$.userForm.icon = 'icons:content-copy';
        this.$.userForm.title = 'Copy User';
        this.$.userForm.copy(e.target.id);
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
}
customElements.define('user-list', UserList);