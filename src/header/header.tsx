import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import HelpIcon from '@material-ui/icons/Help';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, withStyles, WithStyles, makeStyles } from '@material-ui/core/styles';
import { useAuthContext } from "./../login/state";
import { Link as RouterLink } from "react-router-dom";
import { Breadcrumbs } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const useStyles = makeStyles(theme => ({
    breadcrumb: {
        color: 'rgba(0, 0, 0, 0.87)',
        backgroundColor: '#eaeaea',
        padding: '10px 24px',
        fontSize: '12px'
    },
    secondaryBar: {
        zIndex: 0,
    },
    menuButton: {
        marginLeft: -theme.spacing(1),
    },
    iconButtonAvatar: {
        padding: 4,
    },
    link: {
        textDecoration: 'none',
        color: lightColor,
        '&:hover': {
            color: theme.palette.common.white,
        },
    },
    button: {
        borderColor: lightColor,
    },
    breadcrumbItem: {
        fontSize: '14px'
    }
}));

interface HeaderProps {
    database: string;
    stream?: string;
    message?: number;
}

export function Header(props: HeaderProps) {

    const classes = useStyles();
    const { isAuthenticated } = useAuthContext();

    return (
        <React.Fragment>
            <AppBar 
                component="div"
                color="primary"
                position="sticky"
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
                <Toolbar>
                    <Grid container alignItems="center" spacing={1}>
                        <Grid item xs>
                            <Typography color="inherit" variant="h5" component="h1">
                                {props.database} 
                            </Typography>
                        </Grid>
                    </Grid>
                </Toolbar>
                <Tabs value={0} textColor="inherit">
                    <Tab textColor="inherit" label="Streams" />
                    <Tab textColor="inherit" label="Visualize" />
                    <Tab textColor="inherit" label="Projections" />
                    <Tab textColor="inherit" label="Indexes" />
                    <Tab textColor="inherit" label="Users" />
                </Tabs>
                {
                    !!props.stream &&
                    <Breadcrumbs className={classes.breadcrumb} separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                        <Link color="inherit" href="/" className={classes.breadcrumbItem}>
                            All
                        </Link>
                        <Link color="inherit" href="/" className={classes.breadcrumbItem}>
                            {props.stream}
                        </Link>
                        {
                             !!props.message &&
                             <Typography color="textPrimary" className={classes.breadcrumbItem}>
                                {props.message}
                            </Typography>
                        }
                    </Breadcrumbs>
                }
               
            </AppBar>
        </React.Fragment>
    );
}