'use strict';

const cfActivity = require('@adenin/cf-activity');
const api = require('./common/api');

module.exports = async function (activity) {

  try {
    api.initialize(activity);
    const response = await api('/admins');

    if (!cfActivity.isResponseOk(activity, response)) {
      return;
    }

    activity.Response.Data = convertResponse(response);
  } catch (error) {
    cfActivity.handleError(activity, error);
  }
};

//**maps response data to items */
function convertResponse(response) {
  let items = [];
  let admins = response.body.admins;

  for (let i = 0; i < admins.length; i++) {
    let raw = admins[i];
    if (raw.type == "admin") {
      let item = { id: raw.id, title: raw.name, description: raw.type, link: `https://app.intercom.io/`, raw: raw }
      items.push(item);
    }
  }

  return { items: items };
}