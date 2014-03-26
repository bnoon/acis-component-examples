## A repository for example ACIS Web Services components.

This builds on several javascript tools

* [Node.js](http://nodejs.org/) for server-side javascript
* [Component](http://github.com/component/component) as a client-side package manager
* Reactive templating and view components via Vue.js: [vuejs.org](http://vuejs.org)
* The project layout and gulp usage from a vue.js example on [github](https://github.com/vuejs/vue-component-example)
* [Gulp](http://gulpjs.com/) as a build tool

A working example [here](http://bnoon.github.io/acis-component-examples/)

## Usage

First, get and install a recent version of [node](http://nodejs.org/).  I have been using both 0.10.26 and 0.11.12.

Next, familiarize yourself with [Component](http://github.com/component/component).  The [wiki](https://github.com/component/component/wiki/Components) lists hundreds of components for various uses.

Finally checkout and build the ACIS components.  *The following builds on the Vue.js [component example](https://github.com/vuejs/vue-component-example)*

To get started, install Gulp and Component globally, then clone this repo and install local dependencies:

``` bash
$ npm install -g gulp component
$ git clone https://github.com/bnoon/acis-component-examples.git
$ cd acis-component-examples
$ npm install && component install
```

### Build

``` bash
$ gulp
```

Open one of the examples:

* `examples/fixed_stn_table/index.html`
* `examples/geo_list/index.html`

to see the result.

### Development

``` bash
$ gulp watch
```

This will watch files for change and re-build automatically.