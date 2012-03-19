Ext.define('Burndown.JsonPWithIDProxy',
{
	extend: 'Ext.data.proxy.JsonP',
	
	config:
	{
    baseUrl: 'https://jira-retail.redprairie.com/rest/api/2.0.alpha1/issue',
    callbackKey: 'jsonp-callback'
  },
  
  buildUrl: function(request)
  {
    var url = request.getProxy().getBaseUrl();
    var id = request.getParams().id;
    request.getProxy().setUrl(url + "/" + id);
    request.setParams({});
    url = this.callParent(arguments);
    return url;
  }
});