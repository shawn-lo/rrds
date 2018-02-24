import React, {Component} from 'react';
import {Grid, Image, Form, Segment, Button, Message} from 'semantic-ui-react';
import {bindActionCreators} from 'redux';
import 'redux';
import 'react-redux';
import {connect} from 'react-redux';

const style={
    backgroundColor: "#F57738",
    color: "#FFFFFF",
}

class LoginContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: false,
        }
    }

    handleSubmit = (event) => {
        this.setState({login: true});
    }

    render() {
        return (
            <Grid centered verticalAlign="middle" >
                <Grid.Row></Grid.Row>
                <Grid.Column width={1}>
                    <Image src="c3-orange.png"/>
                </Grid.Column>
                <Grid.Column width={2}>
                    <h1>Project C3</h1>
                </Grid.Column>
                <Grid.Row>
                    <Grid.Column width={5}>
                        <Form>
                            <Segment>
                                <Form.Input icon='user' iconPosition='left' placeholder='Enter Account ID'/>
                                <Form.Input icon='lock' iconPosition='left' placeholder='Enter Password'
                                            type='password'/>
                                <Button fluid type="submit" color="orange" onClick={this.handleSubmit}>Login</Button>
                            </Segment>
                        </Form>
                        <Message>
                            <Message.Content>
                            New to us?
                            <a href="#">&nbsp;Sign up</a>
                            </Message.Content>
                        </Message>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        login: LoginReducer
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);