document.getElementById('brusher').addEventListener('brushed', function(event)
{
  const startEnd = event.detail;

  console.log('received start and end of brush in main context: ' + startEnd);
});

function setCpuData()
{
  const cpuData = [];

  for(let time = 0; time < 1000; time += 5)
  {
    cpuData.push({ time: time, cpu: Math.random()})
  }

  document.getElementById('cpuTimeline').data = cpuData;
}

function setFramesData()
{
  const framesData = [];
  const frameMin = 6;
  const frameMax = 30;

  for(let time = frameMin + Math.random() * (frameMax - frameMin); time < 1000; time += frameMin + Math.random() * (frameMax - frameMin))
  {
    framesData.push(time);
  }

  document.getElementById('framesTimeline').data = framesData;
}


setTimeout(() => setInterval(setCpuData, 1000), 500);
setInterval(setFramesData, 1000);
