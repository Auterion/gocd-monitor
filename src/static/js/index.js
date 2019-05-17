document.addEventListener('DOMContentLoaded', run);

function loop(timeout) {
  return function(e) {
    console.log('loop', e);
    setTimeout(run, timeout);
  }
}

function run() {
  getData().then(buildPage).then(loop(60000), loop(60000));
}

function getData() {
  return fetch('/status')
    .then(response => {
      if (!response.ok) {
        throw new Error('HTTP error, status = ' + response.status);
      }
      return response.json();
    });
}

function buildPage(groups) {
  const passed = document.createElement('div');
  const failed = document.createElement('div');
  const unknown = document.createElement('div');

  passed.id = 'passed';
  failed.id = 'failed';
  unknown.id = 'unknown';

  for (const group of groups) {
    const el = createGroupEl(group);
    let cont;
    switch ((group.status || '').toLowerCase()) {
      case 'passed': cont = passed; break;
      case 'unknown': cont = unknown; break;
      default: cont = failed; break;
    }
    cont.appendChild(el);
  }

  const container = document.getElementById('container');
  container.removeChild(document.getElementById('unknown'));
  container.removeChild(document.getElementById('failed'));
  container.removeChild(document.getElementById('passed'));

  container.appendChild(unknown);
  container.appendChild(failed);
  container.appendChild(passed);
}

function createGroupEl(group) {
  const root = document.createElement('div');
  root.classList.add('group');
  root.classList.add((group.status || 'unknown').toLowerCase());
  if (group.status === 'Passed') {
    const title = document.createElement('h3');
    const titletext = document.createTextNode(group.name.replace(/_/g, '​_'));
    title.appendChild(titletext);
    root.appendChild(title);

    const body = document.createElement('div');
    body.classList.add('info');
    const label = document.createElement('span');
    label.classList.add('label');
    label.appendChild(document.createTextNode(group.label));
    body.appendChild(label);
    if (group.pipelines[0] && group.pipelines[0].history) {
      const trigger = document.createElement('span');
      trigger.classList.add('trigger');
      trigger.appendChild(document.createTextNode(group.pipelines[0].history.trigger.replace('modified by', '').replace(/<.*>/, '')));
      body.appendChild(trigger);
    }
    root.appendChild(body);
  } else {
    const h3 = document.createElement('h3');
    h3.classList.add('group-name');
    h3.appendChild(document.createTextNode(group.name));
    root.appendChild(h3);
    for (const pipeline of group.pipelines) {
      const stage = document.createElement('div');
      stage.classList.add('stage');
      stage.classList.add((pipeline.status || 'unknown').toLowerCase());
      
      const title = document.createElement('h4');
      title.appendChild(document.createTextNode(pipeline.name.replace(group.name + '_', '')));
      stage.appendChild(title);
      const body = document.createElement('div');
      const label = document.createElement('span');
      label.classList.add('label');
      label.appendChild(document.createTextNode(pipeline.label));
      body.appendChild(label);

      const trigger = document.createElement('span');
      trigger.classList.add('trigger');
      if (pipeline.history && pipeline.history.trigger.indexOf('modified') > -1) {
          trigger.appendChild(document.createTextNode(pipeline.history.trigger.replace('modified by', '').replace(/<.*>/, '')));
      } else {
        trigger.innerHTML = '&nbsp;';
      }
      body.appendChild(trigger);

      stage.appendChild(body);

      root.appendChild(stage);
    }
  }
  return root;
}
