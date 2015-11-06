// This file was autogenerated by depswriter.py.
// Please do not edit.
goog.addDependency('../../../../src/vs/async/task-service.js', ['vs.async.TaskService'], ['vs.async.Task'], false);
goog.addDependency('../../../../src/vs/async/task.js', ['vs.async.Task'], [], false);
goog.addDependency('../../../../src/vs/async/thread-pool-service.js', ['vs.async.ThreadPoolService'], ['vs.Configuration', 'vs.ui.UiException'], false);
goog.addDependency('../../../../src/vs/configuration.js', ['vs.Configuration'], [], false);
goog.addDependency('../../../../src/vs/directives/axis.js', ['vs.directives.Axis'], ['vs.async.TaskService', 'vs.directives.GraphicDecorator', 'vs.directives.Visualization', 'vs.ui.VisHandler', 'vs.ui.canvas.CanvasAxis', 'vs.ui.svg.SvgAxis'], false);
goog.addDependency('../../../../src/vs/directives/data-context.js', ['vs.directives.DataContext'], ['vs.directives.Directive', 'vs.ui.DataHandler'], false);
goog.addDependency('../../../../src/vs/directives/directive.js', ['vs.directives.Directive'], [], false);
goog.addDependency('../../../../src/vs/directives/graphic-decorator.js', ['vs.directives.GraphicDecorator'], ['vs.async.TaskService', 'vs.directives.Visualization', 'vs.ui.Decorator', 'vs.ui.VisHandler'], false);
goog.addDependency('../../../../src/vs/directives/grid.js', ['vs.directives.Grid'], ['vs.directives.GraphicDecorator', 'vs.directives.Visualization', 'vs.ui.canvas.CanvasGrid', 'vs.ui.svg.SvgGrid'], false);
goog.addDependency('../../../../src/vs/directives/movable.js', ['vs.directives.Movable'], ['vs.directives.Directive'], false);
goog.addDependency('../../../../src/vs/directives/nav-location.js', ['vs.directives.NavLocation'], ['vs.directives.Directive', 'vs.models.GenomicRangeQuery'], false);
goog.addDependency('../../../../src/vs/directives/navbar.js', ['vs.directives.Navbar'], ['vs.directives.Directive'], false);
goog.addDependency('../../../../src/vs/directives/resizable.js', ['vs.directives.Resizable'], ['vs.directives.Directive'], false);
goog.addDependency('../../../../src/vs/directives/visualization.js', ['vs.directives.Visualization'], ['vs.async.TaskService', 'vs.directives.Directive', 'vs.ui.VisualizationFactory'], false);
goog.addDependency('../../../../src/vs/directives/window.js', ['vs.directives.Window'], ['vs.directives.Directive'], false);
goog.addDependency('../../../../src/vs/models/boundaries.js', ['vs.models.Boundaries'], [], false);
goog.addDependency('../../../../src/vs/models/data-array.js', ['vs.models.DataArray'], ['vs.models.Boundaries'], false);
goog.addDependency('../../../../src/vs/models/data-item.js', ['vs.models.DataItem'], [], false);
goog.addDependency('../../../../src/vs/models/data-row.js', ['vs.models.DataRow'], ['vs.models.DataSource'], false);
goog.addDependency('../../../../src/vs/models/data-source.js', ['vs.models.DataSource'], ['vs.models.DataArray', 'vs.models.Query'], false);
goog.addDependency('../../../../src/vs/models/genomic-range-query.js', ['vs.models.GenomicRangeQuery'], ['vs.models.ModelsException', 'vs.models.Query'], false);
goog.addDependency('../../../../src/vs/models/margins.js', ['vs.models.Margins'], [], false);
goog.addDependency('../../../../src/vs/models/models-exception.js', ['vs.models.ModelsException'], [], false);
goog.addDependency('../../../../src/vs/models/point.js', ['vs.models.Point'], [], false);
goog.addDependency('../../../../src/vs/models/query.js', ['vs.models.Query'], [], false);
goog.addDependency('../../../../src/vs/models/transformer.js', ['vs.models.Transformer'], ['vs.models.Point'], false);
goog.addDependency('../../../../src/vs/ui/canvas/canvas-axis.js', ['vs.ui.canvas.CanvasAxis'], ['vs.models.Transformer', 'vs.ui.decorators.Axis'], false);
goog.addDependency('../../../../src/vs/ui/canvas/canvas-grid.js', ['vs.ui.canvas.CanvasGrid'], ['vs.models.Transformer', 'vs.ui.decorators.Grid'], false);
goog.addDependency('../../../../src/vs/ui/canvas/canvas-vis.js', ['vs.ui.canvas.CanvasVis'], ['goog.string.format', 'vs.ui.VisHandler'], false);
goog.addDependency('../../../../src/vs/ui/data-handler.js', ['vs.ui.DataHandler'], ['vs.models.DataSource', 'vs.models.Query', 'vs.ui.VisualContext'], false);
goog.addDependency('../../../../src/vs/ui/decorator.js', ['vs.ui.Decorator'], ['vs.async.Task', 'vs.async.TaskService'], false);
goog.addDependency('../../../../src/vs/ui/decorators/axis.js', ['vs.ui.decorators.Axis'], ['vs.ui.Decorator', 'vs.ui.Setting'], false);
goog.addDependency('../../../../src/vs/ui/decorators/grid.js', ['vs.ui.decorators.Grid'], ['vs.ui.Decorator', 'vs.ui.Setting'], false);
goog.addDependency('../../../../src/vs/ui/setting.js', ['vs.ui.Setting'], ['vs.models.Boundaries', 'vs.models.DataSource', 'vs.models.Margins'], false);
goog.addDependency('../../../../src/vs/ui/svg/svg-axis.js', ['vs.ui.svg.SvgAxis'], ['vs.ui.decorators.Axis'], false);
goog.addDependency('../../../../src/vs/ui/svg/svg-grid.js', ['vs.ui.svg.SvgGrid'], ['vs.ui.decorators.Grid'], false);
goog.addDependency('../../../../src/vs/ui/svg/svg-vis.js', ['vs.ui.svg.SvgVis'], ['vs.ui.VisHandler'], false);
goog.addDependency('../../../../src/vs/ui/ui-exception.js', ['vs.ui.UiException'], [], false);
goog.addDependency('../../../../src/vs/ui/vis-handler.js', ['vs.ui.VisHandler'], ['vs.async.Task', 'vs.async.TaskService', 'vs.models.DataSource', 'vs.ui.Setting'], false);
goog.addDependency('../../../../src/vs/ui/visual-context.js', ['vs.ui.VisualContext'], [], false);
goog.addDependency('../../../../src/vs/ui/visualization-factory.js', ['vs.ui.VisualizationFactory'], ['vs.Configuration', 'vs.async.TaskService', 'vs.async.ThreadPoolService', 'vs.models.DataSource', 'vs.ui.UiException', 'vs.ui.VisHandler'], false);
goog.addDependency('../../../../src/vs/vs.js', ['vs'], ['vs.Configuration', 'vs.async.TaskService', 'vs.async.ThreadPoolService', 'vs.directives.DataContext', 'vs.directives.Visualization', 'vs.models.DataRow', 'vs.models.GenomicRangeQuery', 'vs.models.Transformer', 'vs.ui.VisHandler', 'vs.ui.VisualizationFactory', 'vs.ui.canvas.CanvasVis', 'vs.ui.svg.SvgVis'], false);