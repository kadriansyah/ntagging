import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-location/iron-location.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js'
import '@polymer/paper-item/paper-item.js';
import '@polymer/app-layout/app-layout.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import 'app-menu-polymer3/app-menu.js'
import 'app-menu-polymer3/app-submenu.js'
import 'app-menu-polymer3/app-menu-icon-item.js'

import './markazuna/markazuna-shared-styles.js';
import './markazuna/markazuna-search-bar.js';

export class BasePage extends PolymerElement {
    static get template() {
        return html`
            <style include="shared-styles">
                :host {
                    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                }
                /* override highlight */
                :host {
                    --paper-menu-focused-item-after: {
                        background: #FFFFFF !important;
                    };
                }
                /* disable focus rectangle */
                :host {
                    --paper-item-focused: {
                        outline: none !important;
                    };
                }
                :host {
                    --paper-font-subhead: {
                        font-size: 14px;
                        font-weight: normal;
                    }
                }
                :host {
                    --paper-item: {
                    min-height: 30px !important;
                    };
                }
                app-header {
                    background-color: rgba(255, 255, 255, 0.95);
                    --app-header-shadow: {
                        box-shadow: inset 0 5px 6px -3px rgba(0, 0, 0, 0.2);
                        height: 10px;
                        bottom: -10px;
                    };
                }
                app-header:not([shadow]) {
                    border-bottom: 1px solid #ddd;
                }
                paper-icon-button {
                    color: #000;
                    --paper-icon-button-ink-color: #31f0ef;
                }
                paper-item:hover {
                    cursor: pointer;
                }
                .sublist paper-item {
                    padding-left: 30px;
                }
                .pannel {
                    width: 100%;
                    height: 100%;
                    padding: 0;
                    margin: 0;
                }
                .title {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .search {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    text-align: right;
                }
                #toolbar {
                    height: 64px;
                }
                #drawerTitleContainer {
                    width: 100%;
                    height: 64px;
                    display: table;
                    background-color: #f3f3f3;
                    border-bottom: 1px solid #e0e0e0;
                }
                #drawerTitle {
                    display: table-cell;
                    vertical-align: middle;
                    text-align: center;
                    font-weight: bold;
                }
                paper-menu, paper-item {
                    display: block;
                    padding: 5px;
                    font-size: 15px;
                }
                .flex-horizontal {
                    @apply --layout-horizontal;
                }
                .flexchild {
                    @apply --layout-flex;
                }
            </style>

            <iron-media-query query="max-width: 400px" query-matches="{{smallScreen}}"></iron-media-query>

            <iron-location id="location" path="{{path}}" hash="{{hash}}" query="{{query}}" dwell-time="{{dwellTime}}"></iron-location>

            <app-header reveals slot="header">
                <app-toolbar id="toolbar">
                    <paper-icon-button icon="menu" on-click="_toggleDrawer"></paper-icon-button>
                    <div class="flex-horizontal" style="width: 100%;">
                        <div class="flexchild title">[[title]]</div>
                        <div class="search"><markazuna-search-bar/></div>
                    </div>
                </app-toolbar>
            </app-header>
            ${this.listTemplate}
            <app-drawer id="drawer" swipe-open slot="drawer">
                <div id="drawerTitleContainer"><div id="drawerTitle">Main Menu</div></div>
                <app-menu id="main_menu">
                    <a class="app-menu-item">
                        <app-menu-icon-item icon="icons:chrome-reader-mode" on-tap="_openUrl" id="questions">Questions</app-menu-icon-item>
                    </a>
                    <a class="app-menu-item">
                        <app-menu-icon-item icon="icons:chrome-reader-mode" on-tap="_openUrl" id="tags">Tags</app-menu-icon-item>
                    </a>
                    <app-submenu>
                        <div class="app-menu-item" slot="submenu-trigger">
                            <app-menu-icon-item icon="icons:accessibility">Access</app-menu-icon-item>
                            <iron-icon icon="expand-more" class="expand-icon"></iron-icon>
                        </div>
                        <app-menu id="access_menu" slot="submenu-content">
                            <a class="app-menu-item" on-tap="_openUrl" id="groups">Groups</a>
                            <a class="app-menu-item" on-tap="_openUrl" id="users">Users</a>
                        </app-menu>
                    </app-submenu>
                    <a class="app-menu-item">
                        <app-menu-icon-item icon="icons:chrome-reader-mode" on-tap="_logout" id="logout">Logout</app-menu-icon-item>
                    </a>
                </app-menu>
            </app-drawer>
        `;
    }

    // child should override this method
    static get listTemplate() { return html`...`; }

    static get properties() {
        return {
            formAuthenticityToken: {
                type: String
            },
            title: {
                type: String,
                value: ''
            },
            page: {
                type: String,
                value: ''
            },
            sections: {
                type: Array,
                value: function() {
                    return [
                        ''
                    ];
                }
            }
        };
    }

    constructor() {
        super();
    }

    ready() {
        super.ready();
    }

    _toggleDrawer() {
        this.$.drawer.toggle();
    }

    _openUrl(e) {
        this.$.location.path = this.$.location.path +'/page/'+ e.target.id;
        window.location.reload(true);
    }

    _logout() {
        var path = this.$.location.path.split('/');
        this.$.location.path = `${path[0]}/admin/logout`;
        window.location.reload(true);
    }
}
customElements.define('base-page', BasePage);