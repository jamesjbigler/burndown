Ext.define('Burndown.store.CompletionForecasts', 
{
	extend: 'Ext.data.Store',
	config:
	{
    model: 'Burndown.model.CompletionForecast',
    storeId: 'CompletionForecasts',
    grouper: {
  	  groupFn: function(record)
  	  {
    	  return record.get('name');
      }
    },
    data: [
      {name: 'Based On Original Estimates and Full Utilization'},
      {name: 'Based On Estimate Accuracy and Utilization of Completed Tasks'}
    ]
  },
  
  setOriginalEstimateFullUtilizationForecast: function(forecast)
  {
  	var record = this.getAt(1);
  	record.set('forecastMsg', forecast.forecastMsg);
    record.set('forecastDate', forecast.forecastDate);
  },
  
  setEstimateAccuracyAndUtilizationOfCompletedTasksForecast: function(forecast)
  {
    var record = this.getAt(0);
    record.set('forecastMsg', forecast.forecastMsg);
    record.set('forecastDate', forecast.forecastDate);
  }
});