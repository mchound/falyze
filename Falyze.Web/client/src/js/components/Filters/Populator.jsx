var React = require('react'),
    Lean = require('../../lean/lean'),
    
    TeamStatStore = require('../../stores/TeamStatStore'),
    FilterStore = require('../../stores/FilterStore'),
    
    Actions = require('../../actions/Actions'),

    Utils = require('../../utils/Utils');


module.exports = Lean.createController({
    stores: [TeamStatStore, FilterStore],
    onPopulate: function () {
        var filters = Utils.Filter.populate(this.store.filter, this.store.teamStat);
        Actions.Filter.updateManyTeam.dispatch(filters);
    },
    shouldRender: function(state, props){
        return (!!state.store.teamStat.team1 || !!state.store.teamStat.team2) && !!Utils.Filter.active(this.store.filter).length;
    },
    action: function () {

    },
    view: function () {
        return (
            <button data-am-button="green cta" onClick={this.onPopulate}><i className="icon-flow-parallel"></i>Populate filters<i className="icon-right-open-big icon-cta"></i></button>
        );
    }
});