import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import api from "@/services/api";
import { toast } from "sonner";

interface ReviewFormProps {
    clinicId: string;
    appointmentId?: string;
    onSuccess?: () => void;
}

const ReviewForm = ({ clinicId, appointmentId, onSuccess }: ReviewFormProps) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error("Por favor, selecione uma avaliação");
            return;
        }

        if (!comment.trim()) {
            toast.error("Por favor, escreva um comentário");
            return;
        }

        if (!appointmentId) {
            toast.error("ID de agendamento não fornecido");
            return;
        }

        setIsSubmitting(true);
        try {
            await api.createReview(clinicId, appointmentId, rating, comment);
            toast.success("Avaliação enviada com sucesso!");
            setRating(0);
            setComment("");
            if (onSuccess) onSuccess();
        } catch (error: any) {
            console.error("Error submitting review:", error);
            toast.error(error.message || "Erro ao enviar avaliação");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg border">
            <div>
                <h3 className="text-lg font-semibold mb-2">Deixe sua avaliação</h3>
                <p className="text-sm text-gray-600 mb-4">Como foi sua experiência?</p>

                <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="transition-transform hover:scale-110"
                        >
                            <Star
                                className={`h-8 w-8 ${star <= (hoverRating || rating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <Textarea
                    placeholder="Conte-nos sobre sua experiência..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full"
                    disabled={isSubmitting}
                />
            </div>

            <Button
                type="submit"
                disabled={isSubmitting || rating === 0 || !comment.trim()}
                className="w-full"
            >
                {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
            </Button>
        </form>
    );
};

export default ReviewForm;
