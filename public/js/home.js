var angApp = angular.module('angApp', ['ngRoute']);

angApp.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl: '/static/views/home.html',
            controller: 'mainController'
        })
        .when('/doc', {
            templateUrl: '/static/views/doc.html',
            controller: 'mainController'
        })
        .when('/contact', {
            templateUrl: '/static/views/contact.html',
            controller: 'mainController'
        }).
        otherwise({
            template : "<h1>Oops! Page not found</h1>"
        });

}]);

angApp.controller('mainController', function ($scope, $http) {
    $scope.formData = {};
    $scope.config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    $scope.initialize = function () {
        $.notify.defaults({className: "success"});
        $scope.getTodos();
    };

    $scope.getTodos = function () {
        console.log("Getting Todos");
        $http.get('/app/getTodos')
            .success(function (data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

    };

    $scope.createTodo = function () {
        console.log($scope.formData.name);

        var filteredTodo = $scope.todos.filter(function (todo) {
            return todo.name == $scope.formData.name
        });
        if (filteredTodo.length > 0) {
            $("#todoInputArea").notify("Todo already exists", {position: "bottom", className: "info"});
            return;
        }

        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        var todo = $.param({
            name: $scope.formData.name,
            completed: false
        })

        var create = $http.post('/app/addTodo', todo, $scope.config)
            .success(function (data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $('#submit').notify("Todo created", {position: "right"});
            })
            .error(function (data) {
                console.log('Error: ' + data);
                $('#submit').notify("Todo creation failed. Please try again", {position: "right", className: "error"});
            })
        create.then($scope.getTodos());

    };

    $scope.deleteTodo = function (todo) {
        console.log("To do ID :" + todo._id);
        console.log("To do name:" + todo.name);

        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        var data = $.param({
            _id: todo._id
        });

        var del = $http.post('/app/deleteTodo', data, $scope.config)
            .success(function (data) {
                $.notify("Todo deleted", {position: "bottom center"});

            })
            .error(function (error) {
                $.notify("Todo deletion failed. Please try again", {position: "bottom center", className: "error"});
            })
            .catch(function (error) {
                console.log(error.statusText);
            });
        del.then($scope.getTodos());
    };

    //For both false and true
    $scope.setCompleted = function (isCompleted, todo) {

        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        var data = $.param({
            _id: todo._id,
            completed: isCompleted
        });

        var updateTodo = $http.post('/app/updateTodo', data, $scope.config)
            .success(function (data) {
                $.notify("Todo status changed!", {position: "bottom center", className: "info"});
            })
            .error(function (error) {
                $.notify("Todo update failed. Please try again", {position: "bottom center", className: "error"});
            })
            .catch(function (error) {
                console.log(error.statusText);
            });
        updateTodo.then($scope.getTodos());

    }

});