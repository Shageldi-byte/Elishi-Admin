import { Button, IconButton, OutlinedInput, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ConstantTable from './ConstantTable'
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import LoadingButton from '@mui/lab/LoadingButton';
import JoditEditor from "jodit-react";
import { AxiosInstance } from '../Axios/AxiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showError, showSuccess, showWarning } from '../Alert/Alert.mjs';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  bgcolor: 'background.paper',
  border: '2px solid transparent',
  borderRadius: '12px',
  boxShadow: 24,
  p: 4,
  overflow: 'scroll',
  height: '100%',
  display: 'block'
};

function Constants() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isLoading, setLoading] = useState(false);
  const [isEmptyPage, setEmptyPage] = useState(false);
  const [constants,setConstants]= useState([]);

  const handleClick = () => {
    addConstant();
  }

  // Field variables
  const[titleTM,setTitleTM] = useState('');
  const[titleRU,setTitleRU] = useState('');
  const[titleEN,setTitleEN] = useState('');
  const[contentLightTM,setContentLightTM] = useState('');
  const[contentLightRU,setContentLightRU] = useState('');
  const[contentLightEN,setContentLightEN] = useState('');
  const[contentDarkTM,setContentDarkTM] = useState('');
  const[contentDarkRU,setContentDarkRU] = useState('');
  const[contentDarkEN,setContentDarkEN] = useState('');
  const[type,setType] = useState('');
  // Field variables

  useEffect(()=>{
    getConstants();
  },[]);

  const clearInput=()=>{
    setTitleTM('');
    setTitleRU('');
    setTitleEN('');
    setContentLightTM('');
    setContentLightRU('');
    setContentLightEN('');
    setContentDarkTM('');
    setContentDarkRU('');
    setContentDarkEN('');
    setType('');
  }

  const addConstant = () => {
    if(titleTM=='' || titleRU=='' || titleEN=='' || type=='' || contentLightTM=='' || contentLightRU=='' || contentLightEN=='' || contentDarkTM=='' || contentDarkRU=='' || contentDarkEN==''){
      showWarning("Please enter required informations");
      return;
    }
    setLoading(true);
    const body = {
      titleTM:titleTM,
      titleRU:titleRU,
      titleEN:titleEN,
      lightTM:contentLightTM,
      lightRU:contentLightRU,
      lightEN:contentLightEN,
      darkTM:contentDarkTM,
      darkRU:contentDarkRU,
      darkEN:contentDarkEN,
      type:type,
    }
    AxiosInstance.post('/constant-page/add-constant',body)
    .then(response => {
      if (!response.data.error) {
          showSuccess("Successfully added!");
          setLoading(false);
          clearInput();
          handleClose();
          getConstants()
      } else {
          showError("Something went wrong!");
          setLoading(false);
      }
  })
  .catch(error => {
      showError(error + "");
      setLoading(false);
  })
  }

  const getConstants = () => {
    AxiosInstance.get('/constant-page/get-constant')
    .then(response => {
      if (!response.data.error) {
        setConstants(response.data.body);
          if (typeof response.data.body === 'undefined' || response.data.body == 0) {
              setEmptyPage(true);
          } else {
              setEmptyPage(false);
          }
      } else {
          showError("Something went wrong!");
          if (constants.length == 0) {
              setEmptyPage(true);
          }

      }
    })
    .catch(error => {
        showError(error + "");
        if (constants.length == 0) {
            setEmptyPage(true);
        }
    })
  }


  return (
    <div>
      <ToastContainer />
      <Stack
        direction={'column'}
        spacing={4}
      >
         <Grid container spacing={0}>
                    <Grid item lg={6}>
                        <h2>Constants</h2>
                    </Grid>
                    <Grid item lg={6}>
                        <Stack
                            direction={'row'}
                            spacing={4}
                            justifyContent={'flex-end'}
                        >
                            <Button variant="outlined" onClick={handleOpen} startIcon={<AddIcon />}>Add Contant</Button>
                        </Stack>
                    </Grid>
                </Grid>


        <ConstantTable constants={constants} getConstants={getConstants} isEmptyPage={isEmptyPage} />
      </Stack>


      {/* Modal for add */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack
            direction={"column"}
            spacing={3}
          >
            <Stack
              direction={'row'}
              justifyContent={'flex-end'}
            >
              <IconButton onClick={handleClose}><CloseIcon /></IconButton>
            </Stack>
            <Grid container spacing={2}>
              <Grid item md={12} lg={6}>
                <TextField
                  fullWidth
                  required
                  id="outlined-required"
                  label="Title turkmen"
                  defaultValue=""
                  value={titleTM}
                  onChange={e=>setTitleTM(e.target.value)}
                />
              </Grid>
              <Grid item md={12} lg={6}>
                <TextField
                  fullWidth
                  required
                  id="outlined-required"
                  label="Title russian"
                  defaultValue=""
                  value={titleRU}
                  onChange={e=>setTitleRU(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item md={12} lg={6}>
                <TextField
                  fullWidth
                  required
                  id="outlined-required"
                  label="Title english"
                  defaultValue=""
                  value={titleEN}
                  onChange={e=>setTitleEN(e.target.value)}
                />
              </Grid>
              <Grid item md={12} lg={6}>
                <TextField
                  fullWidth
                  required
                  id="outlined-required"
                  label="Type"
                  defaultValue=""
                  value={type}
                  onChange={e=>setType(e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item md={12} lg={6}>
                <TextField
                  fullWidth
                  id="filled-textarea"
                  label="Light Content turkmen"
                  placeholder="Enter Content turkmen..."
                  multiline
                  rows={20}
                  variant="filled"
                  value={contentLightTM}
                  onChange={e=>setContentLightTM(e.target.value)}
                />
              </Grid>
              <Grid item md={12} lg={6}>
                <TextField
                  fullWidth
                  id="filled-textarea"
                  label="Light Content russian"
                  placeholder="Enter Content russian..."
                  multiline
                  rows={20}
                  variant="filled"
                  value={contentLightRU}
                  onChange={e=>setContentLightRU(e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item md={12} lg={6}>
                  <TextField
                    fullWidth
                    id="filled-textarea"
                    label="Light Content russian"
                    placeholder="Enter Content russian..."
                    multiline
                    rows={20}
                    variant="filled"
                    value={contentLightEN}
                    onChange={e=>setContentLightEN(e.target.value)}
                  />
                </Grid>
              <Grid item md={12} lg={6}>
                  <TextField
                    fullWidth
                    id="filled-textarea"
                    label="Dark Content turkmen"
                    placeholder="Enter Dark Content turkmen..."
                    multiline
                    rows={20}
                    variant="filled"
                    value={contentDarkTM}
                    onChange={e=>setContentDarkTM(e.target.value)}
                  />
                </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item md={12} lg={6}>
                  <TextField
                    fullWidth
                    id="filled-textarea"
                    label="Dark Content russian"
                    placeholder="Enter Dark Content russian..."
                    multiline
                    rows={20}
                    variant="filled"
                    value={contentDarkRU}
                    onChange={e=>setContentDarkRU(e.target.value)}
                  />
                </Grid>
              <Grid item md={12} lg={6}>
                  <TextField
                    fullWidth
                    id="filled-textarea"
                    label="Dark Content english"
                    placeholder="Enter Dark Content english..."
                    multiline
                    rows={20}
                    variant="filled"
                    value={contentDarkEN}
                    onChange={e=>setContentDarkEN(e.target.value)}
                  />
                </Grid>


                <Grid item md={12} lg={12}>
                                {
                                    <LoadingButton
                                        loading={isLoading}
                                        loadingPosition="start"
                                        startIcon={<AddIcon />}
                                        variant="contained"
                                        fullWidth={true}
                                        onClick={handleClick}
                                    >
                                        {isLoading ? <p style={{ color: "white" }}>Please wait...</p> : <p style={{ color: "white" }}>Add</p>}
                                    </LoadingButton>

                                }

                            </Grid>
            </Grid>
           

          </Stack>
        </Box>
      </Modal>
      {/* End of modal add */}

    </div>
  )
}

export default Constants

