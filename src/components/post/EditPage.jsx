import React, { useEffect, useState } from 'react'
import { app } from '../../firebase'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
import { useNavigate, useParams } from 'react-router-dom';
import { FaSpinner } from "react-icons/fa";
import { Col, Row, Form, Button } from 'react-bootstrap';

const EditPage = () => {
    const params = useParams();
    const db = getFirestore(app);
    const { id } = params;
    const navi = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        title: '',
        content: ''
    });

    const {title, content, preTitle, preContent, email, date} = form;
    
    const getPost = async () => {
        setIsLoading(true);
        const snapshot = await getDoc(doc(db, 'post', id));
        const post = snapshot.data();
        
        setForm({...post, preTitle: post.title, preContent: post.content});
        setIsLoading(false);
    };
    
    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    };

    const onSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        if(window.confirm('정말 수정하시겠어요?')){
            const post = {title, content, email, date};
            await setDoc(doc(db, 'post', id), post);
            setIsLoading(false);
            navi(-1);
        }
    }

    const onReset = () => {
        if(window.confirm('내용을 초기상태로 되돌릴까요?')){
            getPost();
        }
    };

    useEffect(() => {
        getPost();
    }, []);

    if(isLoading) return <h1 className='spin text-center my-5'><FaSpinner/></h1>

    return (
        <div>
            <h1 className='my-5 text-center'>Edit post</h1>
            <Row>
                <Col>
                    <Form onSubmit={onSubmit} onReset={onReset}>
                        <Form.Control
                            onChange={onChange}
                            value={title}
                            className='mb-2'
                            name='title'
                        />
                        <Form.Control
                            onChange={onChange}
                            value={content}
                            as='textarea'
                            rows={10}
                            name='content'
                        />
                        <div className='text-center mt-3'>
                            <Button
                                type='submit'
                                disabled={title === preTitle && content === preContent}
                                className='px-5 me-2'
                            >저장하기</Button>
                            <Button
                                type='reset'
                                disabled={title === preTitle && content === preContent}
                                className='px-5' variant='secondary'
                            >취소하기</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default EditPage