var React = require('react'),
  PureRenderMixin = require('react-pure-render/mixin'),
  TooltipInternal = require('./tooltip_internal');

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
  getDefaultProps: function() {
    return {
      align: 'bottom'
    };
  },
  getInitialState: function() {
    return {
      open: false
    };
  },
  componentDidMount: function() {
    this._container = React.findDOMNode(this);
    this._container.addEventListener('mouseenter', this.onMouseEnter);
    this._container.addEventListener('mouseleave', this.hideTooltip);
  },
  componentWillUnmount: function() {
    if (this.state.showTimeout) window.clearTimeout(this.state.showTimeout);
    this.hideTooltip(null, function() {
      this._container.removeEventListener('mouseenter', this.onMouseEnter);
      this._container.removeEventListener('mouseleave', this.hideTooltip);
    }.bind(this));
  },
  componentWillReceiveProps: function() {
    if (this.state.open) this.showTooltip();
  },
  onMouseEnter: function() {
    this.setState({
      showTimeout: window.setTimeout(this.showTooltip, TOOLTIP_DELAY)
    });
  },
  showTooltip: function() {
    if (!this.isMounted()) return;
    if (!this._node) {
      this._node = document.body.appendChild(document.createElement('div'));
    }
    this.setState({ open: true }, function() {
      this._render();
    }.bind(this));
  },
  hideTooltip: function(e, callback) {
    if (!callback) callback = function() {};
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
  _render: function() {
    React.render(
      React.createElement(TooltipInternal, _extends({}, this.props, {
        anchor: this._container,
        nubClassName: nubClasses[this.props.align],
        className: 'round pad0x pad00y fill-tooltip micro noevents contain'
      })), this._node);
  },
  render: function() {
    return this.props.children;
  }
});

module.exports = Tooltip;
