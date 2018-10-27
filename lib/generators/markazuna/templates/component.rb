/*---------------------------------------------------------------------
  For oldie browser
  load webcomponents bundle, which includes all the necessary polyfills
----------------------------------------------------------------------*/
import '@webcomponents/webcomponentsjs/webcomponents-loader.js'

/*---------------------------------------------------------------------
  Import Components
----------------------------------------------------------------------*/
import './components/<%= plural_name %>-page.js'
import './components/<%= singular_name %>-list.js'
import './components/<%= singular_name %>-form.js'