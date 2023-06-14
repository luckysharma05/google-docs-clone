import { Server } from 'socket.io';

import Connection from './database/db.js';

import { getDocument, updateDocument } from './controller/document-controller.js';

const PORT = 9000; 

const URL = 'mongodb://lucky:lucky@ac-ugx1h2q-shard-00-00.rbcbab1.mongodb.net:27017,ac-ugx1h2q-shard-00-01.rbcbab1.mongodb.net:27017,ac-ugx1h2q-shard-00-02.rbcbab1.mongodb.net:27017/GOOGLE-DOCS-CLONE?ssl=true&replicaSet=atlas-ey0ipa-shard-0&authSource=admin&retryWrites=true&w=majority';

Connection(URL);

const io = new Server(PORT, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

io.on('connection', socket => {
    socket.on('get-document', async documentId => {
        const document = await getDocument(documentId);
        socket.join(documentId);
        socket.emit('load-document', document);

        socket.on('send-changes', delta =>{
            socket.broadcast.to(documentId).emit('receive-changes', delta);
        })

        socket.on('save-document', async pageData => {
            const newData = {
                data: pageData.data,
                title: pageData.title,
            };
            await updateDocument(documentId, newData.data, newData.title);
            // console.log(newData.title);
        })
    })
    
    
});