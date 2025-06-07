import React, { useEffect, useState } from 'react'
import { app } from '../../firebase'
import { getFirestore, collection, query, orderBy, where, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { Col, Row, Form, Button } from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

export const ReplyList = ( { pid } ) => {
    const login = sessionStorage.getItem('email');
    const db = getFirestore(app);

    const [list, setList] = useState([]);

    const getList = () => {
        const q = query(
            collection(db, 'reply'), 
            where('pid', '==', pid),
            orderBy('date', 'desc'));
        onSnapshot(q, snapshot => {
            let rows = [];
            snapshot.forEach(row => {
                rows.push({id: row.id, ...row.data()});
            });
            const data = rows.map(row => 
                row && {...row, ellipsis: true, edit: false, text: row.contents});
            setList(data);
        });
    };

    const onClickContents = (id) => {
        const data = list.map(reply => reply.id === id ? 
            {...reply, ellipsis: !reply.ellipsis}: reply);
        setList(data);
    }

    const onClickUpdate = (id) => {
        const data = list.map(reply => reply.id === id ? 
            {...reply, edit: !reply.edit} : reply);
        setList(data);
    }

    const onChangeContents = (id, e) => {
        const data = list.map(reply => reply.id === id ? 
            {...reply, contents: e.target.value}: reply);
        setList(data);
    }

    const onClickCancel = (r) => {
        const data = list.map(reply => reply.id === r.id ? 
            {...reply, edit: false, contents: reply.text} : reply);
        setList(data);
    }

    const onClickSave = async (id) => {
        const data = list.find(reply => reply.id === id);
        const reply = {pid: data.pid, contents: data.contents, date: data.date, email: data.email}
        await setDoc(doc(db, 'reply', id), reply);
    }

    const onClickDelete = async (id) => {
        if(window.confirm('Do you really want to delete reply?')){
            await deleteDoc(doc(db, 'reply', id));
        }
    }

    useEffect(() => {
        getList();
    }, []);

    return (
        <Row className='justify-content-center'>
            <Col md={10}>
                {list.map(reply => (
                    <div key={reply.id} className='my-5'>
                        <Row>
                            <Col className='text-muted'>
                                {reply.date} {reply.email}
                            </Col>
                            {reply.email === login && !reply.edit &&
                                <Col className='text-end'>
                                    <CiEdit onClick={() => onClickUpdate(reply.id)} className='edit'/>
                                    <MdDeleteOutline onClick={() => onClickDelete(reply.id)} className='delete'/>
                                </Col>
                            }
                        </Row>
                        {reply.edit ? 
                            <Form>
                                <TextareaAutosize className='textarea'
                                    onChange={(e) => onChangeContents(reply.id, e)}
                                    value={reply.contents}/>  
                                <div className='text-end'>
                                    <Button 
                                        onClick={() => onClickSave(reply.id)}
                                        size='sm' variant='primary' className='mx-2' 
                                        disabled={reply.text === reply.contents}
                                    >Save</Button>
                                    <Button onClick={() => onClickCancel(reply)} 
                                        size='sm' variant='secondary'
                                    >cancel</Button>
                                </div>      
                            </Form>
                            :
                            <div
                                onClick={() => onClickContents(reply.id)}
                                style={{cursor: 'pointer'}}
                                className={reply.ellipsis ? 'ellipsis2' : ''}
                            >
                                <p style={{whiteSpace: 'pre-wrap'}}>{reply.contents}</p>
                            </div>
                        }
                    </div>
                ))}
            </Col>
        </Row>
    )
}
