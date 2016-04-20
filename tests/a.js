/**
 * Created by mdylag on 17/03/16.
 */
var _ = require('lodash');
var links = [{url: 'url1',
    attributes:[
        {name:'n1'},{name:'n2'},
        {name:'n3'},{name:'n4'},

    ]
}, {
    url: 'url2',
    attributes:[{name:'n1'},{name:'n2'},{name:'n3'}]
}
];


var attributes = {};
_(links[0].attributes).forEach(function(value, key) {
    console.log(value, key);
    attributes[value.name]=value;
});

console.log(attributes);





