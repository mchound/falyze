var React = require('react'),
    Lean = require('./lean/lean'),
    //CountryStore = require('./stores/CountryStore'),
    //LeagueStore = require('./stores/LeagueStore'),
    //SeasonStore = require('./stores/SeasonStore'),
    //FilterStore = require('./stores/SeasonStore'),
    Connectors = require('./domConnectors/connectors'),
    Actions = require('./actions/Actions');

Lean.inject({
    //country: require('./components/Prerequisites/Country.jsx'),
    //league: require('./components/Prerequisites/League.jsx'),
    //season: require('./components/Prerequisites/Season.jsx'),
    //'prerequisite-confirm': require('./components/Prerequisites/Confirm.jsx'),
    //'match-count': require('./components/Match/Count.jsx'),
    //'teamFilter': require('./components/Filters/TeamFilter.jsx'),
    //'pointsFilter': require('./components/Filters/RangeFilter.jsx'),
    //'winsFilter': require('./components/Filters/RangeFilter.jsx'),
    //'drawsFilter': require('./components/Filters/RangeFilter.jsx'),
    //'lossesFilter': require('./components/Filters/RangeFilter.jsx'),
    //'roundsFilter': require('./components/Filters/RangeFilter.jsx'),
    //'positionFilter': require('./components/Filters/RangeFilter.jsx'),
    //'goalsForFilter': require('./components/Filters/RangeFilter.jsx'),
    //'goalsAgainstFilter': require('./components/Filters/RangeFilter.jsx'),
    //'goalDiffFilter': require('./components/Filters/RangeFilter.jsx'),
    //'filter-title': require('./components/Filters/Title.jsx'),
    //'filter-activator': require('./components/Filters/Activator.jsx'),
    //'filter-confirm': require('./components/Filters/Confirm.jsx'),
    //'filter-add': require('./components/Filters/Add.jsx'),
    //'team-selector': require('./components/Stats/Team/TeamSelector.jsx'),
    //'team-stat': require('./components/Stats/Team/TeamStat.jsx'),
    //'filter-populate': require('./components/Filters/Populator.jsx'),

    //'import': require('./components/Import/Import.jsx'),
    //'import-country': require('./components/Import/Country.jsx'),
    //'import-league': require('./components/Import/League.jsx'),
    //'import-matches': require('./components/Import/Matches.jsx'),
    //'import-teams': require('./components/Import/Teams/MatchTeams.jsx'),
    //'import-team': require('./components/Import/Teams/Create.jsx'),
    //'import-countryteams': require('./components/Import/Teams/CountryTeams.jsx'),
    //'import-save': require('./components/Import/Save.jsx'),
    //'import-status': require('./components/Import/Status.jsx'),

    'admin-country': require('./components/admin/country/country.jsx'),
    'admin-league': require('./components/admin/league/league.jsx'),
    'admin-season': require('./components/admin/season/season.jsx'),
    'admin-team': require('./components/admin/team/team.jsx'),
    'admin-alias': require('./components/admin/alias/alias.jsx'),
    'admin-matchupload': require('./components/admin/upload/upload.jsx'),
    'admin-messages': require('./components/admin/messages/messages.jsx')
});

//var resourceCount = 0,
//    countries = CountryStore.get(),
//    leagues = LeagueStore.get(),
//    seasons = SeasonStore.get();

//var onStoresUpdate = function () {

//    countries = CountryStore.get();
//    leagues = LeagueStore.get();
//    seasons = SeasonStore.get();

//    if (countries !== undefined && leagues !== undefined && seasons !== undefined) {
//        document.getElementById('splash').remove();
//    }
//}

window.onload = function () {

    Lean.connectDom(document.body, Connectors);

    //countries = CountryStore.get();
    //if (countries === undefined) {
    //    CountryStore.on(onStoresUpdate);
    //}
    //else{
    //    resourceCount++;
    //}

    //leagues = LeagueStore.get();
    //if (leagues === undefined) {
    //    LeagueStore.on(onStoresUpdate);
    //}
    //else{
    //    resourceCount++;
    //}

    //seasons = SeasonStore.get();
    //if (seasons === undefined) {
    //    SeasonStore.on(onStoresUpdate);
    //}
    //else{
    //    resourceCount++;
    //}

    //if (resourceCount === 3) {
    //    var node = document.getElementById('splash');
    //    if(!!node) node.remove();
    //}
};