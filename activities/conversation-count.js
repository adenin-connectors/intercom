'use strict';
const api = require('./common/api');

module.exports = async function (activity) {
  try {
    api.initialize(activity);
    //const response = await api('/counts?type=conversation');
    const response = await api('/counts?type=conversation');
    if ($.isErrorResponse(activity, response)) return;

    let value = response.body.conversation.open;
    activity.Response.Data.title = T(activity, 'Open Conversations');
    activity.Response.Data.linkLabel = T(activity, 'All Conversations');
    activity.Response.Data.link = "https://app.intercom.io/a/";
    activity.Response.Data.actionable = value > 0;
    activity.Response.Data.value = value;
    activity.Response.Data.conversations = response.body.conversation;

    if (value > 0) {
      activity.Response.Data.color = 'blue';
      activity.Response.Data.description = value > 1 ? T(activity, "There are {0} open conversations.", value)
        : T(activity, "There is 1 open conversation.");
    } else {
      activity.Response.Data.description = T(activity, 'There are no open conversations.');
    }
  } catch (error) {
    $.handleError(activity, error);
  }
};