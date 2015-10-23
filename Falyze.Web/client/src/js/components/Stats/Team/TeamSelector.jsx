var React = require('react'),
    Lean = require('../../../lean/lean'),

    Spinner = require('../../common/Spinner/Spinner.jsx'),
    Select = require('../../common/Select/Select.jsx'),
    Table = require('../Table/Table.jsx'),
    
    Actions = require('../../../actions/Actions'),
    
    TeamStatStore = require('../../../stores/TeamStatStore'),
    TeamStore = require('../../../stores/TeamStore');

module.exports = Lean.createController({
    stores: [TeamStore],
    getInitialState: function () {
        return {
            team1: null,
            team2: null
        };
    },
    onTeam1Change: function (selected) {
        Actions.TeamStat.update.dispatch({
            team1: !!selected.length ? selected[0].value : null,
            team2: !!this.state.team2 ? this.state.team2.value : null
        });
        this.setState({ team1: !!selected.length ? selected[0] : null });
    },
    onTeam2Change: function (selected) {
        Actions.TeamStat.update.dispatch({
            team1: !!this.state.team1 ? this.state.team1.value : null,
            team2: !!selected.length ? selected[0].value : null
        });
        this.setState({ team2: !!selected.length ? selected[0] : null });
    },
    onTeamReset: function(team){
        Actions.TeamStat.update.dispatch({
            team1: team === 1 ? null : !!this.state.team1 ? this.state.team1.value : null,
            team2: team === 2 ? null : !!this.state.team2 ? this.state.team2.value : null
        });
        this.setState({
            team1: team === 1 ? null : this.state.team1,
            team2: team === 2 ? null : this.state.team2
        });
    },
    shouldRender: function (state) {
        return (!!state.store.team && !!state.store.team.length) || this.store.team.status === 'pending';
    },
    isLoading: function () {
        return this.store.team.status === 'pending';
    },
    renderLoad: function () {
        return (
            <div className="content">
                <Spinner color="green" />
                Counting matches...
            </div>
        );
    },
    action: function (state, props) {
        return {
            one: {
                teams: state.store.team.filter((t) => !state.team2 || t.id !== state.team2.value).map((t) => ({ value: t.id, text: t.name, selected: !!state.team1 && t.id === state.team1.value, sortBy: t.name })),
                selected: state.team1,
                name: !!state.team1 ? state.team1.text : ''
            },
            two: {
                teams: state.store.team.filter((t) => !state.team1 || t.id !== state.team1.value).map((t) => ({ value: t.id, text: t.name, selected: !!state.team2 && t.id === state.team2.value, sortBy: t.name })),
                selected: state.team2,
                name: !!state.team2 ? state.team2.text : ''
            }
        }
    },
    view: function (model, state, props, q) {
        return (
            <div className="team-selector clearfix">
                <div className="col left">
                    {q.if(!!model.one.selected, (
                        <div className="team-label large bolder" onClick={this.onTeamReset.bind(this, 1)}>
                            <span>{model.one.name}</span>
                        </div>
                    ))}
                    {q.if(!model.one.selected, (
                        <Select items={model.one.teams} onChange={this.onTeam1Change} defaultText="Select team" />
                    ))}
                </div>
                <div className="col right">
                    {q.if(!!model.two.selected, (
                        <div className="team-label large bolder" onClick={this.onTeamReset.bind(this, 2)}>
                            <span>{model.two.name}</span>
                        </div>
                    ))}
                    {q.if(!model.two.selected, (
                        <Select items={model.two.teams} onChange={this.onTeam2Change} defaultText="Select team" />
                    ))}
                </div>
            </div>
        );
    }
});