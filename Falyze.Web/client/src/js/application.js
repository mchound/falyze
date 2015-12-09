var views = {
    dashboard: require('./views/dashboard'),
    admin: require('./views/admin')
};

window.views = views;

//var React = require('react'),
//    Lean = require('./lean.v2/lean'),
//    CountryRepo = require('./repositories/dashbaord/countryRepo'),
//    SeasonRepo = require('./repositories/dashbaord/seasonRepo'),
//    LeagueRepo = require('./repositories/dashbaord/leagueRepo');

//Lean.inject({
//    'admin-country': require('./components/admin/country/country.jsx'),
//    'admin-league': require('./components/admin/league/league.jsx'),
//    'admin-season': require('./components/admin/season/season.jsx'),
//    'admin-team': require('./components/admin/team/team.jsx'),
//    'admin-alias': require('./components/admin/alias/alias.jsx'),
//    'admin-matchupload': require('./components/admin/upload/upload.jsx'),
//    'admin-messages': require('./components/admin/messages/messages.jsx')
//});

//var cbCount = 3;

//var repoCallback = function () {
//    cbCount--;
//    if (cbCount === 0) {
//        console.log('All downloaded');
//    }
//}

//CountryRepo.observe(repoCallback);
//SeasonRepo.observe(repoCallback);
//LeagueRepo.observe(repoCallback);