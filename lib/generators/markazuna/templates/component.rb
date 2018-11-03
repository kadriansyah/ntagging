/*---------------------------------------------------------------------
  For oldie browser
  load webcomponents bundle, which includes all the necessary polyfills
----------------------------------------------------------------------*/
import '@webcomponents/webcomponentsjs/webcomponents-loader.js'

/*---------------------------------------------------------------------
  Import Components
----------------------------------------------------------------------*/
import './<%= plural_name %>-page.js'
import './<%= singular_name %>-list.js'
import './<%= singular_name %>-form.js'