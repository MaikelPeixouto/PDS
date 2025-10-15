import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, Phone, Calendar } from "lucide-react";

interface ClinicCardProps {
  name: string;
  rating: number;
  reviews: number;
  distance: string;
  address: string;
  phone: string;
  openUntil: string;
  specialties: string[];
  image: string;
  isOpen: boolean;
}

const ClinicCard = ({ 
  name, 
  rating, 
  reviews, 
  distance, 
  address, 
  phone, 
  openUntil, 
  specialties, 
  image, 
  isOpen 
}: ClinicCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 bg-white/80 backdrop-blur-sm">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-4 right-4">
          <Badge variant={isOpen ? "default" : "destructive"} className="bg-white/90 text-foreground">
            {isOpen ? "Aberto" : "Fechado"}
          </Badge>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground line-clamp-1">{name}</h3>
          
          <div className="flex items-center gap-4 text-sm text-vet-neutral">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-vet-accent text-vet-accent" />
              <span className="font-medium">{rating}</span>
              <span>({reviews} avaliações)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{distance}</span>
            </div>
          </div>
          
          <div className="space-y-1 text-sm text-vet-neutral">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{isOpen ? `Aberto até ${openUntil}` : `Abre amanhã`}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {specialties.map((specialty, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-vet-primary/10 text-vet-primary border-vet-primary/20">
                {specialty}
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button variant="vetOutline" size="sm" className="flex-1">
              Ver Detalhes
            </Button>
            <Button variant="vet" size="sm" className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              Agendar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ClinicCard;