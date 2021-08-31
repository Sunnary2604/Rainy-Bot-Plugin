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
    let dFull = preprocessing(this._data);
    console.log(dFull);
    const width = 380;
    const height = 430;
    const lineH = 100;
    const lineWidth = 10;
    const padding = 5;
    const innerRadius = 100;
    const outerRadius = 60;
    let yScale = d3.scaleSqrt().domain([0, 15]).range([5, lineH]);
    var svg = d3
      .select(".rain")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2 - 20, -height / 2 + 80, width, height]);

    if (dFull !== null) {
      let d = dFull.slice(0, 12);
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
      const day = new Date(arcs[0].data.fxTime);
      const minute = day.getMinutes();
      const hour = day.getHours();
      const startA = (minute / 30) * Math.PI;
      const currStartA = (new Date().getMinutes / 30) * Math.PI;
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
        .attr("stroke", "#fff");

      cell
        .append("text")
        .text(function (d, i) {
          return arcs[i].data.fxTime.slice(14, 16);
        })
        .attr("text-anchor", "middle")
        .attr("font-family", "Luminari, fantasy")
        .attr("fill", "#666")
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.2)
        .attr("transform", function (d, i) {
          let x = Math.sin((-d.startAngle - d.endAngle) / 2 - 2.9) * 80;
          let y = Math.cos((-d.startAngle - d.endAngle) / 2 - 2.9) * 80;
          return "translate(" + x + ", " + y + ")";
        });

      // dark hand's border
      svg
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", 60)
        .attr("stroke", "#fff")
        .attr("stroke-width", 5)
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
            ((currStartA / Math.PI) * 180 - 180) +
            ")"
          );
        });
      // dark hand
      svg
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", 59)
        .attr("stroke", colorSelector(d[0].rainType))
        .attr("stroke-width", 3)
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
            ((currStartA / Math.PI) * 180 - 180) +
            ")"
          );
        });
      // clock center
      svg.append("circle").attr("r", 6).attr("height", 60).attr("fill", "#fff");
      svg
        .append("circle")
        .attr("r", 5)
        .attr("height", 60)
        .attr("fill", colorSelector(d[0].rainType));
      //bar chart
      const bar = svg.selectAll("#selector").data(dFull).enter();
      bar
        .append("rect")
        .attr("x", (d, i) => (lineWidth + padding) * i - 200)
        .attr("y", (d) => -yScale(d.precip) + 250)
        .attr("width", lineWidth)
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5)
        .attr("height", function (d, i) {
          return yScale(d.precip);
        })
        .attr("fill", function (d, i) {
          return colorSelector(d.rainType);
        });
      // render minut text
      bar
        .append("text")
        .text(function (d, i) {
          if (i % 4 == 0) return d.fxTime.slice(14, 16);
          else return "";
        })
        .attr("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.2)
        .attr("font-family", "Luminari, fantasy")
        .attr("fill", "#666")
        .attr("transform", function (d, i) {
          let x = (lineWidth + padding) * i - 200 + 5;
          let y = 282;
          return "translate(" + x + ", " + y + ")";
        });
      // render hour text
      bar
        .append("text")
        .text(function (d, i) {
          if (d.fxTime.slice(14, 16) < 5 || i == 0)
            return d.fxTime.slice(11, 13);
          else return "";
        })
        .attr("font-size", "13px")
        .attr("text-anchor", "middle")
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.2)
        .attr("font-family", "Luminari, fantasy")
        .attr("fill", "#666")
        .attr("transform", function (d, i) {
          let x = (lineWidth + padding) * i - 200 + 5;
          let y = 270;
          return "translate(" + x + ", " + y + ")";
        });
    } else {
      svg
        .append("text")
        .text("福瑞发现没有雨")
        .attr("font-size", "30px")
        .attr("font-weight", 800)
        .attr("text-anchor", "middle")
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5)
        .attr("font-family", "Luminari, fantasy")
        .attr("fill", "#666")
        .attr("transform", function (d, i) {
          let x = -20;
          let y = 30;
          return "translate(" + x + ", " + y + ")";
        });

      svg
        .append("text")
        .text("想了想决定不画了")
        .attr("font-size", "30px")
        .attr("font-weight", 800)
        .attr("text-anchor", "middle")
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5)
        .attr("font-family", "Luminari, fantasy")
        .attr("fill", "#666")
        .attr("transform", function (d, i) {
          let x = -20;
          let y = 80;
          return "translate(" + x + ", " + y + ")";
        });
      svg
        .append("img")
        .attr("src", "../sun-regular.svg")
        .attr("fill", "#ffa940");
      // .attr("transform", function (d, i) {
      //   let x = -0;
      //   let y = 100;
      //   return "translate(" + x + ", " + y + ")";
      // });
    }
  }
}
/**设定下雨量*/
function preprocessing(data) {
  const a = data.minutely.filter((d) => {
    return parseFloat(d.precip) === 0;
  });

  if (a.length !== 24) {
    for (let item of data.minutely) {
      if (item.type === "rain") {
        if (item.precip === 0) item.rainType = "晴天";
        else if (item.precip < 10 / 24) item.rainType = "小雨";
        else if (item.precip < 25 / 24) item.rainType = "中雨";
        else if (item.precip < 50 / 24) item.rainType = "大雨";
        else if (item.precip < 100 / 24) item.rainType = "暴雨";
        else if (item.precip < 250 / 24) item.rainType = "大暴雨";
        else if (item.precip >= 250 / 24) item.rainType = "特大暴雨";
      }
    }
    return data.minutely;
  } else {
    return null;
  }
}
function colorSelector(type) {
  switch (type) {
    case "晴天":
      return "#fadb14";
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
