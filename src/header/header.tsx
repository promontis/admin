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
    tertiaryBar: {
        color: 'rgba(0, 0, 0, 0.87)',
        backgroundColor: '#eaeaea',
        padding: '10px 24px',
        fontSize: '12px'
    },
    breadcrumbItem: {
        fontSize: '12px'
    }
}));

interface HeaderProps {
    
}

export function Header(props: HeaderProps) {

    const classes = useStyles();
    const { isAuthenticated } = useAuthContext();

    return (
        <React.Fragment>
           
            <AppBar
                component="div"
                className={classes.secondaryBar}
                color="primary"
                position="static"
                elevation={0}
            >
                <Toolbar>
                    <Grid container alignItems="center" spacing={1}>
                        <Grid item xs>
                            <Typography color="inherit" variant="h5" component="h1">
                                Promontis 
                            </Typography>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <AppBar
                component="div"
                className={classes.secondaryBar}
                color="primary"
                position="static"
                elevation={0}
            >
                <Tabs value={0} textColor="inherit">
                    <Tab textColor="inherit" label="Streams" />
                    <Tab textColor="inherit" label="Projections" />
                    <Tab textColor="inherit" label="Indexes" />
                    <Tab textColor="inherit" label="Users" />
                </Tabs>
            </AppBar>
            <AppBar
                component="div"
                className={classes.tertiaryBar}
                position="static"
                elevation={0}
            >
                 <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                    <Link color="inherit" href="/" className={classes.breadcrumbItem}>
                        All
                    </Link>
                    <Link color="inherit" href="/" className={classes.breadcrumbItem}>
                        model-0e748b9f-84d5-4663-bdb7-399f411cd503
                    </Link>
                    {/* <Typography color="textPrimary" className={classes.breadcrumbItem}>
                        model-0e748b9f-84d5-4663-bdb7-399f411cd503
                    </Typography> */}
                    <Typography color="textPrimary" className={classes.breadcrumbItem}>
                        2
                    </Typography>
                </Breadcrumbs>
            </AppBar>
        </React.Fragment>
    );
}