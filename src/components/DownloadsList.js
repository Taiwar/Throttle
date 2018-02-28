import React, { Component } from "react";
import { Collection, CollectionItem, ProgressBar } from "react-materialize";

export default class DownloadsList extends Component {
    render() {
        const { downloads, outputDir, actions } = this.props;

        const correctIcon = (download) => {
            if (!download.isFinished && !download.isDownloading) {
                return (
                    <a href='#' onClick={() => actions.onStartClick(download.id, download.info, outputDir)} className="">
                        <i className="material-icons green-text">arrow_downward</i>
                    </a>
                )
            } else if (!download.isFinished && download.isDownloading) {
                return (
                    <a className="">
                        <i className="material-icons">autorenew</i>
                    </a>
                )
            } else {
                return (
                    <a href='#' onClick={() => actions.onRemoveClick(download)} className="">
                        <i className="material-icons purple-text">check_circle</i>
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
                                        <i className="material-icons grey-text">clear</i>
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