'use strict';

// Wrap everything in an anonymous function to avoid polluting the global namespace
(function () {
  $(document).ready(function () {
    tableau.extensions.initializeAsync().then(function () {
      // Since dataSource info is attached to the worksheet, we will perform
      // one async call per worksheet to get every dataSource used in this
      // dashboard.  This demonstrates the use of Promise.all to combine
      // promises together and wait for each of them to resolve.
      let dataSourceFetchPromises = [];

      // Maps dataSource id to dataSource so we can keep track of unique dataSources.
      let dashboardDataSources = {};

      // To get dataSource info, first get the dashboard.
      const dashboard = tableau.extensions.dashboardContent.dashboard;

      // Then loop through each worksheet and get its dataSources, save promise for later.
      dashboard.worksheets.forEach(function (worksheet) {
        dataSourceFetchPromises.push(worksheet.getDataSourcesAsync());
      });

      Promise.all(dataSourceFetchPromises).then(function (fetchResults) {
        fetchResults.forEach(function (dataSourcesForWorksheet) {
          dataSourcesForWorksheet.forEach(function (dataSource) {
            if (!dashboardDataSources[dataSource.id]) { // We've already seen it, skip it.
              dashboardDataSources[dataSource.id] = dataSource;
            }
          });
        });

        buildDataSourcesTable(dashboardDataSources);

        // This just modifies the UI by removing the loading banner and showing the dataSources table.
        $('#loading').addClass('hidden');
        $('#dataSourcesTable').removeClass('hidden').addClass('show');
      });
    }, function (err) {
      // Something went wrong in initialization.
      console.log('Error while Initializing: ' + err.toString());
    });
  });

  var myVar; 
  
  function refreshStart(dataSource){
	  alert("Data is maintained live with frequesnt automated refresh :-)");
	  myVar = setInterval(function() { refreshDataSource(dataSource); }, 30000);
  }
  
  function refreshStop(){
	  alert("Automated Data Refresh Stopped);
	  clearInterval(myVar); 
  }
  
  // Refreshes the given dataSource.
  function refreshDataSource (dataSource) {
	  
    dataSource.refreshAsync().then(function () {
      console.log(dataSource.name + ': Refreshed Successfully');
    });
  }

 
  // Constructs UI that displays all the dataSources in this dashboard
  // given a mapping from dataSourceId to dataSource objects.
  function buildDataSourcesTable (dataSources) {
    // Clear the table first.
    $('#dataSourcesTable > tbody tr').remove();
    const dataSourcesTable = $('#dataSourcesTable > tbody')[0];

    // Add an entry to the dataSources table for each dataSource.
    for (let dataSourceId in dataSources) {
      const dataSource = dataSources[dataSourceId];

      let newRow = dataSourcesTable.insertRow(dataSourcesTable.rows.length);
      let nameCell = newRow.insertCell(0);
      let refreshCell = newRow.insertCell(1);
      let infoCell = newRow.insertCell(2);

      let refreshButton = document.createElement('button');
      refreshButton.innerHTML = ('Start Refresh cycle');
      refreshButton.type = 'button';
      refreshButton.className = 'btn btn-primary';);
      refreshButton.addEventListener('click', function () { refreshStart(dataSource); });
	  
	  let stoprefreshButton = document.createElement('button');
      stoprefreshButton.innerHTML = ('Stop Refresh');
      stoprefreshButton.type = 'button';
      stoprefreshButton.className = 'btn btn-primary';
      stoprefreshButton.addEventListener('click', function () { refreshStop(); });

      //let infoSpan = document.createElement('span');
      //infoSpan.className = 'glyphicon glyphicon-info-sign';
      //infoSpan.addEventListener('click', function () { showModal(dataSource); });

      nameCell.innerHTML = dataSource.name;
      refreshCell.appendChild(refreshButton);
	  infoCell.appendChild(stoprefreshButton);
      //infoCell.appendChild(infoSpan);
    }
  }
})();
