import React, { useEffect, useState } from 'react'

//Imports Google Maps
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'
import usePlacesAutocomplete from "use-places-autocomplete";
import {
    Combobox,
    ComboboxInput,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

//imports Modal e Design
import { 
    withStyles, 
    makeStyles, 
    Button,
    Dialog,
    DialogContent as MuiDialogContent,
    DialogTitle as MuiDialogTitle,
    DialogActions as MuiDialogActions,
    IconButton,
    Typography,
    CircularProgress,
    InputBase,
    Paper,
    Divider
} from '@material-ui/core';
import {Close as CloseIcon, Search as SearchIcon } from '@material-ui/icons'

//import componentes and resources
import Card from './components/layout/Card'
import ApiMarvel from './services/ApiMarvel'
import './App.css'

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

//Input Search Scripts - begin
const useStyles = makeStyles((theme) => ({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 400,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }));

//Input Search Scripts - end

export default function App(props) {
    //Configs Google Maps - begin
    const libraries = ["places"];
    const mapContainerStyle = {
        width: "100%",
        height: "40vh"
    };

    const [center, setCenter] = useState([{
        lat: -7.228988,
        lng: -39.3308357,
    }]);


    const options = {
        disableDefaultUI: true,
        zoomControl: true,
    }
    

    const {isLoad} = useLoadScript({
        googleMapsApiKey: "AIzaSyDn7jDSZDCfpU5TDSUOap5txxRJqw4ANh8",
        libraries,
    });
    const [marker, setMarker] = useState([{
        lat: -7.228988,
        lng: -39.3308357,
    }]);

    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, []);

    const panTo = React.useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(14);
      }, []);

    const Search = ({ panTo }) => {
        const {
            ready,
            value,
            setValue,
        } = usePlacesAutocomplete({
            requestOptions: {
              location: { lat: () => -7.228988, lng: () => -39.3308357},
              radius: 100 * 1000,
            },
        });
        
        const handleInput = (e) => {
            setValue(e.target.value)
        }

        return (
            <div className="search">
                <Combobox 
                    onSelect={() => {
                        console.log('Olá mundo');
                    }}
                >
                    <ComboboxInput 
                        value={value} 
                        onChange={handleInput}
                        disabled={!ready}
                        placeholder="Informe o endereço..."
                    />
                </Combobox>
            </div>
        )
    }

    //Configs Google Maps - end

    //States Modal
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [details, setDetails] = useState([]);
    const [openDetails, setOpenDetails] = useState(false);

    //Style input
    const classes = useStyles();

    //States Comics
    const [comics, setComics] = useState([]);
    const [comicsFilter, setComicsFilter] = useState([]);
    const [searchFilter, setSearchFilter] = useState('');
    const [comicsLimit, setComicsLimit] = useState(10);
    const [loadComics, setLoadComics] = useState(false);

    //State checkBox
    const [checkedBoxes, setCheckedBoxes] = useState([]);

    const handleCloseDetails = () => {
        setOpenDetails(false);
        setDetails([])
    }
    const handleClose = () => {
        setOpen(false);
    }
    const handleClose2 = () => {
        setOpen2(false);
    }
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClickOpen2 = () => {
        setOpen(false);
        setOpen2(true);
    };
    

    //Set filters comics
    const handleFilter = (search) => {
        setSearchFilter(search.target.value)
        setComicsLimit(10)

        if (search) {
            const lowerSearch = (search.target.value).toLowerCase()
            const results = comics.filter(data => {
                return (data.title).toLowerCase().includes(lowerSearch)
            })
            setComicsFilter(results)
        } else {
            setComicsFilter(comics)
        }
    }

    //Get data API Marvel
    useEffect(() => {
        setLoadComics(true);

        ApiMarvel.get(`v1/public/comics?ts=1&apikey=94b5cda7806cf9749411de7c28aa9baa&hash=c29a778d47900907efc0865ac94d4a7c&limit=100`)
            .then(({ data }) => {
                setComics(data.data.results)
                setComicsFilter(data.data.results)
                setLoadComics(false)
            })
            .catch(e => { console.log(e) })
    }, [])

    

    return (
        <div className="row">
            <div className="center">
                <Paper component="form" className={classes.root}>
                    <InputBase
                        className={classes.input}
                        placeholder="Buscar quadrinhos..."
                        inputProps={{ 'aria-label': 'search google maps' }}
                        onChange={(e) => { handleFilter(e) }} value={searchFilter}
                    />
                    <Divider className={classes.divider} orientation="vertical" />
                    <IconButton type="submit" className={classes.iconButton} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>
            </div>            
                {
                    loadComics ? (
                        <div 
                            style={{
                                display: 'flex', 
                                justifyContent: 'center', 
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <CircularProgress /> <h3> Caregando...</h3>
                        </div>
                    ) : (
                        <>
                            <div className="App">
                                {
                                    comicsFilter.slice(0,comicsLimit)?.map(comic => {
                                        return (
                                            <Card
                                                key={comic.id}
                                                image={`${comic.thumbnail.path}.${comic.thumbnail.extension}`} 
                                                title={comic.title} 
                                                description={comic.description}
                                                comicData={comic}
                                                id={comic.id}
                                                checkedBoxes={checkedBoxes}
                                                setCheckedBoxes={setCheckedBoxes}
                                            />
                                            
                                            )
                                    })
                                }
                            </div>

                            <div className="center">
                                <Button variant="outlined" color="secondary" onClick={()=>{setComicsLimit(comicsLimit+5)}}>
                                    Mostrar mais
                                </Button>
                            </div>
                            
                            <div className="modal-enviar">
                                <div className="div-button">
                                    <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                                        Enviar quadrinhos
                                    </Button>
                                </div>
                            </div> 
                        </>
                    )
                }
            
                {/* Modal enviar quadrinhos 1 */}
                <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                    <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                        Enviar quadrinhos
                    </DialogTitle>
                    <DialogContent dividers>
                        <Typography gutterBottom>
                            
                                Digite no campo abaixo o endereço para envio do(s) quadrinho(s) e posteriormente confirme a localização no mapa.
                            
                        </Typography>
                        {/*Input de pesquisa Maps*/}
                        <Search panTo={panTo} />
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            zoom={13}
                            center={center[0]}
                            options={options}
                            onClick={(event) => {
                                setMarker([{
                                    lat: event.latLng.lat(),
                                    lng: event.latLng.lng(),
                                }]);
                                setCenter([{
                                    lat: event.latLng.lat(),
                                    lng: event.latLng.lng(),
                                }]);
                            }}
                            onLoad={onMapLoad}
                        >
                            <Marker position={{lat: marker[0].lat, lng: marker[0].lng }} />
                        </GoogleMap>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={handleClickOpen2} color="primary">
                            Enviar
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Modal enviar quadrinhos 2 */}
                <Dialog onClose={handleClose2} aria-labelledby="customized-dialog-title" open={open2}>
                    <DialogTitle id="customized-dialog-title" onClose={handleClose2}>
                        Confirmar envio de quadrinhos
                    </DialogTitle>
                    <DialogContent dividers>
                        <Typography gutterBottom>
                                Quadrinhos a enviar:
                        </Typography>
                            {
                                checkedBoxes.map(comic => {
                                    return (
                                        <div key={comic.id} style={{margin: '20px'}}>
                                            <h4 style={{float: 'left'}}>#{comic.id}</h4>
                                            <img alt={`${comic.title}`} width="60px" src={`${comic.image}`}  style={{margin: '10px'}}/>
                                        </div>
                                    )
                            })
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={handleClose2} color="primary">
                            Confirmar
                        </Button>
                    </DialogActions>
                </Dialog>

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
            
        </div>
    )
}