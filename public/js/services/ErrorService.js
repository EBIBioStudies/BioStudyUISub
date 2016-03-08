/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';


module.exports = function () {
    return {
        errors:{},
        catch: function(message){
            return function(reason){
                this.errors.push({message: message, reason: reason});
            };
        },
        clearErrors :  function() {
            this.errors=[];
        },
        addError: function(error, cleanBefore) {
            if (cleanBefore){
                this.errors = {};
            }
            this.errors=error;
        }
    };

};
