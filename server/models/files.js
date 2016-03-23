var tree ={
    'status':'OK',
    'files': [{
        'name': 'User',
        'type': 'DIR',
        'path': '/User',
        'files': [{
            'name': 'data.txt',
            'type': 'FILE',
            'path': '/User/data.txt'},
            {
                'name': 'Eclipse.zip',
                'type': 'ARCHIVE',
                'path': '/User/Eclipse.zip', files:[
                {
                    'name': 'inside2.txt',
                    'type': 'FILE',
                    'path': '/User/Eclipse.zip/inside2.txt'
                },
                {
                    'name': 'inside1.txt',
                    'type': 'FILE',
                    'path': '/User/Eclipse.zip/inside1.txt'
                }

        ]}

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