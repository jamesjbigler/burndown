Ext.define('Burndown.IssueFinder',
{
	extend: 'Object',
  requires: [
    'Burndown.model.Issue'
  ],	
  findStoriesForCurrentIteration: function(config)
  {
    Ext.data.JsonP.request(
    {
      url: 'https://jira-retail.redprairie.com/rest/api/2.0.alpha1/search',
      callbackKey: 'jsonp-callback',
      params: {
        jql: 'labels=Bazinga and issuetype=Story and fixVersion=\'2012.1R2-Itn-01\''
      },
      success: function(result)
      {
        var storyIDs = Ext.Array.pluck(result.issues, 'key');
        config.success.call(config.scope, storyIDs);
      }
    });
  }
});