import React from 'react';
import './chatsidebar.css'
import Navbar from '../navbar/navbar';
export default function Chatsidebar(){
    return(
        <>
            <div className='home'>
                <div className="container">
                    <Navbar/>
                </div>
                <div className="userchat">
                    <img src="/user.png" alt="" />
                    <div className='userchatinfo'>
                        <span>John</span>
                        <p>hello</p>
                    </div>
                </div>
                <div className="userchat">
                    <img src="/user.png" alt="" />
                    <div className='userchatinfo'>
                        <span>John</span>
                        <p>hello</p>
                    </div>
                </div>
                <div className="userchat">
                    <img src="/user.png" alt="" />
                    <div className='userchatinfo'>
                        <span>John</span>
                        <p>hello</p>
                    </div>
                </div>
            </div>
        </>
    );   
}