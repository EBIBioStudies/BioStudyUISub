/**
 * Created by mdylag on 03/09/2014.
 */
'use strict';

var app = angular.module('BioStudyApp');

app.directive('msPasswordCheck', require('./passwordCheck'));

app.directive('bsActiveNav', require('./bsActiveNav'));
//app.directive('bsNgSection', require('./bsNgSection'));
app.directive('bsNgToggle', require('./bsNgToggle'));
app.directive('bsShowErrors', require('./bsShowErrors'));
app.directive('bsNgItem', require('./bsNgItem'));

app.directive('helpBlock', require('./helpBlock'));

app.directive('datepickerPopup',require('./datepickerPopup'));

app.directive('msTree',require('./msTree'));
app.directive('treeNodeElement',require('./treeNodeElement'));

require('./form/msFormValidator')(app);
require('./form/msDuplicate')(app);


module.exports=app;
