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
}));

interface HeaderProps {
    onDrawerToggle: () => void;
}

export function Header(props: HeaderProps) {

    const { onDrawerToggle } = props;
    const classes = useStyles();
    const { isAuthenticated } = useAuthContext();

    return (
        <React.Fragment>
            <AppBar color="primary" position="sticky" elevation={0}>
                <Toolbar>
                    <Grid container spacing={1} alignItems="center">
                        <Hidden smUp>
                            <Grid item>
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    onClick={onDrawerToggle}
                                    className={classes.menuButton}
                                >
                                    <MenuIcon />
                                </IconButton>
                            </Grid>
                        </Hidden>
                        <Grid item xs />
                        <Grid item>
                            <Link className={classes.link} href="#" variant="body2">
                                Go to docs
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
                                    Logout
                                </Link> :
                                <Link className={classes.link} component={RouterLink} to="/login" variant="body2">
                                    Login
                                </Link>
                            }
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
                <Toolbar>
                    <Grid container alignItems="center" spacing={1}>
                        <Grid item xs>
                            <Typography color="inherit" variant="h5" component="h1">
                                Promontis   
                            </Typography>
                        </Grid>
                        {/* <Grid item>
                            <Button className={classes.button} variant="outlined" color="inherit" size="small">
                                Web setup
              </Button>
                        </Grid>
                        <Grid item>
                            <Tooltip title="Help">
                                <IconButton color="inherit">
                                    <HelpIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid> */}
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
        </React.Fragment>
    );
}