import React from 'react'
import './Card.css'

//imports Modal
import { withStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

//Imports checkbox
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import ShoppingBasketOutlinedIcon from '@material-ui/icons/ShoppingBasketOutlined';


//Styles checkbox
const CheckboxComic = withStyles({
    root: {
      color: red[100],
      '&$checked': {
        color: red[900],
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);


//Modal Scripts - begin
const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);
//Modal Scripts - end

export default function Card (props) {
    //States Modal
    const [details, setDetails] = React.useState([]);
    const [openDetails, setOpenDetails] = React.useState(false);

    //Handles Modal
    const handleClickOpenDetails = (data) => {
        setOpenDetails(true)
        setDetails(data)
    }
    const handleCloseDetails = () => {
        setOpenDetails(false);
        setDetails([])
    }

    //States checkbox
    const [state, setState] = React.useState({
        checkedComic: false,
    });
    
    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    return(
        <>
            <div className="Card">
                <div onClick={() => { handleClickOpenDetails(props.comicData) }} >
                    <div className="Name">{props.title}</div>
                    <img alt="Imagem" src={props.image} className="img img-responsive" />
                    
                </div>
                <div className="center">
                    <FormGroup row>
                        <FormControlLabel
                            control={
                            <CheckboxComic
                                
                                className="checkBoxComic"
                                checked={state.checkedComic}
                                onChange={(e)=>{
                                    handleChange(e);
                                    if(e.target.checked){
                                        props.checkedBoxes.push(props)
                                    } else {
                                        const position = props.checkedBoxes.indexOf(props.id)
                                        props.checkedBoxes.splice(position,1)
                                    }
                                }}
                                name="checkedComic"
                                icon={<ShoppingBasketOutlinedIcon />} 
                                checkedIcon={<ShoppingBasketIcon />}
                            />
                            }
                            label="Escolher"
                        />
                    </FormGroup>
                </div>
            </div>
            
            
            
            {/* Modal detalhes */}
            <Dialog onClose={handleCloseDetails} aria-labelledby="customized-dialog-title" open={openDetails}>
                    <DialogTitle id="customized-dialog-title" onClose={handleCloseDetails}>
                        Detalhes do quadrinho #{details?.id}
                    </DialogTitle>
                    <DialogContent dividers>
                        <p>Título: {details?.title}</p>
                        <img alt="Imagem" src={`${details?.thumbnail?.path}.${details?.thumbnail?.extension}`} className="img-details-modal" />
                        <p>Descrição: {(details?.description)}</p>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={handleCloseDetails} color="primary">
                            Fechar
                        </Button>
                    </DialogActions>
            </Dialog>
        </>
    )    
}
