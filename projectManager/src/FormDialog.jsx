import React, {useState} from "react";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import axios from "axios";
import dayjs from "dayjs";


export default function FormDialog({open, handleClose}) {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [activity, setActivity] = useState('');
    const handleSubmit = () => {
    }


    return(
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{"Programmer une tache"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Choisir la tache ainsi que la date.
                </DialogContentText>
                <TextField/>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box>
                        <DatePicker
                            label="choisir une date"
                            value={selectedDate}
                            onChange={(newValue) => setSelectedDate(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Box>
                </LocalizationProvider>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Fermer
                </Button>
                <Button onClick={handleClose} color="primary" autoFocus>
                    Envoyer
                </Button>
            </DialogActions>
        </Dialog>
    );
}