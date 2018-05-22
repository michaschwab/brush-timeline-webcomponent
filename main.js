document.getElementById('brushtimeline').addEventListener('brushed', function(event)
{
  const start = event.detail[0];
  const end = event.detail[1];

  setDetailData(start, end);
  //console.log('received start and end of brush in main context: ', start, end);
});

function setDetailData(start, end)
{
  document.getElementById('detail-timeline').start = start;
  document.getElementById('detail-timeline').end = end;
}

function setCpuData(duration)
{
  const cpuData = [];
  const rate = duration / 400;

  for(let time = 0; time < duration; time += rate)
  {
    cpuData.push({ time: time, cpu: Math.random()})
  }

  document.getElementById('cpuTimeline').end = duration;
  document.getElementById('cpuTimeline').data = cpuData;
}

function setFramesData(duration)
{
  const framesData = [];
  const frameMin = 6;
  const frameMax = 30;

  const getRandomFrame = () => frameMin + Math.random() * (frameMax - frameMin);

  for(let time = getRandomFrame(); time < duration; time += getRandomFrame())
  {
    framesData.push(time);
  }

  document.getElementById('framesTimeline').end = duration;
  document.getElementById('framesTimeline').data = framesData;
}


function setData()
{
  //const traceDuration = 200 + Math.random() * 3 * 3600 * 1000; // Max is 3h
  //const traceDuration = 200 + Math.random() * 3 * 60 * 1000;

  document.getElementById('brushtimeline').end = traceDuration;
  document.getElementById('traceDurationIndicator').innerText = Math.round(traceDuration).toString(10);

  setCpuData(traceDuration);
  setFramesData(traceDuration);
}


let traceDuration = 1500;
document.getElementById('traceDurationSliderValue').innerText = traceDuration.toString(10);
document.getElementById('traceDurationSlider').value = traceDuration;

document.body.onload = setData;
