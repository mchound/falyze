var React = require('react'),
    Lean = require('../../../lean/lean'),
    
    __find = require('lodash/collection/find');

module.exports = Lean.createController({
    action: function (state, props) {
        var table = props.rows.sort((a, b) => a.position - b.position),
            rows = table;
        if(props.teamId !== undefined && props.teamId !== null && !!props.teamCount){
            var team = __find(table, (t) => t.teamId === props.teamId),
                limit = Math.ceil(props.teamCount / 2),
                min = Math.max(1, team.position - limit),
                max = Math.min(rows.length, min + props.teamCount),
                min = max - min < props.teamCount ? min - (props.teamCount - (max - min)) : min;
            rows = [];
            for (var i = min + 1; i <= max; i++) {
                rows.push(table[i - 1]);
            }
            table = rows;
        }
        return {
            table: table
        }
    },
    view: function (model, state, props, q) {
        return (
            <table data-am-matchtable>
                <thead><tr><th></th><th className="team">Team</th><th>M</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>P</th></tr></thead>
                <tbody>
                    {model.table.map((r) => (
                        (<tr key={r.position} className={r.teamId === props.teamId ? 'highlight' : null}>
                            <td>{r.position}</td>
                            <td className="team">{r.teamName}</td>
                            <td>{r.round}</td>
                            <td>{r.wins}</td>
                            <td>{r.draws}</td>
                            <td>{r.losses}</td>
                            <td>{r.goalsFor}</td>
                            <td>{r.goalsAgainst}</td>
                            <td>{r.goalDiff}</td>
                            <td>{r.points}</td>
                        </tr>)
                    ))}
                </tbody>
            </table>
        );
    }
});