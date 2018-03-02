import React, { Component } from 'react';
import { Collection, CollectionItem, Icon, ProgressBar } from 'react-materialize';

export default class DownloadsList extends Component {
    render() {
        const { downloads, outputDir, actions } = this.props;

        const correctIcon = (download) => {
            if (!download.isFinished && !download.isDownloading) {
                return (
                    <a href='#' onClick={() => actions.onStartClick(download.id, download.info, outputDir)}>
                        <Icon className="green-text">arrow_downward</Icon>
                    </a>
                )
            } else if (!download.isFinished && download.isDownloading) {
                return (
                    <Icon className="blue-text">autorenew</Icon>
                )
            } else {
                return (
                    <Icon className="green-text">check_circle</Icon>
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
        const list = () => {
            return downloads.map(function(download){
                return (
                    <CollectionItem className='avatar grey darken-3' key={download.id}>
                        <div className='row'>
                            <div className='col m11'>
                                <span className='title'>{download.info.title}</span>
                                <p>{download.url}</p>
                            </div>
                            <div className='col m1 action-col'>
                                <div className='row'>
                                    <a href='#' onClick={() => actions.onRemoveClick(download)} className="">
                                        <Icon className="grey-text">clear</Icon>
                                    </a>
                                </div>
                                <div className='row'>
                                    {correctIcon(download)}
                                </div>
                            </div>
                        </div>
                        {progressBar(download)}
                    </CollectionItem>
                );
            });
        };

        return (
            <Collection>
                {list()}
            </Collection>
        )
    }
}