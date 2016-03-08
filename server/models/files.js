var tree ={
    'status':'OK',
    'files': [{
        'name': 'User',
        'type': 'DIR',
        'path': '/User',
        'files': [{
            'name': 'data.txt',
            'type': 'FILE',
            'path': '/User/data.txt'}
        ]
    }]};


module.exports = {
    addFile: function(filename) {
        tree.files[0].files.push({name: filename, type: 'FILE', path: '/User/' + filename, size: 100000});
    },
    getTree: function() {
        return tree;
    }

}