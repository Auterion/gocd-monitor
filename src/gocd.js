const request = require('request-promise-native');

const BASE_URL = process.env.GO_URL;
const AUTH_TOKEN = process.env.GO_TOKEN;
const PIPELINE_GROUP_FILTER = new RegExp(process.env.PIPELINE_GROUP_FILTER || '.*');

function get(path, accept=undefined) {
  const uri = BASE_URL + '/go/api/' + path;

  const options = {
    uri,
    headers: {
      'Authorization': 'Bearer ' + AUTH_TOKEN,
      'Accept': accept || 'application/json',
    },
    json: true,
  };

  return request(options);
}

async function getGroups() {
  const data = await get('config/pipeline_groups');

  return data
    .filter((group) => PIPELINE_GROUP_FILTER.test(group.name))
    .map((group) => ({
      name: group.name,
      pipelines: group.pipelines.map((pipeline) => ({
        name: pipeline.name,
        stages: pipeline.stages,
      })),
    }));
}

async function getPipelineHistory(pipeline) {
  const data = await get(`pipelines/${pipeline}/history`);
  const history = data.pipelines[0];
  return history && {
    label: history.label,
    trigger: history.build_cause && history.build_cause.trigger_message || 'N/A',
    modified: history.build_cause && Math.max(...history.build_cause.material_revisions.map((r) => r.modifications[0].modified_time)),
    stages: history.stages && history.stages.map((stage) => ({
      name: stage.name,
      result: stage.result,
      jobs: stage.jobs.map((job) => ({
        name: job.name,
        state: job.state,
        result: job.result,
      })),
    })),
  }
}

async function getPipelineStatus() {
  const groups = await getGroups();

  for (const group of groups) {
    group.status = 'Passed';
    for (const pipeline of group.pipelines) {
      pipeline.history = await getPipelineHistory(pipeline.name);
      group.modified = pipeline.history && pipeline.history.modified;
      pipeline.status = 'Passed';
      if (pipeline.history && pipeline.history.stages) {
        pipeline.label = pipeline.history.label;
        group.label = pipeline.label;

        for (const stage of pipeline.history.stages) {
          if (stage.result && stage.result !== 'Passed') {
            pipeline.status = stage.result;
            if (stage.result) {
              group.status = stage.result;
            }
          }
        }
      }
    }
  }

  return groups;
}

module.exports = {
  getPipelineStatus,
};

