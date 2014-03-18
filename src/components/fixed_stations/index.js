module.exports = {
    className: 'params',
    template: require('./template.html'),

    computed: {
      params: function () {
        if (!this.stn) return;
        return { sid:this.stn }
      }
    },

    methods: {
      update: function () {
        this.$dispatch('change params', this.params);
      }
    }
}
