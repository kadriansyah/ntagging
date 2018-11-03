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

import './moslemcorner/moslemcorner-shared-styles.js';

export class BaseList extends PolymerElement {
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

            <iron-location id="location" path="{{path}}" hash="{{hash}}" query="{{query}}" dwell-time="{{dwellTime}}"></iron-location>
            <paper-progress id="progress" hidden indeterminate></paper-progress>
            ${this.listTemplate}
            <paper-fab icon="icons:add" on-tap="_new"></paper-fab>
            <paper-dialog class="card" id="form" modal>
                ${this.formTemplate}
            </paper-dialog>
            <paper-dialog class="card" id="confirmation" modal>
                <div class="title"><iron-icon icon="icons:delete"></iron-icon>Delete Data?</div>
                <div class="buttons">
                    <paper-button dialog-dismiss>Cancel</paper-button>
                    <paper-button on-tap="_delete" dialog-confirm autofocus>Ok</paper-button>
                </div>
            </paper-dialog>
            <paper-dialog class="card" id="error" modal>
                <div class="title"><iron-icon icon="icons:error"></iron-icon>{{_error}}</div>
                <div class="buttons">
                    <paper-button dialog-dismiss>Ok</paper-button>
                </div>
            </paper-dialog>
        `;
    }

    // child should override this method
    static get listTemplate() { return html`...`; }

    /* 
        id of the form must 'formData' 
        example:
        <tag-form action-url="[[dataUrl]]" form-authenticity-token="[[formAuthenticityToken]]" id="formData"></tag-form>
    */
    static get formTemplate() { return html`...`; } 

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
            },
            _error: {
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

        // /* network delay simulation */
        // self = this;
        // setTimeout(function() {
        //     self.$.dataAjax.url = self.dataUrl + '?page=' + self.page.toString();
        //     self.$.dataAjax.generateRequest();
        // }, 3000);
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

    _onError(event) {
        var response = event.detail.request.xhr.response;
        if (response.status == '401') { // Unauthorized
            this.$.progress.hidden = true;
            var path = this.$.location.path.split('/');
            this.$.location.path = `${path[0]}/admin/login`;
            window.location.reload(true);
        }
        else {
            this.$.progress.hidden = true;
            this._error = response.message;
            this.$.error.open();
        }
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
            this._error = response.message;
            this.$.error.open();
        }
    }

    _onDeleteError(event) {
        var response = event.detail.request.xhr.response;
        this.$.progress.hidden = true;
        this._error = response.message;
        this.$.error.open();
    }

    /* child need to override this method */
    _formTitleNew() {
        return 'Create New Data';
    }

    /* child need to override this method */
    _formTitleEdit() {
        return 'Edit Data';
    }

    /* child need to override this method */
    _formTitleCopy() {
        return 'Copy Data';
    }

    _new() {
        this.$.formData.icon = 'icons:add';
        this.$.formData.title = this._formTitleNew();
        this.$.form.open();
    }

    _edit(e) {
        this.$.formData.icon = 'icons:create';
        this.$.formData.title = this._formTitleEdit();
        this.$.formData.edit(e.target.id);
        this.$.progress.hidden = false;
    }

    _onEditSuccess() {
        this.$.progress.hidden = true;
        this.$.form.open();
    }

    _copy(e) {
        this.$.formData.icon = 'icons:content-copy';
        this.$.formData.title = this._formTitleCopy();
        this.$.formData.copy(e.target.id);
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
customElements.define('base-list', BaseList);