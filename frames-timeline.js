class FramesTimeline extends HTMLElement
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
    style.textContent = 'rect {opacity: 0.1}';

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

    // Adding new data

    if(end - start < 2000)
    {
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
    else
    {
      // Have to sample first

      /* This is O(n^2) and too slow
      for(let time = this.start; time < this.end; time += rate)
      {
        const count = this.framedata.filter(t => t >= time && t <= time + rate).length;
        sampled.push({count: count, time: time});
      }*/
      const sampled = this.getSampledData();

      const max = Math.max.apply(null, sampled.map(s => s.count));

      for(let sample of sampled)
      {
        const rect = this.createSvgEl('rect');
        rect.setAttribute('width', 3);
        rect.setAttribute('height', this.height - 8);
        rect.setAttribute('x', this.x(sample.time)-1);
        rect.setAttribute('fill', '#d70');

        this.svgEl.appendChild(rect);

        rect.style.opacity = (sample.count / max).toString(10);
      }
    }
  }

  getSampledData()
  {
    const rate = (this.end - this.start) / this.width; // Move about 1px per sample

    const sampled = [];
    let currentSample;

    for(let i = 0; i < this.framedata.length; i++)
    {
      if(!currentSample || this.framedata[i] > currentSample.time + rate )
      {
        currentSample = { count: 0, time: this.framedata[i] };
        sampled.push(currentSample);
      }
      currentSample.count++;
    }
    return sampled;
  }

  set data(data)
  {
    this.framedata = data;

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

customElements.define('frames-timeline', FramesTimeline);
