(function() {
  app.helpers = app.helpers || {};
  app.helpers.view = {};

  /**
  * Show tip to where the cursor is located at.
  * Tip message is taken from "title" attribute.
  */
  app.helpers.view.showTip = function() {
    var msg = d3.select(d3.event.target).attr('title');
    var topOffset = 20;
    var leftOffset = -20;

    var tip = d3.select('body')
      .append('span')
        .classed('tooltip', true)
        .style('top', (d3.event.pageY + topOffset) + 'px')
        .style('left', (d3.event.pageX + leftOffset) + 'px')
        .style('min-width', '90px')
        .style('display', 'inline')
        .html(msg);
    tip
      .append('span')
        .classed('nub', true);

    tip
      .append('span')
        .classed('tap-to-close', true);
  };

  app.helpers.view.hideTip = function() {
    d3.select('.tooltip')
      .remove();
  }

  app.helpers.view.showBlockDialog = function() {
    
  }
})();