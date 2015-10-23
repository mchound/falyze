var React = require('react'),
    Lean = require('../../../lean/lean'),

    Spinner = require('../../common/Spinner/Spinner.jsx'),
    Table = require('../Table/Table.jsx'),
    MatchList = require('./MatchList.jsx'),

    TeamStatStore = require('../../../stores/TeamStatStore');

module.exports = Lean.createController({
    stores: [TeamStatStore],
    getInitialState: function () {
        return {
            tableOut: true,
            homeTableOut: false,
            awayTableOut: false,
            matchListOut: true
        };
    },
    onTableClick: function () {
        this.setState({ tableOut: !this.state.tableOut });
    },
    onHomeTableClick: function () {
        this.setState({ homeTableOut: !this.state.homeTableOut });
    },
    onAwayTableClick: function () {
        this.setState({ awayTableOut: !this.state.awayTableOut });
    },
    onMatchListToggle: function(){
        this.setState({matchListOut: !this.state.matchListOut})
    },
    shouldRender: function (state, props) {
        return state.store.teamStat.selected[props.team] !== null;
    },
    isLoading: function (state, props) {
        return this.store.teamStat.status === 'pending';
    },
    renderLoad: function (state, props) {
        return (
            <div>
                <div className="mb-L">
                    <Spinner color="green" />
                </div>
                <p className="large align-center">Loading team data</p>
            </div>
        );
    },
    action: function (state, props) {
        return {
            tables: {
                full: !!state.store.teamStat[props.team] ? state.store.teamStat[props.team].tables.table : [],
                home: !!state.store.teamStat[props.team] ? state.store.teamStat[props.team].tables.homeTable : [],
                away: !!state.store.teamStat[props.team] ? state.store.teamStat[props.team].tables.awayTable : []
            },
            tableState: {
                full: state.tableOut,
                home: state.homeTableOut,
                away: state.awayTableOut
            },
            matches: !!state.store.teamStat[props.team] ? state.store.teamStat[props.team].matches : [],
            matchListOut: state.matchListOut,
            teamId: state.store.teamStat.selected[props.team]
        };
    },
    view: function (model, state, props, q) {
        return (
            <div className="team-tables">
                <div className="mb">
                    {q.if(!model.matchListOut, (
                        <div className="table-bar" onClick={this.onMatchListToggle}>Latest matches<i className="icon-right-open-big"></i></div>
                    ))}
                    {q.if(model.matchListOut, (
                        <MatchList matches={model.matches} teamId={model.teamId} matchCount={5} onToggle={this.onMatchListToggle} />
                    ))}
                </div>
                <div className="mb" onClick={this.onTableClick}>
                    {q.if(!model.tableState.full, (
                        <div className="table-bar">Table<i className="icon-right-open-big"></i></div>
                    ))}
                    {q.if(model.tableState.full, (
                        <Table rows={model.tables.full} teamId={model.teamId} teamCount={5} />
                    ))}
                </div>
                <div className="mb" onClick={this.onHomeTableClick}>
                    {q.if(!model.tableState.home, (
                        <div className="table-bar">Home table<i className="icon-right-open-big"></i></div>
                    ))}
                    {q.if(model.tableState.home, (
                        <Table rows={model.tables.home} teamId={model.teamId} teamCount={5} />
                    ))}
                </div>
                <div className="mb" onClick={this.onAwayTableClick}>
                    {q.if(!model.tableState.away, (
                        <div className="table-bar">Away table<i className="icon-right-open-big"></i></div>
                    ))}
                    {q.if(model.tableState.away, (
                        <Table rows={model.tables.away} teamId={model.teamId} teamCount={5} />
                    ))}
                </div>
            </div>
        );
    }
});