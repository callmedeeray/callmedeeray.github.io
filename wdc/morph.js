(function () {
    var myConnector = tableau.makeConnector();
	var data, query;
	
	tableQuery = 'SELECT * FROM "data"';
	
    var typesMap = {
        'NUMERIC': tableau.dataTypeEnum.float,
        'NUMBER': tableau.dataTypeEnum.float,
        'INTEGER': tableau.dataTypeEnum.int,
        'REAL': tableau.dataTypeEnum.float,
        'TEXT': tableau.dataTypeEnum.string,
        'BLOB': tableau.dataTypeEnum.string
    };

    myConnector.getSchema = function (schemaCallback) {
		$.getJSON('https://api.morph.io/'+tableau.connectionData+'/data.json?callback=?', {
			key: tableau.password,
			query: tableQuery
		}, function(tables) {
			
			// Array of requests
			var requests = tables.map(function(table) {
                return $.getJSON('https://api.morph.io/'+tableau.connectionData+'/data.json?callback=?', {
					key: tableau.password,
					query: "PRAGMA table_info("+table.name+");"
				}).then(function(data) {
                    return {
                        data: data,
                        table: table.name
                    };
                });
            });
						
			var defer = $.when.apply($, requests);
			defer.done(function(){
                
                var def = Array.prototype.slice.call(arguments).map(function(data){
                    return {
                        id: data.table,
                        columns: data.data.map(function(table) {
                            return {
                                id: table.name,
                                dataType: typesMap[table.type]
                            };
                        })
                    };
                });
                schemaCallback(def);
			});
		});
    };

    myConnector.getData = function (table, doneCallback) {
        
        $.getJSON('https://api.morph.io/'+tableau.connectionData+'/data.json?callback=?', {
            key: tableau.password,
            query: "SELECT * FROM " + table.tableInfo.id
        }, function(data) {
            table.appendRows(data);
            doneCallback();
        });

    };

    tableau.registerConnector(myConnector);

	$(document).ready(function () {
	    $("#submitButton").click(function () {
	        tableau.connectionName = "Morph.io data";
			tableau.connectionData = $('#scraper-url').val().replace('https://morph.io/','');
			tableau.password = $('#api-key').val();
	        tableau.submit();
	    });
	});
})();