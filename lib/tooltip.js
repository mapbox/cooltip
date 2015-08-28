var React = require('react'),
  PureRenderMixin = require('react-pure-render/mixin'),
  TooltipInternal = require('./tooltip_internal');

const nubClasses = {
  top: 'bottom-nub tooltip-nub',
  bottom: 'top-nub tooltip-nub',
  left: 'right-nub tooltip-nub',
  right: 'left-nub tooltip-nub'
};

const TOOLTIP_DELAY = 150;

var Tooltip = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    align: React.PropTypes.string,
    children: React.PropTypes.any.isRequired
  },
  getDefaultProps() {
    return {
      align: 'bottom'
    };
  },
  getInitialState() {
    return {
      open: false
    };
  },
  componentDidMount() {
    this._container = React.findDOMNode(this);
    this._container.addEventListener('mouseenter', this.onMouseEnter);
    this._container.addEventListener('mouseleave', this.hideTooltip);
  },
  componentWillUnmount() {
    if (this.state.showTimeout) window.clearTimeout(this.state.showTimeout);
    this.hideTooltip(null, () => {
      this._container.removeEventListener('mouseenter', this.onMouseEnter);
      this._container.removeEventListener('mouseleave', this.hideTooltip);
    });
  },
  componentWillReceiveProps() {
    if (this.state.open) this.showTooltip();
  },
  onMouseEnter() {
    this.setState({
      showTimeout: window.setTimeout(this.showTooltip, TOOLTIP_DELAY)
    });
  },
  showTooltip() {
    if (!this.isMounted()) return;
    if (!this._node) {
      this._node = document.body.appendChild(document.createElement('div'));
    }
    this.setState({ open: true }, () => {
      this._render();
    });
  },
  hideTooltip(e, callback) {
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
  _render() {
    React.render(
      <TooltipInternal {...this.props}
        anchor={this._container}
        nubClassName={nubClasses[this.props.align]}
        className='round pad0x pad00y fill-tooltip micro noevents contain' />,
      this._node);
  },
  render() {
    return this.props.children;
  }
});

module.exports = Tooltip;
