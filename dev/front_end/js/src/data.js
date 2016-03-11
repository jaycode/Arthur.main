/**
* Model of data used in app
*/
(function() {
  /**
   * This object contains all data used in this app.
   * @namespace app.data
   */
  app.data = {
    settings: {
      consoleDefaultHeight: 200,
      // y distance between pages.
      pageVertMargin: 20,
      pageTopOffset: 0,
      blockOffset: 8
    }
  };

  /**
  * Project data. This should kind of resemble the database.
  * We bind this object with knockout js.
  * @namespace app.data.project
  */
  app.data.project = {
    name: 'risky',
    active_doc: {
      name: 'Document.pdf',
      page_infos: [
        {
          number: 1,
          width: 600,
          height: 800
        },
        {
          number: 2,
          width: 800,
          height: 600
        }
      ],
      elements: [
        {features: {x:100, y:0+7, x1: 106, y1: 11+7, page: 1, size: 10}, text: 'T'},
        {features: {x:110, y:0+7, x1: 116, y1: 11+7, page: 1, size: 10}, text: 'e'},
        {features: {x:120, y:0+7, x1: 125, y1: 11+7, page: 1, size: 10}, text: 's'},
        {features: {x:130, y:0+7, x1: 133, y1: 11+7, page: 1, size: 10}, text: 't'},
        {features: {x:10, y:820, x1: 22, y1: 842, page: 2, size: 20}, text: 'T'},
        {features: {x:20, y:820, x1: 21, y1: 842, page: 2, size: 20}, text: 'e'},
        {features: {x:30, y:820, x1: 40, y1: 842, page: 2, size: 20}, text: 's'},
        {features: {x:40, y:820, x1: 45, y1: 842, page: 2, size: 20}, text: 't'},
        {features: {x:50, y:820, x1: 66, y1: 842, page: 2, size: 20}, text: '2'}
      ]
    },
    docs: [],
    context: '',
    concepts: []
  };

})();