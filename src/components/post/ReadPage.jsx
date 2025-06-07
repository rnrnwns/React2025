import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { app } from '../../firebase'
import { getFirestore, doc, getDoc, deleteDoc } from 'firebase/firestore'
import { FaSpinner } from "react-icons/fa";
import { Card, Row, Col, Button} from 'react-bootstrap';
import ReplyPage from './ReplyPage';

const ReadPage = () => {
    const params = useParams();
    const db = getFirestore(app);
    const { id } = params;
    const navi = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [post, setPost] = useState({
        id: '',
        title: '',
        content: '',
        date: '',
        email: ''
    });
    const {title, content, date, email} = post;
    const login = sessionStorage.getItem('email');

    const getPost = async () => {
        setIsLoading(true);
        const snapshot = await getDoc(doc(db, 'post', id));
        setPost(snapshot.data());
        setIsLoading(false);
    }

    const onDelete = async () => {
        if(window.confirm('Do you really want to delete this post?')){
            await deleteDoc(doc(db, 'post', id));
            navi('/post');
        }
    }
    
    useEffect(() => {
        getPost();
    }, []);

    if(isLoading) return <h1 className='spin text-center my-5'><FaSpinner/></h1>

    return (
        <div>
            <h1 className='my-5 text-center'>Post info</h1>
            {login === email &&
                <Row className='justify-content-center'>
                    <Col md={10} className='text-end mb-2'>
                        <Button onClick={() => navi(`/post/edit/${id}`)} size='sm' variant='outline-success' className='mx-2'>Edit</Button>
                        <Button onClick={onDelete} size='sm' variant='outline-danger'>Delete</Button>
                    </Col>
                </Row>
            }
            <Row className='justify-content-center mb-5'>
                <Col md={10}>
                    <Card>
                        <Card.Body>
                            <h5>{title}</h5>
                            <hr/>
                            <p style={{whiteSpace: 'pre-wrap'}}>{content}</p>
                        </Card.Body>
                        <Card.Footer>
                            Posted on {date} by {email}
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
            <ReplyPage id={id} />
        </div>
    )
}

export default ReadPage