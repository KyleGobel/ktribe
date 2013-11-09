define(function (require) {
    var $ = require('jquery');
    var ko = require('knockout');
    var _ = require('underscore');
    var system = require('ktribe/system');

    /**
    * Apply Bindings Public Function
    * ------------------------------
    * A simple wrapper for knockouts applyBindings that will take
    * a jquery element rather than a dom element, and will bind the
    * viewModel to everything in the $selector collection
    */
    var applyBindings = function (viewModel, $selector) {
        if (_.isUndefined($selector)) {
            system.log("applyBindings $selector is undefined, binding to whole page instead");
            ko.applyBindings(viewModel);
            return;
        }

        if ($selector.length == 0) {
            system.log("applyBindings $selector contains no elements, cannot bind anything");
            return;
        }

        _.each($selector, function (domElement) {
            ko.applyBindings(viewModel, domElement);
        });
    }
    var bindViewModelToView = function (viewModel, viewName) {
        var $viewContainer = $('[data-view={0}'.format(viewName));
        system.log("Loading View '{0}'".format(viewName));

        require(['text!views/{0}.html'.format(viewName)], function (view) {
            var $loader = $viewContainer.children('*[data-loader]');
            if ($loader.length > 0) {
                $loader.fadeOut(400, function () {
                    showView($viewContainer, view, viewModel);
                });
            }
            else {
                showView($viewContainer, view, viewModel);
            }
        });
    };
    var bind = function (name) {
        require(['view-models/{0}'.format(name)], function (viewModelFactory) {
            var viewModel;

            if (_.isUndefined(viewModelFactory)) {
                system.log("'{0}' View Model Factory is undefined!".format(name));
                return;
            }

            if (_.isFunction(viewModelFactory)) {
                //if the view model is a function, new it up
                viewModel = new viewModelFactory();
            } else {
                //if it's just an object, just use it
                viewModel = viewModelFactory;
            }

            bindViewModelToView(viewModel, name);

            applyBindings(viewModel, $('[data-view-model={0}'.format(name)));
        });
    };
    var bindAll = function () {
        //find all the elements with the data-view attribute
        var $viewContainers = $('*[data-view]');
        system.log("Found {0} view containers on page".format($viewContainers.length));

        //create an empty array so we don't try to bind the same element twice
        var bindedViews = [];

        //loop through each of the elements with data-view attribute
        _.each($viewContainers, function (obj) {
            //grab the view name
            var viewName = $(obj).attr('data-view');

            //make sure we haven't already bound this view
            if (!_.contains(bindedViews, viewName)) {
                system.log("Binding '{0}' view-model to view".format(viewName));
                bindedViews.push(viewName);
                bind(viewName);
            }
        });
    };

    var viewBinder = {
        applyBindings : applyBindings,
        bindAll: bindAll
    };

    return viewBinder;


    function showView($container, $view, viewModel) {
        $container.hide();
        $container.html($view);

        $.each($container, function() {
            ko.applyBindings(viewModel, this);
        });
        $container.fadeIn();
    }
});