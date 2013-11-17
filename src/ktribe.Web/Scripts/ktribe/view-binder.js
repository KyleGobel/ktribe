/* global define: false */
define(function (require) {
    var $ = require('jquery');
    var ko = require('knockout');
    var _ = require('lodash');
    var system = require('ktribe/system');

    /**
    * Wrapper method around ko.applyBindings to handle jquery objects
    * @method applyBindings
    * @param {object] [viewModel] the view model you want to bind
    * @param {jquery-object} [$selector] the optional selector you want to bind to, or else binds to the whole page
    */
    var applyBindings = function (viewModel, $selector) {
        if (_.isUndefined($selector)) {
            system.log("applyBindings $selector is undefined, binding to whole page instead");
            ko.applyBindings(viewModel);
            return;
        }
        if ($selector.length === 0) {
            system.log("applyBindings $selector contains no elements, cannot bind anything");
            return;
        }
        _.each($selector, function (domElement) {
            ko.applyBindings(viewModel, domElement);
        });
    };

    /**
    * Wrapper function that uses jQuery.Deferred for getting and html
    * document in the views folder.
    * @method getViewHtml
    * @param {string} [viewName] the name of the view you want to retreive
    * @return {promise} with the first parameter as the html of the view you asked for
    */
    var getViewHtml = function (viewName) {
        var deferred = $.Deferred();
        require(['text!views/{0}.html'.format(viewName)], function (view) {
            deferred.resolve(view);
        }, function (err) {
            var errorMessage = err.message;
            errorMessage = errorMessage.replace('HTTP status: 404', '');
            errorMessage = "View '{0}' maps to location: '{1}' which could not be found".format(viewName, errorMessage);
            system.log(errorMessage);
            deferred.reject(errorMessage);
        });
        return deferred;
    };

    /**
    * @method fadeOutInContent
    * @param {string} [htmlContent] the html content you want to fade in
    * @param {jquery-object} [$container] the containing element you want to fade out, then 
    *                                     back in with the new content
    */
    var fadeOutInContent = function (htmlContent, $container) {
        var deferred = $.Deferred();
        if ($container.length <= 0) {
            var errorMessage = "Selector contains no elements";
            system.log(errorMessage);
            deferred.reject(errorMessage);
        }
        _.each($container, function (container) {
            $(container).fadeOut(400, function () {
                $(container).html(htmlContent);
                $(container).fadeIn(400, function () {
                    deferred.resolve();
                });
            });
        });
        return deferred;
    };

    /**
    * This will take a view name and load it into any data-view=[viewName] it 
    * can find on the document.  By default it will fade out the old content and fade
    * in the new view, promise is resolved when the new view is faded in completely.
    * @method loadView
    * @param {string} [viewName] the name of the view that should be loaded
    * @return {promise} 
    */
    var loadView = function (viewName) {
        var deferred = $.Deferred();
        var $viewContainers = $('[data-view={0}]'.format(viewName));
        getViewHtml(viewName).then(function (viewHtml) {
            fadeOutInContent(viewHtml, $viewContainers).then(function () {
                deferred.resolve();
            });
        });
        return deferred;
    };

    /**
    * Wrapper method around requirejs to load a module with a promise
    * @method getViewModel
    * @param {string} [name] the name of view model you want to get
    * @return {promise} with the first parameter being the view model found
    */
    var getViewModel = function (name) {
        var deferred = $.Deferred();
        require(['view-models/{0}'.format(name)], function (viewModel) {
            deferred.resolve(viewModel);
        }, function (err) {
            var errorMessage = err.message;
            errorMessage = errorMessage.replace('HTTP status: 404', '');
            errorMessage = "ViewModel '{0}' maps to location: '{1}' which could not be found".format(name, errorMessage);
            system.log(errorMessage);
            deferred.reject(errorMessage);
        });
        return deferred;
    };

    /**
    * Given a name of a view model, loads the view model, and binds it to
    * the data attribute data-view-model=[viewModelName]
    * @method bindViewModel
    * @param {string} [viewModelName] name of the view model you want to bind
    * @return {promise}
    */
    var bindViewModel = function (viewModelName) {
        var deferred = $.Deferred();
        var $viewModelContainer = $('[data-view-model={0}]'.format(viewModelName));
        //load the viewModel
        getViewModel(viewModelName).then(function (viewModel) {
            if (_.isUndefined(viewModel)) {
                system.log("'{0}' View Model Factory is undefined!".format(viewModel));
                return;
            }
            if (_.isFunction(viewModel)) {
                //if the view model is a function, new it up
                system.log("'{0}' is a function, newing it".format(viewModelName));
                viewModel = new viewModel();
            }

            system.log(viewModel);
            applyBindings(viewModel, $viewModelContainer);
            deferred.resolve();
        });
        return deferred;
    };

    /**
    * This will handle everything, find all data-view attributes and load them
    * find all data-view-model attributes and bind the view models to them
    * find all the data-vvm attributes and load the view, and bind the view
    * model to it, as well as fade them in.
    * @method bindAll
    */
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
                loadView(viewName);
                bindedViews.push(viewName);
            }
        });
        //find all data-view-model attributes in the document
        var $viewModelContainers = $('*[data-view-model]');
        system.log("Found {0} view model attributes on page".format($viewModelContainers.length));
        //empty array so we don't try to bind same element twice
        var bindedViewModels = [];
        //loops through each element and binds the view models
        _.each($viewModelContainers, function (obj) {
            var viewModelName = $(obj).attr('data-view-model');
            if (!_.contains(bindedViewModels, viewModelName)) {
                system.log("Binding '{0}' View Models...".format(viewModelName));
                bindViewModel(viewModelName);
                bindedViewModels.push(viewModelName);
            }
        });
        var $everythingContainers = $('*[data-vvm]');
        system.log("Found {0} vvm attributes on page".format($everythingContainers.length));
        var bindedVvms = [];
        _.each($everythingContainers, function (container) {
            var name = $(container).attr('data-vvm');
            var transition = $(container).attr('data-load-transition');
            if (!_.contains(bindedVvms, name)) {
                getViewHtml(name).then(function (html) {
                    if (transition === "none") {
                        $(container).html(html);
                        getViewModel(name).then(function (viewModel) {
                            applyBindings(viewModel, $(container));
                        });
                    } else {
                        $(container).fadeOut(400, function () {
                            $(container).html(html);
                            getViewModel(name).then(function (viewModel) {
                                applyBindings(viewModel, $(container));
                                $(container).fadeIn();
                            });
                        });
                    }
                });
            }
        });
    };

    /**
    * public interface
    * currently only exposing a couple methods
    */
    var viewBinder = {
        applyBindings: applyBindings,
        bindAll: bindAll
    };

    return viewBinder;

    /** 
    * private 
    * @method showView
    * @param {jquery-object} [$container] the containing element where the view will be shown
    * @param {jquery-object} [$view] the jquery view object
    * @param {object} [viewModel] the viewmodel to bind to the view
    */
    function showView($container, $view, viewModel) {
        $container.hide();
        $container.html($view);
        $.each($container, function () {
            ko.applyBindings(viewModel, this);
        });
        $container.fadeIn();
    }
});