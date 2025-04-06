import React from 'react';
import '../../components/chatsidebar/chatsidebar.css'
import '../home/home.css'
import Navbar from '../../components/navbar/navbar';
import Notif from '../../components/Notif/notif';
import Discussion from '../../components/Discussion/discussion';

const NotifPage: React.FC = () => {
 
  return (
    <>
         <div className="main">
                        <div className="box">
                            <div className="son1">
                                <div className='home'>
                                    <div className="container">
                                        <Navbar/>
                                    </div>
                                    <div className="chat">
                                        <Notif/>
                                </div>
                            </div>
                            </div>
                            <div className='son2'><h1><Discussion/></h1></div>
                        </div>
                    </div>
        
    </>
  );
};

export default NotifPage;


