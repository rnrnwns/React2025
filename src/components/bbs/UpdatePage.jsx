import { Row, Col, Form, Button } from 'react-bootstrap'
import { app } from '../../firebase'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const UpdatePage = () => {
    const nav = useNavigate();
    const [loading, setLoading] = useState(false);
    const db = getFirestore(app);
    const params = useParams();
    const id = params.id;
    const [form, setForm] = useState('')

    const getPost = async() => {
        setLoading(true);
        const snapshot = await getDoc(doc(db, 'bbs', id));
        console.log(snapshot.data());
        const bbs = snapshot.data();
        setForm({...bbs, preTitle:bbs.title, preBody:bbs.body});
        setLoading(false)
    }

    const {title, body, preTitle, preBody, date, email} = form;

    useEffect(()=>{
        getPost();
    }, []);

    const onSubmit = async(e) => {
        e.preventDefault();
        if(window.confirm('정말로 수정하실래요?')){
            const bbs = {email, date, title, body}
            await setDoc(doc(db, 'bbs', id), bbs);
            nav(-1);
        }
    }

    const onReset = (e) => {
        e.preventDefault();
        if(window.confirm('정말로 취소하실래요?')){
            getPost();
        }
    }

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
    }

    if(loading) return <h1 className='my-5 text-center'>로딩중......</h1>
    return (
        <Row className='justify-content-center'>
            <Col md={8}>
                <h1 className='my-5 text-center'>정보수정</h1>
                <Form onSubmit={onSubmit} onReset={onReset}>
                    <Form.Control 
                        onChange={onChange}
                        name='title' value={title}
                        placeholder='제목을 입력하세요.' className='mb-2'/>
                    <Form.Control
                        onChange={onChange}
                        name='body' value={body}
                        placeholder='' as='textarea' rows={10}/>
                    <div className='text-center mt-3'>
                        <Button disabled={title === preTitle && body === preBody} 
                            className='px-5 mx-2' type='submit'>저장</Button>
                        <Button disabled={title === preTitle && body === preBody} 
                            className='px-5' type='reset' variant='secondary'>취소</Button>
                    </div>      
                </Form>
            </Col>
        </Row>
    )
}

export default UpdatePage
