var React = require('react'),
    Lean = require('../../lean/lean'),
    
    ImportUtil = require('../../utils/Import'),

    Actions = require('../../actions/Actions');

//var months = {
//    jan: 0,
//    feb: 1,
//    mar: 2,
//    apr: 3,
//    may: 4,
//    jun: 5,
//    jul: 6,
//    aug: 7,
//    sep: 8,
//    oct: 9,
//    nov: 10,
//    dec: 11
//};

//function parseData(raw) {
//    var data = raw,
//            patt = /Round \d+ \[\w{3} \d+\]/g,
//            match;

//    while (match = patt.exec(data)) {
//        var next = match[0].split('[').join('\n[');
//        data = data.replace(match[0], next);
//    }

//    data = data.
//      replace(/\n/g, '__').
//      replace(/\s\s+/g, '\t').
//      replace(/__/g, '\n').
//      replace(/\n\n/g, '\n');
//    var lines = data.split('\n');
//    lines = lines.filter((l) => !l.toLowerCase().startsWith('\t') && !l.toLowerCase().startsWith('round'));
//    data = lines.join('\n');
//    return data.split('\n');
//}

//function getMatches(raw, startYear) {
//    var date,
//        year = startYear,
//        dateShift = false,
//        matches = [],
//        counter = 0;
//    for (var i = 0; i < raw.length; i++) {
//        if (!!date && date.getMonth() === 2 && date.getDate() === 14) {
//            var qqq = 0;
//        }
//        if (raw[i].startsWith('[')) {
//            if (!(/\[\w{3} \d+\]/g).test(raw[i])) {
//                continue;
//            }
//            var month = (/\w{3}/g).exec(raw[i]),
//                monthNr = months[month[0].toLowerCase()],
//                day = (/\d+/).exec(raw[i]),
//                dayNr = parseInt(day[0]),
//                nextDate = new Date(year, monthNr, dayNr);
//            dateShift = !!date && nextDate < date;
//            date = nextDate;
//        }
//        else {
//            //if (date.getMonth() === 3 && date.getDate() === 11) debugger;
//            var abandoned = (/abd/g).exec(raw[i]),
//                awarded = (/awd/g).exec(raw[i]),
//                result = (/\d+\-\d+/g).exec(raw[i]),
//                resultIndex,
//                resultLength;

//            if (!abandoned && !awarded && !result) {
//                continue;
//            }

//            // There is a result and a comment about awarded or abandoned. Use the result to locate home- and away team
//            if (!!result && (!!awarded || !!abandoned) && result.index < Math.min(!!awarded ? awarded.index : 9999, !!abandoned ? abandoned.index : 9999)) {
//                resultIndex = result.index;
//                resultLength = result[0].length;
//            }
//            else if (!!result && (!!awarded || !!abandoned) && result.index > Math.min(!!awarded ? awarded.index : 9999, !!abandoned ? abandoned.index : 9999)) {
//                resultIndex = !!awarded ? awarded.index : abandoned.index;
//                resultLength = 3
//            }
//            else if(!result && (!!awarded || !!abandoned)){
//                resultIndex = !!awarded ? awarded.index : abandoned.index;
//                resultLength = 3
//            }
//            else {
//                resultIndex = result.index;
//                resultLength = result[0].length;
//            }

//            var homeTeam = raw[i].substring(0, resultIndex).replace(/\t/g, '').trim();
//            var awayTeam = raw[i].substring(resultIndex + 1 + resultLength).split('\t')[0].trim();

//            matches.push({
//                date: new Date(date),
//                dateShift: dateShift,
//                homeTeam: homeTeam,
//                awayTeam: awayTeam,
//                homeTeamGoals: !abandoned && !awarded ? parseInt(result[0].split('-')[0]) : null,
//                awayTeamGoals: !abandoned && !awarded ? parseInt(result[0].split('-')[1]) : null,
//                incomplete: !!abandoned || !!awarded,
//                note: raw[i].substring(resultIndex + 1 + resultLength).split('\t')[1]
//            });
//        }
//    }
//    return matches;
//}

var rawData;

module.exports = Lean.createController({
    getInitialState: function () {
        return {
            startYear: null,
            showMatches: true,
            rawData: ''
        };
    },
    onParseClick: function () {
        var matches = ImportUtil.parseFromBetExplorer(rawData);
        
        //var matches = ImportUtil.parse(this.refs.textarea.getDOMNode().value, this.state.startYear);
        //var cleaned = parseData();
        //var matches = getMatches(cleaned, this.state.startYear);
        Actions.Import.setStartYear.dispatch(this.state.startYear);
        Actions.Import.addMatches.dispatch(matches);
    },
    onTextareaPaste: function(e){
        rawData = e.clipboardData.getData('text/plain');
        this.setState({ rawData:  rawData.substring(0, 100)});
    },
    onStartYearChange: function () {
        this.setState({
            startYear: parseInt(this.refs.startYear.getDOMNode().value)
        });
    },
    action: function (state, props) {
        
    },
    view: function (model, state, props, q) {
        return (
            <div data-am-import-form>
                <div className="group mb">
                    <label>Raw data</label>
                    <textarea className="parse-area mb" ref="textarea" onPaste={this.onTextareaPaste} value={state.rawData} readOnly={true}></textarea>
                    <button data-am-button="green" className="clear" onClick={this.onParseClick} disabled={!state.rawData || state.rawData === ''}>Parse</button>
                </div>                    
            </div>    
        );
    }
});