ktribe
======

A tribe of JS libraries with the goal to make it extremely easy and clean to bind views and view models
together.  Not really meant for a SPA, but more like an asp.net website where you just want to bind some javascript 
view models to some different areas or views.  ktribe makes that easier.

##Dependencies
The tribe of JS libraries that this works with are:

-  JQuery
-  Knockout
-  RequireJs
-  Underscore

All view models are expected to be AMD (requireJS) modules.


Ideas were mainly taken from Durandal, and some of the code :-).

ktribe brings a couple html5 attributes to make binding easier.


###data-view
-------------------------

**MyView.html**
```
<p>This is just a pretty simple static view</p>
```


**Index.cshtml** (Any ASP.net MVC view)
```
<!--some code or controls-->

<div data-view='MyView'>
    Content Loading
</div>

<!--more asp.net code-->
```

**RandomJavascriptFile.js**
```
var viewBinder = require('ktribe/view-binder');
viewBinder.bindAll();
```

**Rendered Output**
```
<!--some code or controls-->

<div data-view='MyView'>
  <p>This is just a pretty simple static view</p>
</div>

<!--more asp.net code-->
```

Somewhat of a worthless example, but if you wanted to just load static html snippets via javascript you could.

There is a couple conventions used here.  Your views are expected to be in their own folder somewhere (Views), and should be 
named the name of the view, and end with a .html extension.  Likewise your View Models should also be in their own folder
and named the same way, except with a .js extension, and should return a javascript view model object.  The folders they are 
located in can be configured via the requirejs config file.

###data-view-model
-----------------------------

Similar to the ``data-view`` attribute, except this one is a way to indicate what view model you want to be bound to the container
element


**Person.js**
A standard issue knockout view model
```
define(function (require) {
    var ko = require('knockout');
    
    var personViewModel = {
        firstName: ko.observable();
        lastName: ko.observable();
    };
    
    //populate for demonstration purposes
    personViewModel.firstName("Kyle");
    personViewModel.lastName("Gobel");
    
    return personViewModel;
});
```

**Index.cshtml**
```
<!-- asp.net stuff -->

<div data-view-model='Person'>
    <p>First Name: <span data-bind='text: firstName'></span></p>
    <p>Last Name: <span data-bind='text: lastName'></span></p>
</div>
```

Then just call the ``viewBinder.bindAll()`` javascript method and everything will be bound up.  
Typically the ``viewBinder.bindAll()`` would be called in your asp.net layout file or something on every page
so everything gets bound automatically and you don't have to worry about it.

###data-vvm
------------------------------


This attribute does everything all in one.

**person.html**

Your plain html view.
```
<p>First Name: <span data-bind='text: firstName'></span></p>
<p>Last Name: <span data-bind='text: lastName'></span></p>
```

**person.js**

Plain knockout view model
```
define(function (require) {
    var ko = require('knockout');
    
    var personViewModel = {
        firstName: ko.observable();
        lastName: ko.observable();
    };
    
    //populate for demonstration purposes
    personViewModel.firstName("Kyle");
    personViewModel.lastName("Gobel");
    
    return personViewModel;
});
```

**Index.cshtml**

Your asp.net host page
```
<!--other content -->

<div data-vvm='person'>
    Content Loading
</div>
```

When the ``viewBinder.bindAll()`` is called now it will load the view, load the view model, bind them together, and place 
them in the proper container (the container marked with data-vm='[name]').  Whatever content is initially in the container
will be faded out and the newly bound view/view-model will be faded in it's place.





