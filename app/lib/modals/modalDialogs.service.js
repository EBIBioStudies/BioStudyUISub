import successDialogTmpl from './successDialog.html!ng-template'
import errorDialogTmpl from './errorDialog.html!ng-template'
import confirmDialogTmpl from './confirmDialog.html!ng-template'

export default class ModalDialogsService {
    constructor($uibModal) {
        "ngInject";

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
                template: successDialogTmpl.templateUrl,
                messages: messages
            });
        }

        function errorMessagesDialog(messages, title) {
            return showMessagesDialog({
                template: errorDialogTmpl.templateUrl,
                messages: messages,
                title: title || 'Errors'
            });
        }

        function confirmDialog(messages) {
            return showMessagesDialog({
                template: confirmDialogTmpl.templateUrl,
                messages: messages
            });
        }

        Object.assign(this, {
            successMessages: successMessagesDialog,
            errorMessages: errorMessagesDialog,
            confirm: confirmDialog
        });

    }
}
