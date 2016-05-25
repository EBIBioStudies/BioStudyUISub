'use strict';

module.exports =
    function ($log, $uibModal) {

        function showMessagesDialog(params) {
            var modalInstance = $uibModal.open({
                templateUrl: params.template,
                backdrop: 'static',
                resolve: {
                    messages: function () {
                        return params.messages;
                    }
                },
                size: 'lg',
                controller: function ($scope, messages) {
                    $scope.messages = messages;
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

        function errorMessagesDialog(messages) {
            return showMessagesDialog({
                template: 'templates/partials/errorDialog.html',
                messages: messages
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

