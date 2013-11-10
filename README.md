ktribe
======

A tribe of JS libraries with the goal and some glue to make it extremely easy to use knockout/require/jquery together for easy MVVM.

Ideas were mainly taken from Durandal, and some of the code.

ktribe brings a couple html5 attributes to make binding easier.


###data-view

*MyView.html*
```
<p>This is just a pretty simple static view</p>
```


*Index.cshtml* (Any ASP.net MVC view)
```
<!--some code or controls-->

<div data-view='MyView'>
    Content Loading
</div>

<!--more asp.net code-->
```

*RandomJavascriptFile.js*
```
var viewBinder = require('ktribe/view-binder');
viewBinder.bindAll();
```

*Rendered Output*
```
<!--some code or controls-->

<div data-view='MyView'>
  <p>This is just a pretty simple static view</p>
</div>

<!--more asp.net code-->
