/**
* Represents an ArthurProject.
*/
(function() {
  app.Project = function(data) {
    var self = this;
    self.name = ko.observable(data['name']);

    self.updateFromData = function(data) {
      self.name(data.name);
    };
  }
})();