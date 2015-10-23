
var React = require('react'),
    Lean = require('../../lean/lean'),

    Actions = require('../../actions/Actions'),

    Range = require('../common/Range/Range.jsx'),

    MatchStore = require('../../stores/MatchStore'),
    FilterStore = require('../../stores/FilterStore');

module.exports = Lean.createController({
    stores: [FilterStore, MatchStore],
    componentWillMount: function(){
        //Actions.Filter.update.dispatch({
        //    team: this.props.team,
        //    filter: {
        //        name: this.props.filter,
        //        configuration: {
        //            active: true,
        //            maximized: true
        //        }
        //    }
        //});
    },
    onChange: function(val){
        Actions.Filter.update.dispatch({
            team: this.props.team,
            filter: {
                name: this.props.filter,
                configuration: {
                    min: val.min,
                    max: val.max
                }
            }
        });
    },
    shouldRender: function(state){
        return !!state.store.match.count;
    },
    action: function(state, props){
        
    },
    view: function (model, state, props) {
        return (
            <div>
                <Range min={0} max={500} onChange={this.onChange} />
            </div>
        );
    }
});