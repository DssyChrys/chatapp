import React from 'react'
import Chatsidebar from '../../components/chatsidebar/chatsidebar';
import './home.css';
import Discussion from '../../components/Discussion/discussion';

export default function Home(){
    return(
        <>
            <div className="main">
                <div className="box">
                    <div className="son1"><Chatsidebar/></div>
                    <div className='son2'><h1><Discussion/></h1></div>
                </div>
            </div>
        </>
    );
}