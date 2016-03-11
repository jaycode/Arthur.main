var app = app || {};
(function() {
  // Human readable filesize e.g. (186457865).fileSize()); will return 177.82 MiB
  Object.defineProperty(Number.prototype,'fileSize',{value:function(a,b,c,d){
   return (a=a?[1e3,'k','B']:[1024,'K','iB'],b=Math,c=b.log,
   d=c(this)/c(a[0])|0,this/b.pow(a[0],d)).toFixed(2)
   +' '+(d?(a[1]+'MGTPEZY')[--d]+a[2]:'Bytes');
  },writable:false,enumerable:false});

  app.viewModel = function() {
    self = this;
    self.project = new app.Project(app.data.project);
    self.activeDoc = new app.ActiveDoc(app.data.project.active_doc);
    self.footerInfo = ko.observable('Hover cursor over document to view its coordinates here.');
    self.loadDoc = function(e) {
      // Not a good javascript code, but it's faster (at least dev-wise) than needing to observe the list
      // of documents with knockoutjs.
      var filename = $(e.target).closest('tr').find('td').first().text();
      $('#console').terminal().exec('load_doc ' + filename);
    };
    self.showCursorPosition = function(activeDoc, cursor) {
      var docPage = null;
      var topOfFirstPage = $('#doc-pageframe-1').offset()['top'];
      for(var i=0; i<activeDoc.pages().length; i++) {
        page = activeDoc.pages()[i];
        if ((cursor.pageY - topOfFirstPage) >= page.yRender() && 
            (cursor.pageY - topOfFirstPage) <= page.yRender() + page.height()) {
          docPage = page;
        }
      };

      if (docPage != null) {
        var centerOfPage = $(document).width() / 2;
        var leftOfDocument = centerOfPage - (activeDoc.maxWidth() / 2);
        var x = cursor.pageX - leftOfDocument;

        var topOfCurrentDocumentPage = $('#doc-pageframe-'+docPage.number() + '').offset()['top'];
        var topOfPage = docPage.y();
        var y = topOfPage + (cursor.pageY - topOfCurrentDocumentPage);
        self.footerInfo('page ' + docPage.number() + ', x: ' + parseInt(x) + ', y: ' + parseInt(y));
      }
    };
    self.shrinkConsole = function() {
      $('#console').css('height', 0);
      $('#main_area').css('padding-bottom', 60);
    };

    self.expandConsole = function() {
      $('#console').css('height', app.data.settings.consoleDefaultHeight);
      $('#main_area').css('padding-bottom', app.data.settings.consoleDefaultHeight + 40);
    };

    self.maximizeConsole = function() {
      $('#console').css('height', $(window).height()-53);
      $('#main_area').css('padding-bottom', 60);
    };

    self.resizeConsole = function() {
      if (parseFloat($('#console').css('height')) < app.data.settings.consoleDefaultHeight) {
        self.expandConsole();
      }
      else {
        self.shrinkConsole();
      }
    };
  };
  app.showPage = function(selector) {
    $('.page').removeClass('is_active');
    $(selector).addClass('is_active');
  };

  $(document).ready(function() {
    app.connection.first_connection = true;
    app.connection.connect();

    app.vm = new app.viewModel();
    ko.applyBindings(app.vm);

    app.vm.expandConsole();

    jQuery(function($, undefined) {
      $('#console').terminal(function(command, term) {
        var cmd = $.terminal.splitCommand(command);
        if (cmd.name == 'connect') {
          if (app.connection.handler != null) {
            app.connection.disconnect();
          }
          app.connection.ran_connect_cmd = true;
          app.connection.connect();
          return false;
        }
        else {
          if (app.connection.handler) {
            app.connection.handler.send(JSON.stringify({
              'method': cmd['name'],
              'params': cmd['args']
            }));
          }
          else {
            $('#console').terminal().echo("Disconnected from server, run 'connect' to reconnect.")
          }
        }
      }, {
        greetings: "Type 'help' for list of commands.",
        name: 'arthur.ai console',
        height: app.data.settings.consoleDefaultHeight,
        prompt: 'arthur> ',
        keydown: function(e) {
          if (e.which === 82 && e.ctrlKey) { // CTRL+R
            return true;
          }
          else if (e.which === 187 && e.altKey) { // ALT++
            app.vm.maximizeConsole();
            return true;
          }
          else if (e.which === 189 && e.altKey) { // ALT+-
            app.vm.shrinkConsole();
            return true;
          }
          else if (e.which === 48 && e.altKey) { // ALT+0
            app.vm.expandConsole();
            return true;
          }
        }
      });
    });
  });
})();
