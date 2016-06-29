'use strict';

angular.module('mean')
    .controller('stripeCtrl', function ($scope, paymentService, $location, ngCart) {
        $scope.total = ngCart.totalCost();
        $scope.isCartEmpty = ngCart.getItems();
        $scope.paymentRequest = {
            success: false,
            error: false,
            message: ''
        };

        $scope.settings = {
            paypal: {
                business: 'mzelarayan@makingsense.com',
                itemName: 'Group of products',
                itemNumber: '22323',
                currencyCode: 'USD'
            }
        };

        $scope.handleStripe = function(status, response){
            $scope.paymentRequest.success = false;
            $scope.paymentRequest.error = false;

            if(response.error) {
                $scope.paymentRequest.error = true;
                $scope.paymentRequest.message = response.error.message;
            } else {

                var data = {
                    id: response.id,
                    amount: $scope.total,
                    currency: 'USD',
                    description: 'test description'
                };

                paymentService.stripe(data)
                    .then(function(){
                        ngCart.empty();
                        $scope.paymentRequest.success = true;
                    }, function(err) {
                        $scope.paymentRequest.error = true;
                        $scope.paymentRequest.message = err.message;
                    });
            }
        }

    });
