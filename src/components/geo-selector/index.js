var request = require('superagent')

module.exports = {
    template: require('./template.html'),

    data: {
      state: 'NY',
      gtypes: [
        {name: "County", param: "county"},
        {name: "River Basin", param: "basin"},
        {name: "Climate Division", param: "climdiv"}
      ],
      gtype: '',
      gids: [],
      gid: ''
    },

    ready: function () {
      this.$watch('gtype', function(x) {
        this.gid = ''
        this.$emit('params')
        this.geoload()
      });
      this.$watch('gid', function() {
        if (this.gid) this.$emit('params',{gtype:this.gtype,gid:this.gid})
      });
    },

    methods: {
      geoload: function () {
        var self=this, params = {state: this.state, meta: ['name','id']}
        request
          .post('http://data.rcc-acis.org/General/'+this.gtype, params)
          .end(function(res){
            if (res.status == 200) {
              if (res.body.error === undefined) self.gids = res.body.meta
              else console.log('invalid request %s', res.body.error)
            } else {
              console.log('failed reqest %s',res.status)
            }
          })
      }
    }
}
