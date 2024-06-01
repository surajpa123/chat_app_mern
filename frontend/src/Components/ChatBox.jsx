import React from 'react';

const ChatBox = ({ newMessage, setNewMessage, sendMessage }) => {
  return (
    <div className="w-full p-8">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
            {/* SVG code */}
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
       <g id="User Circle">
         <path id="icon" d="M6.05 17.6C6.05 15.3218 8.26619 13.475 11 13.475C13.7338 13.475 15.95 15.3218 15.95 17.6M13.475 8.525C13.475 9.89191 12.3669 11 11 11C9.6331 11 8.525 9.89191 8.525 8.525C8.525 7.1581 9.6331 6.05 11 6.05C12.3669 6.05 13.475 7.1581 13.475 8.525ZM19.25 11C19.25 15.5563 15.5563 19.25 11 19.25C6.44365 19.25 2.75 15.5563 2.75 11C2.75 6.44365 6.44365 2.75 11 2.75C15.5563 2.75 19.25 6.44365 19.25 11Z" stroke="#4F46E5" stroke-width="1.6" />
       </g>
     </svg>
          </svg>
          <input
            className="grow shrink basis-0 text-black text-xs font-medium leading-4 focus:outline-none"
            placeholder="Type here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="items-center flex px-3 py-2 bg-indigo-600 rounded-full shadow" onClick={sendMessage}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              {/* SVG code */}
            </svg>
            <h3 className="text-white text-xs font-semibold leading-4 px-2">Send</h3>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
