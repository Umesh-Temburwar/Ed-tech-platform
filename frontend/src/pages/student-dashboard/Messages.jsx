import React, { useState } from 'react';
import { Search, History, MoreHorizontal, Paperclip, Send } from 'lucide-react';
import { Avatar } from '../../components/dashboard/Common';
import { MESSAGES_DATA } from '../../data/student-dashboard-data';

const MessagesPage = () => {
  const [selectedId, setSelectedId] = useState(1);
  const selected = MESSAGES_DATA.find(m => m.id === selectedId) || MESSAGES_DATA[0];
  const [msgInput, setMsgInput] = useState('');

  const handleSend = () => { 
    if (msgInput.trim()) { 
      setMsgInput(''); 
    } 
  };

  return (
    <div className="h-[calc(100vh-180px)] min-h-[500px] flex gap-5">
      {/* Sidebar List */}
      <div className="w-80 flex flex-col bg-surface border border-border rounded-xl overflow-hidden shrink-0 shadow-sm">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="text-sm font-semibold text-text">Direct Inquiries</h3>
          <span className="text-[11px] font-mono text-muted bg-surface-2 px-2 py-0.5 rounded border border-border">
            {MESSAGES_DATA.length} Threads
          </span>
        </div>
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
            <input 
              type="text" 
              placeholder="Filter conversations..." 
              className="input-field pl-8 py-1.5 text-xs" 
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-border/60">
          {MESSAGES_DATA.map(chat => (
            <button 
              key={chat.id} 
              onClick={() => setSelectedId(chat.id)} 
              className={`w-full p-3.5 flex gap-3 text-left transition-colors ${
                selectedId === chat.id 
                  ? 'bg-surface-2 border-l-2 border-l-hot' 
                  : 'hover:bg-surface-2/60'
              }`}
            >
              <Avatar initials={chat.avatar} size="w-9 h-9" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className="text-xs font-semibold text-text truncate">{chat.teacher}</h4>
                  <span className="text-[10px] text-muted">10:45 AM</span>
                </div>
                <p className="text-[11px] text-muted truncate">{chat.subject}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Pane */}
      <div className="flex-1 flex flex-col bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex justify-between items-center bg-surface-2">
          <div className="flex items-center gap-3">
            <Avatar initials={selected?.avatar} size="w-8 h-8" />
            <div>
              <h4 className="text-xs font-semibold text-text flex items-center gap-1.5">
                {selected?.teacher}
                {selected?.online && <span className="w-1.5 h-1.5 bg-success rounded-full" />}
              </h4>
              <p className="text-[10px] text-muted">{selected?.subject}</p>
            </div>
          </div>
          <button className="p-1.5 text-muted hover:text-text rounded-md transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center gap-3 my-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] text-muted font-medium uppercase tracking-wider">Today</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          {selected?.messages.map((m, i) => {
            const isSent = m.type === 'sent';
            return (
              <div 
                key={i} 
                className={`flex flex-col gap-1 max-w-[75%] ${isSent ? 'ml-auto items-end' : 'items-start'}`}
              >
                <div className={`p-3 rounded-lg text-xs leading-relaxed ${
                  isSent 
                    ? 'bg-hot text-white' 
                    : 'bg-surface-2 text-text border border-border'
                }`}>
                  {m.text}
                </div>
                <span className="text-[10px] text-muted font-mono">{m.time}</span>
              </div>
            );
          })}
        </div>

        {/* Message Input */}
        <div className="p-3 border-t border-border bg-surface-2">
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Type message to instructor..." 
              value={msgInput} 
              onChange={(e) => setMsgInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()} 
              className="flex-1 input-field py-2 text-xs" 
            />
            <button 
              onClick={handleSend} 
              className="btn-primary py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
