'use strict';
var sugar = require('sugar');
var db=require('./database');

var sub1={id: 1, accno : 'BS-1', description:'Description1',title : 'The title. Maybe description', releaseDate : new Date()};
var sub2={id: 2, accno : 'BS-2', description:'Description1',title : 'The title. Maybe description', releaseDate : new Date()};

var submissions=new db.Datastore({filename: db.const.SUBMISSIONS, autoload: true });
//submissions.loadDatabase();

function insert(data) {
  submissions.find({id : data.id},function(err, result) {
    if (err) {
      return console.log('Ooops!', err);
    }
    if (result.length===0) {
      submissions.insert(data, function (err, result) {
        if (err) {
          return console.log('Ooops!', err);
        }
      });
    }
  });

}

insert(sub1);
insert(sub2);

function save(submission, done) {
    if (submission ) {
        if (submission._id) {
            if (!submission._id) {
                done('Can not update this submission');
                return;
            }
            submissions.update({_id: submission._id}, submission, {}, done);
        } else {
            submissions.count({}, function (err, count) {
                submission.id=count+1;
                submissions.insert(submission, function(err, newDoc) {
                    done(err, newDoc);
                });
            });
        }
    }
}

module.exports = function Submissions() {
    return {
        get : function(search, done){
            submissions.find(search, function (err, docs) {
                done(err, docs);
            });
        },
        submit: function(submission, done) {
            submissions.count({}, function (err, count) {
                if (!submission.acc) {
                    count = count + 1;
                    submission.acc = 'BS-' + count;
                }
                save(submission, done);
            });

        },
        save: function(submission, done) {
            save(submission,done);
        },

        remove:function(submission, done) {
            submissions.remove(submission, { multi: true },done);
        }


    };
};
