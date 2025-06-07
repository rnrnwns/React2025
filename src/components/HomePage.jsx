import axios from 'axios'
import { useEffect, useState } from 'react'
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import BookPage from './BookPage';
import { BsCart2 } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, set, get, onValue, remove} from 'firebase/database';
import { app } from '../firebase';
import moment from 'moment';
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

const HomePage = () => {
    const [loading, setLoading] = useState(false);
    const uid = sessionStorage.getItem('uid');
    const db = getDatabase(app);
    const nav = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [heart, setHeart] = useState([]);

    const [query, setQuery] = useState('리액트');
    const [page, setPage] = useState(1);
    const [last, setLast] = useState(1);
    const apiKey = process.env.REACT_APP_KAKAO_REST_KEY;

    const callAPI = async() => {
        console.log("📢 Kakao API 키:", process.env.REACT_APP_KAKAO_REST_KEY);
        const url="https://dapi.kakao.com/v3/search/book?target=title"
        const config = {
            headers:{
                Authorization:"KakaoAK " + apiKey
            },
            params:{
                query:query,
                size:12,
                page:page
            }
        }
        setLoading(true);
        const res=await axios.get(url, config);
        setDocuments(res.data.documents);
        setLast(Math.ceil(res.data.meta.pageable_count/12));
        setLoading(false);
    }

    const checkHeart = ()=> {
        setLoading(true);
        onValue(ref(db, `heart/${uid}`), snapshot=>{
            const rows = [];
            snapshot.forEach(row=>{
                rows.push(row.val().isbn);
            });
            setHeart(rows);
            setLoading(false);
        });
    }

    useEffect(()=>{
        callAPI();
    }, [page]);

    useEffect(()=> {
        checkHeart();
    }, [uid]);

    useEffect(()=> {
        const titleElement = document.getElementsByTagName('title')[0];
        titleElement.innerHTML = '홈페이지';
    }, []);

    const onSumbit = (e)=> {
        e.preventDefault();
        if(query==='') {
            alert("검색어를 입력하세요!");
        }else{
            callAPI();
        }
    }

    const onClickRegHeart = (book) => {
        if(uid){
            set(ref(db, `heart/${uid}/${book.isbn}`), book);
            alert('좋아요 추가!');
        }else{
            nav('/login');
        }
    }

    const onClickHeart = (book) => {
        remove(ref(db, `heart/${uid}/${book.isbn}`));
        alert('좋아요 취소!');
    }

    const onClickCart = (book) => {
        if(uid){
            get(ref(db, `cart/${uid}/${book.isbn}`)).then(snapshot=>{
                if(snapshot.exists()){
                    alert('이미 장바구니에 존재합니다!');
                }else{
                    const date = moment(new Date()).format('YYYY-MM-DD HH:mm-ss');
                    set(ref(db, `cart/${uid}/${book.isbn}`), {...book, date});
                    alert('장바구니에 등록되었습니다!');
                }
                 if(window.confirm('장바구니로 이동하실래요?')){
                        nav('/cart');
                }
            })
        }else{
            nav(`/login`);
        }
    }

    if(loading) return <h1 className='my-5 text-center'>로딩중......</h1>
    return (
        <div>
            <h1 className='my-5 text-center'>홈페이지</h1>
            <Row className='mb-2'>
                <Col>
                    <Form onSubmit={onSumbit}>
                        <InputGroup>
                            <Form.Control onChange={(e)=>setQuery(e.target.value)}
                                value={query}/>
                            <Button type="submit">검색</Button>
                        </InputGroup>
                    </Form>
                </Col>
                <Col></Col>
                <Col></Col>
            </Row>
            <Row>
                {documents.map(doc=>
                    <Col lg={2} md={3} xs={6} className='mb-2' key={doc.isbn}>
                        <Card>
                            <Card.Body>
                                <BookPage doc={doc}/>
                                <div className='text-end heart'>
                                    {heart.includes(doc.isbn) ? 
                                        <FaHeart onClick={()=>onClickHeart(doc)}/>
                                        :
                                        <FaRegHeart onClick={()=>onClickRegHeart(doc)}/>
                                    }
                                </div>
                            </Card.Body>
                            <Card.Footer>
                                <div className='text-truncate title'>{doc.title}</div>
                                <Row>
                                    <Col className='price align-self-center'>{doc.sale_price}원</Col>
                                    <Col className='text-end cart'>
                                        <BsCart2 onClick={()=>onClickCart(doc)}/>
                                    </Col>
                                </Row>
                            </Card.Footer>
                        </Card>
                    </Col>
                )}
            </Row>
            <div className='text-center mt-3'>
                <Button disabled={page===1} 
                    onClick={()=>setPage(page-1)}>이전</Button>
                <span className='mx-2'>{page} / {last}</span>
                <Button disabled={page===last} 
                    onClick={()=>setPage(page+1)}>다음</Button>
            </div>
        </div>
    )
}

export default HomePage
