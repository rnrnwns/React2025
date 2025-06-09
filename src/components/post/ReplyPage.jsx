import React, { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap';
import TextareaAutoSize from 'react-textarea-autosize'
import { app } from '../../firebase'
import { getFirestore, addDoc, collection } from 'firebase/firestore'
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { ReplyList } from './ReplyList';

const ReplyPage = ( { id } ) => {
    const db = getFirestore(app);
    const navi = useNavigate();

    const email = sessionStorage.getItem('email');
    const [contents, setContents] = useState('');

    const onWrite = async () => {
        const reply = {
            pid: id,
            email,
            contents,
            date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };

        await addDoc(collection(db, 'reply'), reply);
        setContents('');
    };

    const onLogin = () => {
        sessionStorage.setItem('target', `/post/${id}`);
        navi('/login');
    };

    return (
        <div>
            {email ? 
                <Row className='justify-content-center'>
                    <Col md={10}>
                        <Form>
                            <TextareaAutoSize
                                onChange={(e) => setContents(e.target.value)}
                                value={contents}
                                placeholder='댓글을 입력하세요'
                                className='textarea'
                            />
                            <Button
                                onClick={onWrite}
                                disabled={contents === ''}
                                className='px-5 text-end'
                            >댓글추가</Button>
                        </Form>
                    </Col>
                </Row>
                :
                <Row className='justify-content-center'>
                    <Col md={10}>
                        <Button onClick={onLogin} className='w-100'>로그인하기</Button>
                    </Col>
                </Row>
            }
            <ReplyList pid={id}/>
        </div>
    )
}

export default ReplyPage