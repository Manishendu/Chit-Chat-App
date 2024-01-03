import { Box } from "@chakra-ui/react";

import SideDrawer from "../Components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/MyChatProvider";
import MyChats from "../Components/MyChats";
import ChatBox from "../Components/ChatBox";
import { useState } from "react";



const Mychatpage = () => {
  
   const [fetchAgain, setFetchAgain] = useState(false);
    const {user} =ChatState();
    
    return (
      <div style={{width:"100%"}}>
       {user && <SideDrawer/>}
       <Box display="flex" justifyContent='space-between'
        width='100%' height='91.5vh' padding='10px' >
      {user &&  <MyChats fetchAgain={fetchAgain}  /> } 
       {user && ( <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> )} 
       </Box>
      </div>
    )
}

export default Mychatpage 