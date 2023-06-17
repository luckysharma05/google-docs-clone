import { useEffect, useState } from 'react';

import Table from './Table';

import Quill from 'quill';
import 'quill/dist/quill.snow.css';

import { Box } from '@mui/material';
import styled from '@emotion/styled';

import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

import { RWebShare } from "react-web-share";

const Component = styled.div`
    background: #F5F5F5;
`

const toolbarOptions = {
    container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
      
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
      
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
      
        ['clean'],                                        // remove formatting button
        
    ] 
} 
  

const Editor = () => {
    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();
    const { id } = useParams();
    const [inputTitle, setInputTitle] = useState("");
  

    useEffect(() => {
        const quillServer = new Quill('#container', { theme: 'snow', modules: { toolbar: toolbarOptions }});
        quillServer.disable();
        quillServer.setText('Loading the document... ');
        setQuill(quillServer);
    }, []);

    useEffect(() => {
        console.log("Break");
        // const socketServer = io('https://google-docs-clone-api2.onrender.com');
        const socketServer = io('https://my-appy.adaptable.app');
        setSocket(socketServer);

        return () => {
            socketServer.disconnect();
        }
    }, []);

    useEffect(() => {
        if (socket === null || quill === null) return;

        const handleChange = (delta, oldData, source) => {
            if (source !== 'user') return;

            socket && socket.emit('send-changes', delta);
        }

        quill && quill.on('text-change', handleChange);

        return () => {
            quill && quill.off('text-change', handleChange);
        }
    }, [quill, socket]);


    useEffect(() => {
        if (socket === null || quill === null) return;

        const handleChange = (delta) => {
            quill.updateContents(delta);
        }

        socket && socket.on('receive-changes', handleChange);

        return () => {
            socket && socket.off('receive-changes', handleChange);
        }
    }, [quill, socket]);


    useEffect(() => {
        if(quill === null || socket === null) return;

        socket && socket.once('load-document', document => {
            quill && quill.setContents(document.data);
            setInputTitle(document.title);
            console.log(document.title);
            quill && quill.enable();
        })
        socket && socket.emit('get-document', id);
    }, [quill,socket,id]);


    useEffect(() => {
        if(quill === null || socket === null) return;

        const interval = setInterval(() => {
            const pageData = {
                data: quill.getContents(),
                title: inputTitle,
            };
            // socket && socket.emit('save-document', quill.getContents());
            socket && socket.emit('save-document', pageData);
        }, 2000)

        return () => {
            clearInterval(interval);
        }
        
    }, [quill,socket,inputTitle]);


    useEffect(() => {
        setInputTitle(inputTitle);
        // console.log(inputTitle);
    }, [inputTitle]);



    const onTitleChange = (e) => {
        setInputTitle(e.target.value);
    }

    return (
        
        <Component >
            <div className='titleBar'>
                <input 
                    type='text' 
                    placeholder='Title' 
                    className='title'
                    value={inputTitle} 
                    name = 'title'
                    onChange={(e) => onTitleChange(e)}
                />
                <RWebShare
                    data={{
                        text: "Share Your Document",
                        url: window.location.href,
                        title: "Google Docs"
                      }}    
                >
                    <button className='button'>Share this Document</button>
                </RWebShare>
            </div>
            
            <Box >
                <Box className='container' id='container'></Box>
                <Box > 
                    <Table class="table" />
                </Box>
            </Box>
        </Component>
    )
}

export default Editor;