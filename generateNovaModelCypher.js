function generateNovaModelCypher() {
  let activeSheet = SpreadsheetApp.getActiveSpreadsheet();

  // This represents ALL the data
  var values = activeSheet.getDataRange().offset(1, 0).getValues();

  // make functional?
  let Goal_collection = [];
  for (var i = 0; i < values.length; i++) {
    let Goal = {};
    Goal.name = values[i][0];
    Goal.users = values[i][1].toString().split(';');
    Goal.read = values[i][2].toString().split(';');
    Goal.write = values[i][3].toString().split(';');
    Goal.update = values[i][4].toString().split(';');
    Goal_collection.push(Goal);
  }

  let cypher_script = "";

  Goal_collection.filter(Goal => Goal.name).forEach(Goal => {
    let Goal_merge = 'MERGE (Goal:Goal {name: \'' + Goal.name + '\', progress: 0})\r\n';
    let data_merge = '';
    Goal.read
      .filter(d => d)
      .forEach((data, i) => data_merge
        += 'MERGE (reading' + i + ':Data {name: \'' + data + '\'})\r\n');

    Goal.update
      .filter(d => d)
      .forEach((data, i) => data_merge
        += 'MERGE (updating' + i + ':Data {name: \'' + data + '\'})\r\n');

    Goal.write
      .filter(d => d)
      .forEach((data, i) => data_merge
        += 'MERGE (writing' + i + ':Data {name: \'' + data + '\'})\r\n');

    let user_merge = '';
    Goal.users
      .filter(u => u)
      .forEach((user, i) => user_merge
        += 'MERGE (u' + i + ':User {name: \'' + user + '\'})\r\n'
        + 'MERGE (u' + i + ')-[does' + i + ':DOES]->(Goal)\r\n'
      );

    let readers_merge = '';
    Goal.read
      .filter(r => r)
      .forEach((r, i) => readers_merge
        += 'MERGE (Goal)-[reads' + i + ':READS]->(reading' + i + ')\r\n'
      );

    let updaters_merge = '';
    Goal.update
      .filter(r => r)
      .forEach((r, i) => updaters_merge
        += 'MERGE (Goal)-[updates' + i + ':UPDATES]->(updating' + i + ')\r\n'
      );

    let writers_merge = '';
    Goal.write
      .filter(r => r)
      .forEach((r, i) => writers_merge
        += 'MERGE (Goal)-[writes' + i + ':WRITES]->(writing' + i + ')\r\n'
      );

    cypher_script
      += Goal_merge
      + user_merge
      + data_merge
      + readers_merge
      + writers_merge
      + updaters_merge
      + ';\r\n';
  });

  var cypherSheet = activeSheet.getSheetByName("cypher");

  if (cypherSheet != null) {
    activeSheet.deleteSheet(cypherSheet);
  }

  cypherSheet = activeSheet.insertSheet();
  cypherSheet.setName("cypher");

  cypherSheet.setColumnWidth(1, 400);
  cypherSheet.getRange(1, 1).setValue(cypher_script);
}

function onOpen() {
  let ui = SpreadsheetApp.getUi();
  ui.createMenu('Nova Modelling').addItem('Generate Cypher', 'generateNovaModelCypher').addToUi();
}