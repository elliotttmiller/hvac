
import React, { useState, useRef } from 'react';
import { Icons } from './Icons';
import { Comment } from '../types';

export const UserAvatar = ({ initials, size = "sm" }: { initials: string, size?: "xs" | "sm" | "md" }) => {
    const sizeClasses = {
        xs: "w-5 h-5 text-[8px]",
        sm: "w-8 h-8 text-[10px]",
        md: "w-10 h-10 text-xs"
    };

    return (
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold ring-2 ring-[#121214]`}>
            {initials}
        </div>
    );
};

export const CommentThread = ({ 
    comments = [], 
    onAddComment, 
    contextId,
    compact = false,
    placeholder = "Type a note..."
}: { 
    comments?: Comment[], 
    onAddComment: (text: string) => void, 
    contextId: string,
    compact?: boolean,
    placeholder?: string
}) => {
    const [newComment, setNewComment] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newComment.trim()) return;
        onAddComment(newComment);
        setNewComment("");
    };

    return (
        <div className={`flex flex-col h-full ${compact ? 'gap-2' : 'gap-3'}`}>
            <div className={`flex-1 overflow-y-auto custom-scrollbar space-y-3 ${comments.length === 0 ? 'flex items-center justify-center py-4' : 'pr-1'}`}>
                {comments.length > 0 ? (
                    comments.map((c) => (
                        <div key={c.id} className="flex gap-3 animate-fade-in group">
                            <div className="shrink-0 mt-0.5">
                                <UserAvatar initials={c.initials} size="xs" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-xs font-medium text-gray-200">{c.author}</span>
                                    <span className="text-[9px] text-gray-600">{c.timestamp}</span>
                                </div>
                                <div className="text-xs text-gray-400 leading-relaxed break-words bg-[#18181b] p-2 rounded-lg rounded-tl-none border border-[#27272a] group-hover:border-gray-600 transition-colors">
                                    {c.text}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-600">
                        <Icons.MessageSquare width={24} height={24} className="mx-auto mb-2 opacity-20" />
                        <p className="text-[10px]">No notes yet. Start the discussion.</p>
                    </div>
                )}
            </div>
            
            <form onSubmit={handleSubmit} className="relative shrink-0 mt-2">
                 <div className="relative">
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-[#09090b] border border-[#27272a] rounded-lg pl-3 pr-10 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                    />
                    <button 
                        type="submit"
                        disabled={!newComment.trim()}
                        className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-colors ${newComment.trim() ? 'text-white bg-blue-600 hover:bg-blue-500' : 'text-gray-600'}`}
                    >
                        <Icons.Send width={12} height={12} />
                    </button>
                 </div>
            </form>
        </div>
    );
};
