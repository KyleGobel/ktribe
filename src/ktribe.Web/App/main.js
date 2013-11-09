requirejs.config({
    basePath: '/App',
    paths: {
        'ktribe': '../Scripts/ktribe',
        'text': '../Scripts/text',
        'underscore' : '../Scripts/underscore'
    },
    shim : {
        'underscore' : {
            exports : '_'
        }
    }
});

//Define our named modules so we can use them anywhere (they are included globally)
define('jquery', function () { return jQuery; });
define('knockout', ko);

define(function (require) {
    var system = require('ktribe/system');
    var viewBinder = require('ktribe/view-binder');

    //turn the system debugger on
    system.debug(true);

    //RUN YOUR JAVASCRIPT HERE


    //Scan page and bind everything we can
    viewBinder.bindAll();
});