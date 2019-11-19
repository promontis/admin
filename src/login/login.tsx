import React, { FunctionComponent } from 'react';
import ReactGA from 'react-ga';
import { Redirect } from 'react-router';
import { LoginComponent as LoginMutationComponent } from "../data/types";
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { ApolloError } from 'apollo-client';
import { useSnackbar } from 'notistack';
import { useAuthContext } from './state';
import { Typography, FormControlLabel, Checkbox, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

type Props = {
    redirectUrl: string | null;
}

interface State {
    username: string;
    password: string;
}

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export const Login: FunctionComponent<Props> = ({ redirectUrl }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [values, setValues] = React.useState<State>({
        username: '',
        password: '',
    });
    const { setAuthenticated } = useAuthContext();

    const handleChange = (name: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [name]: event.target.value });
    };

    const displayError = (e: ApolloError) => {
        enqueueSnackbar(e.message, { variant: 'error' });
    }

    const classes = useStyles();

    return <LoginMutationComponent onError={displayError}>
        {(mutate, { loading, data }) => {

            if (data && data.login && data.login.token) {
                setAuthenticated(data.login.token);
                localStorage.setItem("token", data.login.token)
                ReactGA.set({ username: values.username });

                if (!redirectUrl) {
                    return <Redirect to="/" />
                }

                return <Redirect to={redirectUrl} />
            }

            return (
                <Container component="main" maxWidth="xs">
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <form className={classes.form} noValidate>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="username"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                value={values.username}
                                onChange={handleChange('username')}                      
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={values.password}
                                onChange={handleChange('password')}                          
                            />
                            {/* <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            /> */}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={(e) => { e.preventDefault(); mutate({variables: values})}}
                            >
                                Sign In
                            </Button>
                        </form>
                    </div>
                </Container>
            );
        }}</LoginMutationComponent>
}
