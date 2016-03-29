'use strict';

// in the root of the project run 'node fixPackageJson.js' and it'll generate package.txt with the correct npm modules and versions
// adjust timeout for bigger projects if needed. Doing it async was taking too long.

var fs = require('fs');

(function main () {
    var results = 'npm: \n "dependencies": { \n',
        errors = 'errors: \n',
        bowers = 'bower: \n "dependencies": { \n',
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
                                results += '\n } \n \n \n ';
                            }
                        }
                    });
                }
            }
        });
    });
    fs.readdir('./public/lib', function (err, dirs) {
        if (err) {
            fs.writeFile('package.txt', err);
            return;
        }
        dirs.forEach(function (dir, index) {
            if (dir.indexOf('.') !== 0) {
                var packageJsonFile = fs.existsSync('./public/lib/' + dir + '/package.json') ? './public/lib/' + dir + '/package.json' : './public/lib/' + dir + '/.bower.json';
                if (fs.existsSync(packageJsonFile)) {
                    fs.readFile(packageJsonFile, function (err, data) {
                        if (err) {
                            errors += err + ', \n';
                        } else {
                            var json = JSON.parse(data);
                            bowers += '    "' + json.name + '": "' + json.version + '"';
                            if (index + 1 !== dirs.length) {
                                bowers += ', \n';
                            } else {
                                bowers += '} \n \n \n' + errors;
                            }
                        }
                    });
                } else {
                    var fileSplit = packageJsonFile.split('/'),
                        returnString = '';
                    fileSplit = fileSplit.slice(0, -1);
                    fileSplit.forEach(function (item, index) {
                        if (index + 1 === fileSplit.length) {
                            returnString += item + ', \n';
                        } else {
                            if (item !== undefined) returnString += item + '/';
                        }
                    });
                    errors += returnString;
                }
            }
        });
        setTimeout(function () {
            results = results + bowers;
            fs.writeFile('package.txt', results);
        }, 3000);
    });
})();