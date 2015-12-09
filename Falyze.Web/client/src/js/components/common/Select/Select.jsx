var React = require('react'),

    _find = require('lodash/collection/find'),

    SelectItem = require('./SelectItem.jsx');

function sorter(a, b) {
    var cmpA = a.sortBy || a.text,
        cmpB = b.sortBy || b.text;
    if (cmpA > cmpB) return 1;
    else if (cmpA < cmpB) return -1;
    return 0;
}

function getSelectedText(props, items) {
    let selected = items.filter((item) => item.selected);
    if (selected.length === 0) {
        return props.defaultText;
    }
    else if (selected.length === 1 || !props.multiple) {
        return selected[0].text;
    }
    else if (props.multiple && !props.showCount) {
        return selected.map((item) => item.text).join(', ');
    }
    else if (props.multiple, props.showCount) {
        return selected.length + ' ' + props.entityPluralName + ' selected';
    }

}

module.exports = React.createClass({
    displayName: 'Select',
    getInitialState: function () {
        return {
            items: this.props.items,
            showItems: false
        };
    },
    getSelected: function () {
        return this.state.items.filter((i) => i.selected);
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({ items: nextProps.items });
    },
    onItemClick: function (clickedItem) {
        var showItems = true;
        if (!this.props.multiple) {
            var selected = _find(this.state.items, (item) => !!item.selected && item.value !== clickedItem.value);
            !!selected ? selected.selected = false : false;
            showItems = false;
        }

        var item = _find(this.state.items, (item) => item.value === clickedItem.value);
        item.selected = !item.selected;

        this.setState({
            items: this.state.items,
            showItems: showItems
        });

        if(!!this.props.onChange){
            this.props.onChange(
                this.state.items.filter((item) => item.selected),
                this.state.items.filter((item) => !item.selected),
                this.state.items
            );
        }
    },
    onClick: function () {
        if (this.props.disabled) return;
        if (this.props.notifyElementSelector) {
            var node = document.querySelector(this.props.notifyElementSelector);
            if (!!node) {
                node.setAttribute('data-select-status', !this.state.showItems ? 'open' : 'closed');
            }
        }
        var showItems = !this.state.showItems;

        if(!showItems && !!this.props.onClose){
            this.props.onClose(
                this.state.items.filter((item) => item.selected),
                this.state.items.filter((item) => !item.selected),
                this.state.items
            );
        }

        this.setState({ showItems: showItems });
    },
    action: function (state, props) {

        return {
            items: state.items.sort(sorter),
            attr: { disabled: props.disabled, open: state.showItems }
        }
    },
    render: function (model, state, props, q) {
        var items = this.state.items.sort(sorter),
            attr = [],
            content = null,
            closeArea = null,
            itemsContainer = null;

        if (this.props.disabled) attr.push('disabled');

        if (this.state.showItems) {
            attr.push('open');

            closeArea = ( <div className="close-area" onClick={this.onClick}></div> );

            itemsContainer = (
                <div className="items-container">
                    <ul className="items">
                        {items.map((i) => {
                            return (<SelectItem item={i} key={i.value} onClick={this.onItemClick} />)
                            }.bind(this))}
                    </ul>
                </div>
            );
        }

        return (
            <div data-am-select={attr.join(' ')} className={this.props.className}>
                <div className="select" onClick={this.onClick}>
                    {getSelectedText(this.props, this.state.items)}
                </div>

                {closeArea}
                {itemsContainer}

            </div>
        );
    }
});