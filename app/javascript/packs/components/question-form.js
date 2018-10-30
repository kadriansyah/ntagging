import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-input-container.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-input/iron-input.js';
import '@polymer/paper-progress/paper-progress.js';

import Mark from 'mark.js/dist/mark.es6.js'
import './moslemcorner/moslemcorner-shared-styles.js';

class QuestionForm extends PolymerElement {
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
                .title {
                    margin-bottom: 0px;
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
                #id_wrapper {
                    display: none;
                }
                mark{
                    background: orange;
                    color: black;
                    padding: 3px 3px;
                }
                paper-dialog#context_menu {
                    position: fixed;
                }
                label-selector {
                    display: block;
                }
                label-selector:hover {
                    cursor: pointer;
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

            <div>
                <template is="dom-if" if="[[_error]]">
                    <p class="alert-error">[[_error]]</p>
                </template>

                <iron-input id="id_wrapper" slot="input" bind-value="{{question.id}}">
                    <input id="id" type="hidden" value="{{question.id}}">
                </iron-input>
                
                <paper-input-container>
                    <label slot="label">Title</label>
                    <iron-input slot="input" bind-value="{{question.title}}">
                        <input id="title" type="text" value="{{question.title}}">
                    </iron-input>
                </paper-input-container>
                
                <paper-input-container>
                    <label slot="label">Question</label>
                    <iron-input slot="input" bind-value="{{question.question_text}}">
                        <textarea rows="8" cols="50" id="question_text" type="text" value="{{question.question_text}}"></textarea>
                    </iron-input>
                </paper-input-container>

                <div>
                    <p>Tagged Question</p>
                    <div>
                        <p id="tagged">TEST</p>
                    </div>
                </div>
                
                <div class="wrapper-btns">
                    <paper-button class="link" on-tap="_cancel">Cancel</paper-button>
                    <paper-button raised class="indigo" on-tap="_save">Save</paper-button>
                </div>
            </div>

            <paper-dialog id="context_menu" on-iron-overlay-closed="_dismissContextMenu" hidden>
                <label-selector>Diabetes</label-selector>
                <label-selector>Batuk</label-selector>
                <label-selector>Influence</label-selector>
                <label-selector>Pusing</label-selector>
                <label-selector>Bahagia</label-selector>
            </paper-dialog>
        `;
    }

    static get properties() {
        return {
            formAuthenticityToken: String,
            actionUrl: {
                type: String,
                value: ''
            },
            question: {
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

    connectedCallback() {
        super.connectedCallback();

        // block contextmenu on document level
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        }, false);

        // register contextmenu event on component level
        this.addEventListener('contextmenu', this._onContextMenu);
    }

    _onContextMenu(e) {
        console.log(window.getSelection().toString());
        self = this;
        /*
        DOM changes don't take effect until they can be rendered. Javascript is single-threaded
        (meaning you cannot run two pieces of code simultaneously), and run on the same thread as the render cycle.

        Because of this, the renderer cannot fire unless you give it time to look at the new state of the DOM by deferring execution
        of your JS code (using setTimeout or requestAnimationFrame). So unless you give the browser time to render,
        only the final value before the renderer gets to look at the DOM is what matters.
        */
        setTimeout(function(){
            self.$.context_menu.style.left = (e.pageX - 20) + 'px';
            self.$.context_menu.style.top = (e.pageY - 20) + 'px';
            self.$.context_menu.hidden = false;
        }, 2);
        this.$.context_menu.hidden = true;
        this.$.context_menu.open();
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

    // _onDblClick(e) {
    //     self = this;
    //     /*
    //     DOM changes don't take effect until they can be rendered. Javascript is single-threaded
    //     (meaning you cannot run two pieces of code simultaneously), and run on the same thread as the render cycle.

    //     Because of this, the renderer cannot fire unless you give it time to look at the new state of the DOM by deferring execution
    //     of your JS code (using setTimeout or requestAnimationFrame). So unless you give the browser time to render,
    //     only the final value before the renderer gets to look at the DOM is what matters.
    //     */
    //     setTimeout(function(){
    //         self.$.context_menu.style.left = (e.pageX - 20) + 'px';
    //         self.$.context_menu.style.top = (e.pageY - 20) + 'px';
    //         self.$.context_menu.hidden = false;
    //     }, 1);
    //     this.$.context_menu.hidden = true;
    //     this.$.context_menu.open();
    // }

    _dismissContextMenu() {
        this.$.context_menu.close();
    }

    _onEditResponse(data) {
        var response = data.detail.response;
        this.question = response.payload;
        if (this._mode === 'copy') {
            this.question.id = ''; // nullify id, we will save it as new document
        }
        this.dispatchEvent(new CustomEvent('editSuccess', {bubbles: true, composed: true}));

        console.log(this.$.tagged);
        this.$.tagged.innerHTML = this.$.question_text.value;
        var mark_instance = new Mark(this.$.tagged);
        mark_instance.mark(this.$.title.value);
    }

    _onEditError() {
        this._error = 'Edit Question Error';
    }

    _onSaveResponse(e) {
        var response = e.detail.response;
        if (response.status == '200') {
            this._error = '';
            this._mode = 'new';
            this.question = {};
            this.dispatchEvent(new CustomEvent('saveSuccess', {bubbles: true, composed: true}));
        }
        else {
            this._error = 'Creating Question Error';
        }
        this.$.progress.hidden = true;
    }

    _onSaveError() {
        this._error = 'Creating Question Error';
        this.$.progress.hidden = true;
    }

    _onUpdateResponse(data) {
        var response = data.detail.response;
        if (response.status == '200') {
            this._error = '';
            this._mode = 'new';
            this.question = {};
            this.dispatchEvent(new CustomEvent('saveSuccess', {bubbles: true, composed: true}));
        }
        else {
            this._error = 'Updating Question Error';
        }
        this.$.progress.hidden = true;
    }

    _onUpdateError() {
        this._error = 'Creating Question Error';
        this.$.progress.hidden = true;
    }

    _save() {
        if (this._mode === 'new' || this._mode === 'copy') {
            this.$.saveAjax.headers['X-CSRF-Token'] = this.formAuthenticityToken;
            this.$.saveAjax.body = this.question;
            this.$.saveAjax.generateRequest();
            this.$.progress.hidden = false;
        }
        else {
            this.$.updateAjax.headers['X-CSRF-Token'] = this.formAuthenticityToken;
            this.$.updateAjax.body = this.question;
            this.$.updateAjax.url = this.actionUrl +'/'+ this.question.id;
            this.$.updateAjax.generateRequest();
            this.$.progress.hidden = false;
        }
    }

    _cancel() {
        this._error = '';
        this._mode = 'new';
        this.question = {};
        this.dispatchEvent(new CustomEvent('cancel', {bubbles: true, composed: true}));
    }
}
customElements.define('question-form', QuestionForm);
