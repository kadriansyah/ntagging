import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-input-container.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-input/iron-input.js';
import '@polymer/paper-progress/paper-progress.js';

import './markazuna/markazuna-shared-styles.js';

class LoginForm extends PolymerElement {
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
                paper-button.link {
                    color: #757575;
                }
                .alert-error {
                    background: #ffcdd2;
                    border: 1px solid #f44336;
                    border-radius: 3px;
                    color: #333;
                    font-size: 14px;
                    padding: 10px;
                }
                .card {
                    margin: 10px;
                }
            </style>

            <iron-ajax
                id="registerLoginAjax"
                method="post"
                content-type="application/json"
                handle-as="json"
                on-response="handleUserResponse"
                on-error="handleUserError">
            </iron-ajax>

            <div class="card">
                <div id="unauthenticated">
                    <h1>Tagging App</h1>
                    <p><strong>Log in</strong> or <strong>sign up</strong></p>
                    <template is="dom-if" if="[[_error]]">
                        <p class="alert-error">[[_error]]</p>
                    </template>
                    <paper-input-container>
                        <label slot="input">Username</label>
                        <iron-input slot="input" bind-value="{{formData.email}}">
                            <input id="email" type="text" value="{{formData.email}}" placeholder="Username">
                        </iron-input>
                    </paper-input-container>

                    <paper-input-container>
                        <label>Password</label>
                        <iron-input slot="input" bind-value="{{formData.password}}">
                            <input id="password" type="password" value="{{formData.password}}" placeholder="Password">
                        </iron-input>
                    </paper-input-container>

                    <div class="wrapper-btns">
                        <paper-button raised class="indigo" on-tap="postLogin">Log In</paper-button>
                        <paper-button raised class="primary" on-tap="postRegister">Sign Up</paper-button>
                    </div>
                </div>
            </div>
        `;
    }

    static get properties() {
        return {
            formAuthenticityToken: String,
            formData: {
                type: Object,
                value: {}
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
    }

    _setReqBody() {
        this.$.registerLoginAjax.body = {'core_user': this.formData};
    }

    postLogin() {
        this.$.registerLoginAjax.url = '/admin/login';
        this.$.registerLoginAjax.headers['X-CSRF-Token'] = this.formAuthenticityToken;
        this._setReqBody();
        this.$.registerLoginAjax.generateRequest();
    }

    postRegister() {
        this.$.registerLoginAjax.url = '/admin/login';
        this.$.registerLoginAjax.headers['X-CSRF-Token'] = this.formAuthenticityToken;
        this._setReqBody();
        this.$.registerLoginAjax.generateRequest();
    }

    handleUserResponse(event) {
        // var response = event.detail.response;
        this.formData = {};
        window.location.reload(true);
    }

    handleUserError(event) {
        var response = event.detail.request.xhr.response;
        this._error = response.message;
    }
}
customElements.define('login-form', LoginForm);
