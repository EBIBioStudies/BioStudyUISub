'use strict';

module.exports =
    function ($log, $uibModal) {

        function showMessagesDialog(params) {
            var modalInstance = $uibModal.open({
                templateUrl: params.template,
                backdrop: 'static',
                resolve: {
                    params: function () {
                        return params;
                    }
                },
                size: 'lg',
                controller: function ($scope, params) {
                    $scope.params = params;
                }
            });
            return modalInstance.result;
        }

        function successMessagesDialog(messages) {
            return showMessagesDialog({
                template: 'templates/partials/successDialog.html',
                messages: messages
            });
        }

        function errorMessagesDialog(messages, title) {
            return showMessagesDialog({
                template: 'templates/partials/errorDialog.html',
                messages: messages,
                title: title || 'Errors'
            });
        }
        
        function confirmDialog(messages) {
            return showMessagesDialog({
                template: 'templates/partials/confirmDialog.html',
                messages: messages
            });
        }

        return {
            successMessages: successMessagesDialog,
            errorMessages: errorMessagesDialog,
            confirm: confirmDialog
        }
    };

