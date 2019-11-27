import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, Theme, withStyles, WithStyles, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import { Tabs, Tab, Link } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { Header } from '../header/header';
import { useAuthContext } from '../login/state';
import { Link as RouterLink } from "react-router-dom";

const lightColor = 'rgba(255, 255, 255, 0.7)';

const useStyles = makeStyles(theme => ({
    paper: {
        // flexGrow: 1,
        //backgroundColor: theme.palette.background.paper,
        margin: '0 auto'
    },
    appBar: {
        background: 'transparent',
        // boxShadow: 'none',
        color: "black"
    },
    searchBar: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    },
    searchInput: {
        fontSize: theme.typography.fontSize,
    },
    block: {
        display: 'block',
    },
    addUser: {
        marginRight: theme.spacing(1),
    },
    contentWrapper: {
        margin: '40px 16px',
    },
    indicator: {
        backgroundColor: theme.palette.primary.main,
    },
    link: {
        textDecoration: 'none',
        color: 'black',
        '&:hover': {
            color: 'black',
        },
    },
    select: {
        marginTop: '55px',
        marginLeft: '24px',
        color: 'black' //'rgba(0, 0, 0, 0.54)'
    },
    arrow: {
        marginLeft: '48px',
    }
}));

export function Dashboard() {

    const classes = useStyles();
    const { isAuthenticated } = useAuthContext();

    return (
        <div>
            
            <AppBar  
                component="div"
                className={classes.appBar}
                position="static"
                elevation={0}
            >
                 <Toolbar>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item xs />
                        <Grid item>
                            <Link className={classes.link} href="#" variant="body2">
                                Go to Docs
                        </Link>
                        </Grid>
                        <Grid item>
                            <Link className={classes.link} href="https://streamsdb.io/chat/" variant="body2">
                                Chat
                        </Link>
                        </Grid>
                        <Grid item>
                            {isAuthenticated ?
                                <Link className={classes.link} component={RouterLink} to="/logout" variant="body2">
                                    Log Out
                            </Link> :
                                <Link className={classes.link} component={RouterLink} to="/login" variant="body2">
                                    Log In
                            </Link>
                            }
                        </Grid>
                    </Grid>
                </Toolbar>
                
            </AppBar>

            <div className={classes.paper}>
               <h3 className={classes.select}>Please select a database</h3>
               <img src='arrow.png' width='50px' className={classes.arrow} />
            </div>
            
        </div>
    );
}