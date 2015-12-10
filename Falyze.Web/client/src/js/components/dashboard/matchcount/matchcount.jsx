var React = require('react'),
    Lean = require('../../../lean.v2/lean'),

    DashboardRepo = require('../../../repositories/dashbaord/dashboardRepo');

var _interval;

module.exports = Lean.createComponent({
    displayName: 'MatchCount',
    repositories: [DashboardRepo],
    getInitialState: function(){
        return {
            count: 0
        };
    },
    doCount: function () {
        var step = parseFloat(this.state.repo.dashboard.matchCount) / 100;
        _interval = setInterval(this.onStep.bind(this, step), 10);
    },
    onStep: function(step){
        var next = Math.round(this.state.count + step);
        if (next >= this.state.repo.dashboard.matchCount) {
            clearInterval(_interval);
            this.setState({ count: this.state.repo.dashboard.matchCount });
        }
        else {
            this.setState({ count: next });
        }
    },
    onRepoUpdate: function(){
        if (this.state.repo.dashboard.matchCount != null) {
            this.doCount();
        }
    },
    componentDidMount: function(){
        if (this.state.repo.dashboard.matchCount != null) {
            this.doCount();
        }
    },
    shouldRender: function(state, props){
        return !!state.repo.dashboard.matchCount;
    },
    controller: function (state, props) {
        
    },
    index: function (model, state, props, q) {
        return (
            <span>{state.count}</span>  
        );
    }
})