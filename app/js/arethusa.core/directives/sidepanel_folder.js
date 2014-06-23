'use strict';
angular.module('arethusa.core').directive('sidepanelFolder', [
  'configurator',
  function (configurator) {
    return {
      scope: true,
      link: function (scope, element, attrs) {
        function get(id) {
          return angular.element(document.getElementById(id));
        }

        function addShowText() {
          element.text('Show Panel');
        }

        function addFoldText() {
          element.text('Fold Panel');
        }

        function toggleFoldStatus(args) {
          var main = get('main-body');
          var panel = get('sidepanel');
          var width = panel.width();
          var mainWidth = main.width();
          if (scope.folded) {
            main.width(mainWidth - width);
            panel.show();
            addFoldText();
          } else {
            main.width(mainWidth + width);
            panel.hide();
            addShowText();
          }
          scope.folded = !scope.folded;
        }

        function init() {
          if (scope.folded) {
            var main = get('main-body');
            var panel = get('sidepanel');
            main.width(main.width() + panel.width());
            panel.hide();
            addShowText();
          } else {
            addFoldText();
          }
        }

        element.on('click', function () {
          toggleFoldStatus();
        });

        scope.folded = configurator.configurationFor('main').foldSidepanel;
        init();
      }
    };
  }
]);
