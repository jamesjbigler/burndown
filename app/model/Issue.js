Ext.define('Burndown.model.Issue', 
{
  extend: 'Ext.data.Model',
  requires: ['Burndown.JsonPWithIDProxy'],

  config: 
  {
    fields: [
      {name: 'key',  type: 'string'},
      {name: 'fields',   type: 'auto'}
    ],
    proxy: Ext.create('Burndown.JsonPWithIDProxy')
  },
  
  getSubTaskIDs: function()
  {
    var subtasks = this.get('fields')['sub-tasks'].value;
    return Ext.Array.pluck(subtasks, 'issueKey');
  },
  
  getMinutesLoggedOnOrAfter: function(start)
  {
  	var worklogs = this._getWorklogsStartingOnOrAfter(start);
  	return this._sumMinutesSpent(worklogs);
  },
  
  getMinutesLoggedBefore: function(start)
  {
  	var worklogs = this._getWorklogsStartingBefore(start);
  	return this._sumMinutesSpent(worklogs);
  },
  
  _sumMinutesSpent: function(worklogs)
  {
  	var minutesSpent = Ext.Array.pluck(worklogs, 'minutesSpent');
  	return Ext.Array.sum(worklogs);
  },
  
  getEstimatedMinutes: function(start)
  {
    if (this.get('fields').issuetype.value.subtask)
    {
    	var timetracking = this.get('fields').timetracking.value;
    	if (timetracking)
    	{
    		var originalEstimate = timetracking.timeoriginalestimate;
      	return originalEstimate;
      }
    }
    
    return 0;
  },
  
  getRemainingEstimatedMinutesForOpenIssue: function(start)
  {
  	if (this.isOpen())
  	{
  		var estimatedMinutes = this.getEstimatedMinutes();
  		var loggedMinutes = this.getMinutesLoggedOnOrAfter(start);
  		var remainingMinutes = estimatedMinutes - loggedMinutes;
  		return (remainingMinutes > 0) ? remainingMinutes : 0;
  	}
  	return 0;
  },
  
  isOpen: function()
  {
  	var status = this.get('fields').status.value.name;
  	return status !== "Closed";
  },

  _getWorklogsStartingBefore: function(start)
  {
  	var allWorklogs = this.get('fields').worklog.value;
 		var worklogs = [];
  	Ext.each(worklogs, function(worklog)
  	{
  		if (worklog.started < start)
  		{
  			worklogs.push(worklog);
  		}
  	}, this);
  	return worklogs;
  },
  
  _getWorklogsStartingOnOrAfter: function(start)
  {
  	var allWorklogs = this.get('fields').worklog.value;
 		var worklogs = [];
  	Ext.each(worklogs, function(worklog)
  	{
  		if (worklog.started >= start)
  		{
  			worklogs.push(worklog);
  		}
  	}, this);
  	return worklogs;
  }
});