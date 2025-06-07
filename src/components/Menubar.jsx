import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import MainRouter from './router/MainRouter';
import { useLocation, useNavigate } from 'react-router-dom';

const Menubar = () => {
    const navi = useNavigate();
    const email = sessionStorage.getItem('email');
    const location = useLocation();
    const {pathname} = location;
    const basename = process.env.PUBLIC_URL;

    const onLogout = (e) => {
        e.preventDefault();
        if(window.confirm("Are you sure want to logout?")){
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
                            <Nav.Link href={`${basename}/`} active={pathname === '/' && true}>Home</Nav.Link>
                            <Nav.Link href={`${basename}/cart`} active={pathname === '/cart' && true}>Cart</Nav.Link>
                            <Nav.Link href={`${basename}/post`} active={pathname === '/post' && true}>Post</Nav.Link>
                        </Nav>
                        <Nav>
                            {email ?
                                <>
                                    <Nav.Link href='#' active={true}>{email}</Nav.Link>
                                    <Nav.Link href='#' onClick={onLogout}>Logout</Nav.Link>
                                </>
                                :
                                <Nav.Link href={`${basename}/login`}  active={pathname === '/login' && true}>Login</Nav.Link>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <MainRouter />
        </>
    );
}

export default Menubar