import React, { useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { confirm } from "react-confirm-box";
import './subcategorytable.css';
import { Modal, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { OutlinedInput, TextField } from '@mui/material'
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';
import { data } from '../../constants'
import Loading from '../Loading/Loading';
import Empty from '../Empty/Empty';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import { server_ip } from '../Axios/AxiosInstance';
import FileBrowse from '../FileBrowse/FileBrowse';
import { AxiosInstance, AxiosInstanceFormData } from '../Axios/AxiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactLoading from 'react-loading';
import { showError, showSuccess, showWarning } from '../Alert/Alert.mjs';
import {useTranslation} from '../../components/sidebar/Sidebar';

const Input = styled('input')({
    display: 'none',
});

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    border: '2px solid transparent',
    borderRadius: '12px',
    boxShadow: 24,
    p: 4,
    overflow: 'scroll',
    height: '90%',
    display: 'block',
    overflowX: 'hidden'
};

const SubCategoryTable = ({ list, isEmpty, categoryList, getData }) => {
    const {t} = useTranslation();
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);
    const [image, setImage] = useState('Select image');
    const [name_tm, setNameTm] = useState('');
    const [name_ru, setNameRu] = useState('');
    const [name_en, setNameEn] = useState('');
    const [status, setStatus] = useState(false);
    const [category, setCategory] = useState('');
    const [selectedFile, setFile] = useState('');
    const [id, setId] = useState(0);
    const handleOpen = (element) => {
        setOpen(true);
        setNameTm(element.sub_category_name_tm);
        setNameRu(element.sub_category_name_ru);
        setNameEn(element.sub_category_name_en);
        setStatus(element.status);
        setCategory(element.category_id);
        setImage(element.image);
        setId(element.id);
    }

    const handleFileInput = (e) => {
        setImage(e.target.files[0].name);
        setFile(e.target.files[0]);
    }


    const [isLoading, setLoading] = useState(false);
    const handleLoading = () => {
        setLoading(!isLoading);
    }

    const [isLoadingButton, setLoadingButton] = useState(false);

    const handleClick = () => {
        updateCategory();
    }

    const clearInput = () => {
        setNameTm('');
        setNameRu('');
        setNameEn('');
        setStatus(1);
        setCategory('');
        setFile('');
        setImage('Select image');
        setId(0);
    }

    const confirmDialog = async (element) => {
        if (window.confirm("Do you want delete this sub category?")) {
            deleteSubCategory(element);
        }
    };

    const updateCategory = () => {
        if (name_tm == '' || name_ru == '' || name_en == '' || category == '' || id == 0) {
            showWarning("Enter all required information");
            return;
        }
        setLoading(true);
        let formData = new FormData();
        if (selectedFile != '') {
            formData.append('file',selectedFile);
        }

        formData.append('nameTM', name_tm);
        formData.append('nameRU', name_ru);
        formData.append('nameEN', name_en);
        formData.append('status', status);
        formData.append('category', category);
        formData.append('id', id);
        AxiosInstanceFormData.put('/sub-category/update-sub-category', formData)
            .then(response => {
                if (!response.data.error) {
                    showSuccess("Successfully updated!");
                    setLoading(false);
                    clearInput();
                    handleClose();
                    getData();
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

    const deleteSubCategory = async (element) => {
        AxiosInstance.delete('/sub-category/delete-sub-category/' + element.id + "?filename=" + element.image)
            .then(response => {
                if (!response.data.error) {
                    showSuccess("Successfully deleted!");
                    getData();
                } else {
                    showError("Something went wrong!");
                }
            })
            .catch(err => {
                showError(err + "");
            })
    }
    return (
        <div>
            {((typeof list === 'undefined' || list.length <= 0) && !isEmpty) ? <Loading /> : ((typeof list === 'undefined' || list.length <= 0) && isEmpty) ? <Empty /> :
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell align="left">{t('Sub Name TM')}</TableCell>
                                <TableCell align="left">{t('Image')}</TableCell>
                                <TableCell align="left">{t('Category')}</TableCell>
                                <TableCell align="left">{t('Status')}</TableCell>
                                <TableCell align="left">{t('DELETE')}</TableCell>
                                <TableCell align="left">{t('EDIT')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                list.map((element, i) => {
                                    return (
                                        <TableRow
                                            key={element.id + "key" + element.sub_category_name_tm}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell key={element.id + "key" + element.sub_category_name_tm + data.user.placeholder} component="th" scope="row">{element.id}</TableCell>
                                            <TableCell align="left">{element.sub_category_name_tm}</TableCell>
                                            <TableCell align="left">
                                                <LazyLoadImage
                                                    placeholderSrc={data.user.placeholder}
                                                    placeholder={<img src={data.user.placeholder} className="img" />}
                                                    effect="black-and-white"
                                                    src={server_ip + "/" + element.image} className="img" /></TableCell>
                                            <TableCell align="left">{element.category_name_tm}</TableCell>
                                            <TableCell align="left">{(element.status == '0' || element.status === '') ? <label>{t('Passive')}</label> : <label>{t('Active')}</label>}</TableCell>
                                            <TableCell align="left"> <IconButton aria-label="delete" color="secondary" onClick={() => confirmDialog(element)}><DeleteIcon /></IconButton></TableCell>
                                            <TableCell align="left"> <IconButton aria-label="delete" color="success" onClick={() => handleOpen(element)}><EditIcon /></IconButton></TableCell>
                                        </TableRow>
                                    )
                                })
                            }



                        </TableBody>
                    </Table>
                </TableContainer>
            }



            {/* Modal for edit */}
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
                                    label={t('Sub Category name turkmen')}
                                    defaultValue=""
                                    value={name_tm}
                                    onChange={e => setNameTm(e.target.value)}
                                />
                            </Grid>
                            <Grid item md={12} lg={6}>
                                <TextField
                                    fullWidth
                                    required
                                    id="outlined-required"
                                    label={t('Sub Category name russian')}
                                    defaultValue=""
                                    value={name_ru}
                                    onChange={e => setNameRu(e.target.value)}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item md={12} lg={6}>
                                <TextField
                                    fullWidth
                                    required
                                    id="outlined-required"
                                    label={t('Sub Category name english')}
                                    defaultValue=""
                                    value={name_en}
                                    onChange={e => setNameEn(e.target.value)}
                                />
                            </Grid>
                            <Grid item md={12} lg={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-multiple-name-label">{t('Status')}</InputLabel>
                                    <Select
                                        value={status}
                                        onChange={e => setStatus(e.target.value)}
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        input={<OutlinedInput label={t('Status')} />}
                                    >
                                        <MenuItem
                                            key="Active"
                                            value="1"
                                        >
                                            {t('Active')}
                                        </MenuItem>

                                        <MenuItem
                                            key="Passive"
                                            value="0"
                                        >
                                            {t('Passive')}
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>

                            <Grid item md={12} lg={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-multiple-name-label">{t('Category')}</InputLabel>
                                    <Select
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        input={<OutlinedInput label={t('Category')} />}
                                    >
                                        {
                                            categoryList?.map((element, i) => {
                                                return (
                                                    <MenuItem key={i} value={element.id}>
                                                        {element.category_name_ru}
                                                    </MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item md={12} lg={6}>
                            </Grid>
                            <Grid item md={12} lg={12}>
                                <label htmlFor="contained-button-file3">
                                    <Input accept="image/*" id="contained-button-file3" type="file" onChange={handleFileInput} />
                                    <FileBrowse component="span" image={image}>
                                    </FileBrowse>
                                </label>
                            </Grid>

                            <Grid item md={12} lg={12}>
                                {
                                    <LoadingButton
                                        loading={isLoading}
                                        loadingPosition="start"
                                        startIcon={<EditIcon />}
                                        variant="contained"
                                        color="primary"
                                        fullWidth={true}
                                        onClick={handleClick}
                                    >
                                        {isLoading ? <Typography variant="action">{t('Please wait...')}</Typography> : <Typography variant="action">{t('Edit')}</Typography>}
                                    </LoadingButton>

                                }

                            </Grid>
                        </Grid>


                    </Stack>
                </Box>
            </Modal>
            {/* End of modal edit */}
        </div>
    )
}

export default SubCategoryTable
