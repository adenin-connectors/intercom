'use strict';
const api = require('./common/api');

module.exports = async function (activity) {
  try {
    let pagination = Activity.pagination();
    let url = '';
    if (pagination.nextpage) {
      url = pagination.nextpage;
    } else {
      url = '/admins';
    }

    const response = await api(url);

    if (Activity.isErrorResponse(response)) return;

    activity.Response.Data = convertResponse(response);
    if (response.body.pages) {
      if (response.body.pages.next) {
        //if no more pages next object is not defined
        //link to next page - its not offset token
        activity.Response.Data._nextpage = response.body.pages.next;
      }
    }
  } catch (error) {
    Activity.handleError(error);
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