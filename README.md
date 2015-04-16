# big-printer

Generate PNG & PDF output from [Big](https://github.com/tmcw/big) presentations.

This is a [phantomjs](http://phantomjs.org/) script, not a node script, so you'll
need phantomjs installed.

On a Mac with Homebrew, that's as simple as

```sh
$ brew install phantomjs
```

## Usage

Download `printer.js`

All defaults: this outputs png images at 2560x1440

```sh
$ phantomjs printer.js http://url-to-big-presentation/presentation.html
```

Output PDFs instead

```sh
$ phantomjs printer.js http://url-to-big-presentation/presentation.html pdf
```

Or low-resolution PNGs

```sh
$ phantomjs printer.js http://url-to-big-presentation/presentation.html png 640 480
```

## Examples

[PNG output](http://imgur.com/a/XG1KA) of the [demo presentation](http://www.macwright.org/big/demo.html#0).
