import React, {Component} from 'react';
// import {Document, Page} from 'react-pdf';
import axios from 'axios';
import {Button, Icon} from 'semantic-ui-react';
import { Document, Page} from 'react-pdf/build/entry.webpack';

const style = {
    height: '600px',
    border: '1px solid',
    borderColor: '#dedede',
    overflowY: 'scroll',
    overflowX: 'scroll',
}

class FileViewer extends Component {
    constructor(props) {
        super(props);
        console.log('Call constructor.');
        this.state = {
            numPages: null,
            file: 'http://127.0.0.1:8000/docs/' + this.props.fileName,
            closed: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.file != this.state.file)
            this.setState({file: 'http://127.0.0.1:8000/docs/' + nextProps.fileName, closed: false});
    }

    closeFile = (event) => {
        this.setState({closed: true});
    }

    onDocumentLoad = ({numPages}) => {
        this.setState({numPages});
    }

    render() {
        console.log('In viewer, ', this.props.fileName);

        const {numPages, file, closed} = this.state;
        var pages = []
        for (let i = 1; i <= numPages; i++) {
            pages.push(<Page pageNumber={i}/>)
        }
        console.log(pages);
        if (closed)
            return (
                <div></div>
            );
        else
            return (
                <div>
                <div style={style}>
                    <Document
                        file={file}
                        onLoadSuccess={this.onDocumentLoad}
                    >
                        {pages}
                    </Document>
                </div>
                <Button basic content='Close' onClick={this.closeFile}/>
                </div>
            );
    }
}

export default FileViewer;