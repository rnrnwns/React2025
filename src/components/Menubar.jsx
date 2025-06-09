import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import MainRouter from './router/MainRouter';
import { useLocation, useNavigate } from 'react-router-dom';

const Menubar = () => {
    const navi = useNavigate();
    const email = sessionStorage.getItem('email');
    const location = useLocation();
    const { pathname } = location;
    const basename = process.env.PUBLIC_URL;

    const onLogout = (e) => {
        e.preventDefault();
        if (window.confirm("정말 로그아웃 하실거에요?")) {
            sessionStorage.clear();
            navi('/');
        }
    }

    return (
        <>
            <Navbar expand="lg" bg="primary" data-bs-theme="dark">
                <Container fluid>
                    <Navbar.Brand href={`${basename}/`}>REACT</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll>
                            <Nav.Link href={`${basename}/`} active={pathname === '/'}>
                                책 검색
                            </Nav.Link>

                            {/* 로그인한 경우에만 Cart 표시 */}
                            {email && (
                                <Nav.Link href={`${basename}/cart`} active={pathname === '/cart'}>
                                    장바구니
                                </Nav.Link>
                            )}

                            <Nav.Link href={`${basename}/post`} active={pathname === '/post'}>
                                게시판
                            </Nav.Link>
                        </Nav>
                        <Nav>
                            {email ? (
                                <>
                                    <Nav.Link href="#" active={true}>
                                        {email}
                                    </Nav.Link>
                                    <Nav.Link href="#" onClick={onLogout}>
                                        로그아웃
                                    </Nav.Link>
                                </>
                            ) : (
                                <Nav.Link href={`${basename}/login`} active={pathname === '/login'}>
                                    로그인
                                </Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <MainRouter />
        </>
    );
}

export default Menubar;