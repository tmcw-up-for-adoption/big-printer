var fs = require('fs'),
  Handlebars = require('handlebars'),
  glob = require('glob'),
  path = require('path'),
  argv = require('minimist')(process.argv.slice(2)),
  exec = require('child_process').exec;

var style = fs.readFileSync('./lib/basscss.min.css', 'utf8');
var template = Handlebars.compile(fs.readFileSync('./lib/template.hbs', 'utf8'));
var imageDir = path.join(argv._[1], 'images');

fs.mkdirSync(argv._[1]);
fs.mkdirSync(imageDir);

var child = exec(['phantomjs',
  path.join(__dirname, '/lib/reader.js'),
  argv._[0], imageDir].join(' '), function (error, stdout, stderr) {
  if (error !== null) {
    return new Error('exec error: ' + error);
  }

  var images = glob.sync(path.join(imageDir, '*.png'));

  var notes = stdout.split('\n')
    .filter(function (note) { return note; })
    .map(function (note) {
      return JSON.parse(note);
    })
    .reduce(function (memo, note) {
      memo[note.page] = note.message.replace('\n', ' ');
      return memo;
    }, {});

  fs.writeFile(path.join(argv._[1], 'index.html'), template({
    style: style,
    slides: images.map(function (image, i) {
      return {
        image: 'images/' + path.basename(image),
        note: notes[i]
      };
    })
  }));
});
