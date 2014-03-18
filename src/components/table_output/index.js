module.exports = {
    className: 'tbl box',
    template: require('./template.html'),

    methods: {
      update: function (results) {
        this.ready = !!results;
        this.results = results;
      }
    }
}
