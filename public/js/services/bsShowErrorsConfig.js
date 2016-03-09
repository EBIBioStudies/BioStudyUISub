'use strict';
module.exports = function() {
    var _showSuccess, _trigger;
    _showSuccess = false;
    _trigger = 'blur';
    this.showSuccess = function(showSuccess) {
        _showSuccess = showSuccess;
        return _showSuccess;
    };
    this.trigger = function(trigger) {
        _trigger = trigger;
        return _trigger;
    };
    this.$get = function() {
        return {
            showSuccess: _showSuccess,
            trigger: _trigger
        };
    };
};
