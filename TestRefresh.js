'use strict';


// Wrap everything in an anonymous function to avoid polluting the global namespace
(function() {
    // Use the jQuery document ready signal to know when everything has been initialized
	
    $(document).ready(function() {
        // Tell Tableau we'd like to initialize our extension
        tableau.extensions.initializeAsync().then(function() {
            console.log("Initializing Extension");
            
        });
    });
    
	function refresh(){
		
		const dashboard = tableau.extensions.dashboardContent.dashboard; 
            let dataSourceFetchPromises = []; 
            let dashboardDataSources = {};
            dashboard.worksheets.forEach(function (worksheet) { 
                dataSourceFetchPromises.push(worksheet.getDataSourcesAsync()); 
            }); 
            Promise.all(dataSourceFetchPromises).then(function (fetchResults) { 
                fetchResults.forEach(function (dataSourcesForWorksheet) { 
                    dataSourcesForWorksheet.forEach(function (dataSource) { 
                        if (!dashboardDataSources[dataSource.id]) { 
                            dashboardDataSources[dataSource.id] = dataSource; 
                            dataSource.refreshAsync(); 
                        } 
                    }); 
                }); 
            }); 
	}
})();