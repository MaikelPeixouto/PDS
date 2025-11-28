import { useEffect, useState } from "react";
import { Star, User } from "lucide-react";
import api from "@/services/api";

interface Review {
    id: string;
    user_first_name: string;
    user_last_name: string;
    rating: number;
    comment: string;
    created_at: string;
}

interface ReviewsListProps {
    clinicId: string;
    limit?: number;
}

const ReviewsList = ({ clinicId, limit = 10 }: ReviewsListProps) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        loadReviews();
    }, [clinicId]);

    const loadReviews = async () => {
        try {
            setIsLoading(true);
            const data = await api.getClinicReviews(clinicId, limit);
            setReviews(data);

            // Calculate average rating
            if (data.length > 0) {
                const avg = data.reduce((sum: number, r: Review) => sum + r.rating, 0) / data.length;
                setAverageRating(avg);
            }
        } catch (error) {
            console.error("Error loading reviews:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    if (isLoading) {
        return (
            <div className="py-8 text-center text-gray-500">
                Carregando avaliações...
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="py-8 text-center text-gray-500">
                Nenhuma avaliação ainda. Seja o primeiro a avaliar!
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Average Rating Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900">
                            {averageRating.toFixed(1)}
                        </div>
                        <div className="flex gap-1 mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`h-5 w-5 ${star <= Math.round(averageRating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">
                            Baseado em {reviews.length} avaliação{reviews.length !== 1 ? "ões" : ""}
                        </p>
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-start gap-3">
                            <div className="bg-gray-200 rounded-full p-2">
                                <User className="h-5 w-5 text-gray-600" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            {review.user_first_name} {review.user_last_name}
                                        </h4>
                                        <div className="flex gap-1 mt-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-4 w-4 ${star <= review.rating
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {formatDate(review.created_at)}
                                    </span>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewsList;
