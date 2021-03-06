class CpuTimeline extends HTMLElement {

  createSvgEl(elName)
  {
    return document.createElementNS('http://www.w3.org/2000/svg', elName);
  }

  constructor()
  {
    super();

    const shadow = this.attachShadow({mode: 'open'});

    this.width = this.getAttribute('width');
    this.height = this.getAttribute('height');

    const div = document.createElement('div');

    this.svgEl = this.createSvgEl('svg');
    this.svgEl.setAttribute('width', this.width);
    this.svgEl.setAttribute('height', this.height);

    div.appendChild(this.svgEl);
    shadow.appendChild(div);

    const bcr = div.getBoundingClientRect();
    this.width = bcr.width;
    this.height = bcr.height;

    const style = document.createElement('style');

    shadow.appendChild(style);
  }

  redraw()
  {
    // Removing old data
    while (this.svgEl.firstChild)
    {
      this.svgEl.removeChild(this.svgEl.firstChild);
    }

    // Updating Scales
    const start = +this.getAttribute('start');
    const end = +this.getAttribute('end');
    this.x = (time) => { return (time - start) / (end - start)* this.width };
    this.y = (cpu) => { return this.height - cpu * this.height };

    // Adding new data
    let d = 'M';

    for(const dataPoint of this.cpudata)
    {
      d += this.x(dataPoint.time) +  ' ' + this.y(dataPoint.cpu) + ' L';
    }
    d = d.substr(0, d.length - 1);

    const path = this.createSvgEl('path');
    path.setAttribute('d', d);
    path.setAttribute('stroke', '#d70');
    path.setAttribute('fill', 'none');

    this.svgEl.appendChild(path);
  }

  set data(data)
  {
    this.cpudata = data;

    this.redraw();
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
  }
}

customElements.define('cpu-timeline', CpuTimeline);