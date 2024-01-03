import { Box, Container, Text, Tab, TabPanels, TabPanel, Tabs, TabList } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Login from '../Components/Authentication/Login'
import Signup from '../Components/Authentication/Signup'
import {useHistory} from "react-router-dom";

const Myhomepage = () => {
   const history=useHistory();

   useEffect(() => {
     const user=JSON.parse(localStorage.getItem("userInfo"));
     if(user)history.push("/chats");
   }, [history])
   

    return (
    <Container maxW='xl' centerContent >
   <Box display={'flex'} justifyContent={'center'} padding={3}
    background={"white"} w='100%' margin='40px 0 15px 0'
     borderRadius={'lg'} borderWidth={'1px'} >
    <Text fontSize='4xl' fontFamily="work sans" >Chit Chat</Text>
   </Box>
   <Box background="white" width="100%" padding={4}
    borderRadius="large" borderWidth="1px" >

      <Tabs variant='soft-rounded' >
  <TabList marginBottom="1em" >
    <Tab width="50%" >Login</Tab>
    <Tab width="50%">Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login />
    </TabPanel>
    <TabPanel>
      <Signup />
    </TabPanel>
  </TabPanels>
</Tabs>

    </Box>

    </Container>
  )
}

export default Myhomepage