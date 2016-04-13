/**
 * Created by mdylag on 03/09/2014.
 */
'use strict';

var app = angular.module('BioStudyApp');

app.directive('msPasswordCheck', require('./passwordCheck'));
app.directive('accessLevel', require('./accessLevel'));

app.directive('bsActiveNav', require('./bsActiveNav'));
//app.directive('bsNgSection', require('./bsNgSection'));
app.directive('bsNgToggle', require('./bsNgToggle'));
app.directive('bsShowErrors', require('./bsShowErrors'));
app.directive('bsNgItem', require('./bsNgItem'));

app.directive('helpBlock', require('./helpBlock'));

app.directive('datepickerPopup',require('./datepickerPopup'));

app.directive('bsSectionItem',require('./submission/bsSectionItem'));

app.directive('msTree',require('./msTree'));
app.directive('treeNodeElement',require('./treeNodeElement'));

require('./form/msFormValidator')(app);
require('./form/msDuplicate')(app);

require('./submission/bsSection')(app);
//require('./submission/bsSectionNew')(app);



module.exports=app;
