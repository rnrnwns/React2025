import React, { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { app } from '../../firebase'
import { getFirestore, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { FaSpinner } from "react-icons/fa";

const ListPage = () => {
    const db = getFirestore(app);
    const navi = useNavigate();
    const email = sessionStorage.getItem('email');
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getList = () => {
        setIsLoading(true);
        const q = query(collection(db, 'post'), orderBy('date', 'desc'));
        const rows = [];

        let no = 0;
        onSnapshot(q, snapshot => {
            snapshot.forEach(row => {
                no = no + 1;
                
                const start = (page - 1) * 5 + 1;
                const end = page * 5;
                
                if(no >= start && no <= end) {
                    rows.push({no, id: row.id, ...row.data()});
                }            
            });            
            
            setPosts(rows);
            setLastPage(Math.ceil(no / 5));
            setIsLoading(false);
        });
    };

    const onClickWrite = () => {
        if(email) {
            navi('/post/write');
        } else {
            sessionStorage.setItem('target', '/post/write');
            navi('/login');
        }
    };

    useEffect(() => {
        getList();
    }, [page]);

    if(isLoading) return <h1 className='spin text-center my-5'><FaSpinner/></h1>

    return (
        <div>
            <h1 className='my-5 text-center'>게시글</h1>
            <div className='mb-2'>
                <Button onClick={onClickWrite} className='px-5'>작성하기</Button>
            </div>
            <Table hover>
                <thead>
                    <tr>
                        <td>번호</td>
                        <td>제목</td>
                        <td>작성자</td>
                        <td>작성일자</td>
                    </tr>
                </thead>
                <tbody>
                    {posts.map(post =>
                        <tr key={post.no}>
                            <td>{post.no}</td>
                            <td>
                                <a href={`${process.env.PUBLIC_URL}/post/${post.id}`}>{post.title}</a>
                            </td>
                            <td>{post.email}</td>
                            <td>{post.date}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <div className='text-center'>
                <Button onClick={() => setPage(page - 1)} 
                    disabled={page === 1} 
                    size='sm' className='px-3'>이전</Button>
                <span className='mx-3'>{page}</span>
                <Button onClick={() => setPage(page + 1)} 
                    disabled = {page === lastPage} 
                    size='sm' className='px-3'>다음</Button>
            </div>
        </div>
    )
}

export default ListPage