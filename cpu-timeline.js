class CpuTimeline extends HTMLElement {

  createSvgEl(elName)
  {
    return document.createElementNS('http://www.w3.org/2000/svg', elName);
  }

  constructor()
  {
    super();

    const shadow = this.attachShadow({mode: 'open'});

    let width = this.getAttribute('width');
    let height = this.getAttribute('height');
    const start = +this.getAttribute('start');
    const end = +this.getAttribute('end');
    const div = document.createElement('div');

    this.svgEl = this.createSvgEl('svg');
    this.svgEl.setAttribute('width', width);
    this.svgEl.setAttribute('height', height);

    div.appendChild(this.svgEl);
    shadow.appendChild(div);

    const bcr = div.getBoundingClientRect();
    width = bcr.width;
    height = bcr.height;

    this.x = (time) => { return (time - start) / (end - start)* width };
    this.y = (cpu) => { return height - cpu * height };

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
}

customElements.define('cpu-timeline', CpuTimeline);