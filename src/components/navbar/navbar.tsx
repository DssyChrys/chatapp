import React from 'react'
import './navbar.css'

export default function Navbar(){
    return(
        <>
            <div className="nav">
                <h3>ChatApp</h3>
                <div className="info">
                    <img src="/user.png" alt="" />
                    <h4>John doe</h4>
                    <img src="/disconnect.png" alt="" />
                </div>
            </div>
        </>
    );
}