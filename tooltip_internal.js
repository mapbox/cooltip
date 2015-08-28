var React = require('react'),
  prefix = require('prefix');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var flipAlign = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left'
};

function shouldFlip(align, left, top, width, height, xOffset, yOffset, flipPadding, windowWidth, windowHeight) {
  return (
    (align === 'top' && ((top + yOffset - flipPadding) < 0)) ||
    (align === 'bottom' && ((top + height + yOffset + flipPadding) > (windowHeight - flipPadding))) ||
    (align === 'left' && ((left + xOffset - flipPadding) < 0)) ||
    (align === 'right' && ((left + width + xOffset + flipPadding) > (windowWidth - flipPadding))));
}

function tooltipConfig(align, left, top, width, height, xOffset, yOffset) {
  return {
    bottom: {
      nubTranslate: 'translate3d(-50%, -100%, 0)',
      translate: 'translate3d(-50%, 0, 0)',
      posTop: top + height + yOffset,
      posLeft: left + (width / 2) + xOffset,
      nubLeft: '50%',
      nubTop: 0
    },
    top: {
      nubTranslate: 'translate3d(-50%, 0, 0)',
      translate: 'translate3d(-50%, -100%, 0)',
      posTop: top + yOffset,
      posLeft: left + (width / 2) + xOffset,
      nubLeft: '50%',
      nubTop: '100%'
    },
    left: {
      nubTranslate: 'translate3d(0, -50%, 0)',
      translate: 'translate3d(-100%, -50%, 0)',
      posTop: top + (height / 2) + yOffset,
      posLeft: left + xOffset,
      nubLeft: '100%',
      nubTop: '50%'
    },
    right: {
      nubTranslate: 'translate3d(-100%, -50%, 0)',
      translate: 'translate3d(0, -50%, 0)',
      posTop: top + (height / 2) + yOffset,
      posLeft: left + width + xOffset,
      nubLeft: 0,
      nubTop: '50%'
    }
  }[align];
}

var TooltipInternal = React.createClass({
  displayName: 'TooltipInternal',
  propTypes: {
    anchor: React.PropTypes.any.isRequired,
    // One of 'top', 'bottom', 'left', or 'right'
    align: React.PropTypes.string,
    // Content can be a string or a function that returns JSX
    content: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.func
    ]),
    // Buffer of px from window edge to flip alignment
    flipPadding: React.PropTypes.number,
    maxWidth: React.PropTypes.number,
    lineHeight: React.PropTypes.number,
    className: React.PropTypes.string,
    nubClassName: React.PropTypes.string,
    children: React.PropTypes.any.isRequired,
    xOffset: React.PropTypes.number,
    yOffset: React.PropTypes.number
  },
  getDefaultProps: function() {
    return {
      content: '',
      className: '',
      nubClassName: '',
      align: 'bottom',
      flipPadding: 100,
      maxWidth: 220,
      lineHeight: 1.6,
      xOffset: 0,
      yOffset: 0
    };
  },
  render: function() {
    var content = typeof this.props.content === 'string' ? this.props.content : this.props.content();
    if (!content) return null;

    var boundingRect = this.props.anchor.getBoundingClientRect();
    var left = boundingRect.left;
    var top = boundingRect.top;
    var width = boundingRect.width;
    var height = boundingRect.height;

    var flip = shouldFlip(this.props.align,
      left, top,
      width, height,
      this.props.xOffset, this.props.yOffset,
      this.props.flipPadding,
      window.innerWidth, window.innerHeight);
    var config = tooltipConfig(
      flip ? flipAlign[this.props.align] : this.props.align,
      left, top, width, height,
      flip ? -this.props.xOffset : this.props.xOffset,
      flip ? -this.props.yOffset : this.props.yOffset);

    return React.createElement(
      'div', {
        className: this.props.className,
        style: _defineProperty({
          maxWidth: this.props.maxWidth,
          position: 'fixed',
          lineHeight: this.props.lineHeight,
          top: config.posTop + 'px',
          left: config.posLeft + 'px'
        }, prefix('transform'), config.translate) },
      React.createElement('div', {
        className: flip ? this.props.nubClassName.replace(flipAlign[this.props.align], this.props.align) : this.props.nubClassName,
        style: _defineProperty({
          left: config.nubLeft,
          top: config.nubTop
        }, prefix('transform'), config.nubTranslate) }),
      content
    );
  }
});

module.exports = TooltipInternal;
