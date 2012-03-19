Ext.define('Burndown.controller.CompletionForecasts', 
{
  extend: 'Ext.app.Controller',
	requires: [
		'Burndown.CompletionForecastCalculator'
	],

  config: {
    refs: {
      list: '#completionforecastview #completionforecastlist'
    }
  },

  launch: function() 
  {
  	var calculator = Ext.create('Burndown.CompletionForecastCalculator');
  	calculator.on('load', this._updateForecasts, this);
  	calculator.calculateForecasts();
  },
  
  _updateForecasts: function(forecasts)
  {
  	var store = this.getList().getStore();
  	store.setOriginalEstimateFullUtilizationForecast(forecasts.originalEstimateFullUtilizationForecast);
  	store.setEstimateAccuracyAndUtilizationOfCompletedTasksForecast(forecasts.estimateAccuracyAndUtilizationOfCompletedTasksForecast);
  }
});