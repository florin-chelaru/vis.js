/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 11/19/2015
 * Time: 4:55 PM
 */

goog.provide('vs.directives.LoadingDecorator');

goog.require('vs.async.TaskService');

/**
 * @param {angular.Scope} $scope
 * @param {vs.async.TaskService} taskService
 * @param {angular.$timeout} $timeout
 * @constructor
 * @extends {ngu.Directive}
 */
vs.directives.LoadingDecorator = function($scope, taskService, $timeout) {
  ngu.Directive.apply(this, arguments);

  /**
   * @type {vs.async.TaskService}
   * @private
   */
  this._taskService = taskService;

  /**
   * @type {angular.$timeout}
   * @private
   */
  this._$timeout = $timeout;
};

goog.inherits(vs.directives.LoadingDecorator, ngu.Directive);

/**
 * @param {angular.Scope} $scope
 * @param {jQuery} $element
 * @param {angular.Attributes} $attrs
 * @param controller
 * @override
 */
vs.directives.LoadingDecorator.prototype.link = function($scope, $element, $attrs, controller) {
  ngu.Directive.prototype.link['post'].apply(this, arguments);

  /** @type {vs.directives.Visualization} */
  var vis = $scope['visualization']; //['handler'];

  /** @type {vs.ui.VisHandler} */
  var target = vis['handler'];

  var startTimeout = null;
  var endTimeout = null;
  var progressInterval = null;

  var $overlay = $('<div class="vs-loading-overlay" style="opacity: 0; display: none;"></div>').appendTo($element);

  var $container = $('<div class="vs-loading-container" style="opacity: 0; display: none;"></div>').appendTo($element);

  var $progress = $('<div class="progress" ></div>').appendTo($container);
  var $progressBar = $(
    '<div class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="0" ' +
          'aria-valuemin="0" aria-valuemax="100" style="width:0"> ' +
    '</div>').appendTo($progress);

  var updateProgress = function() {
    $progressBar.css({
     '-webkit-transition': '',
     '-o-transition': '',
     'transition': ''
     });
    var w = $progressBar.css('width');
    var p = (w == undefined || w.indexOf('px') >= 0) ? ($progressBar.width() / $progress.width() * 100) : parseInt(w, 10);
    if (p >= 99) { return; }
    var remaining = 100 - p;
    p = Math.min(p + Math.ceil(remaining * 0.25), 99);
    $progressBar.css('width', p + '%');
  };

  $element.on('resizestart', function(e) {
    $overlay.css('display', 'block');
    u.reflowForTransition($overlay[0]);
    $overlay.css('opacity', '1');
  });
  $element.on('resizeend', function(e) {
    target.scheduleRedraw()
      .then(function() {
        $overlay.one('transitionend', function() {
          $overlay.css('display', 'none');
        });
        $overlay.css('opacity', '0');
      });
  });

  var afterDraw = function() {
    if (endTimeout != null) { return Promise.resolve(); }
    if (startTimeout != null) {
      clearTimeout(startTimeout);
      startTimeout = null;
      return Promise.resolve();
    }

    endTimeout = setTimeout(function() {
      endTimeout = null;
      clearInterval(progressInterval);

      $overlay.one('transitionend', function() {
        $overlay.css('display', 'none');
      });
      $overlay.css('opacity', 0);

      $container.one('transitionend', function() {
        $container.css('display', 'none');
      });
      $container.css('opacity', 0);
      $progressBar.css('width', '100%');
    }, 500);
    return Promise.resolve();
  };

  var beforeDraw = function() {
    if (startTimeout != null) { return Promise.resolve(); }
    if (endTimeout != null) {
      clearTimeout(endTimeout);
      endTimeout = null;
      return Promise.resolve();
    }
    startTimeout = setTimeout(function() {
      startTimeout = null;
      $progressBar.css({
        '-webkit-transition': 'none',
        '-o-transition': 'none',
        'transition': 'none'
      });
      $progressBar.css('width', '0');

      $overlay.css('display', 'block');
      u.reflowForTransition($overlay[0]);
      $overlay.css('opacity', '1');

      $container.css('display', 'block');
      u.reflowForTransition($container[0]);
      $container.css('opacity', '1');

      progressInterval = setInterval(updateProgress, 500)
    }, 500);

    // In this case, it's ok to resolve the promise before the timeout is done; we don't want the visualization to wait
    return Promise.resolve();
  };

  target['data']['changing'].addListener(beforeDraw);
  target['data']['changed'].addListener(afterDraw);

  this._taskService.chain(target['endDrawTask'], this._taskService.createTask(afterDraw));
  this._taskService.chain(this._taskService.createTask(beforeDraw), target['beginDrawTask']);
};
