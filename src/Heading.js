import React from 'react';

const Header = (props) => {
    return(
    <div>
        <h1 style={{color:'#FFF0FF', textAlign: 'center'}}>{props.text} {props.name}</h1>
        <br/>
    </div>
    

);}

export default Header;