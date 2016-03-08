'use strict';


module.exports = function ($scope, $log, EuropePmc, SubmissionModel) {

    function addOrUpdateAttribute(publication, attr) {
        var exist = false;
        for (var i in publication.attributes) {
            if (publication.attributes[i].name === attr.name) {
                exist = true;
                publication.attributes[i].value = attr.value;
                break;
            }
        }
        if (!exist) {
            SubmissionModel.addAttribute.call(publication, attr);
        }
    }

    $scope.getPubFromPmc = function(pubMedid, publication) {
        if (pubMedid) {
            EuropePmc.get(pubMedid).then(function(data) {
                $log.debug('get publication',data);
                var pub = data;
                if (angular.isArray(data)) {
                    pub = data[0];
                }
                if (pub) {

                }
                //get DOI
                addOrUpdateAttribute(publication, {name: 'DOI', value: pub.DOI});
                addOrUpdateAttribute(publication, {name: 'Title', value: pub.title});
                addOrUpdateAttribute(publication, {name: 'Authors', value: pub.authorString});
                addOrUpdateAttribute(publication, {name: 'Type', value: pub.pubType});
                addOrUpdateAttribute(publication, {name: 'Year', value: pub.pubYear});
                addOrUpdateAttribute(publication, {name: 'Issue', value: pub.issue});

                $log.debug(publication);
            }, function(err) {
                $log.debug('Error',err);

            });
        }
    };
}