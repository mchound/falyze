var React = require('react'),
    Lean = require('../../../lean.v2/lean'),

    MatchUtils = require('../utils/matchUtils'),

    AdminRepo = require('../../../repositories/admin/adminRepo'),
    TeamRepo = require('../../../repositories/admin/teamRepo'),
    AliasRepo = require('../../../repositories/admin/aliasRepo'),
    UploadRepo = require('../../../repositories/admin/uploadRepo');

module.exports = Lean.createComponent({
    repositories: [UploadRepo, TeamRepo, AliasRepo, AdminRepo],
    controller: function (state, props) {
        var validationResult = MatchUtils.validate(this.state.repo.admin.country, this.state.repo.admin.league, state.repo.upload.matches, state.repo.upload.season, state.repo.team, state.repo.alias);
        return {
            view: !state.repo.upload.matches.length || !state.repo.upload.season ? 'empty' : (!!validationResult.length ? 'invalid' : 'valid'),
            validationResult: validationResult
        }
    },
    empty: function (model, state, repo, q) {
        return (
            <p>No season selected</p>
        );
    },
    valid: function (model, state, repo, q) {
        return (
          <p>Season is valid!</p>
        );
    },
    invalid: function (model, state, props, q) {
        return (
            <ul>
                {model.validationResult.map((r, i) => { return (
                    <li key={i}>{r}</li>
                )})}
            </ul>  
        );
    }
});