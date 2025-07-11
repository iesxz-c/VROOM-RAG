"use client";
//npm install ai --legacy-peer-deps
import Image from "next/image";
import Logo from "@/app/assets/hq720.jpg";
import { useChat } from "ai/react";
import { Message } from "ai";
import Bubble from "./components/Bubble";
import Lb from "./components/Lb";
import PSr from "./components/PSr";

// use chat hook from vercel ai
// allow us to easily  create a conversational
// user interface for our chatbot--
// it enables the streaming of chat messages
// from our ai provider , manages the state for 
// chat input and updates the ui automatically as 
// new messages are received

const Home = () => {
    const { isLoading, append, input, handleInputChange, handleSubmit, messages } = useChat();




    const noMessages = false;


    return (
        <main>
            <Image src={Logo} alt="Logo" width="250" />
            <section className={noMessages ? "" : "populated"}>
                {noMessages ? (
                    <>
                        <p className="starter">
                            Vroom knows Red Bull wins, Ferrari fumbles, and McLaren clocks in once a month. New to F1? Cute. Ask anything—we’ll pretend you always knew what an undercut was (we won’t).
                        </p>
                        <br />
                        <PSr />
                    </>
                ) : (
                    <>
                    <Lb/>
                    </>
                )}
                
            </section>
            <form onSubmit={handleSubmit}>
                    <input className="qsbox" onChange={handleInputChange} value={input}
                    placeholder="Ask me smth......" />
                    <input type="submit" />
                </form>
        </main>
    )
}

export default Home;