var React = require('react');

var Tabs = React.createClass({
    getInitialState: function(){
        return {
            tab: this.props.tabNames[0]
        };
    },
    onSelectTab: function(tabName){
        this.setState({ tab: tabName });
    },
    render: function () {
        
        var activeTab = !!this.props.children.length ? this.props.children.filter((t) => t.props.tabName === this.state.tab) : this.props.children;

        return (
            <div data-am-tabs>
                <ul className="selectors">
                    {this.props.tabNames.map((t) => {
                        var tab = this.props.children.find((t2) => t2.props.tabName === t),
                        className = this.state.tab === t ? 'selector selected' : (tab.props.disabled ? 'selector disabled' : 'selector'),
                        clickCallback = tab.props.disabled ? null : this.onSelectTab.bind(this, t);
                        return (<li key={t} className={className} onClick={clickCallback}>{t}</li>)
                    }.bind(this))}
                </ul>
                <div className="tab-content">
                    {activeTab}
                </div>
            </div>          
        );
    }
});

module.exports = Tabs;