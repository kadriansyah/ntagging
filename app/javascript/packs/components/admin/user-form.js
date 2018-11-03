import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-input-container.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-input/iron-input.js';
import '@polymer/paper-progress/paper-progress.js';

import '../markazuna/markazuna-shared-styles.js';

class UserForm extends PolymerElement {
    static get template() {
        return html`
            <style include="shared-styles">
                :host {
                    display: block;
                    margin-top: 10px;
                }
                .wrapper-btns {
                    margin-top: 15px;
                    text-align: right;
                }
                paper-button {
                    margin-top: 10px;
                }
                paper-button.indigo {
                    background-color: var(--paper-indigo-500);
                    color: white;
                    --paper-button-raised-keyboard-focus: {
                        background-color: var(--paper-pink-a200) !important;
                        color: white !important;
                    };
                }
                paper-button.green {
                    background-color: var(--paper-green-500);
                    color: white;
                }
                paper-button.green[active] {
                    background-color: var(--paper-red-500);
                }
                paper-progress {
                    width: 100%;
                }
                #formContainer {
                    width: var(--user-form-width, 100%);
                    margin: 0 auto;
                    @apply(--user-form);
                }
                .title {
                    margin-bottom: 10px;
                }
                .title > div {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;

                    padding: 5px 0 5px 0;
                    border-bottom: 2px solid #757575;
                    font-size: 16px;
                    font-weight: bold;
                }
                .title iron-icon {
                    padding: 0;
                    padding-right: 2px;
                }
            </style>

            <iron-ajax
                id="saveAjax"
                method="post"
                url="[[actionUrl]]"
                content-type="application/json"
                handle-as="json"
                on-response="_onSaveResponse"
                on-error="_onSaveError">
            </iron-ajax>

            <iron-ajax
                    id="updateAjax"
                    method="put"
                    content-type="application/json"
                    handle-as="json"
                    on-response="_onUpdateResponse"
                    on-error="_onUpdateError">
            </iron-ajax>

            <iron-ajax
                    id="editAjax"
                    method="get"
                    content-type="application/json"
                    handle-as="json"
                    on-response="_onEditResponse"
                    on-error="_onEditError">
            </iron-ajax>

            <div class="title">
                <div><iron-icon icon="[[icon]]"></iron-icon>[[title]]</div>
                <paper-progress id="progress" hidden indeterminate></paper-progress>
            </div>

            <div id="formContainer">
                <template is="dom-if" if="[[_error]]">
                    <p class="alert-error">[[_error]]</p>
                </template>

                <iron-input slot="input" bind-value="{{core_user.id}}">
                    <input id="id" type="hidden" value="{{core_user.id}}">
                </iron-input>

                <paper-input-container>
                    <label slot="label">Email</label>
                    <iron-input slot="input" bind-value="{{core_user.email}}">
                        <input id="email" type="text" value="{{core_user.email}}">
                    </iron-input>
                </paper-input-container>

                <paper-input-container>
                    <label slot="label">Username</label>
                    <iron-input slot="input" bind-value="{{core_user.username}}">
                        <input id="username" type="text" value="{{core_user.username}}">
                    </iron-input>
                </paper-input-container>

                <paper-input-container>
                    <label slot="label">Password</label>
                    <iron-input slot="input" bind-value="{{core_user.password}}">
                        <input id="password" type="password" value="{{core_user.password}}">
                    </iron-input>
                </paper-input-container>

                <paper-input-container>
                    <label slot="label">Confirm Password</label>
                    <iron-input slot="input" bind-value="{{core_user.confirmation_password}}">
                        <input id="confirmationPassword" type="password" value="{{core_user.confirmation_password}}">
                    </iron-input>
                </paper-input-container>

                <paper-input-container>
                    <label slot="label">First Name</label>
                    <iron-input slot="input" bind-value="{{core_user.firstname}}">
                        <input id="firstname" type="text" value="{{core_user.firstname}}">
                    </iron-input>
                </paper-input-container>

                <paper-input-container>
                    <label slot="label">Last Name</label>
                    <iron-input slot="input" bind-value="{{core_user.lastname}}">
                        <input id="lastname" type="text" value="{{core_user.lastname}}">
                    </iron-input>
                </paper-input-container>

                <div class="wrapper-btns">
                    <paper-button class="link" on-tap="_cancel">Cancel</paper-button>
                    <paper-button raised class="indigo" on-tap="_save">Save</paper-button>
                </div>
            </div>
        `;
    }

    static get properties() {
        return {
            formAuthenticityToken: String,
            actionUrl: {
                type: String,
                value: ''
            },
            core_user: {
                type: Object,
                value: {},
                notify: true
            },
            title: {
                type: String,
                value: ''
            },
            icon: {
                type: String,
                value: ''
            },
            _mode: {
                type: String,
                value: 'new'
            },
            _error: String
        };
    }

    constructor() {
        super();
    }

    ready() {
        super.ready();
    }

    edit(id) {
        this.$.editAjax.url = this.actionUrl +'/'+ id +'/edit';
        this.$.editAjax.generateRequest();
        this._mode = 'edit';
    }

    copy(id) {
        this.$.editAjax.url = this.actionUrl +'/'+ id +'/edit';
        this.$.editAjax.generateRequest();
        this._mode = 'copy';
    }

    _onEditResponse(data) {
        var response = data.detail.response;
        this.core_user = response.payload;
        if (this._mode === 'copy') {
            this.core_user.id = ''; // nullify id, we will save it as new document
        }
        this.dispatchEvent(new CustomEvent('editSuccess', {bubbles: true, composed: true}));
    }

    _onEditError() {
        this._error = 'Edit User Error';
    }

    _onSaveResponse(e) {
        var response = e.detail.response;
        if (response.status == '200') {
            this._error = '';
            this._mode = 'new';
            this.core_user = {};
            this.dispatchEvent(new CustomEvent('saveSuccess', {bubbles: true, composed: true}));
        }
        else {
            this._error = 'Creating User Error';
        }
        this.$.progress.hidden = true;
    }

    _onSaveError() {
        this._error = 'Creating User Error';
        this.$.progress.hidden = true;
    }

    _onUpdateResponse(data) {
        var response = data.detail.response;
        if (response.status == '200') {
            this._error = '';
            this._mode = 'new';
            this.core_user = {};
            this.dispatchEvent(new CustomEvent('saveSuccess', {bubbles: true, composed: true}));
        }
        else {
            this._error = 'Updating User Error';
        }
        this.$.progress.hidden = true;
    }

    _onUpdateError() {
        this._error = 'Creating User Error';
        this.$.progress.hidden = true;
    }

    _save() {
        if (this._mode === 'new' || this._mode === 'copy') {
            this.$.saveAjax.headers['X-CSRF-Token'] = this.formAuthenticityToken;
            this.$.saveAjax.body = this.core_user;
            this.$.saveAjax.generateRequest();
            this.$.progress.hidden = false;
        }
        else {
            this.$.updateAjax.headers['X-CSRF-Token'] = this.formAuthenticityToken;
            this.$.updateAjax.body = this.core_user;
            this.$.updateAjax.url = this.actionUrl +'/'+ this.core_user.id;
            this.$.updateAjax.generateRequest();
            this.$.progress.hidden = false;
        }
    }

    _cancel() {
        this._error = '';
        this._mode = 'new';
        this.core_user = {};
        this.dispatchEvent(new CustomEvent('cancel', {bubbles: true, composed: true}));
    }
}
customElements.define('user-form', UserForm);
