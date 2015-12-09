var React = require('react'),
    Lean = require('../lean.v2/lean');

module.exports = {
    apply: function () {
        Lean.inject({
            'admin-country': require('../components/admin/country/country.jsx'),
            'admin-league': require('../components/admin/league/league.jsx'),
            'admin-season': require('../components/admin/season/season.jsx'),
            'admin-team': require('../components/admin/team/team.jsx'),
            'admin-alias': require('../components/admin/alias/alias.jsx'),
            'admin-matchupload': require('../components/admin/upload/upload.jsx'),
            'admin-messages': require('../components/admin/messages/messages.jsx')
        });
    }
}