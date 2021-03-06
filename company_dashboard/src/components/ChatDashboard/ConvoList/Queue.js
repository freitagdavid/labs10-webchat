import React, { Component } from 'react';
import io from 'socket.io-client';
import { withRouter} from "react-router-dom"
import { BrowserRouter as Router, Link, Route, Redirect } from 'react-router-dom'
import axios from 'axios';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
      flexGrow: 1,
      overflow: 'hidden',
      padding: `0 ${theme.spacing.unit * 3}px`,
    },
    paper: {
      maxWidth: 400,
      margin: `${theme.spacing.unit}px auto`,
      padding: theme.spacing.unit * 2,
    },
    listItem: {
      '&:hover': {
        cursor: 'pointer'
      }
    },
    convoAuthor: {
        'margin-block-start': '0px',
        'margin-block-end': '.8em'
    },
    convoSummary: {
        'margin-left': '.6em'
    },
    convoList: {
        // overflowY: 'scroll',
        // height: 1000
    }
});

class Queue extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            conversations: []
        }
    }

    componentDidMount() {
        const getQueue = axios.get('/api/chat/queue')
        getQueue
            .then(q => {
                this.setState({
                    conversations: q.data  // q.data should be an array of objects, each containing rep_name, rep_company_id, customer_uid, summary, customer_name
                });
            })
            .catch(error => {
                console.log(error.message);
            })
    }


    render() {
        const { classes } = this.props;
        return (
        <div>
            <MuiThemeProvider>   
            <div className={classes.convoList}> 
            <Typography color='inherit' variant='h4' align='left'>Incoming Queue</Typography><br/><br/>     
                {this.state.conversations.map((convo, index) => {
                return(
                    <Paper key={index} className={classes.paper}>
                    <Grid container wrap="nowrap"  className={classes.listItem} spacing={0}>
                        <Grid item>
                        </Grid>
                        <Grid item
                          xs
                          zeroMinWidth
                          key={index}
                          onClick={() => this.props.handleQueueConvoSelect(convo.convo_id, convo.customer_uid, convo.customer_name, convo.summary)}
                        >
                            {/* <Typography
                                color='primary'
                                variant='h5'
                                align='left'
                                noWrap
                                key={index}
                            >
                              Customer: {convo.customer_name}
                            </Typography> */}

                            <Typography
                                color='primary' 
                                variant='h5' 
                                align='left' 
                                noWrap 
                                key={index}
                            >
                            <h3 className={classes.convoAuthor}>{convo.customer_name}</h3>
                            
                            <body2 className={classes.convoSummary}>    {convo.summary}</body2>
                            </Typography>

                        </Grid>
                    </Grid>
                    </Paper>
                )
                })}
            </div>
            </MuiThemeProvider>
        </div>
        );
    }
}

export default withStyles(styles)(withRouter(Queue));