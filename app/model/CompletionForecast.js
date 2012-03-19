Ext.define('Burndown.model.CompletionForecast', 
{
  extend: 'Ext.data.Model',

  config: {
    fields: [
      {name: 'name',  type: 'string'},
      {name: 'forecastDate',   type: 'date'},
      {name: 'forecastMsg',   type: 'string'}
    ]
  }
});