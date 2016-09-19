var angApp = angular.module('angApp', []);

angApp.controller('mainController', function ($scope, $http) {
    $scope.formData = {};

    $scope.getTodos = function () {
        $http.get('/app/getTodos')
            .success(function (data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

    }

    $scope.createTodo = function () {
        console.log($scope.formData.name);
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        var data = $.param({
            name: $scope.formData.name
        })

        var create = $http.post('/app/addTodo', data, config)
            .success(function (data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another

            })
            .error(function (data) {
                console.log('Error: ' + data);
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
            _id: todo._id,
            name: todo.name
        });

        $http.post('/app/deleteTodo', todo)
            .success(function (data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                console.log(data);

            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
        $scope.getTodos();
    }

});