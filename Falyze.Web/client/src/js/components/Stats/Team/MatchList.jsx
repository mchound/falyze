var React = require('react'),
    Lean = require('../../../lean/lean');

module.exports = Lean.createController({
    getInitialState: function(){
        return {
            matchCount: this.props.matchCount
        };
    },
    onMoreClick: function(){
        this.setState({ matchCount: this.state.matchCount + 5 });
    },
    action: function (state, props) {
        return {
            matches: !!state.matchCount ? props.matches.slice(0, state.matchCount) : matches
        };
    },
    view: function (model, state, props) {
        return (
            <table data-am-matchlist>
                <thead>
                    <tr>
                        <th colSpan="4">
                            Last 5 matches
                        </th>
                    </tr>
                </thead>
                <tbody onClick={props.onToggle}>
                    {model.matches.map((m) => (
                        <tr key={m.date}>
                            <td className="date">{m.date.substring(0, 10)}</td>
                            <td className={m.homeTeamId === props.teamId ? 'home-team highlight' : 'home-team'}>{m.homeTeam}</td>
                            <td className="result">{m.homeGoals + ' - ' + m.awayGoals}</td>
                            <td className={m.awayTeamId === props.teamId ? 'away-team highlight' : 'away-team' }>{m.awayTeam}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="4"><button data-am-button="green" className="btn-more" onClick={this.onMoreClick}>See more...</button></td>
                    </tr>
                </tfoot>
            </table>  
        );
    }
});