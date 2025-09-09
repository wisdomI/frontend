interface ServiceCardProps {
    image: string;
    title: string;
    description: string;
  }
  
  const ServiceCard = ({ image, title, description }: ServiceCardProps) => {
    return (
      <div className="border p-3 md:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3">
          <img 
            src={image} 
            alt={title}
            className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-800 text-sm md:text-base truncate">{title}</h4>
            <p className="text-xs md:text-sm text-gray-600 line-clamp-2">{description}</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default ServiceCard;