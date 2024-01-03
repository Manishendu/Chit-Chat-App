import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/MyChatProvider'
import { Box, Button, FormControl, HStack, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import {ArrowBackIcon, ArrowRightIcon} from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../Config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import './styles.css';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import Lottie from 'react-lottie';
import animationData from '../animations/typing.json';

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

 const [messages, setMessages] = useState([]);
 const [loading, setLoading] = useState(false);
 const [newMessage, setNewMessage] = useState("");
 const [socketConnected, setSocketConnected] = useState(false);
 const [typing, setTyping] = useState(false);
 const [isTyping, setIsTyping] = useState(false);
 const toast=useToast();
    
    const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

    const {user,selectedChat,setSelectedChat,notification,setNotification}=ChatState();
    
    const fetchMessages=async ()=>{

      if(!selectedChat)return;

      try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      
      setMessages(data);
      setLoading(false);
      
      socket.emit("join chat",selectedChat._id);
      
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    }
    
     const sendMessage=async (event)=>{
    
      
        socket.emit("stop typing", selectedChat._id);
        try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        
        
        socket.emit("new message",data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    
    }

   const handleKeyPress = (event) => {
  if (event.key === "Enter" && newMessage) {
    sendMessage();
  }
};
const handleButtonClick = () => {
  if (newMessage) {
    sendMessage();
  }
};

   useEffect(() => {
     
   socket = io(ENDPOINT);
   socket.emit("setup",user);
   socket.on("connected",()=>setSocketConnected(true));

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
   }, [])

   useEffect(() => {
    fetchMessages();
     
    selectedChatCompare=selectedChat;
  }, [selectedChat]);


    useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
          if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    })
  })
  
   
    const typingHandler=(e)=>{
      setNewMessage(e.target.value);

      
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    
      let lastTypingTime = new Date().getTime();
    var timerLength = 4000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);

    }

  return (
    <>
    {
       selectedChat?(
         <>
         <Text
          fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            width="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
         >
          <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
         
             {
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    
              /> 
                </>
              ))}

         </Text>

         <Box
          display="flex"
            flexDir="column"
            justifyContent="flex-end"
            padding={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
         >
      
           {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
               <ScrollableChat messages={messages} />
              </div>
            )}
         
         <FormControl    isRequired marginTop={3}  >
         {isTyping?(<div>
          <Lottie
              options={defaultOptions}      
              width={70}
              style={{ marginBottom: 15, marginLeft: 0 }}
            />
         </div>):(<></>)}
         <HStack>
          <Input
          variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
                onKeyDown={handleKeyPress}
          />
           <Button leftIcon={<ArrowRightIcon />} onClick={handleButtonClick}  colorScheme='teal' variant='solid'>
    Send
  </Button>
         </HStack>
          
         </FormControl>

         </Box>

         </>
       ) :(
         <Box display="flex" alignItems="center" justifyContent="center" height="100%" >
          <Text fontSize="3xl" paddingTop="20px" paddingLeft="80px" fontFamily="Work sans" >
            Click on a user to start chatting
          </Text>
         </Box>
       )
    }
    </>
  )
}

export default SingleChat