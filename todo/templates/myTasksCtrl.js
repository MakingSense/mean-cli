function __moduleName__Ctrl($scope) {

    $scope.tasks = [{
            id: 1,
            text: 'Test task 1',
            done: true
    },
        {
            id: 2,
            text: 'Test task 2',
            done: false
        },
        {
            id: 3,
            text: 'Hello world !',
            done: true
        }
    ];

    $scope.cont = $scope.tasks.length;

    var msgAlert = function (msg, isVisible, state) {
        $scope.msgAlert = msg;
        $scope.msgVisible = isVisible;
        $scope.styleAdded = state;
    }

    $scope.remaining = function () {
        var count = 0;
        angular.forEach($scope.tasks, function (task) {
            count += task.done ? 0 : 1;
        });
        numDone();
        return count;
    };

    var numDone = function () {
        $scope.countDelete = 0;
        angular.forEach($scope.tasks, function (t) {
            $scope.countDelete += t.done ? 1 : 0;
        });
    };

    $scope.delSelectedTasks = function () {
        if ($scope.countDelete == 0) {
            msgAlert("You must select the task to delete", true, false);
            return;
        }
        angular.forEach($scope.tasks, function (task) {
            if (task.done == true) {
                var index = $scope.tasks.indexOf(task);
                $scope.tasks.splice(index, 1);
            }
        });
        numDone();
        msgAlert("Deleted task", true, true);
    };
    
    $scope.addTask = function () {
        if ($scope.textNewTask == "" || $scope.textNewTask == undefined) {
            $scope.empty = true;
            msgAlert("You must enter a task", true, false);
            return;
        } else {
            $scope.tasks.push({
                text: $scope.textNewTask,
                done: false
            });
            msgAlert("Task added", true, true)
            $scope.textNewTask = '';
        }
    };

    $scope.verifyText = function () {
        if ($scope.textNewTask != "" || $scope.textNewTask != undefined) {
            msgAlert("", false, false);
            $scope.empty = false;
        }
    }
}