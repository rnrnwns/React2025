import { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { app } from '../../firebase';
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import moment from 'moment/moment';
import { useNavigate } from 'react-router-dom';

const WriterPage = () => {
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const db = getFirestore(app);

    const [form, setForm] = useState({
        email: sessionStorage.getItem('email'),
        title: '',
        body: '',     // 여긴 그대로 유지 (입력 상태 관리)
        date: ''
    });

    const { email, title, body } = form;

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (title === '' || body === '') {
            alert('제목이나 내용을 입력하세요!');
        } else {
            if (window.confirm('정말로 등록하실래요?')) {
                setLoading(true);
                const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

                // 🔥 핵심 수정: Firestore에 저장할 때 'content'로 저장
                await addDoc(collection(db, 'post'), {
                    title,
                    content: body, // ✅ 필드 이름 변환
                    email,
                    date
                });

                setLoading(false);
                nav('/post');
            }
        }
    };

    const onReset = (e) => {
        e.preventDefault();
        if (window.confirm('정말로 취소하실래요?')) {
            setForm({
                ...form,
                title: '',
                body: ''
            });
        }
    };

    if (loading) return <h1 className='my-5 text-center'>로딩중......</h1>;

    return (
        <Row className='justify-content-center'>
            <h1 className='my-5 text-center'>글쓰기</h1>
            <Col md={8}>
                <Form onSubmit={onSubmit} onReset={onReset}>
                    <Form.Control
                        placeholder='제목을 입력하세요.'
                        onChange={onChange}
                        name='title'
                        value={title}
                        className='mb-2'
                    />
                    <Form.Control
                        placeholder='내용을 입력하세요.'
                        onChange={onChange}
                        name='body'
                        value={body}
                        as='textarea'
                        rows={10}
                    />
                    <div className='text-center mt-3'>
                        <Button className='px-5 mx-2' type='submit'>등록</Button>
                        <Button className='px-5' type='reset' variant='secondary'>취소</Button>
                    </div>
                </Form>
            </Col>
        </Row>
    );
};

export default WriterPage;