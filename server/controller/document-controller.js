
import Document from '../schema/documentSchema.js';

export const getDocument = async (id) => {
    if( id === null ) return;

    const document = await Document.findById(id);

    if(document) return document;

    return await Document.create({_id: id, title: "Untitled Document", data: ""});
}

export const updateDocument = async (id,data,title) => {
    return await Document.findByIdAndUpdate(id, {data, title});
}