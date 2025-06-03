import { Card, Row, Col, Button } from 'react-bootstrap'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { app } from '../../firebase'
import { getFirestore, doc, getDoc, deleteDoc, collection, query, where, getCountFromServer } from 'firebase/firestore'
import { useState, useEffect } from 'react'
import ReplyPage from './ReplyPage'

const ReadPage = () => {
    const location = useLocation();
    const search = new URLSearchParams(location.search);
    const page = search.get('page');
    

    const nav = useNavigate();
    const login = sessionStorage.getItem('email');
    const db = getFirestore(app);
    const params = useParams();
    const id = params.id;
    const [bbs, setBbs] = useState({
        id:'',
        title:'',
        body:'',
        date:'',
        email:''
    });
    const {title, body, date, email} = bbs;
    const [loading, setLoading] = useState(false);

    const getBbs = async() => {
        setLoading(true);
        const snapshot = await getDoc(doc(db, 'bbs', id));
        setBbs({id: snapshot.id, ...snapshot.data()});
        setLoading(false);
    }

    const onDelete = async(id)=> {
        const q = query(collection(db, 'reply'), where('pid', '==', id));
        const snapshot = await getCountFromServer(q)
        const count = snapshot.data().count;
        if(count > 0) {
            alert('댓글이 있어서 삭제할수 없습니다!');
        }else{
            if(window.confirm(`${id}번 게시글을 삭제하실래요?`)){
                await deleteDoc(doc(db, 'bbs', id));
                nav(-1);
            }
        }
    }

    useEffect(()=>{
        sessionStorage.setItem('page', page);
        getBbs();
    }, []);

    if(loading) return <h1 className='my-5 text-center'>로딩중......</h1>
    return (
        <div>
            <h1 className='my-5 text-center'>게시글정보</h1>
            {login===email &&
                <Row className='justify-content-center'>
                    <Col md={10} className='text-end'>
                        <Button onClick={()=>nav(`/bbs/update/${id}`)}
                            variant='outline-success' size='sm' className='mx-2'>수정</Button>
                        <Button onClick={()=>onDelete(id)} 
                            variant='outline-danger' size='sm'>삭제</Button>
                    </Col>
                </Row>
            }
            <Row className='justify-content-center mt-2'>
                <Col md={10}>
                    <Card>
                        <Card.Body>
                            <h5>{title}</h5>
                            <hr/>
                            <p style={{whiteSpace:'pre-wrap'}}>{body}</p>
                        </Card.Body>
                        <Card.Footer>
                            Posted on {bbs.date} by {bbs.email}
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
            <ReplyPage id={id}/>
        </div>
    )
}

export default ReadPage
