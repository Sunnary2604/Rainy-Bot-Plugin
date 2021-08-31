export default class innerVerticalStack {
    constructor() {
        this._svg = null;


    }
    svg(s) {
        if (arguments.length === 0) return this._svg;
        this._svg = s;
        return this;
    }

    render() {
        let width = 400;
        let height = 400

        var svg = d3
            .select(".personal")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-width / 2, -height / 2, width, height]);


    }
}
