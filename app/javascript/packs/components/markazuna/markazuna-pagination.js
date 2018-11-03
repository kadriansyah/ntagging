import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { templatize } from '@polymer/polymer/lib/utils/templatize.js';

class MarkazunaPagination extends PolymerElement {
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
             * Visibiliy
             */
            hidden: {
                type: Boolean,
                computed: '_computedHidden(page, count, range, url)',
                notify: true,
                reflectToAttribute: true
            },
            /**
             * Page information
             */
            pageNumber: {
                type: Array,
                computed: '_computePageNumber(page, count, range, url)'
            },
            /**
             * Previous page information, null when current is first page
             */
            previous: {
                type: Object,
                computed: '_computePrevious(page, count, range, url, hidePrevious)'
            },
            /**
             * Next page information, null when current is last page
             */
            next: {
                type: Object,
                computed: '_computeNext(page, count, range, url, hideNext)'
            },
            /**
             * First page information, null when current is first page
             */
            first: {
                type: Object,
                computed: '_computeFirst(page, count, range, url, hideFirst)'
            },
            /**
             * Last page information, null when current is last page
             */
            last: {
                type: Object,
                computed: '_computeLast(page, count, range, url, hideLast)'
            }
        }
    }

    static get observers() {
        return [
            '_render(page, count, range, url, hideFirst, hidePrevious, hideNext, hideLast)'
        ]
    }

    constructor() {
        super();
        this.style.display = 'inline';
    }

    ready() {
        super.ready();
    }

    connectedCallback() {
        super.connectedCallback();
        // Render pagination
        this._render();
    }

    /**
     * Compute visibility of component
     *
     * @param {Number} page Page number
     * @param {Number} count Page count
     * @param {Number} range Display range
     * @return {Boolean}
     */
    _computedHidden(page, count, range) {
        let hidden = false;
        if (!page || isNaN(page * 1) || page * 1 < 1) {
            hidden = true;
            console.warn(`<markazuna-pagination> property page is invalid: ${page}`);
        }
        if (!count || isNaN(count * 1) || page * 1 < 1) {
            hidden = true;
            console.warn(`<markazuna-pagination> property count is invalid: ${count}`);
        }
        if (count * 1 === 1) {
            hidden = true;
            console.info(`<markazuna-pagination> single page detected.`);
        }
        if (!range || isNaN(range * 1) || page * 1 < 1) {
            hidden = true;
            console.warn(`<markazuna-pagination> property range is invalid: ${range}`);
        }
        this.style.display = hidden ? 'none' : 'inline'
            ;
        return hidden;
    }

    /**
     * Caculate page information
     *
     * @param {Number} page Page number
     * @param {Number} count Page count
     * @param {Number} range Display range
     * @return {Array} Page information
     */
    _computePageNumber(page, count, range) {
        page = Math.max(1, page);
        count = Math.max(1, count);
        range = Math.max(1, range);
        page = Math.min(count, page);
        let result = [];
        for (let i = Math.max(1, page * 1 - range + 1); i <= Math.min(count * 1, page * 1 + range - 1); i++) {
            result.push({
                css: 'general' + (page * 1 === i ? ' current' : ''),
                page: i,
                text: i,
                current: page * 1 === i,
                url: this._resolveUrl(i, count, this.url)
            });
        }
        return result;
    }

    /**
     * Caculate previous page information
     *
     * @param {Number} page Page number
     * @param {Number} count Page count
     * @param {Number} range Display range
     * @param {String} url Url template
     * @param {Boolean} hidePrevious Hide previous element
     * @return {Object} Previous page information, null when current is first page
     */
    _computePrevious(page, count, range, url, hidePrevious) {
        page = Math.max(1, page);
        count = Math.max(1, count);
        range = Math.max(1, range);
        page = Math.min(count, page);
        return hidePrevious || (page * 1 === 1) ? null : {
            css: 'general previous',
            page: Math.max(1, page * 1 - 1),
            text: Math.max(1, page * 1 - 1),
            url: this._resolveUrl(Math.max(1, page * 1 - 1), count, url)
        };
    }

    /**
     * Caculate next page information
     *
     * @param {Number} page Page number
     * @param {Number} count Page count
     * @param {Number} range Display range
     * @param {String} url Url template
     * @param {Boolean} hideNext Hide next element
     * @return {Object} Next page information, null when current is last page
     */
    _computeNext(page, count, range, url, hideNext) {
        page = Math.max(1, page);
        count = Math.max(1, count);
        range = Math.max(1, range);
        page = Math.min(count, page);
        return hideNext || (page * 1 === count * 1) ? null : {
            css: 'general next',
            page: Math.min(count * 1, page * 1 + 1),
            text: Math.min(count * 1, page * 1 + 1),
            url: this._resolveUrl(Math.min(count * 1, page * 1 + 1), count, url)
        };
    }

    /**
     * Caculate first page information
     *
     * @param {Number} page Page number
     * @param {Number} count Page count
     * @param {Number} range Display range
     * @param {String} url Url template
     * @param {Boolean} hideFirst Hide first element
     * @return {Object} First page information, null if current is first page
     */
    _computeFirst(page, count, range, url, hideFirst) {
        page = Math.max(1, page);
        count = Math.max(1, count);
        range = Math.max(1, range);
        page = Math.min(count, page);
        return hideFirst || (page * 1 === 1) ? null : {
            css: 'general first',
            page: 1,
            text: 1,
            url: this._resolveUrl(1, count, url)
        };
    }

    /**
     * Caculate last page information
     *
     * @param {Number} page Page number
     * @param {Number} count Page count
     * @param {Number} range Display range
     * @param {String} url Url template
     * @param {Boolean} hideLast Hide last element
     * @return {Object} Last page information, null if current is last page
     */
    _computeLast(page, count, range, url, hideLast) {
        page = Math.max(1, page);
        count = Math.max(1, count);
        range = Math.max(1, range);
        page = Math.min(count, page);
        return hideLast || (page * 1 === count * 1) ? null : {
            css: 'general last',
            page: count * 1,
            text: count * 1,
            url: this._resolveUrl(count * 1, count, url)
        };
    }

    /**
     * Generate real url from template text
     *
     * @param {Number} page Page number
     * @param {Number} count Page count
     * @param {String} template Template of url
     * @returns {String} Url
     */
    _resolveUrl(page, count, template) {
        return (template || '#').replace(/#\{page}/, page).replace(/#\{count}/, count);
    }

    /**
     * Render elements of page link
     *
     * @return {Void}
     */
    _render() {
        let root = this.querySelector(':scope > .root');
        // Create a node as a root for rendering page link
        // For customize styling, shadow dom is not used
        if (!root) {
            root = document.createElement('span');
            root.classList.add('root');
            this.appendChild(root);
        };
        // Remove exists content
        while (root.firstChild) {
            root.removeChild(root.firstChild);
        }
        let templateClass, instance;
        // first
        if (this.first && (templateClass = this._getTemplateType('first'))) {
            instance = new templateClass(this.first);
            root.appendChild(this._bindClickHandler(instance, this.first).root);
        }
        // previous
        if (this.previous && (templateClass = this._getTemplateType('previous'))) {
            instance = new templateClass(this.previous);
            root.appendChild(this._bindClickHandler(instance, this.previous).root);
        }
        // general & current
        if ((templateClass = this._getTemplateType('general'))) {
            let currentTempateClass = this._getTemplateType('current'), pages = this.pageNumber;
            pages.forEach((page) => {
                if (page.current && currentTempateClass) {
                    instance = new currentTempateClass(page);
                } else {
                    instance = new templateClass(page);
                }
                root.appendChild(this._bindClickHandler(instance, page).root);
            });
        }
        // next
        if (this.next && (templateClass = this._getTemplateType('next'))) {
            instance = new templateClass(this.next);
            root.appendChild(this._bindClickHandler(instance, this.next).root);
        }
        // last
        if (this.last && (templateClass = this._getTemplateType('last'))) {
            instance = new templateClass(this.last);
            root.appendChild(this._bindClickHandler(instance, this.last).root);
        }
    }

    /**
     * Bind page click event to element
     *
     * @param {DocumentFragment} fragment Document fragment created from template
     * @param {Function} handler Page click event handler
     * @param {Object} data Page information
     * @return {DocumentFragment}
     */
    _bindClickHandler(fragment, data) {
        // Bind event handler where `general` class is applied
        Array.prototype.forEach.call(fragment.root.querySelectorAll('.general'), (item) => {
            item.addEventListener('click', e => {
                // Disable hyperlink
                e.preventDefault();
                this.dispatchEvent(new CustomEvent('pageClick', {bubbles: true, composed: true, detail: {page: data.page}}));
            }, false);
        });
        return fragment;
    }

    /**
     * Get render template
     *
     * @param {String} name Slot name
     * @return {Class} TemplateInstance class
     */
    _getTemplateType(name) {
        let TemplateClass = this[`__pageTemplate${name}`];
        if (!TemplateClass) {
            // template
            let template = this.querySelector(`template[slot=${name}]`);
            if (!template) {
                console.warn(`[markazuna-pagination] requires a <template slot="${name}"> child`);
                return null;
            }
            // initialize template class
            TemplateClass = this[`__pageTemplate${name}`] = templatize(template, this, {
                instanceProps: {
                    css: String,
                    page: Number,
                    text: String,
                    curent: Boolean,
                    url: String
                }
            });
        }
        return TemplateClass;
    }
}
customElements.define('markazuna-pagination', MarkazunaPagination);