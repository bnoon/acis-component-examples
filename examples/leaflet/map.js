var Vue = require('vue');

Vue.component('ny-map',{
  methods: {
    updateAreas: function (areas) {
      // only load once
      if (this.county.getLayers().length == 0) {
        var layer=this.county
        areas.forEach(function (v) {
          layer.addData(v)
        })
      }
      var layers = this.county.getLayers()
      areas.forEach(function (v,i) {
        if (v.selected) {
          layers[i].setStyle({fillOpacity:0.7})
        } else {
          layers[i].setStyle({fillOpacity: 0})
        }
      })
    },

    updateBounds: function () {
      var layers = this.county.getLayers(),
        mapBounds = this.map.getBounds()
      this.areas.forEach(function (v,i) {
        v.onMap = mapBounds.intersects(layers[i].getBounds())
      })
    }
  },

  ready: function () {
    var vm = this;
    var m = this.map = L.map('mapID').setView([42.7, -76.], 6);
    var mapquestOSM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
        maxZoom: 9,
        minZoom: 5,
        subdomains: ["otile1", "otile2", "otile3", "otile4"],
        attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
    });
    m.addLayer(mapquestOSM);

    m.on("moveend", function (e) {
      vm.updateBounds()
    })

    var county = this.county = new L.GeoJSON(null, {
        style: {
                    clickable: true,
                    weight: 1,
                    color: 'black',
                    opacity: 1,
                    fill: true,
                    fillColor: 'black',
                    fillOpacity: 0

        },
        onEachFeature: function (feature,layer) {
          layer.on({
            click: function (e) {
              var add = e.originalEvent.shiftKey
              vm.areas.forEach(function (v) {
                if (feature == v) {
                  v.selected = !v.selected
                } else {
                  if (!add) v.selected = false
                }
              })
            },

            mouseover: function (e) {
              e.target.setStyle({
                weight: 3,
                color: "#00FFFF",
                opacity: 1
              })
              if (!L.Browser.ie && !L.Browser.opera) {
                  layer.bringToFront();
              }
            },

            mouseout: function (e) {
              e.target.setStyle({weight:1, color: "black"})
            }
          })
        }
    });
    m.addLayer(county);
    this.$watch("areas",this.updateAreas);
  }
});
