import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import io from "socket.io-client";
import styles from '../styles/Home.module.css'

let socket;
type Message = {
  author: string;
  message: string;
};

const Home: NextPage = () => {
  const [username, setUsername] = useState("");
  const [chosenUsername, setChosenUsername] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<Message>>([]);

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    setChosenUsername(true);
    console.log(username);
  };

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");

    socket = io();

    socket.on("newIncomingMessage", (msg) => {
      setMessages((currentMsg) => [
        ...currentMsg,
        { author: msg.author, message: msg.message },
      ]);
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Skribbl clone</title>
      </Head>

      <main className={styles.main}>
        {chosenUsername
          ? (<canvas></canvas>)
          :
          (<form onSubmit={handleSubmit}>
            <input type={"text"} onChange={(event: Event) => setUsername(event.target.value)} placeholder={"Name"}></input>
          </form>)
        }
      </main>
    </div>
  )
}

export default Home
