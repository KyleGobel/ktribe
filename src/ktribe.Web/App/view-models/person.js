define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var ko = require('knockout');

    var personViewModel = {
        firstName: ko.observable(),
        lastName: ko.observable(),
        age: ko.observable(),
    }

    //add on computed
    personViewModel.fullName = ko.computed(function () {
        return personViewModel.firstName() + " " + personViewModel.lastName();
    })

    //create an inital person
    personViewModel.firstName("Kyle");
    personViewModel.lastName("Gobel");
    personViewModel.age(27);

    return personViewModel;
});