import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-input-container.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-input/iron-input.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-radio-group/paper-radio-group.js';

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
                paper-dialog#context_menu {
                    position: fixed;
                }
                label-selector {
                    display: block;
                }
                label-selector:hover {
                    cursor: pointer;
                }
                paper-radio-button {
                    display: block;
                }
                .label {
                    color: white;
                    padding: 5px 10px;
                    margin-right: 2px;
                }
                #tagged {
                    line-height: 180%;
                }
                #label_container {
                    padding-top: 5px;
                    border-top: 1px solid #757575;
                }
            </style>

            <iron-ajax
                id="dataAjax"
                handle-as="json"
                on-response="_onResponse"
                on-error="_onError">
            </iron-ajax>

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
                        <p id="tagged">{{question.question_tag}}</p>
                    </div>
                </div>
                
                <div id="label_container">{{question.question_label}}</div>

                <div class="wrapper-btns">
                    <paper-button class="link" on-tap="_cancel">Cancel</paper-button>
                    <paper-button raised class="indigo" on-tap="_save">Save</paper-button>
                </div>
            </div>

            <paper-dialog id="context_menu" on-iron-overlay-closed="_dismissContextMenu" hidden>
                <paper-radio-group id="label_group" allow-empty-selection>
                <template is="dom-repeat" items="{{labels}}">
                    <paper-radio-button on-change="_onRadioChange" name="{{item.value}}" value="{{item.css}}">{{item.name}}</paper-radio-button>
                </template>
                </paper-radio-group>
            </paper-dialog>
            <paper-dialog class="card" id="error" modal>
                <div class="title"><iron-icon icon="icons:error"></iron-icon>{{_error}}</div>
                <div class="buttons">
                    <paper-button dialog-dismiss>Ok</paper-button>
                </div>
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
            labels: {
                type: Array,
                value: function() {
                    return [];
                }
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
            exclude: Object,
            registry: Object,
            labelCount: Object,
            selectedText: String,
            parentTextNode: Object,
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
        this.exclude = {};
        this.registry = {};
        this.labelCount = {};
    }

    connectedCallback() {
        super.connectedCallback();

        // block contextmenu on document level
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        }, false);

        // register contextmenu event on component level
        this.addEventListener('contextmenu', this._onContextMenu);

        this.$.dataAjax.url = '/admin/tags';
        this.$.dataAjax.generateRequest();
    }

    _onResponse(data) {
        var response = data.detail.response;
        this.count = response.count;
        this.splice('labels', 0, this.labels.length); // clear data
        response.results.forEach(function(item) {
            this.push('labels', item);
        }, this);
    }

    _onError(event) {
        var response = event.detail.request.xhr.response;
        this._error = response.message;
        self = this;
        setTimeout(function(){
            self.dispatchEvent(new CustomEvent('cancel', {bubbles: true, composed: true}));
        }, 2000);
    }

    _onContextMenu(e) {
        this.parentTextNode = this.shadowRoot.getSelection().anchorNode.parentNode;
        this.$.label_group.selected = this.shadowRoot.getSelection().anchorNode.parentNode.nodeName.toLowerCase();
        this.selectedText = this.shadowRoot.getSelection().toString();
        /*
        DOM changes don't take effect until they can be rendered. Javascript is single-threaded
        (meaning you cannot run two pieces of code simultaneously), and run on the same thread as the render cycle.

        Because of this, the renderer cannot fire unless you give it time to look at the new state of the DOM by deferring execution
        of your JS code (using setTimeout or requestAnimationFrame). So unless you give the browser time to render,
        only the final value before the renderer gets to look at the DOM is what matters.
        */
        self = this;
        setTimeout(function(){
            self.$.context_menu.style.left = (e.pageX - 20) + 'px';
            self.$.context_menu.style.top = (e.pageY - 20) + 'px';
            self.$.context_menu.hidden = false;
        }, 250);
        this.$.context_menu.hidden = true;
        this.$.context_menu.open();
    }

    _addRegistry(keyword, count) {
        if (this.registry[keyword] == null) {
            this.registry[keyword] = count;
        }
        else {
            this.registry[keyword] = this.registry[keyword] + count;
        }
    }

    _subRegistry(keyword, count) {
        this.registry[keyword] = this.registry[keyword] - count;
    }

    _updateLabel(span, label, className, counter) {
        if (span == null) {
            var span = document.createElement('span');
            span.id = label;
            span.className = `label ${className}`;
            span.textContent = `${label} (${counter})`;
            this.$.label_container.appendChild(span);
            this.labelCount[label] = counter;
        }
        else {
            var count = this.labelCount[label] + counter;
            var span  = this.shadowRoot.getElementById(label);
            span.textContent = `${label} (${count})`;
            this.labelCount[label] = count;
        }
    }

    _onRadioChange(e) {
        self = this;
        if (e.target.checked == true) {
            if (this.parentTextNode.nodeName.toLowerCase() == 'p') {
                var options = {};
                options['element'] = e.target.name;
                options['separateWordSearch'] = false;
                options['className'] = e.target.value;
                options['acrossElements'] = true;

                if (this.exclude[this.selectedText] != null) {
                    options['exclude'] = Array.from(this.exclude[this.selectedText]);
                }

                options['done'] = function(counter) {
                    self._addRegistry(self.selectedText, counter);
                    var span = self.shadowRoot.getElementById(e.target.name);
                    self._updateLabel(span, e.target.name, e.target.value, counter);
                };

                if (this.exclude[this.selectedText] == null) {
                    this.exclude[this.selectedText] = new Set([e.target.name]);
                }
                else {
                    this.exclude[this.selectedText].add(e.target.name);
                }

                var mark_instance = new Mark(this.$.tagged);
                mark_instance.mark(this.selectedText, options);

                this.$.context_menu.hidden = true;
                this.$.context_menu.close();
            }
            else {
                // do not umark if selectedText is part of tagged text
                var keyword = this.parentTextNode.textContent;
                if (this.parentTextNode.textContent.includes(this.selectedText) && this.parentTextNode.textContent.length == this.selectedText.length) {
                    // swap label case
                    var mark_instance = new Mark(this.parentTextNode);
                    mark_instance.unmark(this.selectedText);

                    var span = this.shadowRoot.getElementById(this.parentTextNode.nodeName.toLowerCase());
                    self._updateLabel(span, this.parentTextNode.nodeName.toLowerCase(), null, -1);
                }

                // mark with new label
                var options = {};
                options['element'] = e.target.name;
                options['separateWordSearch'] = false;
                options['className'] = e.target.value;
                options['acrossElements'] = true;
                if (this.exclude[this.selectedText] != null) {
                    options['exclude'] = Array.from(this.exclude[this.selectedText]);
                }

                options['done'] = function(counter) {
                    // make sure we are not incrementing the same keyword twice (condition: replace the same keyword with different label)
                    if (self.selectedText != keyword) {
                        self._addRegistry(self.selectedText, counter);
                    }
                    var span = self.shadowRoot.getElementById(e.target.name);
                    self._updateLabel(span, e.target.name, e.target.value, counter);
                };

                var mark_instance = new Mark(this.$.tagged);
                mark_instance.mark(this.selectedText, options);

                if (this.exclude[this.selectedText] == null) {
                    this.exclude[this.selectedText] = new Set([e.target.name]);
                }
                else {
                    this.exclude[this.selectedText].add(e.target.name);
                }

                this.$.context_menu.hidden = true;
                this.$.context_menu.close();
            }
        }
        else {
            if (this.parentTextNode.textContent.includes(this.selectedText) && this.parentTextNode.textContent.length == this.selectedText.length) {
                this._subRegistry(this.selectedText, 1);
            }
            else {
                this._subRegistry(this.parentTextNode.textContent, 1); // case: select text part on tagged text
            }

            var mark_instance = new Mark(this.parentTextNode);
            mark_instance.unmark(this.selectedText, options);

            var span = this.shadowRoot.getElementById(e.target.name);
            this._updateLabel(span, e.target.name, e.target.value, -1);

            this.$.context_menu.hidden = true;
            this.$.context_menu.close();
        }
    }

    _clearData() {
        var label_container = this.shadowRoot.getElementById('label_container');
        while (label_container.firstChild) {
            label_container.removeChild(label_container.firstChild);
        }
        this.exclude = {};
        this.registry = {};
        this.labelCount = {};
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

    _dismissContextMenu() {
        this.$.context_menu.close();
    }

    _onEditResponse(data) {
        var response = data.detail.response;
        this.question = response.payload;
        if (this._mode === 'copy') {
            this.question.id = ''; // nullify id, we will save it as new document
        }

        if (this.question.question_tag.length === 0 || !this.question.question_tag) {
            this.$.tagged.innerHTML = this.question.question_text;
        }
        else {
            this.$.tagged.innerHTML = this.question.question_tag;
        }

        if (this.question.question_label.length > 0 && this.question.question_label) {
            this.$.label_container.innerHTML = this.question.question_label;
        }

        // load metadata
        if (this.question.metadata.length > 0 && this.question.metadata) {
            var metadata = this.question.metadata.split('-');
            function Array_toSet(key, value) {
                if (typeof value === 'object' && value instanceof Array) {
                    return new Set(value);
                }
                return value;
            }
            this.exclude = JSON.parse(metadata[0], Array_toSet);
            this.labelCount = JSON.parse(metadata[1]);
        }

        this.dispatchEvent(new CustomEvent('editSuccess', {bubbles: true, composed: true}));
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
        this.question.question_tag = this.$.tagged.innerHTML;
        this.question.question_label = this.$.label_container.innerHTML;

        // save metadata
        function Set_toJSON(key, value) {
            if (typeof value === 'object' && value instanceof Set) {
                return [...value];
            }
            return value;
        }
        var exclude = JSON.stringify(this.exclude, Set_toJSON);
        var lacount = JSON.stringify(this.labelCount);
        this.question.metadata = exclude +'-'+lacount;

        this._clearData();
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
        this._clearData();
        this.dispatchEvent(new CustomEvent('cancel', {bubbles: true, composed: true}));
    }
}
customElements.define('question-form', QuestionForm);