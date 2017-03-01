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
    var now = new Date();
    var nbError = 0;
    var error = new Array();

    errorGestion = function (error, infos) {
        function addZero(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
        nbError++;
        $scope.errors = error;
        error[nbError - 1] = {
            number: nbError,
            time: addZero(now.getHours()) + ':' + addZero(now.getMinutes()) + ':' + addZero(now.getSeconds()),
            recipientName: infos.name,
            recipientPhone: infos.number
        };
    }

    nbError = 0;
    $scope.form = {
        numbers: '0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994;0672686994',
        names: 'Camille;Chloé;Jérémy;Pascal;Benoit;Camille;Chloé;Jérémy;Pascal;Benoit;Camille;Chloé;Jérémy;Pascal;Benoit;Camille;Chloé;Jérémy;Pascal;Benoit;Camille;Chloé;Jérémy;Pascal;Benoit;Camille;Chloé;Jérémy;Pascal;Benoit;Camille;Chloé;Jérémy;Pascal;Benoit;Camille;Chloé;Jérémy;Pascal;Benoit',
        times: '23h;00h;22h;01h;21h;23h;00h;22h;01h;21h;23h;00h;22h;01h;21h;23h;00h;22h;01h;21h;23h;00h;22h;01h;21h;23h;00h;22h;01h;21h;23h;00h;22h;01h;21h;23h;00h;22h;01h;21h',
        message: 'Coucou *, tu es dans le bus de *'
    };
    $scope.readyToGo = false;
    $scope.readyToCheck = true;
    $scope.done = false;
    $scope.verifyNumbers = function() {
        console.log('############# verifyNumbers launched ! #############');
        if ($scope.form.numbers.substring(0,2) != '06' && $scope.form.numbers.substring(0,2) != '07') {
            $scope.form.numbers = undefined;
            alert('Mauvais format de numéros 1');
        }
    };
    $scope.verifyNames = function() {
        console.log('############# verifyNames launched ! #############');
        var regex = /\d/g;
        if (regex.test($scope.form.names) === true) {
            $scope.form.names = undefined;
            alert('Mauvais format de noms');
        }
    };
    $scope.verifyTimes = function() {
        console.log('############# verifyTimes launched ! #############');
        var regex = /\d/g;
        if ($scope.form.times.substring(0,2) == '06' && $scope.form.times.substring(0,2) == '07') {
            $scope.form.times = undefined;
            alert('Mauvais format d\'horaire');
        }
        if (regex.test($scope.form.times.substring(2,3)) === true) {
            $scope.form.times = undefined;
            alert('Mauvais format d\'horaire');
        }
    };
    $scope.verifyMessage = function() {
        console.log('############# verifyMessage launched ! #############');
        if ($scope.form.message.split('*').length -1 != 2) {
            $scope.form.message = undefined;
            alert('Mauvais format de message');
        }
    };
    var data = new Array();
    var message = '';
    var count = 0;

    $scope.dataTreat = function() {
        console.log('############# dataTreat launched ! #############');
        var input = $scope.form;

        $scope.verifyNumbers();
        $scope.verifyNames();
        $scope.verifyTimes();
        $scope.verifyMessage();

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
                    errorGestion(error, data[i]);
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
