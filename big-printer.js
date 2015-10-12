#!/usr/bin/env node

var fs = require('fs'),
  Handlebars = require('handlebars'),
  path = require('path'),
  binPath = require('phantomjs').path,
  argv = require('minimist')(process.argv.slice(2)),
  execFile = require('child_process').execFile;

var style = fs.readFileSync(__dirname + '/lib/basscss.min.css', 'utf8');
var template = Handlebars.compile(fs.readFileSync(__dirname + '/lib/template.hbs', 'utf8'));
var imageDir = path.join(argv._[1], 'images');

fs.mkdirSync(argv._[1]);
fs.mkdirSync(imageDir);

var child = execFile(binPath, [
  path.join(__dirname, '/lib/reader.js'),
  argv._[0], imageDir], function (error, stdout, stderr) {

  if (error !== null) {
    return new Error('exec error: ' + error);
  }

  var notes = stdout.split('\n')
    .filter(function (note) { return note; })
    .map(function (note) {
      try {
        return JSON.parse(note);
      } catch(e) {
        return null;
      }
    })
    .filter(Boolean)
    .reduce(function (memo, note) {
      memo[note.page] = note.message
        .replace(/%c\d+:\s/, ' ')
        .replace(/padding:5px;.*/, ' ')
        .replace('\n', ' ');
      return memo;
    }, {});

  fs.writeFile(path.join(argv._[1], 'index.html'), template({
    style: style,
    slides: fs.readdirSync(imageDir).filter(function (path) {
      return path.match(/\.png$/);
    }).map(function (image, i) {
      return {
        image: 'images/' + path.basename(image),
        note: notes[i]
      };
    })
  }));
});
