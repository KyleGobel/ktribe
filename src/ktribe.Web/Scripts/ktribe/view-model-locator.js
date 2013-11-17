/* global define: false */
define(function(require) {
    var ko = require('knockout');
    var $ = require('jquery');
    var system = require('ktribe/system');

    var getViewModel = function(name) {
        //first try the data-view-model attribute to find the view
        var $viewModelContainer = $('[data-view-model={0}'.format(name));

        if ($viewModelContainer.length > 0)
            return ko.dataFor($viewModelContainer.get(0));

        //next try the vvm
        var $container = $('[data-vvm={0}'.format(name));

        if ($container.length > 0)
            return ko.dataFor($container.get(0));

        return null;
    };

    var viewLocator = {
        /**
        * Get View Model
        * @param [string] name - the name of the view model you're looking for
        * @returns [object] - the view model that you're looking for if it's found bound somewhere
        */
        getViewModel: getViewModel
    };

    return viewLocator;
});