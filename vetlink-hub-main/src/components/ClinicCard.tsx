
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, Phone, Calendar, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LegacyClinicCardProps {
  id: string;
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
  isRegistered?: boolean;
  googleMapsUrl?: string;
}

interface Clinic {
  id: string;
  name: string;
  rating?: number;
  totalReviews?: number;
  distance?: number;
  address: string;
  phone?: string;
  openUntil?: string;
  specialties?: string[];
  image?: string;
  isOpen?: boolean;
  isRegistered: boolean;
  googleMapsUrl?: string;
}

// New props interface using Clinic type
interface NewClinicCardProps {
  clinic: Clinic;
}

type ClinicCardProps = LegacyClinicCardProps | NewClinicCardProps;

const ClinicCard = (props: ClinicCardProps) => {
  const navigate = useNavigate();

  // Check if using new or legacy interface
  const isNewInterface = 'clinic' in props;

  if (isNewInterface) {
    const { clinic } = props;

    const handleClick = () => {
      if (clinic.isRegistered) {
        navigate(`/clinicas/${clinic.id}`);
      } else if (clinic.googleMapsUrl) {
        window.open(clinic.googleMapsUrl, '_blank');
      }
    };

    return (
      <Card
        className="overflow-hidden transition-all duration-300 border-border/50 bg-white/80 backdrop-blur-sm hover:shadow-lg cursor-pointer"
        onClick={handleClick}
      >
        {clinic.image && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={clinic.image}
              alt={clinic.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              {clinic.isOpen !== undefined && (
                <Badge variant={clinic.isOpen ? "default" : "destructive"} className="bg-white/90 text-foreground">
                  {clinic.isOpen ? "Aberto" : "Fechado"}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-xl font-bold text-foreground line-clamp-1 flex-1">{clinic.name}</h3>
              <Badge
                variant={clinic.isRegistered ? "default" : "outline"}
                className={clinic.isRegistered ? "bg-vet-primary text-white" : "border-vet-neutral text-vet-neutral"}
              >
                {clinic.isRegistered ? "Parceira" : "Google"}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-vet-neutral">
              {clinic.rating !== undefined && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-vet-accent text-vet-accent" />
                  <span className="font-medium">{clinic.rating.toFixed(1)}</span>
                  {clinic.totalReviews !== undefined && <span>({clinic.totalReviews})</span>}
                </div>
              )}
              {clinic.distance !== undefined && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{clinic.distance.toFixed(1)} km</span>
                </div>
              )}
            </div>

            <div className="space-y-1 text-sm text-vet-neutral">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{clinic.address}</span>
              </div>
              {clinic.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{clinic.phone}</span>
                </div>
              )}
              {clinic.openUntil && clinic.isOpen !== undefined && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{clinic.isOpen ? `Aberto até ${clinic.openUntil}` : `Fechado`}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {clinic.isRegistered && clinic.specialties && clinic.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {clinic.specialties.slice(0, 3).map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-vet-primary/10 text-vet-primary border-vet-primary/20">
                    {specialty}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              {clinic.isRegistered ? (
                <>
                  <Button
                    variant="vetOutline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/clinicas/${clinic.id}`);
                    }}
                  >
                    Ver Detalhes
                  </Button>
                  <Button
                    variant="vet"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/clinicas/${clinic.id}#booking`);
                    }}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar
                  </Button>
                </>
              ) : (
                <Button
                  variant="vet"
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (clinic.googleMapsUrl) {
                      window.open(clinic.googleMapsUrl, '_blank');
                    }
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver no Google Maps
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Legacy rendering
  const {
    id,
    name,
    rating,
    reviews,
    distance,
    address,
    phone,
    openUntil,
    specialties,
    image,
    isOpen,
    isRegistered = true,
    googleMapsUrl
  } = props as LegacyClinicCardProps;

  const handleLegacyClick = () => {
    if (isRegistered) {
      navigate(`/clinica/${id}`);
    } else if (googleMapsUrl) {
      window.open(googleMapsUrl, '_blank');
    }
  };

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 border-border/50 bg-white/80 backdrop-blur-sm ${isRegistered ? 'hover:shadow-lg cursor-pointer' : ''}`}
      onClick={handleLegacyClick}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          {!isRegistered && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
              Não cadastrada
            </Badge>
          )}
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
          {specialties.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-vet-primary/10 text-vet-primary border-vet-primary/20">
                  {specialty}
                </Badge>
              ))}
            </div>
          )}

          {isRegistered ? (
            <div className="flex gap-2">
              <Button
                variant="vetOutline"
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/clinica/${id}`);
                }}
              >
                Ver Detalhes
              </Button>
              <Button
                variant="vet"
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/clinica/${id}#booking`);
                }}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Agendar
              </Button>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-xs text-vet-neutral">
                Esta clínica não está cadastrada no sistema
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ClinicCard;
