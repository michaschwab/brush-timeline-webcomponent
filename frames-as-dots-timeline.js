class FramesAsDotsTimeline extends HTMLElement
{
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
    const start = +this.getAttribute('start');
    const end = +this.getAttribute('end');
    const div = document.createElement('div');

    this.svgEl = this.createSvgEl('svg');
    this.svgEl.setAttribute('width', this.width);
    this.svgEl.setAttribute('height', this.height);

    div.appendChild(this.svgEl);
    shadow.appendChild(div);

    const bcr = div.getBoundingClientRect();
    this.width = bcr.width;
    this.height = bcr.height;

    this.x = (time) => { return (time - start) / (end - start)* this.width };

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
    for(const frame of this.framedata)
    {
      const circle = this.createSvgEl('circle');
      circle.setAttribute('r', 5);
      circle.setAttribute('cy', this.height / 2);
      circle.setAttribute('cx', this.x(frame));
      circle.setAttribute('fill', '#d70');

      this.svgEl.appendChild(circle);
    }
  }

  set data(data)
  {
    this.framedata = data;

    this.redraw();
  }
}

customElements.define('frames-as-dots-timeline', FramesAsDotsTimeline);
