'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react'),
    PureRenderMixin = require('react-pure-render/mixin'),
    TooltipInternal = require('./tooltip_internal');

var nubClasses = {
  top: 'bottom-nub tooltip-nub',
  bottom: 'top-nub tooltip-nub',
  left: 'right-nub tooltip-nub',
  right: 'left-nub tooltip-nub'
};

var TOOLTIP_DELAY = 150;

var Tooltip = React.createClass({
  displayName: 'Tooltip',

  mixins: [PureRenderMixin],
  propTypes: {
    align: React.PropTypes.string,
    children: React.PropTypes.any.isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      align: 'bottom'
    };
  },
  getInitialState: function getInitialState() {
    return {
      open: false
    };
  },
  componentDidMount: function componentDidMount() {
    this._container = React.findDOMNode(this);
    this._container.addEventListener('mouseenter', this.onMouseEnter);
    this._container.addEventListener('mouseleave', this.hideTooltip);
  },
  componentWillUnmount: function componentWillUnmount() {
    var _this = this;

    if (this.state.showTimeout) window.clearTimeout(this.state.showTimeout);
    this.hideTooltip(null, function () {
      _this._container.removeEventListener('mouseenter', _this.onMouseEnter);
      _this._container.removeEventListener('mouseleave', _this.hideTooltip);
    });
  },
  componentWillReceiveProps: function componentWillReceiveProps() {
    if (this.state.open) this.showTooltip();
  },
  onMouseEnter: function onMouseEnter() {
    this.setState({
      showTimeout: window.setTimeout(this.showTooltip, TOOLTIP_DELAY)
    });
  },
  showTooltip: function showTooltip() {
    var _this2 = this;

    if (!this.isMounted()) return;
    if (!this._node) {
      this._node = document.body.appendChild(document.createElement('div'));
    }
    this.setState({ open: true }, function () {
      _this2._render();
    });
  },
  hideTooltip: function hideTooltip(e, callback) {
    if (!callback) callback = function () {};
    if (this.state.showTimeout) window.clearTimeout(this.state.showTimeout);
    if (this._node) {
      React.unmountComponentAtNode(this._node);
      this._node.parentNode.removeChild(this._node);
      this._node = null;
    }
    if (this.isMounted()) {
      this.setState({ open: false });
    }
    callback();
  },
  _render: function _render() {
    React.render(React.createElement(TooltipInternal, _extends({}, this.props, {
      anchor: this._container,
      nubClassName: nubClasses[this.props.align],
      className: 'round pad0x pad00y fill-tooltip micro noevents contain' })), this._node);
  },
  render: function render() {
    return this.props.children;
  }
});

module.exports = Tooltip;

