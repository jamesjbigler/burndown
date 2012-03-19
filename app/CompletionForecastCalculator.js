Ext.define('Burndown.CompletionForecastCalculator',
{
  extend: 'Object',
  mixins: ['Ext.mixin.Observable'],
  requires: [
    'Burndown.IssueFinder',
    'Burndown.IssueListLoader'
  ],
  config: {
  	loadedStories: null,
  	loadedTasks: null
  },

  calculateForecasts: function()
  {
    var issueFinder = Ext.create('Burndown.IssueFinder');
    issueFinder.findStoriesForCurrentIteration(
    {
      success: this._loadStories,
      scope: this
    });
  },
  
  _loadStories: function(storyIDs)
  {
  	var issueLoader = Ext.create('Burndown.IssueListLoader');
  	issueLoader.on('load', this._onStoriesLoaded, this);
  	issueLoader.loadIssues(storyIDs);
  },
  
  _onStoriesLoaded: function(stories)
  {
  	this.setLoadedStories(stories);
    this._loadTasks();
  },
  
  _loadTasks: function()
  {
    var taskIDs = [];
    Ext.each(this.getLoadedStories(), function(story)
    {
    	taskIDs = taskIDs.concat(story.getSubTaskIDs());
    }, this);
    
  	var issueLoader = Ext.create('Burndown.IssueListLoader');
  	issueLoader.on('load', this._onTasksLoaded, this);
  	issueLoader.loadIssues(taskIDs);
  },
  
  _onTasksLoaded: function(tasks)
  {
  	this.setLoadedTasks(tasks);
		
		var iterationStart = new Date(2012,2,14,10,0,0);
		var minutesInIterationPerDeveloper = ((8 * 6) + 2) * 60;
		var minutesInIteration = minutesInIterationPerDeveloper * 8;
		var minutesSpentPerDeveloper = this._getMinutesSpent(iterationStart);
	  Ext.Logger.warn('minutesSpentPerDeveloper = ' + minutesSpentPerDeveloper);
		var minutesSpent = minutesSpentPerDeveloper * 8;
		var remainingEstimatedMinutes = this._getRemainingEstimatedMinutesForOpenTasks(iterationStart);
		Ext.Logger.warn('minutesInIteration = ' + minutesInIteration);
		Ext.Logger.warn('minutesSpent = ' + minutesSpent);
    Ext.Logger.warn('remainingEstimatedMinutes = ' + remainingEstimatedMinutes);

		var minutesBeforeEndOfIteration = minutesInIteration - minutesSpent - remainingEstimatedMinutes;
		
		Ext.Logger.warn('minutesBeforeEndOfIteration = ' + minutesBeforeEndOfIteration);
	
		var hoursBeforeEndOfIteration = Math.ceil((minutesBeforeEndOfIteration/60)/8);
		
		Ext.Logger.warn('hoursBeforeEndOfIteration = ' + hoursBeforeEndOfIteration);
		
    var results = {
     originalEstimateFullUtilizationForecast: {
       forecastDate: new Date(2012, 3, 16),
       forecastMsg: Ext.String.format('{0} hours {1}', Math.abs(hoursBeforeEndOfIteration), 
         (hoursBeforeEndOfIteration > 0) ? "under" : "over")
     },
     estimateAccuracyAndUtilizationOfCompletedTasksForecast: {
       forecastDate: new Date(2012, 3, 19),
       forecastMsg: "TODO"
     }
    };
    this.fireEvent('load', results);
	},
	
	// Wed 1, Thu 2, Fri 3. Sat 4, Sun 5, Mon 6, Tue 7, Wed 8, Thu 9, Fri 10, Sat 11, Sun 12, Mon 13, Tue 14
	_getMinutesSpent: function(iterationStart)
	{
		var now = Ext.Date.now();
		var dayStart = Ext.Date.clone(iterationStart);
		var minutesSpent = 0;
	  for (var dayIndex = 1; dayIndex <= 14; dayIndex++)
	  {
	  	Ext.Logger.warn('dayIndex = ' + dayIndex);
	  	Ext.Logger.warn('dayStart = ' + dayStart);
	  	if (now < dayStart)
	  	{
	  		return minutesSpent;
	  	}
	  	if (dayIndex === 4 || dayIndex === 5 || dayIndex === 11 || dayIndex === 12)
	  	{
	  		dayStart = Ext.Date.add(dayStart, Ext.Date.DAY, 1);
	  		continue;
	  	}
	  	
	    var hourToEnd = (dayIndex === 13) ? 12 : 17;
	    var dayEnd = new Date(dayStart.getFullYear(), dayStart.getMonth(), dayStart.getDate(), hourToEnd, 0, 0);
	    Ext.Logger.warn('dayEnd = ' + dayEnd);
	    
	    var hourOfDay = Ext.Date.add(dayStart, Ext.Date.HOUR, 1);
	    while (hourOfDay < now && hourOfDay < dayEnd)
	    {
	    	hourOfDay = Ext.Date.add(hourOfDay, Ext.Date.HOUR, 1);
	    	Ext.Logger.warn('hourOfDay = ' + hourOfDay);
	    	minutesSpent += 60;
	    }
	    
	    dayStart = Ext.Date.add(dayStart, Ext.Date.DAY, 1);
	  }
		return minutesSpent;
	},
	
	_getRemainingEstimatedMinutesForOpenTasks: function(start)
	{
		var totalMinutes = 0;
		var allIssues = this.getLoadedStories().concat(this.getLoadedTasks());
		Ext.each(allIssues, function(issue)
		{
			var minutes = issue.getRemainingEstimatedMinutesForOpenIssue();
			//Ext.Logger.warn('remainingMinutesForIssue(' + issue.get('key') + ') = ' + minutes);
			totalMinutes += minutes;
		}, this);
		
		return totalMinutes;
	}
});