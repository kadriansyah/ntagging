import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-input/iron-input.js';
import '@polymer/paper-input/paper-input.js';

class MarkazunaSearchBar extends PolymerElement {
    static get template() {
        return html`
            <style>
                :host {
                    display: inline-block;
                }
                .group {
                    display: inline-block;
                    position: relative;
                }
                input {
                    display: inline-block;
                    font-size: 18px;
                    width: 300px;
                    padding: 0;
                    border: none;
                    border-bottom: 1px solid var(--moslemcorner-search-bar-border-bottom-color ,#ffffff);
                }
                input:focus {
                    outline: none !important;
                }
                /* underline right to left effect */
                .bar {
                    direction: rtl;
                    display: block;
                    position: relative;
                    width: 300px;
                }
                .bar:after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: .1rem;
                    background: #2979FF;
                    transition: width 0.2s ease;
                }
                /* active state */
                input:focus ~ .bar:after {
                    width: 100%;
                }
            </style>
            <div class="group" hidden$="{{!show}}">
                <input is="iron-input" on-blur="_onBlur" on-keypress="_onKeyPress" id="input">
                <span class="bar"></span>
            </div>
            <paper-icon-button icon="search" on-tap="_toggle" id="search"></paper-icon-button>
        `;
    }

    static get properties() {
        return {
            _show: {
                type: Boolean,
                value: false
            },
            placeholder: {
                type: String,
                value: 'search content...'
            }
        };
    }

    constructor() {
        super();
    }

    _onBlur() {
        this._show = false;
        this.$.input.placeholder = '';
        this.$.input.value = '';
        this.$.search.disabled = false;
    }

    _toggle() {
        if (!this._show) {
            this._show = true;
            this.$.input.placeholder = this.placeholder;
            this.$.search.disabled = true;
            this.$.input.focus();
        }
    }

    _onKeyPress() {
        if (e.keyCode == 13) { // Enter
//                        var q = this.searchInput;
//                        //q = 'site:mysite.com+' + q; // edit site here
//                        window.open('https://www.google.com/search?q=' + q);
//                        this.show = false;
//                        this.searchInput = '';
        }
    }
}
customElements.define('markazuna-search-bar', MarkazunaSearchBar);
