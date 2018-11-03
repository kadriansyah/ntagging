import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './markazuna-pagination.js';

class MarkazunaCircularPager extends PolymerElement {
    static get template() {
        return html`
            <style>
                :host {
                    margin-top: .5rem;
                    margin-bottom: .5rem;
                    display: inline-block;
                    --var-pager-color: #454545;
                    --var-pager-background-color: transparent;
                    --var-pager-current-color: #fff;
                    --var-pager-current-background-color: #454545;
                    --var-pager-hover-color: #454545;
                    --var-pager-hover-background-color: rgba(197, 197, 197, .62);
                    --var-pager-shadow: 0 2px 5px 0 rgba(0, 0, 0, .26);
                }
                :host[hidden] {
                    display: none;
                }
                markazuna-pagination a.general {
                    padding: .5rem .75rem;
                    margin-left: -1px;
                    color: var(--var-pager-color);
                    text-decoration: none;
                    background-color: var(--var-pager-background-color);
                    border: 0 solid #ddd;
                    min-width: 2.6em;
                    margin-right: .5em;
                    text-align: center;
                    border-radius: 4em;
                }
                markazuna-pagination a.general:hover {
                    color: var(--var-pager-hover-color);
                    background-color: var(--var-pager-hover-background-color);
                }
                markazuna-pagination a.current,
                markazuna-pagination a.current:hover {
                    cursor: default;
                    color: var(--var-pager-current-color);
                    background-color: var(--var-pager-current-background-color);
                    border-color: var(--var-pager-current-background-color);
                    -webkit-box-shadow: var(--var-pager-shadow);
                    -moz-box-shadow: var(--var-pager-shadow);
                    box-shadow: var(--var-pager-shadow);
                }
            </style>
            <markazuna-pagination page="[[page]]" count="[[count]]" range="[[range]]" url="[[url]]" hide-first="[[hideFirst]]"
                hide-last="[[hideLast]]" hide-previous="[[hidePrevious]]" hide-next="[[hideNext]]" hidden="{{hidden}}">
                <template slot="first"><a class$="[[css]]" href$="[[url]]">first</a></template>
                <template slot="previous"><a class$="[[css]]" href$="[[url]]">previous</a></template>
                <template slot="general"><a class$="[[css]]" href$="[[url]]">[[text]]</a></template>
                <template slot="current"><a class$="[[css]]">[[text]]</a></template>
                <template slot="next"><a class$="[[css]]" href$="[[url]]">next</a></template>
                <template slot="last"><a class$="[[css]]" href$="[[url]]">last</a></template>
            </markazuna-pagination>
        `;
    }

    static get properties() {
        return {
            /**
             * Current page number
             */
            page: {
                type: Number,
                value: 1
            },
            /**
             * Page count of data
             */
            count: {
                type: Number,
                value: 1
            },
            /**
             * Count of pagination
             */
            range: {
                type: Number,
                value: 5
            },
            /**
             * Url template, replace page count and page number via `#{count}` and `#{page}` variable
             */
            url: String,
            /**
             * Hide first element
             */
            hideFirst: {
                type: Boolean,
                value: false
            },
            /**
             * Hide last element
             */
            hideLast: {
                type: Boolean,
                value: false
            },
            /**
             * Hide previous element
             */
            hidePrevious: {
                type: Boolean,
                value: false
            },
            /**
             * Hide next element
             */
            hideNext: {
                type: Boolean,
                value: false
            },
            /**
             * Text of first page @note: using autobinding somehow is not working
             */
            firstText: {
                type: String,
                value: 'first'
            },
            /**
             * Text of last page @note: using autobinding somehow is not working
             */
            lastText: {
                type: String,
                value: 'last'
            },
            /**
             * Text of previous page @note: using autobinding somehow is not working
             */
            previousText: {
                type: String,
                value: 'previous'
            },
            /**
             * Text of next page @note: using autobinding somehow is not working
             */
            nextText: {
                type: String,
                value: 'next'
            },
            /**
             * Visibiliy
             */
            hidden: {
                type: Boolean,
                reflectToAttribute: true
            }
        }
    }

    constructor() {
        super();
    }

    ready() {
        super.ready();
    }
}
customElements.define('markazuna-circular-pager', MarkazunaCircularPager);