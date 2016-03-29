'use strict';

// in the root of the project run 'node fixPackageJson.js' and it'll generate package.txt with the correct npm modules and versions
// adjust timeout for bigger projects if needed. Doing it async was taking too long.

var fs = require('fs');

(function main () {
    var results = '"dependencies": { \n',
        errors = 'errors: \n',
        counter = 0;
    fs.readdir('./node_modules', function (err, dirs) {
        if (err) {
            fs.writeFile('package.txt', err);
            return;
        }
        dirs.forEach(function (dir, index) {
            if (dir.indexOf('.') !== 0) {
                var packageJsonFile = './node_modules/' + dir + '/package.json';
                if (fs.existsSync(packageJsonFile)) {
                    fs.readFile(packageJsonFile, function (err, data) {
                        if (err) {
                            errors += err + ', \n';
                        } else {
                            var json = JSON.parse(data);
                            results += '    "' + json.name + '": "' + json.version + '"';
                            if (index + 1 !== dirs.length) {
                                results += ', \n';
                            } else {
                                results += '\n';
                            }
                        }
                    });
                }
            }
        });
    setTimeout(function () {
        results = results + '} \n \n \n' + errors;
        fs.writeFile('package.txt', results);
    }, 1000);
    });
})();