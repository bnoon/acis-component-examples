var Vue = require('vue');

Vue.component('data-plot',{

    data: {
      margin: {top: 20, right: 20, bottom: 30, left: 80},
      fullwidth: 900,
      fullheight: 200
    },

    created: function () {
      var products = this.$parent.products;
    },

    ready: function () {
      this.build_plot();
      this.$on("hoverIndex", this.hoverIndex)
    },

    methods: {
      build_plot: function () {
        var vm = this;
        var data = vm.prod.results[vm.area.gid]
        var margin = vm.margin,
            width = vm.fullwidth - margin.left - margin.right,
            height = vm.fullheight - margin.top - margin.bottom;

        var parseDate = d3.time.format("%Y").parse,
            bisectDate = d3.bisector(function(d) { return parseDate(d[0]); }).left;
        vm.fmtValue = d3.format(vm.prod.valueFormat);

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .ticks(6)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line()
            .defined(function (d,i) {
              if (i<5) return false
              d[1] = d3.mean(data.slice(i-5,i).map(function (x) {return x[1]}))
              return true
            })
            .interpolate("bundle")
            .x(function(d) { return x(d[0]); })
            .y(function(d) { return y(d[1]); });

        var svg = d3.select(vm.$el).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var cData = data.map(function(d) {
          return [parseDate(d[0]),+d[1]]
          });

        x.domain(d3.extent(cData, function(d) { return d[0]; }));
        y.domain(vm.prod.range);

        svg.append("text")
            .attr("x","30px")
            .attr("y","0")
            .style({"font-size":"150%", "text-anchor": "start"})
            .text(vm.area.name)

        svg.append("text")
            .attr("x",(width/2)+"px")
            .attr("y","0")
            .style({"font-size":"150%", "text-anchor": "middle"})
            .text(vm.prod.title)

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", "-3em")
            .attr("x",-height/2)
            .style("text-anchor", "middle")
            .text(vm.prod.ylabel);

        svg.selectAll("circle")
          .data(cData)
          .enter()
          .append("circle")
          .attr("cx",function(d) { return x(d[0]); })
          .attr("cy",function(d) { return y(d[1]); })
          .attr("fill","darkblue")
          .attr("r","3px")

        svg.append("path")
          .datum(cData)
          .attr("class","line")
          .attr("d",line)

        var focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        vm.focus$el = focus

        focus.append("text")
            .attr("y",0)
            .attr("x", width)
            .style({"font-size":"150%", "text-anchor": "end"})

        svg.append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            //.on("mouseover", function() { focus.style("display", null); })
            //.on("mouseout", function() { focus.style("display", "none"); })
            .on("mouseout", function() { vm.$dispatch("hoverIndex", -1) })
            .on("mousemove", mousemove);

        function mousemove() {
          var x0 = x.invert(d3.mouse(this)[0]),
              i = bisectDate(data, x0, 1),
              d0 = data[i - 1],
              d1 = data[i],
              idx = x0 - parseDate(d0[0]) > parseDate(d1[0]) - x0 ? i : i-1;
          vm.$dispatch("hoverIndex", idx)
        }
      },

      hoverIndex: function (idx) {
        var d = this.prod.results[this.area.gid][idx], focus = this.focus$el
        if (idx < 0) { focus.style("display", "none"); return }
        focus.style("display", null)
        focus.select("text").text(""+d[0]+": "+this.fmtValue(d[1]));
      }
    }
});

