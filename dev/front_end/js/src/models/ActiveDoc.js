/**
* Model used for document editing.
*/
(function() {
  app.ActiveDoc = function(data) {
    var self = this;
    var doc_content_id = '#doc-content';

    self.name = ko.observable(data['name']);
    self.maxWidth = ko.observable(800);
    self.totalHeight = ko.observable(1000);
    self.pages = ko.observableArray([]);

    /**
     * Update attributes from given data.
     */
    self.updateFromData = function(data, blocks) {
      if (data == null) {
        self.name('');
        self.pages.removeAll();
        self.maxWidth(0);
        self.totalHeight(0);
      }
      else {
        self.name(data['name']);
        self.pages.removeAll();
        var maxWidth = 0;
        var totalHeight = 0;
        _.sortBy(data.page_infos, 'number');
        data.page_infos.forEach(function(pageInfo) {
          if (maxWidth < pageInfo.width) {
            maxWidth = pageInfo.width;
          }
          totalHeight += pageInfo.height + app.data.settings.pageVertMargin;
        });

        var y = app.data.settings.pageTopOffset;
        data.page_infos.forEach(function(pageInfo) {
          var x = (maxWidth - pageInfo.width)/2;
          docPage = new app.DocPage({
            x: x,
            y: y,
            width: pageInfo.width,
            height: pageInfo.height,
            number: pageInfo.number
          });
          self.pages.push(docPage);
          y += pageInfo.height;
        });

        self.maxWidth(maxWidth);
        self.totalHeight(totalHeight);
        setTimeout(function() {
          // Drawing content is done here instead of inside DocPage because earlier I needed
          // to use maxWidth and totalHeight.
          // Todo: Refactor later if no adjustments needed to get elements' features.
          data.elements.forEach(function(element, id) {
            var page = d3.select('#doc-page-'+element.features['page']);
            var docPage = self.pages()[element.features['page']-1];
            var topOffset = ((parseInt(element.features['page'])-1) * app.data.settings.pageVertMargin);

            var x = element.features['x'];
            var y = element.features['y'] + topOffset;

            var fontsize = 'auto';
            if (typeof(element.features['size']) != 'undefined') {
              fontsize = element.features['size']+'px';
            }

            page
              .append('text')
                .attr('class', 'doc-element')
                .attr('x', x)
                .attr('y', y)
                .attr('real-y', element.features['y'])
                .style('font-size', fontsize)
                .text(element.text)
          });
          // ----End of drawing contents----

          // Drawing the blocks
          d3.select('#doc-blocks').remove();
          var docBlocks = d3.select('#doc-content')
            .append('g')
              .attr('id', 'doc-blocks')
              .attr('class', 'doc-blocks');

          if (blocks != null) {
            for (var i=0; i<blocks.length; i++) {
              block = blocks[i];
              if (!isNaN(block['x']) && !isNaN(block['y']) && !isNaN(block['x1']) && !isNaN(block['y1'])) {
                var topOffset = 0;
                if (block['page']) {
                  topOffset = ((parseInt(block['page'])-1) * app.data.settings.pageVertMargin);
                }
                docBlocks
                  .append('rect')
                    .attr('x', block['x'])
                    .attr('y', block['y'] + topOffset - app.data.settings.blockOffset)
                    .attr('width', block['x1'] - block['x'])
                    .attr('height', block['y1'] - block['y'])
                    .attr('title', 'text: ' + block['text'] + "\nx: " + block['x'] + "\nx1:" + block['x1'] + "\ny: " + block['y'] + "\ny1:" + block['y1'])
                    .on('mouseover', self.blockHover)
                    .on('mouseout', self.blockOut)
                    .on('click', self.blockClick)
                    .style('fill', '#CC0066')
                    .style('stroke', '#CC0066');              
              }
            };

          }
          // ----End of drawing the blocks----

        }, 100);
      }
    };

    self.blockHover = function() {
      // Use d3.event for cursor object.
      d3.select(d3.event.target).style('fill', '#FFFFA3');
      app.helpers.view.showTip();
    };

    self.blockOut = function() {
      d3.select(d3.event.target).style('fill', '#CC0066');
      app.helpers.view.hideTip();
    };

    self.blockClick = function() {
      app.helpers.view.showBlockDialog();
    };

    self.updateFromData(data, data.data_fields);
  };
})();