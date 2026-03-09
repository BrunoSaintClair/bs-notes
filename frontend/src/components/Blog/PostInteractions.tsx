import { useState, useEffect, useCallback } from "react";
import { api } from "../../services/api";
import type { ReactionSummary, UserReaction, CommentResponse } from "../../types";
import {
  BiLike, BiDislike, BiSolidLike, BiSolidDislike,
  BiComment, BiLockAlt, BiCheckCircle
} from "react-icons/bi";

interface PostInteractionsProps {
  postId: string;
  isAdmin?: boolean;
  isLoggedIn?: boolean;
  token?: string | null;
  onLoginRequired?: () => void;
}

export default function PostInteractions({ postId, isAdmin = false, isLoggedIn = false, token, onLoginRequired }: PostInteractionsProps) {
  const [summary, setSummary] = useState<ReactionSummary>({ likes: 0, dislikes: 0 });
  const [userReaction, setUserReaction] = useState<UserReaction>({ type: null });
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [myComments, setMyComments] = useState<CommentResponse[]>([]);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentSent, setCommentSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      if (isLoggedIn && token) {
        const reactionData = await api.checkReaction(postId, token);
        setUserReaction(reactionData);

        const myCommentsData = await api.getMyComments(postId, token);
        setMyComments(myCommentsData);
      }

      if (isAdmin && token) {
        const [summaryData, commentsData] = await Promise.all([
          api.getReactionSummary(postId, token),
          api.getComments(postId, token),
        ]);
        setSummary(summaryData);
        setComments(commentsData);
      }
    } catch (err) {
      console.error("Erro ao carregar interações:", err);
    }
  }, [postId, isAdmin, isLoggedIn, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReaction = async (type: "like" | "dislike") => {
    if (!isLoggedIn) {
      onLoginRequired?.();
      return;
    }
    try {
      if (!token) return;
      const result = await api.toggleReaction(postId, type, token);
      setUserReaction(result);
      if (isAdmin && token) {
        const newSummary = await api.getReactionSummary(postId, token);
        setSummary(newSummary);
      }
    } catch (err) {
      console.error("Erro ao reagir:", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (!token) return;
      await api.createComment(postId, commentText.trim(), token);
      setCommentText("");
      setCommentSent(true);
      setTimeout(() => setCommentSent(false), 4000);

      const myCommentsData = await api.getMyComments(postId, token);
      setMyComments(myCommentsData);

      if (isAdmin && token) {
        const commentsData = await api.getComments(postId, token);
        setComments(commentsData);
      }
    } catch (err) {
      console.error("Erro ao enviar comentário:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLiked = userReaction.type === "like";
  const isDisliked = userReaction.type === "dislike";

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleReaction("like")}
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
            transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-sm
            ${isLiked
              ? "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-800/50"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400"
            }
          `}
          title="Gostei"
        >
          {isLiked ? <BiSolidLike className="text-lg" /> : <BiLike className="text-lg" />}
          {isAdmin && summary.likes > 0 && <span>{summary.likes}</span>}
        </button>

        <div className="w-px h-6 bg-gray-300"></div>

        <button
          onClick={() => handleReaction("dislike")}
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
            transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-sm
            ${isDisliked
              ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-800/50"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-red-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-red-400"
            }
          `}
          title="Não gostei"
        >
          {isDisliked ? <BiSolidDislike className="text-lg" /> : <BiDislike className="text-lg" />}
          {isAdmin && summary.dislikes > 0 && <span>{summary.dislikes}</span>}
        </button>

        <div className="w-1"></div>

        <button
          onClick={() => {
            if (!isLoggedIn) {
              onLoginRequired?.();
              return;
            }
            setShowCommentBox(!showCommentBox);
            setCommentSent(false);
          }}
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
            transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-sm
            ${showCommentBox
              ? "bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            }
          `}
          title="Comentar"
        >
          <BiComment className="text-lg" />
          Comentar
        </button>
      </div>

      {showCommentBox && (
        <div className="mt-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
            <BiLockAlt className="text-base shrink-0" />
            <span>Apenas o dono do site poderá ler seu comentário.</span>
          </div>

          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value.slice(0, 300))}
            placeholder="Escreva seu comentário..."
            maxLength={300}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
          />

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">
              {commentText.length}/300
            </span>
            <button
              onClick={handleCommentSubmit}
              disabled={!commentText.trim() || isSubmitting}
              className={`
                px-5 py-2 rounded-full text-sm font-semibold
                transition-all duration-200 cursor-pointer
                ${commentText.trim()
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              {isSubmitting ? "Enviando..." : "Enviar"}
            </button>
          </div>

          {commentSent && (
            <div className="mt-3 flex items-center gap-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <BiCheckCircle className="text-base" />
              Comentário enviado com sucesso!
            </div>
          )}
        </div>
      )}

      {!isAdmin && myComments.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <BiComment className="text-base" />
            Meus comentários ({myComments.length})
          </h4>
          <div className="space-y-3">
            {myComments.map((comment) => (
              <div key={comment.id} className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-600">{comment.username}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit", month: "2-digit", year: "numeric",
                      hour: "2-digit", minute: "2-digit"
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-800 whitespace-pre-wrap break-all">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {isAdmin && comments.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <BiComment className="text-base" />
            Todos os comentários ({comments.length})
          </h4>
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-600">{comment.username}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit", month: "2-digit", year: "numeric",
                      hour: "2-digit", minute: "2-digit"
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-800 whitespace-pre-wrap break-all">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
