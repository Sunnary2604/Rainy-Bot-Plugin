export default class RainChart {
  constructor() {
    this._data = [];
  }

  data(s) {
    if (arguments.length === 0) return this._data;
    this._data = s;
    return this;
  }

  render() {
    let d = preprocessing(this._data).slice(0, 12);
    const width = 550;
    const height = 550;
    const lineH = 100;
    const lineWidth = 40;
    const padding = 5;
    const innerRadius = 100;
    const outerRadius = 60;
    let yScale = d3.scaleSqrt().domain([0, 15]).range([5, lineH]);
    var svg = d3
      .select(".rain")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height]);

    // render Rain
    let pie = d3
      .pie()
      .padAngle(0.1)
      .startAngle(0)
      .endAngle(2 * Math.PI)
      .sort(null)
      .value(100);
    let arc = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(function (d) {
        return innerRadius + yScale(d.data.precip);
      })
      .padRadius(innerRadius);

    const arcs = pie(d);

    const minut = arcs[0].data.fxTime.slice(14, 16);
    const hour = arcs[0].data.fxTime.slice(11, 13);

    const startA = (minut / 30) * Math.PI;
    console.log(startA);
    for (let item of arcs) {
      item.startAngle += startA;
      item.endAngle += startA;
    }

    const cell = svg.selectAll("#selector").data(arcs).enter();

    cell
      .append("path")
      .attr("d", arc)
      .attr("fill", function (d) {
        return colorSelector(d.data.rainType);
      })
      .attr("style", "opacity:0.7")
      .on("click", function (e) {
        console.log(e.path[1]);
      });
    cell
      .append("text")
      .text(function (d, i) {
        return arcs[i].data.fxTime.slice(14, 16);
      })
      .attr("text-anchor", "middle")
      .attr("font-family", "Luminari, fantasy")
      .attr("fill", "#666")
      .attr("transform", function (d, i) {
        let x = Math.sin((-d.startAngle - d.endAngle) / 2 - 2.9) * 80;
        let y = Math.cos((-d.startAngle - d.endAngle) / 2 - 2.9) * 80;
        return "translate(" + x + ", " + y + ")";
      });

    svg
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", 60)
      .attr("stroke", colorSelector(d[0].rainType))
      .attr("stroke-width", 4)
      .attr("transform", function (d, i) {
        let x = 1.5;
        let y = 0;
        return (
          "translate(" +
          x +
          ", " +
          y +
          ")" +
          "rotate(" +
          ((startA / Math.PI) * 180 - 180) +
          ")"
        );
      });
    svg
      .append("circle")
      .attr("r", 5)
      .attr("height", 60)
      .attr("fill", colorSelector(d[0].rainType))
      .attr();
  }
}
/**设定下雨量*/
function preprocessing(data) {
  for (let item of data.minutely) {
    if (item.type === "rain") {
      if (item.precip < 10 / 24) item.rainType = "小雨";
      else if (item.precip < 25 / 24) item.rainType = "中雨";
      else if (item.precip < 50 / 24) item.rainType = "大雨";
      else if (item.precip < 100 / 24) item.rainType = "暴雨";
      else if (item.precip < 250 / 24) item.rainType = "大暴雨";
      else if (item.precip >= 250 / 24) item.rainType = "特大暴雨";
    }
  }

  return data.minutely;
}
function colorSelector(type) {
  switch (type) {
    case "小雨":
      return "#d7eff8";
    case "中雨":
      return "#B3E0F2";
    case "大雨":
      return "#99D0F2";
    case "暴雨":
      return "#699EBF";
    case "大暴雨":
      return "#1D5273";
    case "特大暴雨":
      return "#012340";
    default:
      return "#fff";
  }
}
function saveImg(svgpath) {
  window.onload = () => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    v = canvg.Canvg.fromString(ctx, svgpath);

    // Start SVG rendering with animations and mouse handling.
    v.start();
  };
}
