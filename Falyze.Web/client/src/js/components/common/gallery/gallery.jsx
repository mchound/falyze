var React = require('react');

var _galleryWidth = 0;

module.exports = React.createClass({
    displayName: 'Gallery',
    getInitialState: function () {
        return {
            active: this.props.slide || 0,
            slideCount: !!this.props.children && !!this.props.children.length ? this.props.children.length : !!this.props.children ? 1 : 0
        };
    },
    goLeft: function () {
        var current = this.state.active,
            next = Math.min(current + 1, this.state.slideCount - 1);
        this.setState({ active: next });
    },
    goRight: function () {
        var current = this.state.active,
            next = Math.max(current - 1, 0);
        this.setState({ active: next });
    },
    goTo: function (slide) {
        var next = Math.max(Math.min(slide, this.state.slideCount), 0);
        this.setState({ active: next });
    },
    componentDidMount: function () {
        _galleryWidth = this.refs.gallery.getDOMNode().clientWidth;
    },
    render: function () {
        var slides = this.state.slideCount === 1 ? [this.props.children] : this.props.children;
        return (
            <div data-am-gallery={'slide-' + this.state.active} ref="gallery">
                <div className="slides">
                    {this.props.children}
                </div>
            </div>
        );
    }
});

