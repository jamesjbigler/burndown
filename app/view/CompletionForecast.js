Ext.define('Burndown.view.CompletionForecast',
{
  extend: 'Ext.Panel',
 
  config:
  {
	  itemId: 'completionforecastview',
    layout: {
      type: 'vbox',
      align: 'stretch'
    },
    items:
    [{
      xtype: 'titlebar',
      title: 'Completion Forecast',
      docked: 'top'
    },
    {
      xtype: 'list',
      itemId: 'completionforecastlist',
      flex: 1,
      ui: 'round',
      grouped: true,
      pinHeaders: false,
      store: 'CompletionForecasts',
      //itemTpl: '{forecastDate:date("D n/j g a")}',
      itemTpl: '{forecastMsg}',
      onItemDisclosure: true,
      preventSelectionOnDisclose: false,
      scrollable: false
    }]
  }
});