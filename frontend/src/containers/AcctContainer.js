import React, {Component} from 'react';
import axios from 'axios';
import {Button, Message, Form, Grid} from 'semantic-ui-react';
import 'redux';
import 'react-redux';
import {bindActionCreators} from 'redux';
import {
    loadData,
} from '../actions/AcctAction';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

class AcctContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dataLoaded: false,
            apiURL: 'http://127.0.0.1:8000/api/v1/dbs/c3/accounts/10002',
            updated: 0,
            docsNum: 0,
        }
        this.loadAcctFromServer();
    }

    loadAcctFromServer() {
        axios.get(this.state.apiURL)
            .then((response) => {
                this.setState({data: response.data.serializer, dataLoaded: true});
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleChange = (event) => {
        this.setState({data: {...this.state.data, [event.target.name]: event.target.value}});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const formData = this.state.data;
        const url = this.state.apiURL;
        console.log(formData);
        axios.put(url, formData)
            .then(response => {
                console.log(response);
                this.setState({updated: 1});
            })
            .catch(error => {
                console.log(error);
                this.setState({updated: 2});
            })
    }

    render() {
        const dataLoaded = this.state.dataLoaded;
        const updated = this.state.updated;

        let acctForm = null;
        let message = null;
        if (dataLoaded) {
            if(updated === 1) {
                message = (
                    <Message positive>
                        <p>Congratulations! You updated successfully.</p>
                    </Message>
                );
            }
            else if (updated === 2) {
                message = (
                    <Message negative>
                        <p>Oops, you failed updating.</p>
                    </Message>
                );
            }
            acctForm = (
                <Grid>
                    <Grid.Column width={2}>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <Form className="segment" onSubmit={this.handleSubmit}>
                            {
                                Object.keys(this.state.data).map((key) => (
                                    <Form.Field key={key}>
                                        <label>{key}</label>
                                        <input name={key} value={this.state.data[key]} onChange={this.handleChange}/>
                                    </Form.Field>
                                ))
                            }
                            <Grid>
                                <Grid.Column>
                                    <Button type="submit">Update</Button>
                                </Grid.Column>
                                <Grid.Column width={1}>
                                </Grid.Column>
                                <Grid.Column width={5}>
                                    {message}
                                </Grid.Column>
                            </Grid>
                        </Form>
                    </Grid.Column>
                    <Grid.Column width={2}>
                    </Grid.Column>
                </Grid>

            );
        } else {
            acctForm = <p> Data is Loading... </p>;
        }
        return (
            <div>
                {acctForm}
            </div>
        );
    }
}

// map store state to container props
function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        // loadData: loadData,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AcctContainer);