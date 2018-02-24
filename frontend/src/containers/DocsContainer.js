import React, {Component} from 'react';
import axios, {post} from 'axios';
import {Button, Input, Icon, Label, Form, Grid, Table} from 'semantic-ui-react';
import {
    withRouter
} from 'react-router-dom'

import FileViewer from '../components/FileViewer';

const styles = {
    height: 20,
}

class DocsContainer extends Component {
    constructor(props) {
        super(props);
        // axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
        // axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
        this.state = {
            data: [],
            apiURL: 'http://127.0.0.1:8000/api/v1/dbs/c3/accounts/10002/docs',
            fileFolderURL: 'http://127.0.0.1:8000/api/v1/docs',
            dataLoaded: false,
            docsNum: 0,
            docClicked: false,
            docCreate: false,
            docUpdated: false,
            docID: 0,
            docDetails: [],
            userID: 10002,
            file: null,
            fileContent: null
        }

        this.loadDocsFromServer();
    }

    loadDocsFromServer() {
        axios.get(this.state.apiURL)
            .then((response) => {
                this.setState(
                    {
                        fields: response.data.empty,
                        data: response.data.results,
                        dataLoaded: true,
                        docsNum: response.data.counts,
                    });
                const docsNum = this.state.relatedDocsNum;
                this.props.setActiveTab('docs', docsNum);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    countDocs() {
        const url = this.state.apiURL;
        axios.get(url)
            .then((response) => {
                this.setState({docsNum: response.data.counts});
                const docsNum = this.state.relatedDocsNum;
                console.log('!!! ', docsNum);
                this.props.setActiveTab('docs', docsNum);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    showFileContent = (event) => {
        const fileName = event.target.name;
        const fileType = event.target.fType;
        console.log(fileName);
        this.setState({fileContent: <FileViewer fileName={fileName}/>});
    }

    getDocDetails = (event) => {
        const docID = event.target.name.split('-')[1];
        const url = this.state.apiURL + '/' + docID;
        console.log(url);
        axios.get(url)
            .then((response) => {
                this.setState({
                    docClicked: true,
                    docCreate: false,

                    docID: docID,
                    docDetails: response.data.serializer,
                });

                console.log(response.data.serializer);
            });

    }

    deleteDoc = (event) => {
        const docID = event.target.name.split('-')[1];
        const url = this.state.apiURL + '/' + docID;
        axios.delete(url)
            .then(response => {
                console.log(response);
                this.setState({docCreate: false, docUpdated: true, fileContent: null});
                this.loadDocsFromServer();
            })
            .catch(error => {
                console.log(error);
            })
    }

    fileUpload() {
        const file = this.state.file;
        const url = 'http://127.0.0.1:8000/api/v1/docs'
        const data = new FormData();
        data.append('file', file)
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return post(url, data, config)
    }

    createDoc = (event) => {
        const url = this.state.apiURL;
        const formData = this.state.docDetails;
        console.log(formData);
        this.setState({docCreate: false});
        axios.post(url, formData)
            .then(response => {
                this.loadDocsFromServer();
                this.setState({docCreate: false, docDetails: [], fileContent: null});
            })
            .catch(error => {
                console.log(error);
            })
        this.fileUpload();
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const formData = this.state.docDetails;
        const url = this.state.apiURL + '/' + this.state.docID;
        axios.put(url, formData)
            .then(response => {
                console.log(response);
                this.setState({docUpdated: true, docDetails: []});
                this.loadDocsFromServer();
            })
            .catch(error => {
                console.log('Errors here ', error);
            });
        this.fileUpload();
    }

    handleChange = (event) => {
        const userID = this.state.userID;
        this.setState({
            docDetails: {
                ...this.state.docDetails,
                [event.target.name]: event.target.value,
                emp_no: userID
            }
        });
    }

    closeForm = (event) => {
        this.setState({docClicked: false, docCreate: false});
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.docUpdated && this.state.docClicked) {
            this.setState({docClicked: false, docUpdated: false});
        }
    }

    componentDidMount() {
        this.countDocs();
    }

    onFileChange = (event) => {
        this.setState({
            docDetails: {...this.state.docDetails, path: event.target.files[0].name},
            file: event.target.files[0]
        });
    }


    render() {
        const dataLoaded = this.state.dataLoaded;
        const userID = this.state.userID;
        const data = this.state.data;
        const fileContent = this.state.fileContent;

        let docsList = null;
        let docForm = null;
        let addDocBtn = null;
        let docContent = null;
        if (dataLoaded) {
            addDocBtn = (
                <Button as='div' labelPosition='right' onClick={() => {
                    this.setState({docCreate: true, docClicked: false})
                }}>
                    <Button icon color='blue'>
                        <Icon name='add'/>
                    </Button>
                    <Label as='a' basic pointing='left' color='blue'>Add a new document</Label>
                </Button>
            )

            docsList = (
                <Table celled selectable>
                    <Table.Header>
                        <Table.Row>
                            {
                                Object.keys(data[0]).map((key) => (
                                    <Table.HeaderCell>
                                        {key}
                                    </Table.HeaderCell>
                                ))
                            }
                            <Table.HeaderCell>

                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {
                            data.map(object => {
                                return (
                                    <Table.Row name={'row-' + object['doc_id']}>
                                        {
                                            Object.keys(object).map((key) => (
                                                <Table.Cell>{object[key]}</Table.Cell>
                                            ))
                                        }
                                        <Table.Cell>
                                            <Button name={object['path']} basic color='blue' content='Preview'
                                                    onClick={this.showFileContent}/>
                                            <Button name={'editbtn-' + object['doc_id']} basic color='green'
                                                    content='Edit' onClick={this.getDocDetails}/>
                                            <Button name={'rmbtn-' + object['doc_id']} basic color='red'
                                                    content='Remove' onClick={this.deleteDoc}/>
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })
                        }
                    </Table.Body>
                </Table>
            )

            const docClicked = this.state.docClicked;
            const docCreate = this.state.docCreate;
            const docID = this.state.docID - 1;
            const docDetails = this.state.docDetails;
            // generate doc form
            if (docClicked && !docCreate) {
                docForm = (
                    <Form className="segment" onSubmit={this.handleSubmit}>
                        <Form.Field>
                            <label>doc_id</label>
                            <input name='doc_id' value={docDetails['doc_id']} readOnly/>
                        </Form.Field>
                        <Form.Field>
                            <label>emp_no</label>
                            <input name='emp_no' value={docDetails['emp_no']} readOnly/>
                        </Form.Field>
                        {
                            Object.keys(docDetails).slice(2, Object.keys(docDetails).length - 1).map((key) => (
                                <Form.Field>
                                    <label>{key}</label>
                                    <input name={key} value={docDetails[key]} onChange={this.handleChange}/>
                                </Form.Field>
                            ))
                        }
                        <Form.Field>
                            <label>file path</label>
                            <p> Current File: {docDetails['path']}</p>
                            <input
                                type="file"
                                name="path"
                                ref={input => {
                                    this.fileInput = input;
                                }}
                                onChange={this.onFileChange}
                            />
                        </Form.Field>
                        <Button basic type='submit' color='green' content='Update'/>
                        <Button basic content='Close' onClick={this.closeForm}/>
                    </Form>
                );
            }
            else if (docCreate) {
                const fields = this.state.fields;
                docForm = (
                    <Form className="segment" onSubmit={this.createDoc}>
                        <Form.Field>
                            <label>emp_no</label>
                            <input name='emp_no' value={userID} readOnly/>
                        </Form.Field>
                        {
                            Object.keys(fields).slice(1, Object.keys(fields).length - 1).map((key) => (
                                <Form.Field>
                                    <label>{key}</label>
                                    <input name={key} onChange={this.handleChange}/>
                                </Form.Field>
                            ))
                        }
                        <Form.Field>
                            <label>file path</label>
                            <p> Current File: {docDetails['path']}</p>
                            <input
                                type="file"
                                name="path"
                                ref={input => {
                                    this.fileInput = input;
                                }}
                                onChange={this.onFileChange}
                            />
                        </Form.Field>
                        <Button basic type='submit' color='green' content='Save'/>
                        <Button basic content='Close' onClick={this.closeForm}/>
                    </Form>
                );
            }
            else {
                docForm = null;
            }
        }
        else {
        }

        docContent = (
            <Grid>
                <Grid.Column width={7}>
                    {docForm}
                </Grid.Column>
                <Grid.Column width={9}>
                    {fileContent}
                </Grid.Column>
            </Grid>
        );
        return (
            <div>
                {addDocBtn}
                {docsList}
                {docContent}
            </div>
        );
    }
}

export default withRouter(DocsContainer);