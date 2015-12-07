var React = require('react'),
    Lean = require('../../../lean.v2/lean'),
    
    UploadRepo = require('../../../repositories/admin/uploadRepo'),

    Tabs = require('../../common/tabs/tabs.jsx'),
    Matches = require('./matches.jsx'),
    Validation = require('./validation.jsx'),
    Teams = require('./teams.jsx'),

    MatchUtils = require('../utils/matchUtils');

module.exports = Lean.createComponent({
    displayName: 'Upload',
    getInitialState: function(){
        return {
            dragOver: false
        }
    },
    onDragOver: function (e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        this.setState({ dragOver: true });
    },
    onDragLeave: function(){
        this.setState({ dragOver: false });
    },
    onDrop: function (e) {
        e.stopPropagation()
        e.preventDefault();
        this.setState({ dragOver: false });
        var fr = new FileReader();
        fr.onload = function (e) {
            var matches = MatchUtils.parseFromXls(e.target.result);
            UploadRepo.model.matches.set(matches);
        };
        fr.readAsBinaryString(e.dataTransfer.files[0]);
    },
    onRepoUpdate: function(){
        console.log(this.refs.validation.valdiationResult);
    },
    controller: function (state, props) {
        return {
            dropZoneClass: state.dragOver ? 'drop-zone drag-over' : 'drop-zone'
        };
    },
    index: function (model, state, props, q) {
        return (
            <div data-am-upload>
                <div className={model.dropZoneClass} onDragOver={this.onDragOver}>
                    <div className="drop-message-area">
                        <div className="table stretch-v stretch-h">
                            <div className="drop-message" onDragOver={this.onDragOver} onDragLeave={this.onDragLeave} onDrop={this.onDrop}>
                                <p>Drop matches here...</p>
                            </div>
                        </div>
                    </div>
                    <div className="tab-area">
                        <Tabs tabNames={['Matches', 'Teams' , 'Validation', 'Save' ]}>
                            <Matches tabName="Matches" />
                            <Teams tabName="Teams" />
                            <Validation tabName="Validation" />
                            <div tabName="Save" disabled="true">
                                <p>Hej</p>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </div>  
        );
    }
});