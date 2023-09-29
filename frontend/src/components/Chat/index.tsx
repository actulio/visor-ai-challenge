import { KeyboardEvent, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ScrollToBottom from 'react-scroll-to-bottom';
import { AppContext } from '../../context/AppContext';
import type { Message } from '../../interfaces/message';
import { MessageService } from '../../services/MessageService';
import LoadingEllipsis from './LoadingEllipsis';
import MessageBox from './MessageBox';
import LogoutIcon from '../../assets/logout.svg';
import { removeLocalStorage } from '../../utils/storage';

const sendButtonStyle = `
  absolute inset-y-0 right-0 flex items-center px-4 font-bold font-mono text-white rounded-r-lg
  bg-gradient-to-b from-purple-800 to-purple-600 hover:from-violet-600 hover:to-violet-600 active:from-violet-800 active:to-violet-800
  disabled:from-violet-300 disabled:to-violet-400 disabled:cursor-not-allowed
`;

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const { userData, clearUserData } = useContext(AppContext);
  const navigate = useNavigate();
  const messageService = useMemo(() => new MessageService(), []);

  useEffect(() => {
    const getDataAsync = async () => {
      if (messages.length || !userData.id) return;
      const result = await messageService.getMessages(userData.id, 0);
      if (result.data) {
        setTotalMessages(result.data.total);
        setMessages(result.data.messages.reverse());
      } else {
        toast.error(result.error, { position: 'top-right' });
      }
    };
    getDataAsync();
  }, [messages, messageService, userData.id]);

  const handleOnKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code !== 'Enter') return;
    await sendPrompt();
  };

  const sendPrompt = async () => {
    if (prompt.length === 0) return;
    setAwaitingResponse(true);
    setTotalMessages((m) => m + 1);
    setMessages((old) => [...old, { body: prompt, isResponse: false }]);

    const result = await messageService.getResponseFromPrompt(userData.id, prompt);
    if (result.data) {
      setTotalMessages((m) => m + 1);
      setMessages((old) => [...old, { body: result.data.response, isResponse: true }]);
      setPrompt('');
    } else {
      toast.error(result.error, { position: 'top-right' });
    }

    setAwaitingResponse(false);
  };

  const logout = async () => {
    removeLocalStorage('token');
    clearUserData();
    navigate('/login');
  };

  console.log(totalMessages, messages.length, messages);
  const loadMore = async () => {
    setLoadingMore(true);
    const result = await messageService.getMessages(userData.id, page + 1);
    if (result.data) {
      setTotalMessages(result.data.total);
      setMessages([...result.data.messages.reverse(), ...messages]);
      setPage((p) => p + 1);
    } else {
      toast.error(result.error, { position: 'top-right' });
    }
    setLoadingMore(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="flex flex-col justify-between bg-white rounded-lg  min-h-[600px] h-[100%] w-[100%] md:h-[70%] md:w-[35%] md:min-w-[760px] p-4">
        <div className="flex justify-between items-center border-b-2 border-violet-700">
          <div className="font-mono text-sm text-gray-500">
            Start chatting with Botty McBotface, your friendly assistant.
          </div>
          <div className="w-6 h-6 cursor-pointer mb-1 hover:bg-gray-200" onClick={logout}>
            <img src={LogoutIcon} className="w-full h-full" alt="Logout" />
          </div>
        </div>

        <div className="self-center mt-1">
          {totalMessages > messages.length && (
            <button
              onClick={loadMore}
              className={`text-white font-mono rounded-lg p-1.5 border-b-2 bg-gray-400 hover:bg-gray-500 active:bg-gray-600`}
            >
              {loadingMore ? 'Loading...' : 'Load more...'}
            </button>
          )}
        </div>
        <ScrollToBottom className="flex-auto overflow-auto pb-[5%] px-0">
          {messages.map((message, i) => (
            <MessageBox {...message} key={i} />
          ))}
        </ScrollToBottom>
        {awaitingResponse && (
          <div className="flex mb-1 gap-1">
            <div className="text-xs text-gray-500 bg-violet-700 ">Botty McBotface is typing</div>
            <LoadingEllipsis />
          </div>
        )}
        <div className="relative">
          <input
            className="w-[100%] p-4 px-2 pr-20 border-2 border-violet-700 rounded-lg focus:shadow-outline disabled:border-violet-300 disabled:cursor-not-allowed"
            type="text"
            placeholder="Type your prompt..."
            onKeyDown={handleOnKeyDown}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            maxLength={100}
            disabled={awaitingResponse}
          />
          <button disabled={awaitingResponse} onClick={sendPrompt} className={sendButtonStyle}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
