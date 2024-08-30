import React from "react";
import './card.css'
import {Card,Avatar, Divider, Box, Typography, CardHeader} from "@mui/material";
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';



export default function MyCard() {
    return(
        <Card variant = "outlined" sx = {{maxWidth : 360, bgcolor : '#36BA98', color : 'white'}}>
            <CardHeader sx={{color : 'white'}}
                avatar = {<FavoriteIcon/>}
                action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                title="Shrimp and Chorizo Paella"
                subheader="September  14, 2016"
                subheaderTypographyProps={{ style: { color: 'white' } }}
            />
        </Card>
    );
}