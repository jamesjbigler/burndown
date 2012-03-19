Ext.application({
  name: 'Burndown',
  
  stores: ['CompletionForecasts'],
  models: ['CompletionForecast'],
  views: ['CompletionForecast'],
  controllers: ['CompletionForecasts'],

  launch: function()
  {
    Ext.Viewport.add(Ext.create('Burndown.view.CompletionForecast'));
  }
});

Ext.Ajax.on('requestcomplete', function(response)
{
	var iso9601DateRx = /"(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)"/g;
	var jsCode = " new Date(parseInt('$1', 10), parseInt('$2', 10)-1, parseInt('$3', 10), parseInt('$4', 10), parseInt('$5', 10), parseInt('$6', 10)) ";
	response.responseText = response.responseText.replace(iso9601DateRx, jsCode);
});