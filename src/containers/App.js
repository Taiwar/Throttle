import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Card, Col, Collection, CollectionItem, ProgressBar, Row } from 'react-materialize';
import { addDownload, changeInput, endDownload, removeDownload, startDownload } from '../actions/downloadsActions';
import { changeOutputDir } from "../actions/settingsActions";

const path = window.require("path");
const ffmpeg = window.require('fluent-ffmpeg');
const ytdl = window.require('ytdl-core');
const dialog = window.require('electron').remote.dialog;

class App extends Component {
    render() {
        const { downloads, outputDir, onAddClick, onRemoveClick, onInputChange, onStartClick, onChangeOutputClick } = this.props;
        const correctIcon = (download) => {
            if (!download.isFinished && !download.isDownloading) {
                return (
                    <a href='#' onClick={() => onStartClick(download.id, download.info, outputDir)} className="secondary-content">
                        <i className="material-icons">arrow_downward</i>
                    </a>
                )
            } else if (!download.isFinished && download.isDownloading) {
                return (
                    <a className="secondary-content">
                        <i className="material-icons">autorenew</i>
                    </a>
                )
            } else {
                return (
                    <a href='#' onClick={() => onRemoveClick(download.id)} className="secondary-content">
                        <i className="material-icons">check_circle</i>
                    </a>
                )
            }

        };
        const progressBar = (download) => {
            if (!download.isFinished && download.isDownloading) {
                return (
                    <ProgressBar/>
                )
            }
        };
        const downloadsList = downloads.map(function(download){
            return (
                    <CollectionItem className='avatar grey darken-3' key={download.id}>
                        <span className='title'>{download.info.title}</span>
                        <p>{download.url}</p>
                        {correctIcon(download)}
                        {progressBar(download)}
                    </CollectionItem>
            );
        });

        return (
            <Row>
                <Col className="m3">
                    <Card className='card-content-less-margin dark-panel z-depth-4'>
                        <div className="input-field inline">
                            <input onChange={(e) => onInputChange(e.target.value)} type="text" className="active"/>
                            <label htmlFor="first_name">Url</label>
                        </div>
                        <br/>
                        <Button className='purple darken-3' onClick={() => onAddClick(this.props.inputValue)}>Add Download</Button>
                        <hr/>
                        <p>Output dir: {this.props.outputDir? this.props.outputDir : "\\"}</p>
                        <br/>
                        <Button className='purple darken-3'
                                onClick={() => onChangeOutputClick()}>
                            Set
                        </Button>
                    </Card>
                </Col>
                <Col className="m7 offset-m1">
                    <Card className='dark-panel z-depth-4'>
                        <Collection>
                            {downloadsList}
                        </Collection>
                    </Card>
                </Col>
            </Row>
        );
    }
}

export default connect(
    (store) => {
        return {
            downloads: store.downloads.downloads,
            inputValue: store.downloads.inputValue,
            outputDir: store.settings.outputDir
        };
    },
    (dispatch) => {
        return {
            onInputChange: (input) => dispatch(changeInput(input)),
            onAddClick: (url) => {
                ytdl.getInfo(url, function(err, info){
                    if (err) {
                        console.log(err);
                        return
                    }
                    dispatch(addDownload(url, info))
                });
            },
            onRemoveClick: (id) => {
                dispatch(removeDownload(id))
            },
            onStartClick: (id, info, outputDir) => {
                dispatch(startDownload(id));
                // TODO: Look into formats, don't just choose the first one
                let format = ytdl.filterFormats(info.formats, 'audioonly')[0];
                let stream = ytdl.downloadFromInfo(info, { filter: 'audioonly', format: format});
                console.log(info);
                let proc = new ffmpeg({source:stream});
                proc.setFfmpegPath('./node_modules/ffmpeg-binaries/bin/ffmpeg.exe');
                proc.withAudioCodec('libmp3lame')
                    .toFormat('mp3')
                    .output(path.join(outputDir, info.title + '.mp3'))
                    .run();
                proc.on('end', function() {
                    dispatch(endDownload(id));
                });
            },
            onChangeOutputClick: () => {
                // noinspection JSCheckFunctionSignatures
                dialog.showOpenDialog(null, {properties: ['openDirectory']},
                    (dirname) => {
                        dispatch(changeOutputDir(dirname.toString()))
                    }
                );
            }
        }
    })(App)