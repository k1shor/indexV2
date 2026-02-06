import React, { useEffect, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import { BsArrowUp } from 'react-icons/bs'

const Layout = ({ children }) => {
    const [showButton, setShowButton] = useState(false)
    const [showChat, setShowChat] = useState(false)
    const [closingChat, setClosingChat] = useState(false)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setShowButton(window.scrollY > 300)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const sendMessage = () => {
        if (!input.trim()) return
        const userMessage = { sender: 'user', text: input }
        setMessages(prev => [...prev, userMessage])
        setInput("")
        setIsTyping(true)

        setTimeout(() => {
            const botMessage = { sender: 'bot', text: "I'm thinking... How can I assist you further?" }
            setMessages(prev => [...prev, botMessage])
            setIsTyping(false)
        }, 1500)
    }

    const closeChat = () => {
        setClosingChat(true)
        setTimeout(() => {
            setShowChat(false)
            setClosingChat(false)
        }, 700)
    }

    return (
        <>
            <Header />
            {children}

            {/* Chatbot morphing container */}
            {/*<div className="fixed bottom-28 right-10 z-50">
                 <div
                    className={`bg-blue-500 dark:bg-blue-700 text-white shadow-lg cursor-pointer transform transition-all duration-1000 ease-in-out ${showChat ? (closingChat ? 'w-14 h-14 rounded-full animate-bounce-slow shadow-2xl' : 'w-80 h-96 rounded-2xl border-2 border-blue-500 dark:border-blue-700 shadow-xl p-4 bg-blue-500/90 dark:bg-blue-700/90') : 'w-14 h-14 rounded-full animate-bounce-slow shadow-2xl'} flex flex-col`}
                    onClick={() => !showChat && setShowChat(true)}
                >
                    {!showChat && <span className="text-center text-lg">💬</span>}

                    {showChat && !closingChat && (
                        <>
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-lg font-semibold">Chatbot</h2>
                                <button onClick={closeChat} className="text-gray-200 hover:text-white">✖</button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 bg-gray-100/90 dark:bg-gray-700/90 rounded-lg mb-2 space-y-2">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`p-2 rounded-xl max-w-[80%] ${msg.sender==='user' ? 'ml-auto bg-blue-500 text-white' : 'mr-auto bg-gray-300 dark:bg-gray-600'}`}>{msg.text}</div>
                                ))}
                                {isTyping && <div className="mr-auto bg-gray-300 dark:bg-gray-600 p-2 rounded-xl w-20 animate-pulse text-center">typing...</div>}
                            </div>

                            <div className="flex gap-2">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key==='Enter' && sendMessage()}
                                    className="flex-1 p-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200"
                                    placeholder="Type a message..."
                                />
                                <button onClick={sendMessage} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600">Send</button>
                            </div>
                        </>
                    )}
                </div>
            </div> */}

            {/* Go to Top Button */}
            {showButton && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-10 right-10 p-4 rounded-full shadow-lg bg-blue-500 text-white dark:bg-blue-700 transition-all duration-300 hover:scale-110 hover:bg-blue-600 dark:hover:bg-blue-600 animate-fadeIn"
                >
                    <BsArrowUp className="w-4 h-4" />
                </button>
            )}

            <style jsx global>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 1.5s infinite;
                }
            `}</style>

            <Footer />
        </>
    )
}

export default Layout