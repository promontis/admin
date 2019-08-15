import React, { FunctionComponent } from 'react';
import {
  createStyles,
  fade,
  Theme,
  makeStyles,
} from '@material-ui/core/styles';
import AceEditor from 'react-ace';
import TextField, {TextFieldProps } from '@material-ui/core/TextField';
import { OutlinedInputProps } from '@material-ui/core/OutlinedInput';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';

export interface StreamMessage {
  stream: string;
  type: string;
  value: string;
}

type Props = {
  readOnly: boolean;
  message: StreamMessage;
  onChange?: ((message: StreamMessage) => void);
}

const useStylesReddit = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      border: '1px solid #e2e2e1',
      overflow: 'hidden',
      borderRadius: 4,
      backgroundColor: '#fcfcfb',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      '&:hover': {
        backgroundColor: '#fff',
      },
      paddingLeft: '5px',
      '&$focused': {
        backgroundColor: '#fff',
        boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
        borderColor: theme.palette.primary.main,
      },
    },
    focused: {},
  }),
);

function RedditTextField(props: TextFieldProps) {
  const classes = useStylesReddit();

  return (
    <TextField
      InputProps={{ classes, disableUnderline: true } as Partial<OutlinedInputProps>}
      {...props}
    />
  );
}

const MessageComponent: FunctionComponent<Props> = ({readOnly, message, onChange}) => {
  const classes = useStylesReddit();

  return <Grid container spacing={3}>
    <Grid item xs={12}>
      <RedditTextField
        inputProps={{
          readOnly: readOnly,
        }}
        id="standard-name"
        label="stream name"
        value={message.stream}
        onChange={(e) => onChange && onChange({...message, stream: e.target.value})}
      />
    </Grid>
    <Grid item xs={12}>
      <RedditTextField
        inputProps={{
          readOnly: readOnly,
        }}
        id="standard-name"
        label="event type"
        value={message.type}
        onChange={(e) => onChange && onChange({...message, type: e.target.value})}
      />
    </Grid>
    <Grid item xs={12}>
      <InputLabel htmlFor="value">event value</InputLabel>
      <AceEditor
        readOnly={readOnly}
        className={classes.root}
        mode="json"
        theme="tomorrow"
        value={message.value}
        name="value"
        editorProps={{$blockScrolling: true}}
        width="100%"
        wrapEnabled={true}
        fontSize={16}
        onChange={(newValue) => onChange && onChange({...message, value: newValue})}
      />   
    </Grid>
  </Grid>
}

export default MessageComponent;
