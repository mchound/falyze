var React = require('react'),
    Lean = require('./lean/lean'),
    CountryStore = require('./stores/CountryStore'),
    LeagueStore = require('./stores/LeagueStore'),
    SeasonStore = require('./stores/SeasonStore'),
    FilterStore = require('./stores/SeasonStore'),
    Connectors = require('./domConnectors/connectors'),
    Actions = require('./actions/Actions');

Lean.inject({
    country: require('./components/Prerequisites/Country.jsx'),
    league: require('./components/Prerequisites/League.jsx'),
    season: require('./components/Prerequisites/Season.jsx'),
    'prerequisite-confirm': require('./components/Prerequisites/Confirm.jsx'),
    'match-count': require('./components/Match/Count.jsx'),
    'teamFilter': require('./components/Filters/TeamFilter.jsx'),
    'pointsFilter': require('./components/Filters/RangeFilter.jsx'),
    'winsFilter': require('./components/Filters/RangeFilter.jsx'),
    'drawsFilter': require('./components/Filters/RangeFilter.jsx'),
    'lossesFilter': require('./components/Filters/RangeFilter.jsx'),
    'roundsFilter': require('./components/Filters/RangeFilter.jsx'),
    'filter-title': require('./components/Filters/Title.jsx'),
    'filter-activator': require('./components/Filters/Activator.jsx'),
    'filter-confirm': require('./components/Filters/Confirm.jsx'),
    'filter-add': require('./components/Filters/Add.jsx'),
    'team-selector': require('./components/Stats/Team/TeamSelector.jsx'),
    'team-stat': require('./components/Stats/Team/TeamStat.jsx')
});

var resourceCount = 0,
    countries = CountryStore.get(),
    leagues = LeagueStore.get(),
    seasons = SeasonStore.get();

var onStoresUpdate = function () {

    countries = CountryStore.get();
    leagues = LeagueStore.get();
    seasons = SeasonStore.get();

    if (countries !== undefined && leagues !== undefined && seasons !== undefined) {
        document.getElementById('splash').remove();
    }
}

window.onload = function () {

    Lean.connectDom(document.body, Connectors);

    countries = CountryStore.get();
    if (countries === undefined) {
        CountryStore.on(onStoresUpdate);
    }
    else{
        resourceCount++;
    }

    leagues = LeagueStore.get();
    if (leagues === undefined) {
        LeagueStore.on(onStoresUpdate);
    }
    else{
        resourceCount++;
    }

    seasons = SeasonStore.get();
    if (seasons === undefined) {
        SeasonStore.on(onStoresUpdate);
    }
    else{
        resourceCount++;
    }

    if (resourceCount === 3) {
        document.getElementById('splash').remove();
    }
};