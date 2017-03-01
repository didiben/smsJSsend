// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})
.controller('SmsCtroller', ['$scope','$ionicPlatform','$cordovaSms', function ($scope,$ionicPlatform,$cordovaSms) {
    $scope.form = {
        numbers: "0672686994;0672686994;0672686994;0672686994;0672686994",
        names: "Benoit;Camille;Chloé;Jérémy;Pascal",
        times: "21h;23h;00h;22h;01h",
        message: "Coucou *, tu es dans le bus de *"
    };
    $scope.readyToGo = false;
    $scope.readyToCheck = true;
    $scope.done = false;
    $scope.verifyNumbers = function() {
        console.log('verifyNumbers launched !');
    };
    $scope.verifyNames = function() {
        console.log('verifyNames launched !');
    };
    $scope.verifyTimes = function() {
        console.log('verifyTimes launched !');
    };
    $scope.verifyMessage = function() {
        console.log('verifyMessage launched !');
    };
    var data = new Array();
    var message = '';
    var count = 0;

    $scope.dataTreat = function() {
        console.log('############# dataTreat launched ! #############');
        var input = $scope.form;
        if (input.numbers != undefined && input.names != undefined && input.times != undefined && input.message != undefined) {
            console.log('############# $scope isn\'t empty #############');
            count = input.numbers.split(';').length; // -1 to hve the correct ';' count, here it's just the number of people
            console.log('############# ' + (count) + ' entries #############');
            for (var i = 0; i < count; i++) {
                console.log('############# Proceeding entry #' + (i + 1) + ' #############');
                var n = input.numbers.indexOf(';');
                var t = input.names.indexOf(';');
                var p = input.times.indexOf(';');
                if (n == -1 || t == -1 || p == -1) {
                    n = input.numbers.length + 1;
                    t = input.names.length + 1;
                    p = input.times.length + 1;
                }
                data[i] = {
                    number: input.numbers.substring(0, n),
                    name: input.names.substring(0, t),
                    time: input.times.substring(0, p),
                };
                console.log(data[i]);
                input.numbers = input.numbers.substring(n + 1);
                input.names = input.names.substring(t + 1);
                input.times = input.times.substring(p + 1);
            }
            console.log(data);
            message = input.message;
            delete $scope.form;
            delete input;
            $scope.readyToGo = true;
            $scope.readyToCheck = false;
        } else {
            alert('Erreur d\'entrée');
        }
    };

    $scope.sendSMS = function() {
        console.log('############# sendSMS launched ! #############');
        var options = {
            replaceLineBreaks: true, // true to replace \n by a new line, false by default
            android: {
                intent: '' // send SMS without open any other app
                //intent: 'INTENT'  //send SMS with the native android SMS messaging
            }
        };
        function nextStep(texto, options) {
            console.log('############# Sening text... #############');
            console.log(texto);
            $ionicPlatform.ready(function() {
                $cordovaSms
                .send(data[i].number, texto, options)
                .then(function(result) {
                    console.log(result);

                }, function(error) {
                    console.log(error);
                })
            })
        }
        for (var i = 0; i < count; i++) {
            console.log('############# Proceeding entry #' + (i + 1) + ' #############');
            var n = 0;
            var texto = message;
            for (var j = 0; j < 2; j++) {
                var n = texto.indexOf('*')
                switch (j) {
                    case 0:
                    texto = texto.substring(0, n) + data[i].name + texto.substring(n + 1);
                    break;
                    case 1:
                    texto = texto.substring(0, n) + data[i].time + texto.substring(n + 1);
                    nextStep(texto, options);
                    break;
                }
            }
            if (i == 4) {
                $scope.readyToGo = false;
                $scope.done = true;
            }
        }
    };
}])
