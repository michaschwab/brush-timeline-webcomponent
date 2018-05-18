class BrushTimeline extends HTMLElement {

  createSvgEl(elName)
  {
    return document.createElementNS('http://www.w3.org/2000/svg', elName);
  }

  constructor() {
    // Always call super first in constructor
    super();

    const shadow = this.attachShadow({mode: 'open'});

    const margin = {
      top: this.getAttribute('paddingTop'),
      right: this.getAttribute('paddingRight'),
      bottom: this.getAttribute('paddingBottom'),
      left: this.getAttribute('paddingLeft')
    };
    const brushEventName = this.getAttribute('brushEventName');
    this.start = parseInt(this.getAttribute('start'));
    this.end = parseInt(this.getAttribute('end'));
    const brushStart = parseInt(this.getAttribute('brushStart'));
    const brushEnd = parseInt(this.getAttribute('brushEnd'));

    ///////////////////////////////////////////////////////////////
    let width = this.getAttribute('width');
    let height = this.getAttribute('height');
    const div = document.createElement('div');
    div.style.position = 'relative';

    const svgEl = this.createSvgEl('svg');
    svgEl.setAttribute('width', width);
    svgEl.setAttribute('height', height);
    svgEl.style.position = 'absolute';
    svgEl.style.top = '0';
    svgEl.style.left = '0';

    div.appendChild(svgEl);
    shadow.appendChild(div);

    const bcr = svgEl.getBoundingClientRect();
    width = bcr.width;
    height = bcr.height;

    const style = document.createElement('style');
    style.textContent = ':host { display: block; } ' +
        '.brush .selection { stroke: none; }' +
        'svg { display: block; border: 1px solid rgba(200,200,200,0.5); }';
    //svgEl.appendChild(rect);

    const slot = document.createElement('slot');
    div.style.paddingTop = margin.top + 'px';
    div.style.paddingRight = margin.right + 'px';
    div.style.paddingBottom = margin.bottom + 'px';
    div.style.paddingLeft = margin.left + 'px';

    div.appendChild(slot);
    shadow.appendChild(style);

    const d3script = document.createElement('script');
    d3script.src = 'https://d3js.org/d3.v4.min.js';


    const d3loaded = () =>
    {
      console.log(this);
      this.x = d3.scaleTime().range([margin.left, width - margin.right]);
      this.x.domain([this.start, this.end]);

      this.xAxis = d3.axisBottom(this.x);

      this.brush = d3.brushX()
          .extent([[0,0], [width , height - margin.bottom ]])
          .on("brush end", () =>
          {
            const start = this.x.invert(+d3.event.selection[0]);
            const end = this.x.invert(+d3.event.selection[1]);

            this.dispatchEvent(new CustomEvent(brushEventName, { detail: [start, end]}));
          });


      const context = d3.select(svgEl);


      this.axisEl = context.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + (height - margin.bottom) + ")");

      this.axisEl
          .call(this.xAxis);

      this.brushEl = context.append("g")
          .attr("class", "brush");

      this.brushEl
          .call(this.brush)
          .call(this.brush.move, [this.x(brushStart), this.x(brushEnd)]);
    };

    d3script.onload = () => { d3loaded(); };
    shadow.appendChild(d3script);

  }

  updateVis()
  {
    if(this.x)
    {
      this.x.domain([this.start, this.end]);
      //this.xAxis = d3.axisBottom(this.x);

      this.axisEl
          .call(this.xAxis);

      const brushStart = parseInt(this.getAttribute('brushStart'));
      const brushEnd = parseInt(this.getAttribute('brushEnd'));
      this.brushEl
          .call(this.brush.move, [this.x(brushStart), this.x(brushEnd)]);
    }
  }

  get start()
  {
    return parseInt(this.getAttribute('start'));
  }

  set start(start)
  {
    this.setAttribute('start', start);
  }

  get end()
  {
    return parseInt(this.getAttribute('end'));
  }

  set end(end)
  {
    this.setAttribute('end', end);
    this.updateVis();
  }
}

// Define the new element
//customElements.define('popup-info', PopUpInfo);
customElements.define('brush-timeline', BrushTimeline);