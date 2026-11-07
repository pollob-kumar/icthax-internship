function Header( {title} ){
    return(
        <header className="header">
            <h1> {title} </h1>
            <nav>
                <a href="#">Home</a>
                <a href="#">Shop</a>
                <a href="#">About</a>
            </nav>
        </header>
    );
}

export default Header;