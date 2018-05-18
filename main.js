document.getElementById('brushtimeline').addEventListener('brushed', function(event)
{
  const startEnd = event.detail;

  console.log('received start and end of brush in main context: ' + startEnd);
});

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

let traceDuration = 1500;
document.getElementById('traceDurationSliderValue').innerText=traceDuration;
document.getElementById('traceDurationSlider').value = traceDuration;

function setData()
{
  //const traceDuration = 200 + Math.random() * 3 * 3600 * 1000; // Max is 3h
  //const traceDuration = 200 + Math.random() * 3 * 60 * 1000;

  document.getElementById('brushtimeline').end = traceDuration;
  document.getElementById('traceDurationIndicator').innerText = Math.round(traceDuration).toString(10);

  setCpuData(traceDuration);
  setFramesData(traceDuration);
}

setTimeout(setData, 200);

// document.getElementById('newTraceData').addEventListener('click', setData);
//setTimeout(setData, 500);
