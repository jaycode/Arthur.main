/**
* Represents a page inside an ActiveDoc.
*
* This object contain useful attributes such as x, y, width, and height of a page
* to be later used in cursor position detection.
*/
(function() {
  app.DocPage = function(data) {
    var self = this;
    self.width = ko.observable(data.width);
    self.height = ko.observable(data.height);
    self.number = ko.observable(data.number);

    self.x = ko.observable(data.x);
    /**
    * Use following to render to page.
    */
    self.xRender = ko.computed(function() {
      return self.x();
    }, this);

    self.y = ko.observable(data.y);
    /**
    * Use following to render to page, this takes into account the margins between page.
    */
    self.yRender = ko.computed(function() {
      return this.y() + ( (this.number() - 1) * app.data.settings.pageVertMargin);
    }, this);

  }
})();