#!/usr/bin/env node



// in the root of the project run 'node fixPackageJson.js' and it'll generate package.txt with the correct npm modules and versions
// adjust timeout for bigger projects if needed. Doing it async was taking too long.

var fs = require('fs');

(function () {
    var results = 'npm: \n "dependencies": { \n',
        errors = 'errors: \n',
        bowers = 'bower: \n "dependencies": { \n';
    fs.readdir('./node_modules', function (err, dirs) {
        if (err) {
            fs.writeFile('package.txt', err);
            console.log('Aborted with error: ', err);
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
            console.log('Aborted bower file lookup with error: ', err);
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
                                bowers += '\n} \n \n \n';
                            }
                        }
                    });
                } else {
                    var fileSplit = packageJsonFile.split('/'),
                        returnString = '';
                    fileSplit = fileSplit.slice(0, -1);
                    fileSplit.forEach(function (x, i) {
                        if (i + 1 === fileSplit.length) {
                                returnString += x + ', \n';
                        } else {
                            if (x !== undefined) returnString += x + '/';
                        }
                    });
                    errors += returnString;
                }
            }
        });
        setTimeout(function () {
            errors = errors.replace(/,\s*$/, '');
            results = results + bowers + errors;
            fs.writeFile('package.txt', results);
        }, 3000);
    });
})();