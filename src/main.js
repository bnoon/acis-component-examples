var request = require('superagent'),
    extend = require('extend'),
    Vue = require('vue');

var panel = new Vue({

    el: 'body',

    components: {
        fixed_stations: require('fixed_stations'),
        table_output: require('table_output')
    },

    ready: function() {
      this.$.stn.$data.stns = ['304174','KSYR','KBGM','KBUF'];
      this.$.tbl.$data.columns = ['Date','maxT','minT','prcp'];
      this.$on('change params', this.update_params);
    },

    methods: {
      update_params: function (params) {
        var key, valid = true;
        extend(this.params, params);
        for (key in this.params) {
          if (this.params.hasOwnProperty(key) && !this.params[key]) valid = false;
        }
        if (valid) this.make_request();
      },

      make_request: function () {
        var self = this;
        self.$.tbl.update(null);
        request
          .post('http://data.rcc-acis.org/StnData', this.params)
          .end(function(res){
            if (res.status == 200) {
              if (res.body.error === undefined) self.$.tbl.update(res.body);
              else console.log('invalid request %s', res.body.error);
            } else {
              console.log('failed reqest %s',res.status);
            }
          });
      }
    }

})

panel.default_params = {sid:null,elems:[1,2,4],sdate:'2014-01-01',edate:'2014-03-10'};
panel.params = extend({},panel.default_params);
