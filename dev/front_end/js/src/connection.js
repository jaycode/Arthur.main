(function() {

  app.connection = {
    handler: null
  }
  app.connection.log = function(msg) {
    var self = this;
    var workspace = $('#workspace');
    try
    {
      var data = JSON.parse(msg);
    }
    catch(e)
    {
      if (e.name == 'SyntaxError') {
        $('#console').terminal().echo(msg+"\n");
      }
      else {
        $('#console').terminal().echo(e.message+"\n");
      }
    }
    if (typeof(data) != 'undefined') {
      if (data.page == '#doc-list' && self.ran_connect_cmd && self.first_connection == false) {
        // This means user just ran 'connect' command manually. We don't want to change page in this case
        // otherwise user may lost their work.
        $('#console').terminal().echo("Connected to workspace server.\n");
      }
      else {
        if (data.pass_project) {
          app.vm.project.updateFromData(data.project);
          app.vm.activeDoc.updateFromData(data.project.active_doc, data.data_fields);
        }
        if (data.pass_docs) {
          if ( $.fn.dataTable.isDataTable( '#doc-list-table' ) ) {
              table = $('#doc-list-table').DataTable();
          }
          else {
            $('#doc-list-table').DataTable( {
                paging: true,
                pagingType: 'numbers',
                data: data.docs,
                columns: [
                  {title: 'Doc Name', data: 'name'},
                  {title: 'Labeled', data: 'num_data_fields_labeled'},
                  {title: 'Blocks', data: 'num_data_fields_total'},
                  {title: 'Filesize', type: 'natural', data: 'size', render: function(size) {return (size).fileSize();}},
                  {title: 'Status', data: function(row, type, set, meta) {
                    var status = 'unprocessed';
                    if (row.num_data_fields_labeled > 0) {
                      status = 'labeled';
                    } 
                    return(status);}
                  },
                  {sortable: false, render: function(row) {return '<a role="button" onclick="app.vm.loadDoc(event);" class="button tiny inline">Load</a>';}}
                ]
            });
          }
        }
        if (typeof(data.page) != 'undefined') {
          app.showPage(data.page);
        }
        $('#console').terminal().echo(data.message+"\n");
      }
      app.connection.first_connection = false;
      app.connection.ran_connect_cmd = false;
    }
  }

  app.connection.connect = function() {
    var self = this;
    app.connection.disconnect();

    var transports = {
      'websocket': 1,
      'xhr-streaming': 1,
      'iframe-eventsource': 1,
      'iframe-htmlfile': 1,
      'xhr-polling': 1,
      'iframe-xhr-polling': 1,
      'jsonp-polling': 1,
      'origins': '*'
    }

    $.ajax({'url': '/config'}).done(
      function(config, status) {
        if(status == 'success') {
          var workspacePath = JSON.parse(config).workspace_path;
          app.connection.handler = new SockJS(workspacePath, transports);

          app.connection.handler.onopen = function() {
          };

          app.connection.handler.onmessage = function(e) {
            self.log(e.data);
          };

          app.connection.handler.onclose = function() {
            app.connection.handler = null;
          };
        }
        else {
          alert("Error: Cannot connect to config page. Please refresh the page");
        }
      }
    );
  }

  app.connection.disconnect = function() {
    if (app.connection.handler != null) {

      app.connection.handler.close();
      app.connection.handler = null;
    }
  }

})();