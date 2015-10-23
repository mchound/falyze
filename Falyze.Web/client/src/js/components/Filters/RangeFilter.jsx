
var React = require('react'),
    Lean = require('../../lean/lean'),

    Actions = require('../../actions/Actions'),

    Range = require('../common/Range/Range.jsx'),

    MatchStore = require('../../stores/MatchStore'),
    FilterStore = require('../../stores/FilterStore');

module.exports = Lean.createController({
    stores: [FilterStore, MatchStore],
    onChange: function(val){
        Actions.Filter.updateTeam.dispatch({
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
    onFilterUpdate: function(){
        if (!!this.refs.range && !!this.state.store.filter.filters[this.props.filter]) {
            var team = this.state.store.filter.filters[this.props.filter][this.props.team];
            this.refs.range.set(team.min, team.max);
        }
    },
    shouldRender: function(state){
        return !!state.store.match.count;
    },
    action: function (state, props) {
        
    },
    view: function (model, state, props) {
        return (
            <div>
                <Range ref="range" min={0} max={500} onChange={this.onChange} />
            </div>
        );
    }
});