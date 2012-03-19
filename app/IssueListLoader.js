Ext.define('Burndown.IssueListLoader',
{
	extend: 'Object',
	mixins: ['Ext.mixin.Observable'],
	
  config: {
    loadedIssues: null,
    issueCount: null
  },	
	
  loadIssues: function(issueIDs)
  {
    this.setLoadedIssues([]);
    this.setIssueCount(issueIDs.length);
    Ext.each(issueIDs, function(issueID)
    {
      var issue = Ext.ModelManager.getModel('Burndown.model.Issue');

      issue.load(issueID, 
      {
        success: this._onIssueLoaded,
        scope: this
      });
    }, this);
  },
  
  _onIssueLoaded: function(issue)
  {
  	this.getLoadedIssues().push(issue);
    this._checkForAllIssuesLoaded();
  },
  
  _checkForAllIssuesLoaded: function()
  {
    if (this.getLoadedIssues().length !== this.getIssueCount())
    {
      return;
    }
    this.fireEvent('load', this.getLoadedIssues());
  }
});