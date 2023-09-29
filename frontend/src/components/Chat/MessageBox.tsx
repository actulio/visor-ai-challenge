import { useContext } from 'react';
import Emoji from 'react-emoji-render';
import type { Message } from '../../interfaces/message';
import { AppContext } from '../../context/AppContext';

const MessageBox: React.FC<Message> = ({ body, isResponse }) => {
  const {
    userData: { name },
  } = useContext(AppContext);
  const botName = 'Botty McBotface';
  if (!isResponse) {
    return (
      <div className="flex justify-end px-1 py-0 mt-2">
        <p className="flex items-center tracking-tight text-sm font-sans text-gray-400 pr-2 select-none">
          {name.trim()}
        </p>
        <div className="rounded-2xl py-1 px-5 text-white inline-block max-w-[80%] bg-gradient-to-b from-purple-800 to-purple-600">
          <Emoji className="w-full tracking-normal float-left text-base break-words text-white">
            {body}
          </Emoji>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start px-1 py-0 mt-2">
      <div className="rounded-2xl py-1 px-5 text-white inline-block max-w-[80%] bg-gray-100">
        <Emoji className="w-full tracking-normal float-left text-base break-words text-gray-700 selection:bg-violet-400">
          {body}
        </Emoji>
      </div>
      <p className="flex items-center tracking-tight text-sm font-sans text-gray-400 pl-2 select-none">
        {botName}
      </p>
    </div>
  );
};

export default MessageBox;
